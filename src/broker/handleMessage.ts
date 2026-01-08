import amqp from "amqplib";
import { fork } from "child_process";
import { Worker } from "worker_threads";
import { MongoClient, ObjectId } from "mongodb";
import {
  checkCollectionToCreate,
  convertEmbeddingsToBSON,
  createIndex,
  getEmbedding,
} from "../db/mongo";
import { FileStatusEnum } from "../const/FileStatusEnum";
import { ChunkType } from "../types/ChunkType";
import { EmbeddingType } from "../types/EmbeddingType";
import { FileType } from "../types/FileType";
import { clientConnect } from "./redis";

const dbName = "test_database";
const chunkedFiles_collection = "chunkedFiles";
const files_collection = "files";
const MESSAGE_TIMEOUT = 300 * 1000;

enum cachedMessageStatus {
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}
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
async function spawnThread(downloadUrl: string) {
  return new Promise<Document[]>((resolve, reject) => {
    const worker = new Worker("./dist/broker/workerThread.js", {
      workerData: downloadUrl,
    });
    // 2. Listen for messages from the worker
    console.log(`Spawn a worker thread of id ${worker.threadId}`);
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

const timeout = (ms: number) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Operation timed out")), ms)
  );

/**
 * Complete logic to handle a specific message in the broker.
 * Task idempotency:
 * - Before: the file status is UPLOADED, embeddings are not created
 * - After: the file status is SAVED_EMBEDDINGS, embeddings are created
 */
async function handleMessage(msg: amqp.Message) {
  try {
    // Race the task against message timeout
    await Promise.race([
      (async () => {
        const jsonFile = JSON.parse(msg.content.toString());
        const messageId = msg.properties.messageId;

        // Redis: Check the message status in cache
        let redisClient;
        try {
          redisClient = await clientConnect();
          const setResult = await redisClient.SET(
            messageId,
            cachedMessageStatus.IN_PROGRESS,
            {
              condition: "NX",
              expiration: { type: "EX", value: MESSAGE_TIMEOUT },
            }
          );
          if (setResult === null) {
            console.log(
              "Found in cache, another worker is processing this message, closing"
            );
            return true;
          } // there exists another worker which is processing this message
        } catch (error) {
          console.log("Redis error:", error);
        } finally {
          if (redisClient) redisClient.destroy();
        }

        const { downloadUrl, projectId } = jsonFile;
        console.log(jsonFile);
        console.log(" [x] Received file at %s", downloadUrl);

        // Connect to MongoDB
        console.log("Connecting to MongoDB");
        const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
        await client.connect();

        // Update doc status to 'chunking'
        console.log("Update mongodb document status to 'chunking'");
        const filesCollection = client.db(dbName).collection(files_collection);
        let mongoFileDoc = (await filesCollection.findOne({
          downloadUrl,
        })) as FileType | null;
        // If the file is deleted
        if (mongoFileDoc === null) return true;
        // If the doc is finished, status = saved_embeddings -> early return
        if (mongoFileDoc.status === FileStatusEnum.SAVED_EMBEDDINGS) {
          console.log("Mongodb document is successfully processed, closing");
          client.close();
          return true;
        }
        mongoFileDoc = (await filesCollection.findOneAndUpdate(
          { _id: new ObjectId(mongoFileDoc._id) },
          { $set: { status: FileStatusEnum.CHUNKING } },
          { returnDocument: "after" }
        )) as unknown as FileType;

        // Spawn a thread to chunk document
        const split_docs = (await spawnThread(
          downloadUrl
        )) as unknown as ChunkType[];

        // Check collection, gen embeddings and bulk insert embeddings
        console.log(
          "Creating collection and index, generating embeddings and inserting documents..."
        );
        const collection = client
          .db(dbName)
          .collection(chunkedFiles_collection);
        await checkCollectionToCreate({ connectedClient: client, dbName });
        await createIndex({
          connectedClient: client,
          collectionName: chunkedFiles_collection,
        });

        const documentsToInsert: EmbeddingType[] = [];

        // Convert: array of the document and its embeddings -> array of MongoDB documents
        await Promise.all(
          split_docs.map(async (doc) => {
            // Generate embeddings using the function that you defined
            const embedding = await getEmbedding(doc.pageContent);
            const binData = await convertEmbeddingsToBSON([
              embedding.data[0].embedding,
            ]);
            documentsToInsert.push({
              document: { ...doc, id: new ObjectId(mongoFileDoc._id) },
              embedding: embedding.data[0].embedding,
              bindataEmbedding: binData,
              projectId,
            });
          })
        );

        // Begin bulk insert embeddings
        console.log("Running a transaction to bulk insert embeddings");
        // Update doc status to 'saving_embeddings'
        console.log("Update mongodb document status to 'saving_embeddings'");
        await filesCollection.findOneAndUpdate(
          { _id: new ObjectId(mongoFileDoc._id) },
          { $set: { status: FileStatusEnum.SAVING_EMBEDDINGS } }
        );
        // Start a Client Session, make sure the bulk write is all-or-none
        // Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
        // Note: The callback for withTransaction MUST be async and/or return a Promise.
        const session = client.startSession();
        await session.withTransaction(
          async () => {
            await collection.insertMany(documentsToInsert, {
              ordered: false,
            });
            // Update doc status to 'saved_embeddings'
            await filesCollection.findOneAndUpdate(
              { downloadUrl },
              { $set: { status: FileStatusEnum.SAVED_EMBEDDINGS } }
            );
          },
          {
            readPreference: "primary",
            readConcern: { level: "majority" },
            writeConcern: { w: "majority" },
          }
        );

        // Redis: update message status in cache to finished
        try {
          redisClient = await clientConnect();
          await redisClient.SET(messageId, cachedMessageStatus.FINISHED);
        } catch (error) {
          console.log("Redis error:", error);
        } finally {
          if (redisClient) redisClient.destroy();
        }

        // Ending job
        console.log("Ending session and closing MongoDB client connection");
        await session.endSession();
        await client.close();
        return true;
      })(),
      timeout(MESSAGE_TIMEOUT),
    ]);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default handleMessage;
