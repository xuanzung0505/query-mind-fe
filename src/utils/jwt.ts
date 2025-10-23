import * as jwt from "jsonwebtoken";
import { StringValue } from "ms";

function signAccessToken(payload: Record<string, unknown>): string {
  if (
    !process.env.JWT_ACCESS_TOKEN_SECRET ||
    !process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
  ) {
    throw new Error("SECRET is not set");
  }
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue,
  });
}

function signRefreshToken(payload: Record<string, unknown>): string {
  if (
    !process.env.JWT_REFRESH_TOKEN_SECRET ||
    !process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
  ) {
    throw new Error("SECRET is not set");
  }
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as StringValue,
  });
}

function signJwt(
  payload: Record<string, unknown>,
  opts: { expiresIn: StringValue | number },
  SECRET: string | undefined
): string {
  if (!SECRET) {
    throw new Error("SECRET is not set");
  }
  return jwt.sign(payload, SECRET, opts);
}

/**
 * Verifies a JWT and returns the decoded payload typed as DecodedUserInfoType.
 * Returns null when verification fails.
 */
function verifyJwt<T>(token: string, SECRET: string | undefined) {
  if (!SECRET) {
    throw new Error("SECRET is not set");
  }
  const decoded = jwt.verify(token, SECRET) as T;
  return decoded;
}

export { signJwt, signAccessToken, signRefreshToken, verifyJwt };
