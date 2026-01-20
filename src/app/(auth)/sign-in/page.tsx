import type { Metadata } from "next";
import BrandMark from "@/components/BrandMark";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";
import { serverApiFetch } from "@/utils/serverApiFetch";
import { UserType } from "@/types/UserType";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Query Mind sign-in",
  description: "Sign in to Query Mind",
};

export default async function SignInPage() {
  const credentials = await serverApiFetch<UserType | undefined>(
    `${process.env.NEXT_PUBLIC_HOST_URL}/api/users`,
    {
      method: "GET",
    },
  );
  if (credentials !== undefined) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <section className="w-full max-w-xl text-center">
        <div className="flex items-center justify-center select-none animate-bounce-custom">
          <BrandMark className="h-8 w-8 sm:w-10 sm:h-10 md:h-12 md:w-12" />
          <h1
            className={`text-[30px] sm:text-[48px] md:text-[60px] font-extrabold tracking-tight 
          text-transparent bg-clip-text bg-neutral-800 from-primary to-primary/80`}
          >
            QueryMind
          </h1>
        </div>

        <div className="mt-6">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-neutral-700">
            The AI platform you didn&apos;t know you needed
          </h2>
          <p className="mt-2 text-neutral-600">
            Sign in to manage your AI projects and conversations.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <GoogleOAuthButton />
        </div>
      </section>
    </main>
  );
}
