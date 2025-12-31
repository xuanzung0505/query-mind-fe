import { Binary, Collection, MongoClient } from "mongodb";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createMetadataTagger } from "@langchain/classic/document_transformers/openai_functions";
import { ChatOpenAI } from "@langchain/openai";
import OpenAI from "openai";
import fs from "fs";

const dbName = "test_database";
const collectionName = "chunked_data";
const chunkedFiles_collection = "chunkedFiles";
const files_collection = "files";

const embeddingSize = 512;

// Function to generate embeddings for a given data source
export async function getEmbedding(data: string) {
  // const embedder = await pipeline(
  //   "feature-extraction",
  //   "Xenova/nomic-embed-text-v1"
  // );
  // const results = await embedder(data, { pooling: "mean", normalize: true });
  // return Array.from(results.data);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: data,
    encoding_format: "float",
    dimensions: embeddingSize,
  });
  return embedding;
}

export async function convertEmbeddingsToBSON(float32_embeddings: number[][]) {
  try {
    // Validate input
    if (!Array.isArray(float32_embeddings) || float32_embeddings.length === 0) {
      throw new Error("Input must be a non-empty array of embeddings");
    }
    // Convert float32 embeddings to BSON binary representations
    const bsonFloat32Embeddings = float32_embeddings.map((embedding) => {
      if (!(embedding instanceof Array)) {
        throw new Error("Each embedding must be an array of numbers");
      }
      return Binary.fromFloat32Array(new Float32Array(embedding));
    });
    // Return the BSON embedding
    return bsonFloat32Embeddings[0];
  } catch (error) {
    console.error("Error during BSON conversion:", error);
    throw error; // Re-throw the error for handling by the caller if needed
  }
}

export async function checkCollectionToCreate({
  connectedClient,
  dbName,
}: {
  connectedClient?: MongoClient;
  dbName: string;
}) {
  try {
    let client = connectedClient;
    if (connectedClient === undefined) {
      client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
      await client.connect();
    }
    const database = client!.db(dbName);
    const collections = await database.collections();
    if (
      collections.find(
        (collection) => collection.collectionName === collectionName
      )
    ) {
      console.log("The collection exists");
    } else {
      console.log("The collection does not exist");
      await database.createCollection(collectionName);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function createIndex({
  connectedClient,
  collectionName,
}: {
  connectedClient?: MongoClient;
  collectionName: string;
}) {
  try {
    let client = connectedClient;
    if (connectedClient === undefined) {
      client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
      await client.connect();
    }
    const database = client!.db(dbName);
    const collection = database.collection(collectionName);
    // Define your Vector Search index
    const index = {
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "bindataEmbedding",
            similarity: "cosine",
            numDimensions: embeddingSize,
          },
          {
            type: "filter",
            path: "hasCode",
          },
          {
            type: "filter",
            path: "keyword",
          },
          {
            type: "filter",
            path: "title",
          },
        ],
      },
    };
    const [indexData] = await collection
      .listSearchIndexes(index.name)
      .toArray();
    if (indexData) {
      console.log("Index found.");
      return;
    }
    console.log("index not found, creating...");
    // Call the method to create the index
    const result = await collection.createSearchIndex(index);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

async function testMongo() {
  try {
    console.log("test mongo...");

    const pathToFile = path.join(process.cwd(), "public/mongodb.pdf");
    const loader = new PDFLoader(pathToFile);
    const pages = await loader.load();
    // remove blank pages
    const cleaned_pages = pages.filter(
      (page) => page.pageContent.split(" ").length > 20
    );
    console.log(cleaned_pages.length);

    const text_splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 300,
    });
    const metadataTagger = createMetadataTagger(
      {
        properties: {
          title: { type: "string" },
          keywords: { type: "array", items: { type: "string" } },
          hasCode: { type: "boolean" },
        },
        type: "object",
        required: ["title", "keywords", "hasCode"],
      },
      {
        llm: new ChatOpenAI({ model: "gpt-4o-mini" }),
      }
    );
    const docsWithMetadata = await metadataTagger.transformDocuments(
      cleaned_pages
    );
    const split_docs = await text_splitter.splitDocuments(docsWithMetadata);
    console.log(
      `Successfully chunked the PDF into ${split_docs.length} documents.`
    );

    const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);

    console.log(
      "Creating collection and index, generating embeddings and inserting documents..."
    );
    await checkCollectionToCreate({ connectedClient: client, dbName });
    await createIndex({
      connectedClient: client,
      collectionName: collectionName,
    });

    // Insert documents with embeddings into collection
    const insertDocuments: any[] = [];
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
    const options = { ordered: false };
    const insertResult = await collection.insertMany(insertDocuments, options);
    console.log("Count of documents inserted: " + insertResult.insertedCount);

    // begin querying
    const query = "How to update a document without overwriting it?";
    const queryEmbedding = (await getEmbedding(query)).data[0].embedding;
    fs.writeFileSync(
      path.join(process.cwd(), "public/query_embedding.txt"),
      queryEmbedding.toString()
    );
    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          queryVector: queryEmbedding,
          path: "bindataEmbedding",
          exact: true,
          limit: 5,
        },
      },
      {
        $project: {
          _id: 0,
          document: 1,
        },
      },
    ];
    // Retrieve documents using a Vector Search query
    const result = collection.aggregate(pipeline);
    const arrayOfQueryDocs = [];
    for await (const doc of result) {
      arrayOfQueryDocs.push(doc);
    }
    // console.log("QUERIED DOCS:");
    // console.log(arrayOfQueryDocs);
    const context = arrayOfQueryDocs
      .map((doc) => doc.document.pageContent)
      .join("\n");
    const prompt = `
    Use the following pieces of context (wrapped between hashes below) to answer the question at the end.
    ONLY use the context to find for an answer, admit you don't know the answer to the topic if not provided enough knowledge.
    Here's the context:
    #####
    ${context}
    #####
    Here's my question: ${query}
    `;

    const llmClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const llmResponse = await llmClient.responses.create({
      model: "gpt-5-nano",
      input: [
        {
          role: "user",
          content: prompt,
        },
      ],
      reasoning: {
        effort: "minimal",
      },
    });
    console.log(llmResponse.output_text);
  } catch (error) {
    console.log((error as Error).stack);
    console.log("mongo error:" + error);
  }
}

export class FileService {
  private connectedClient: MongoClient;
  private dbName: string = dbName;
  private collectionName: string = files_collection;
  private collection: Collection;

  constructor({ connectedClient }: { connectedClient: MongoClient }) {
    this.connectedClient = connectedClient;

    this.collection = this.connectedClient
      .db(this.dbName)
      .collection(this.collectionName);
  }

  public async insert({
    filter,
    operator,
  }: {
    filter: Record<string, any>;
    operator: Record<string, any>;
  }) {
    await this.collection.findOneAndUpdate(filter, operator, { upsert: true });
  }

  public async get() {
    const cursor = this.collection.find();
    const result = [];
    while (await cursor.hasNext()) {
      result.push(await cursor.next());
    }
    return result;
  }
}

export { testMongo };
