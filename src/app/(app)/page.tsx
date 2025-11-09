"use client";
import { Button } from "@/components/ui/button";
import { clientApiFetch } from "@/utils/clientApiFetch";
import Image from "next/image";
// import type { Metadata } from "next";
import { useEffect } from "react";

// export const metadata: Metadata = {
//   title: "Query Mind",
//   description: "Query Mind index page",
// };

export default function HomePage() {
  useEffect(() => {
    clientApiFetch<unknown>(`${process.env.NEXT_PUBLIC_HOST_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response);
    });
  }, []);
  return (
    <div className="homepage p-2">
      <div className="flex flex-col items-center justify-center my-8">
        <Image
          src={"/ai-chat-bg.jpg"}
          alt="AI chat background"
          width={500}
          height={500}
          className="rounded-2xl"
        ></Image>
        <h1
          className={`text-[20px] sm:text-[30px] font-extrabold tracking-tight bg-clip-text mt-4`}
        >
          Start your first AI conversation
        </h1>
        <div className="text-center text-neutral-700 sm:w-[500px] mt-2">
          Engage with Query Mind to get quick answers, brainstorm ideas, or
          explore new topics. Your AI conversations will appear here.
        </div>
        <Button className="mt-10 px-6 sm:px-8 md:px-10 bg-primary-bg text-primary-foreground">
          New Conversation
        </Button>
      </div>
    </div>
  );
}
