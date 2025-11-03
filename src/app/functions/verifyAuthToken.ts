"use server";

import { ClientTokenType } from "@/types/ClientTokenType";
import { UserType } from "@/types/UserType";
import { signAccessToken, signRefreshToken, verifyJwt } from "@/utils/jwt";
import { setBulkAuthTokenCookies } from "./setAuthTokenCookies";
import verifyGoogleIdToken from "@/utils/verifyGoogleIdToken";
import { createOrGetUser } from "@/utils/db";
import { EmptyTokensError } from "@/classes/errors";

export default async function verifyAuthToken(
  google_token?: string,
  access_token?: string,
  refresh_token?: string
) {
  let credentials: Omit<ClientTokenType, "google_token"> = {
    access_token,
    refresh_token,
  };

  // verify the access token
  if (
    access_token &&
    verifyJwt<UserType>(access_token, process.env.JWT_ACCESS_TOKEN_SECRET)
  ) {
    return credentials;
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
      return credentials;
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
    return credentials;
  }
  throw new EmptyTokensError();
}
