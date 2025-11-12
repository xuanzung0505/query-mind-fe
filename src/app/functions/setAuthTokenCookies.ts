"use server";

import { ClientTokenType } from "@/types/ClientTokenType";
import { TokenMaxAgeType } from "@/types/TokenMaxAgeType";
import { cookies } from "next/headers";

const setBulkAuthTokenCookies = async (
  token: ClientTokenType,
  tokenMaxAge: TokenMaxAgeType
) => {
  const retrievedCookies = await cookies();

  const tokens: { title: string; token: string; maxAge: number }[] =
    Object.entries(token).map(([token_title, token_value]) => {
      return {
        title: token_title,
        token: token_value,
        maxAge: tokenMaxAge[token_title] as number,
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
