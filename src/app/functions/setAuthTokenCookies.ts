"use server";

import { ClientTokenType } from "@/types/ClientTokenType";
import ms, { StringValue } from "ms";
import { cookies } from "next/headers";

const tokenMaxAges: Record<string, number> = {
  access_token:
    ms(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue) / 1000,
  refresh_token:
    ms(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue) / 1000,
};

const setBulkAuthTokenCookies = async (
  token: Omit<ClientTokenType, "google_token">
) => {
  const retrievedCookies = await cookies();

  const tokens: { title: string; token: string; maxAge: number }[] =
    Object.entries(token).map(([token_title, token_value]) => {
      return {
        title: token_title,
        token: token_value,
        maxAge: tokenMaxAges[token_title],
      };
    }, []);

  tokens.forEach(({ title, token, maxAge }) => {
    retrievedCookies.set(title, token, {
      httpOnly: true, // Recommended for security, prevents client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      maxAge: maxAge,
      path: "/", // Available across the entire application
    });
  });
};

export { setBulkAuthTokenCookies };
