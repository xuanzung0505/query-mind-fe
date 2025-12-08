import customMiddleware from "@/app/functions/customMiddleware";
import { EmptyTokensError, GoogleVerifyError } from "@/classes/errors";
import { MessageEnum } from "@/const/MessageEnum";
import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { getMessages } from "@/db/messages";

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
    if (error instanceof GoogleVerifyError || error instanceof EmptyTokensError)
      return new Response(MessageEnum.INVALID_CREDENTIALS, {
        status: StatusCodeEnum.UNAUTHORIZED,
        headers: { "Content-Type": "application/json" },
      });
  }

  return new Response(JSON.stringify([]), {
    status: StatusCodeEnum.OK,
    headers: { "Content-Type": "application/json" },
  });
}
