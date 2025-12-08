import customMiddleware from "@/app/functions/customMiddleware";
import { GoogleVerifyError, EmptyTokensError } from "@/classes/errors";
import { MessageEnum } from "@/const/MessageEnum";
import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_SECRET });

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    await customMiddleware(request);
    const AIReplyStream = await client.responses.create({
      model: "gpt-5-nano",
      input: [
        {
          role: "developer",
          content: "answer with less than 30 words",
        },
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
    if (error instanceof GoogleVerifyError || error instanceof EmptyTokensError)
      return new Response(MessageEnum.INVALID_CREDENTIALS, {
        status: StatusCodeEnum.UNAUTHORIZED,
        headers: { "Content-Type": "application/json" },
      });
  }

  return new Response(JSON.stringify({}), {
    status: StatusCodeEnum.OK,
    headers: { "Content-Type": "application/json" },
  });
}
