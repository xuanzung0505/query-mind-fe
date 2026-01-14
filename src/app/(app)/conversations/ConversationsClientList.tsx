"use client";

import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationType } from "@/types/ConversationType";
import { clientApiFetch } from "@/utils/clientApiFetch";
import dayjs from "@/utils/dayjs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function ConversationsClientList() {
  const { isLoading, data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      clientApiFetch<ConversationType[]>(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/conversations`,
        {
          method: "GET",
        }
      ),
    staleTime: 30 * 1000,
  });

  if (isLoading)
    return (
      <>
        <Skeleton className="h-12 sm:h-[30px]" />
        <Skeleton className="h-20 sm:h-[70px]" />
        <Skeleton className="h-20 sm:h-[70px]" />
        <Skeleton className="h-20 sm:h-[70px]" />
        <Skeleton className="h-20 sm:h-[70px]" />
        <Skeleton className="h-20 sm:h-[70px]" />
      </>
    );

  if (Array.isArray(conversations) && conversations.length == 0)
    return (
      <div className="text-neutral-500 italic responsive-text">
        It seems quiet here...
      </div>
    );

  return (
    <>
      <Input
        type="text"
        placeholder="Search conversation..."
        className="responsive-text"
      />
      {Array.isArray(conversations) &&
        conversations.length > 0 &&
        conversations.map((conversation) => (
          <Link
            href={
              conversation.projectId
                ? `projects/${conversation.projectId}/conversations/${conversation.id}`
                : `conversations/${conversation.id}`
            }
            key={conversation.id}
          >
            <Item
              className={`border-1 shadow-md cursor-pointer transition-transform hover:translate-x-2
                 active:translate-x-1 ease-in-out`}
            >
              <ItemContent>
                <ItemTitle className="responsive-text">
                  {conversation.title}
                </ItemTitle>
                <ItemDescription className="text-neutral-500 responsive-text">
                  {conversation.lastMessage}
                </ItemDescription>
                {conversation.projectId && (
                  <ItemDescription className="responsive-text">
                    In{" "}
                    <span className="font-bold">
                      {conversation.project?.title}
                    </span>
                  </ItemDescription>
                )}
              </ItemContent>
              <ItemActions className="text-neutral-500 responsive-text">
                {dayjs(conversation.lastMessageCreatedAt).fromNow()}
              </ItemActions>
            </Item>
          </Link>
        ))}
    </>
  );
}

export default ConversationsClientList;
