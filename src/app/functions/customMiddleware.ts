import verifyAuthToken from "./verifyAuthToken";
import { cookies } from "next/headers";

export default async function customMiddleware(request: Request) {
  console.log("Custom MIDDLEWARE runs in Nodejs environment");
  try {
    const [cookieStore, headersList] = await Promise.all([
      cookies(),
      request.headers,
    ]);
    const google_token =
      headersList.get("authorization")?.split(" ")[1] ??
      cookieStore.get("google_token")?.value ??
      undefined;
    const access_token = cookieStore.get("access_token")?.value;
    const refresh_token = cookieStore.get("refresh_token")?.value;
    console.log("google_token", google_token);
    console.log("access_token", access_token);
    console.log("refresh_token", refresh_token);
    const credentials = await verifyAuthToken(
      google_token,
      access_token,
      refresh_token
    );
    return credentials;
  } catch (error) {
    throw error;
  }
}
