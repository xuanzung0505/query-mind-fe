"use server";

import { ClientTokenType } from "@/types/ClientTokenType";
import { UserType } from "@/types/UserType";
import { signAccessToken, signRefreshToken, verifyJwt } from "@/utils/jwt";
import { setBulkAuthTokenCookies } from "./setAuthTokenCookies";
import verifyGoogleIdToken from "@/utils/verifyGoogleIdToken";
import { createOrGetUser } from "@/db/users";
import { EmptyTokensError } from "@/classes/errors";
import { jwtDecode } from "jwt-decode";
import ms, { StringValue } from "ms";

const tokenMaxAge = {
  access_token:
    ms(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue) / 1000,
  refresh_token:
    ms(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as StringValue) / 1000,
};

export default async function verifyAuthToken(
  google_token?: string,
  access_token?: string,
  refresh_token?: string
) {
  let credentials: ClientTokenType = {
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
      const { exp: refresh_token_exp } = userPayload;
      const new_access_token = signAccessToken(userPayload);
      const refresh_token_maxAge =
        refresh_token_exp !== undefined
          ? refresh_token_exp * 1000 - Date.now()
          : 0;
      credentials = {
        refresh_token,
        access_token: new_access_token,
      };
      await setBulkAuthTokenCookies(credentials, {
        ...tokenMaxAge,
        refresh_token: refresh_token_maxAge,
      });
      return credentials;
    }
  }
  // verify the google token
  if (google_token) {
    const googleUserInfo = await verifyGoogleIdToken(google_token);
    // valid google token
    const { exp: google_token_exp } = jwtDecode(google_token);
    const google_token_maxAge =
      google_token_exp !== undefined ? google_token_exp * 1000 - Date.now() : 0;
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
      google_token,
      access_token: signAccessToken(userDB),
      refresh_token: signRefreshToken(userDB),
    };
    await setBulkAuthTokenCookies(credentials, {
      ...tokenMaxAge,
      google_token: google_token_maxAge,
    });
    return credentials;
  }
  throw new EmptyTokensError();
}
