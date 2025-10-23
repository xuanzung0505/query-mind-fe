import type { Metadata } from "next";
import BrandMark from "@/components/BrandMark";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";

export const metadata: Metadata = {
  title: "Query Mind sign-in",
  description: "Sign in to Query Mind",
};

export default async function SignInPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <section className="w-full max-w-xl text-center">
        <div className="flex items-center justify-center select-none animate-bounce-custom">
          <BrandMark className="h-8 w-8 sm:w-10 sm:h-10 md:h-12 md:w-12 text-primary" />
          <h1
            className={`text-[30px] sm:text-[48px] md:text-[60px] font-extrabold tracking-tight 
          text-transparent bg-clip-text bg-neutral-800 from-primary to-primary/80`}
          >
            QueryMind
          </h1>
        </div>

        <div className="mt-6">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-neutral-700">
            Welcome to Query Mind
          </h2>
          <p className="mt-2 text-neutral-600">
            Log in with Google to manage your AI projects and conversations.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <GoogleOAuthButton />
        </div>
      </section>
    </main>
  );
}
