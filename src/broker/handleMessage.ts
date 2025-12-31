import amqp from "amqplib";
import { fork } from "child_process";
import { Worker } from "worker_threads";
import { Binary, MongoClient } from "mongodb";
import {
  checkCollectionToCreate,
  convertEmbeddingsToBSON,
  createIndex,
  getEmbedding,
} from "../db/mongo";

type DocType = {
  pageContent: string;
  metadata: Record<string, unknown>;
  id: undefined;
};
const dbName = "test_database";
const collectionName = "chunked_data";

/**
 * Spawn a process which handles the CPU bound job
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function spawnProcess({ id, url }: { id: string; url: string }) {
  const childProcess = fork("./forkedchild.js"); //the first argument to fork() is the name of the js file to be run by the child process
  childProcess.send({ id, url }); //send method is used to send message to child process through IPC
  return new Promise((resolve, reject) => {
    childProcess.on("message", (message) => {
      console.log("Result:", JSON.stringify(message));
      resolve(true);
    });
    childProcess.on("exit", (code) => {
      console.log(`Worker stopped with exit code ${code}`);
      reject(false);
    });
    childProcess.on("error", (err) => {
      console.log(err);
      reject(false);
    });
  });
}

/**
 * Spawn a thread which handles the CPU bound job
 */
async function spawnThread(url: string) {
  return new Promise<Document[]>((resolve, reject) => {
    const worker = new Worker("./dist/broker/workerThread.js", {
      workerData: url,
    });
    // 2. Listen for messages from the worker
    console.log(`Spawn thread: ${worker.threadId}`);
    worker.on("message", (result: Document[]) => {
      // console.log("thread result:", result);
      resolve(result);
    });
    worker.on("error", (err) => {
      reject(err);
    });
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  }).catch((err) => {
    throw err;
  });
}

async function handleMessage(msg: amqp.Message) {
  try {
    const { id, url } = JSON.parse(msg.content.toString());
    console.log(" [x] Received %s %s", id, url);
    // Connect to MongoDB then update document status

    // Spawn a thread to chunk document, update status to "chunking"
    const split_docs = (await spawnThread(url)) as unknown as DocType[];

    // Connect to mongoDB to save embeddings
    const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);

    console.log(
      "Creating collection and index, generating embeddings and inserting documents..."
    );
    await checkCollectionToCreate(client);
    await createIndex(client);

    // Insert documents with embeddings into collection
    const insertDocuments: {
      document: DocType;
      embedding: number[];
      bindataEmbedding: Binary;
    }[] = [];

    await Promise.all(
      split_docs.map(async (doc) => {
        // Generate embeddings using the function that you defined
        const embedding = await getEmbedding(doc.pageContent);
        const binData = await convertEmbeddingsToBSON([
          embedding.data[0].embedding,
        ]);
        // Add the document with the embedding to array of documents for bulk insert
        insertDocuments.push({
          document: doc,
          embedding: embedding.data[0].embedding,
          bindataEmbedding: binData,
        });
      })
    );

    // Make sure the bulk write is all-or-none
    // Start a Client Session
    const session = client.startSession();
    // Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
    // Note: The callback for withTransaction MUST be async and/or return a Promise.
    await session.withTransaction(
      async () => {
        await collection.insertMany(insertDocuments, {
          ordered: false,
        });
      },
      {
        readPreference: "primary",
        readConcern: { level: "majority" },
        writeConcern: { w: "majority" },
      }
    );
    await session.endSession();
    await client.close();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default handleMessage;
