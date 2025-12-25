import customMiddleware from "@/app/functions/customMiddleware";
import { GoogleVerifyError, EmptyTokensError } from "@/classes/errors";
import { MessageEnum } from "@/const/MessageEnum";
import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { UserType } from "@/types/UserType";
import { list, put } from "@vercel/blob";
import { jwtDecode } from "jwt-decode";

export async function GET(request: Request) {
  try {
    const credentials = await customMiddleware(request);
    const decodedAccessToken = jwtDecode(
      credentials.access_token as string
    ) as UserType;
    const blobsListResult = await list({
      prefix: decodedAccessToken.id,
      token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
    });
    return new Response(JSON.stringify(blobsListResult.blobs), {
      status: StatusCodeEnum.OK,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof GoogleVerifyError || error instanceof EmptyTokensError)
      return new Response(MessageEnum.INVALID_CREDENTIALS, {
        status: StatusCodeEnum.UNAUTHORIZED,
        headers: { "Content-Type": "application/json" },
      });
    else console.log(error);
  }

  return new Response(JSON.stringify([]), {
    status: StatusCodeEnum.OK,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  try {
    const credentials = await customMiddleware(request);
    const decodedAccessToken = jwtDecode(
      credentials.access_token as string
    ) as UserType;
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") as string;
    if (request.body) {
      await put(`${decodedAccessToken.id}/${filename}`, request.body, {
        access: "public",
        allowOverwrite: true,
        token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
        onUploadProgress: ({ loaded, total, percentage }) => {
          console.log(
            `loaded: ${loaded}, total: ${total}, percentage: ${percentage}`
          );
        },
      });
      return new Response(JSON.stringify({ success: true }), {
        status: StatusCodeEnum.OK,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    if (error instanceof GoogleVerifyError || error instanceof EmptyTokensError)
      return new Response(MessageEnum.INVALID_CREDENTIALS, {
        status: StatusCodeEnum.UNAUTHORIZED,
        headers: { "Content-Type": "application/json" },
      });
    else console.log(error);
  }
  return new Response(JSON.stringify({ success: false }), {
    status: StatusCodeEnum.INTERNAL_SERVER_ERROR,
    headers: { "Content-Type": "application/json" },
  });
}
