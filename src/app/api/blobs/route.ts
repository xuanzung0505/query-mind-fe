import customMiddleware from "@/app/functions/customMiddleware";
import { FileStatusEnum } from "@/const/FileStatusEnum";
import { MessageEnum } from "@/const/MessageEnum";
import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { FileService } from "@/db/mongo";
import { FileType } from "@/types/FileType";
import { UserType } from "@/types/UserType";
import isAuthError from "@/utils/isAuthError";
import { put } from "@vercel/blob";
import { jwtDecode } from "jwt-decode";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    await customMiddleware(request);

    const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
    await client.connect();
    const fileService = new FileService({ connectedClient: client });
    const result = await fileService.get();
    // const blobsListResult = await list({
    //   prefix: decodedAccessToken.id,
    //   token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
    // });
    // const result = blobsListResult.blobs;
    return new Response(JSON.stringify(result), {
      status: StatusCodeEnum.OK,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (isAuthError(error))
      return new Response(MessageEnum.INVALID_CREDENTIALS, {
        status: StatusCodeEnum.UNAUTHORIZED,
        headers: { "Content-Type": "application/json" },
      });
    else console.log(error);
  }

  return new Response(JSON.stringify([]), {
    status: StatusCodeEnum.INTERNAL_SERVER_ERROR,
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
    const projectId = searchParams.get("projectId") as string;

    const headersList = await headers();
    const contentLength = Number.parseInt(
      headersList.get("content-length") as string
    );

    if (request.body) {
      const { downloadUrl, url, contentType } = await put(
        `${decodedAccessToken.id}/${filename}`,
        request.body,
        {
          access: "public",
          allowOverwrite: true,
          token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
          onUploadProgress: ({ loaded, total, percentage }) => {
            console.log(
              `loaded: ${loaded}, total: ${total}, percentage: ${percentage}`
            );
          },
        }
      );
      // Create the doc in mongoDB
      const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
      await client.connect();
      const fileService = new FileService({ connectedClient: client });
      await fileService.insert({
        filter: { downloadUrl },
        operator: {
          $set: {
            contentType,
            size: contentLength,
            status: FileStatusEnum.UPLOADED,
            createdById: decodedAccessToken.id,
            projectId,
            url,
            downloadUrl,
            pathname: decodedAccessToken.id + `/${filename}`,
          } as FileType,
          $currentDate: { updatedAt: true, createdAt: true },
        },
      });
      return new Response(JSON.stringify({ success: true }), {
        status: StatusCodeEnum.OK,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    if (isAuthError(error))
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
