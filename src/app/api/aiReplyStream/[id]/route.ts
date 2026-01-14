/* eslint-disable @typescript-eslint/no-explicit-any */
import customMiddleware from "@/app/functions/customMiddleware";
import { MessageEnum } from "@/const/MessageEnum";
import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { getConversationsById } from "@/db/conversations";
import { chunkedFiles_collection, dbName, getEmbedding } from "@/db/mongo";
import { UserType } from "@/types/UserType";
import isAuthError from "@/utils/isAuthError";
import { jwtDecode } from "jwt-decode";
import { MongoClient } from "mongodb";
import OpenAI from "openai";

const llmClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const credentials = await customMiddleware(request);
    const decodedAccessToken = jwtDecode(
      credentials.access_token as string
    ) as UserType;

    const { query } = await request.json();
    const { id: conversationId } = await params;
    const conversation = await getConversationsById({ conversationId });

    // User must be conversation owner or belongs to the project
    if (
      conversation.createdById != decodedAccessToken.id &&
      conversation.project &&
      conversation.project.createdById != decodedAccessToken.id &&
      !conversation.project.collaboratorsId.includes(decodedAccessToken.id)
    ) {
      return new Response(MessageEnum.INVALID_CREDENTIALS, {
        status: StatusCodeEnum.UNAUTHORIZED,
        headers: { "Content-Type": "application/json" },
      });
    }

    // begin querying
    let AIReplyStream: any;
    if (conversation.projectId) {
      const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
      await client.connect();
      const collection = client.db(dbName).collection(chunkedFiles_collection);
      const queryEmbedding = (await getEmbedding(query)).data[0].embedding;
      const pipeline = [
        {
          $vectorSearch: {
            index: "vector_index",
            queryVector: queryEmbedding,
            filter: {
              projectId: conversation.projectId,
            },
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

      AIReplyStream = await llmClient.responses.create({
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
        stream: true,
      });
    } else
      AIReplyStream = await llmClient.responses.create({
        model: "gpt-5-nano",
        input: [
          {
            role: "user",
            content: query,
          },
        ],
        reasoning: {
          effort: "minimal",
        },
        stream: true,
      });
    // 1. Create a ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        // Start the streaming process
        for await (const event of AIReplyStream) {
          if (
            [
              "response.created",
              "response.output_text.delta",
              "response.output_text.done",
              "response.completed",
            ].includes(event.type)
          )
            controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
          // save message
          if (event.type === "response.output_text.done") {
          }
          // close the connection
          if (event.type === "response.completed") {
            controller.close();
          }
        }
      },
    });
    // 2. Set the necessary SSE headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform", // Important for reliable streaming
        Connection: "keep-alive", // Keep the connection open
      },
    });
  } catch (error) {
    if (isAuthError(error))
      return new Response(MessageEnum.INVALID_CREDENTIALS, {
        status: StatusCodeEnum.UNAUTHORIZED,
        headers: { "Content-Type": "application/json" },
      });
    else console.log(error);
  }

  return new Response(JSON.stringify({}), {
    status: StatusCodeEnum.OK,
    headers: { "Content-Type": "application/json" },
  });
}
