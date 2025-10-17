"use client";

import { Button } from "@/components/ui/button";
import BrandMark from "@/components/BrandMark";
import GoogleIcon from "@/components/GoogleIcon";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const OAUTH_API_URL = process.env.NEXT_PUBLIC_OAUTH_API_URL || "";
  const signInOAuthObj = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    response_type: "token",
    scope: process.env.NEXT_PUBLIC_OAUTH_SCOPE || "",
    redirect_uri: process.env.NEXT_PUBLIC_HOST_URL || "",
  };

  useEffect(() => {
    const paramsObj = Object.fromEntries(
      new URLSearchParams(window.location.hash.replace("#", "")).entries()
    );
    const { access_token } = paramsObj;
    if (access_token)
      fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((data) => data.json())
        .then((userInfo) => {
          console.log(userInfo);
        });
  }, []);

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
          <Link
            href={`${OAUTH_API_URL}?${new URLSearchParams(
              signInOAuthObj
            ).toString()}`}
          >
            <Button
              className="bg-[#1a73e8] hover:bg-[#1669d5] text-white px-5 h-10 rounded-md shadow-md"
              aria-label="Sign in with Google"
            >
              <GoogleIcon className="h-5 w-5" />
              <span className="ml-2">Sign in with Google</span>
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
