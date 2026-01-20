import Image from "next/image";
import { Plus } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import Link from "next/link";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Query Mind",
//   description: "Query Mind index page",
// };

export default async function HomePage() {
  return (
    <div className="homepage p-2">
      <div className="flex flex-col items-center justify-center my-8">
        <Image
          src={"/ai-chat-bg.jpg"}
          alt="AI chat background"
          width={500}
          height={500}
          className="w-auto h-auto rounded-2xl"
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
        <div className="mt-10">
          <Link href={"/conversations/new"}>
            <PrimaryButton>
              <Plus />
              New Conversation
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
