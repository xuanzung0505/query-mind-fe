import customMiddleware from "@/app/functions/customMiddleware";
import { GoogleVerifyError } from "@/classes/errors";
import { MessageEnum } from "@/const/MessageEnum";
import { StatusCodeEnum } from "@/const/StatusCodeEnum";

export async function GET(request: Request) {
  try {
    await customMiddleware(request);
  } catch (error) {
    if (error instanceof GoogleVerifyError)
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
