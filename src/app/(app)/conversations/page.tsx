"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import ConversationsClientList from "./ConversationsClientList";

export default function ConversationsPage() {
  return (
    <div className="conversation-page p-2 sm:px-12 md:px-32 min-h-[500px]">
      <div className="flex flex-col mt-4">
        <div className="flex justify-between items-center">
          <span
            className={`text-[20px] sm:text-[30px] font-extrabold tracking-tight bg-clip-text`}
          >
            Your conversations
          </span>
          <PrimaryButton>
            <Plus />
            <span className="hidden xs:block">New Conversation</span>
          </PrimaryButton>
        </div>
        <div className="mt-8">
          <Input
            type="text"
            placeholder="Search conversation..."
            className="responsive-text"
          />
        </div>
        <div className="flex w-full mt-4 flex-col gap-6">
          <ConversationsClientList />
        </div>
      </div>
    </div>
  );
}
