import { StatusCodeEnum } from "@/const/StatusCodeEnum";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("google_token");
    redirect("/sign-in");
  } catch (err) {
    console.log(err);
    return new Response(null, {
      status: StatusCodeEnum.REDIRECT,
    });
  }
}
