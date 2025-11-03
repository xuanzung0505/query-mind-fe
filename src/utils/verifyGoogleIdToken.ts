import { GoogleVerifyError } from "@/classes/errors";
import { OAuth2Client, TokenPayload } from "google-auth-library";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
// Initialize the client outside the function for reuse/caching efficiency
const client = new OAuth2Client(CLIENT_ID);

export default async function verifyGoogleIdToken(
  idToken: string
): Promise<TokenPayload> {
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: CLIENT_ID, // Ensure the token was issued for *this* app
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Failed to retrieve payload from ticket.");
    }
    console.log("Google Token Verification Successful. User Sub:", payload.sub);
    return payload;
  } catch (error) {
    console.error("ID Token verification failed:", error);
    // Throw an error that your API route can catch and return a 401 Unauthorized
    throw new GoogleVerifyError("Invalid or expired Google ID Token.");
  }
}
