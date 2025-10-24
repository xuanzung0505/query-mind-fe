import { signAccessToken, signRefreshToken, verifyJwt } from "@/utils/jwt";
import { UserType } from "@/types/UserType";
import { createOrGetUser } from "@/utils/db";
import verifyGoogleIdToken from "@/utils/verifyGoogleIdToken";
import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { setBulkAuthTokenCookies } from "@/app/functions/setAuthTokenCookies";
import { ClientTokenType } from "@/types/ClientTokenType";
import { GoogleVerifyError } from "@/classes/GoogleVerifyError";

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
export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { google_token, access_token, refresh_token } = body;
  let credentials: Omit<ClientTokenType, "google_token"> = {
    access_token,
    refresh_token,
  };

  try {
    // verify the access token
    if (
      access_token &&
      verifyJwt<UserType>(access_token, process.env.JWT_ACCESS_TOKEN_SECRET)
    ) {
      return new Response(JSON.stringify(credentials), {
        status: StatusCodeEnum.OK,
        headers: { "Content-Type": "application/json" },
      });
    }
    // verify the refresh token
    if (refresh_token) {
      const userPayload = verifyJwt<UserType>(
        refresh_token,
        process.env.JWT_REFRESH_TOKEN_SECRET
      );
      if (userPayload) {
        // issue new access token
        const new_access_token = signAccessToken(userPayload);
        credentials = {
          refresh_token,
          access_token: new_access_token,
        };
        await setBulkAuthTokenCookies(credentials);
        return new Response(JSON.stringify(credentials), {
          status: StatusCodeEnum.OK,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    // verify the google token
    if (google_token) {
      const googleUserInfo = await verifyGoogleIdToken(google_token);
      const { sub, email, given_name, name, picture } = googleUserInfo;
      // fetch/create user from DB
      const userDB = await createOrGetUser({
        googleSub: sub,
        email: email || "",
        fullName: given_name || "",
        name: name || "",
        avatarUrl: picture || "",
      });
      // issue new pair of access_token and refresh_token
      credentials = {
        access_token: signAccessToken(userDB),
        refresh_token: signRefreshToken(userDB),
      };
      await setBulkAuthTokenCookies(credentials);
      return new Response(JSON.stringify(credentials), {
        status: StatusCodeEnum.OK,
        headers: { "Content-Type": "application/json" },
      });
    }
    throw new Error("Empty tokens");
  } catch (error) {
    // redirect to /sign-in page
    console.error("Token verification failed:", error);
    if (error instanceof GoogleVerifyError)
      return new Response(JSON.stringify({ message: "Invalid credentials." }), {
        status: StatusCodeEnum.UNAUTHORIZED,
      });
    return new Response(JSON.stringify({ message: "Server error." }), {
      status: StatusCodeEnum.INTERNAL_SERVER_ERROR,
    });
  }
}
