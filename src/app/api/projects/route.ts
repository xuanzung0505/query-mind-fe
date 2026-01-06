import customMiddleware from "@/app/functions/customMiddleware";
import { MessageEnum } from "@/const/MessageEnum";
import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { getProjects } from "@/db/projects";
import isAuthError from "@/utils/isAuthError";

export async function GET(request: Request) {
  try {
    await customMiddleware(request);
    const projects = await getProjects();
    return new Response(JSON.stringify(projects), {
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
    status: StatusCodeEnum.OK,
    headers: { "Content-Type": "application/json" },
  });
}
