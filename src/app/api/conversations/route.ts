import customMiddleware from "@/app/functions/customMiddleware";
import { EmptyTokensError, GoogleVerifyError } from "@/classes/errors";
import { MessageEnum } from "@/const/MessageEnum";
import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { getConversations } from "@/db/conversations";

export async function GET(request: Request) {
  try {
    await customMiddleware(request);
    const conversations = await getConversations();
    return new Response(JSON.stringify(conversations), {
      status: StatusCodeEnum.OK,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof GoogleVerifyError || error instanceof EmptyTokensError)
      return new Response(MessageEnum.INVALID_CREDENTIALS, {
        status: StatusCodeEnum.UNAUTHORIZED,
        headers: { "Content-Type": "application/json" },
      });
    else console.log(error);
  }

  return new Response(JSON.stringify([]), {
    status: StatusCodeEnum.OK,
    headers: { "Content-Type": "application/json" },
  });
}
