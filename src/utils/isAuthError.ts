import { GoogleVerifyError, EmptyTokensError } from "@/classes/errors";
import { TokenExpiredError } from "jsonwebtoken";

export default function isAuthError(error: unknown) {
  return (
    error instanceof TokenExpiredError ||
    error instanceof GoogleVerifyError ||
    error instanceof EmptyTokensError
  );
}
