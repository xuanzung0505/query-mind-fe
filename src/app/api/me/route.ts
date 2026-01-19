import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import customMiddleware from "@/app/functions/customMiddleware";
import { MessageEnum } from "@/const/MessageEnum";
import isAuthError from "@/utils/isAuthError";
import { UserType } from "@/types/UserType";
import { jwtDecode } from "jwt-decode";

export async function GET(request: Request) {
  try {
    const credentials = await customMiddleware(request);
    const decodedAccessToken = jwtDecode(
      credentials.access_token as string
    ) as UserType;
    return new Response(JSON.stringify(decodedAccessToken), {
      status: StatusCodeEnum.OK,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // redirect to /sign-in page
    if (isAuthError(error))
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
