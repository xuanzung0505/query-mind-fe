import customMiddleware from "@/app/functions/customMiddleware";
import { MessageEnum } from "@/const/MessageEnum";
import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { FileType } from "@/types/FileType";
import isAuthError from "@/utils/isAuthError";
import { publishToQueue } from "@/utils/queueHelper";

export async function POST(request: Request) {
  try {
    await customMiddleware(request);
    const body = await request.json();

    // publish to queue
    await publishToQueue(body as FileType);

    return new Response(JSON.stringify({ success: true }), {
      status: StatusCodeEnum.OK,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (isAuthError(error))
      return new Response(MessageEnum.INVALID_CREDENTIALS, {
        status: StatusCodeEnum.UNAUTHORIZED,
        headers: { "Content-Type": "application/json" },
      });
    else console.log(error);
  }
  return new Response(JSON.stringify({ success: false }), {
    status: StatusCodeEnum.INTERNAL_SERVER_ERROR,
    headers: { "Content-Type": "application/json" },
  });
}
