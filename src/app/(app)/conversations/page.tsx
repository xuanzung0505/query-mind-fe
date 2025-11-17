"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { ConversationType } from "@/types/ConversationType";
import { clientApiFetch } from "@/utils/clientApiFetch";
import dayjs from "@/utils/dayjs";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  useEffect(() => {
    clientApiFetch<ConversationType[]>(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/conversations`,
      {
        method: "GET",
      }
    ).then((data) => {
      setConversations(data);
    });
  }, []);

  return (
    <div className="conversation-page p-2 sm:px-12 md:px-32">
      <div className="flex flex-col mt-4">
        <div className="flex justify-between items-center">
          <span
            className={`text-[20px] sm:text-[30px] font-extrabold tracking-tight bg-clip-text`}
          >
            Conversations
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
            className="text-xs xs:text-base"
          />
        </div>
        <div className="flex w-full mt-4 flex-col gap-6">
          {conversations.map((conversation) => (
            <Item className="border-1 shadow-md" key={conversation.id}>
              <ItemContent>
                <ItemTitle>{conversation.title}</ItemTitle>
                <ItemDescription className="text-neutral-500">
                  {conversation.lastMessage}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="text-neutral-500">
                {dayjs(conversation.lastMessageCreatedAt).fromNow()}
              </ItemActions>
            </Item>
          ))}
        </div>
      </div>
    </div>
  );
}
