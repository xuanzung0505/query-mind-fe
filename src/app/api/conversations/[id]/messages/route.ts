import customMiddleware from "@/app/functions/customMiddleware";
import { MessageEnum } from "@/const/MessageEnum";
import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { getMessages } from "@/db/messages";
import isAuthError from "@/utils/isAuthError";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await customMiddleware(request);
    const { id: conversationId } = await params;
    const messages = await getMessages({ conversationId });
    return new Response(JSON.stringify(messages), {
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

  return new Response(JSON.stringify([]), {
    status: StatusCodeEnum.OK,
    headers: { "Content-Type": "application/json" },
  });
}
