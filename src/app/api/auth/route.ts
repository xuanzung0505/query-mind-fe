import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { EmptyTokensError, GoogleVerifyError } from "@/classes/errors";
import customMiddleware from "@/app/functions/customMiddleware";
import { MessageEnum } from "@/const/MessageEnum";

export async function POST(request: Request) {
  // Parse the request body
  try {
    const credentials = await customMiddleware(request);
    return new Response(JSON.stringify(credentials), {
      status: StatusCodeEnum.OK,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // redirect to /sign-in page
    if (error instanceof GoogleVerifyError || error instanceof EmptyTokensError)
      return new Response(
        JSON.stringify({ message: MessageEnum.INVALID_CREDENTIALS }),
        {
          status: StatusCodeEnum.UNAUTHORIZED,
        }
      );
    else console.error(error);
    return new Response(JSON.stringify({ message: "Server error." }), {
      status: StatusCodeEnum.INTERNAL_SERVER_ERROR,
    });
  }
}
