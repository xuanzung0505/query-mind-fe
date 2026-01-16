"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { Plus } from "lucide-react";
import ConversationsClientList from "./ConversationsClientList";
import Link from "next/link";

export default function ConversationsPage() {
  return (
    <div className="conversation-page p-2 sm:px-12 md:px-32 min-h-[80vh]">
      <div className="flex flex-col mt-4">
        <div className="flex justify-between items-center">
          <span
            className={`text-[20px] sm:text-[30px] font-extrabold tracking-tight bg-clip-text`}
          >
            Your conversations
          </span>
          <Link href={"/conversations/new"}>
            <PrimaryButton additionalClassName="flex items-center gap-2">
              <Plus />
              <span className="hidden md:block">New Conversation</span>
            </PrimaryButton>
          </Link>
        </div>
        <div className="flex w-full mt-8 flex-col gap-6">
          <ConversationsClientList />
        </div>
      </div>
    </div>
  );
}
