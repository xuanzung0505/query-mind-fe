import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { EmptyTokensError, GoogleVerifyError } from "@/classes/errors";
import customMiddleware from "@/app/functions/customMiddleware";
import { MessageEnum } from "@/const/MessageEnum";

/**
 * -> PAYLOAD: {google_token?: string, access_token?: string, refresh_token?: string}
 * -> FLOW: access_token - refresh_token - google_token
 * -> access_token and refresh_token contains user info from our DB
 *
 * - QA: client may have only refresh_token -> what to do?
 *      -> issue the new access_token using this valid refresh_token, or else move to google_token
 * - QA: client may have only access_token -> what to do?
 *      -> allow using until expired -> CAUTION: may need token rotation technique, by invalidating old refresh_token
 *      -> if expired, client doesn't have an assigned refresh_token -> will be requested to sign in again
 * 0. verify tokens as FLOW above
 * 1. check/create user -> theres a case where user is to be deactivated
 *      1.1. user not exist: create user -> save to DB
 *      1.2. user exist
 * 2. get new access_token, refresh_token
 *      2.1. by rotation if client refresh_token is valid -> generate the access_token
 *      2.2. refresh_token is invalid or not exist in the payload -> generate both
 * 3.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error." }), {
      status: StatusCodeEnum.INTERNAL_SERVER_ERROR,
    });
  }
}
