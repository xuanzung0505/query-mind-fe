"use client";

import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ConversationType } from "@/types/ConversationType";
import { clientApiFetch } from "@/utils/clientApiFetch";
import dayjs from "@/utils/dayjs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect } from "react";

function ProjectConversationsList({
  projectId,
  conversation,
  setConversation,
  defaultConversationId,
}: {
  projectId?: string;
  conversation?: ConversationType;
  setConversation?: React.Dispatch<
    React.SetStateAction<ConversationType | undefined>
  >;
  defaultConversationId?: string | "new";
}) {
  const {
    isLoading,
    isFetched,
    data: conversations,
  } = useQuery({
    queryKey: ["projects", projectId, "conversations"],
    queryFn: () =>
      clientApiFetch<ConversationType[]>(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/projects/${projectId}/conversations`,
        {
          method: "GET",
        }
      ),
    staleTime: 30 * 1000,
    enabled: projectId !== undefined,
  });

  useEffect(() => {
    if (
      isFetched &&
      Array.isArray(conversations) &&
      defaultConversationId !== "new"
    ) {
      if (setConversation)
        setConversation(
          defaultConversationId
            ? conversations.find((convo) => convo.id === defaultConversationId)
            : conversations.at(0)
        );
    }
  }, [isFetched, conversations, setConversation, defaultConversationId]);

  if (isLoading)
    return (
      <>
        {Array(6)
          .fill(<></>)
          .map((_, index) => (
            <Skeleton
              key={index}
              className="h-12 shrink-0 sm:h-[70px]"
            ></Skeleton>
          ))}
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
      {Array.isArray(conversations) &&
        conversations.length > 0 &&
        conversations.map((convo) => (
          <Link
            href={`/projects/${projectId}/conversations/${convo.id}`}
            key={convo.id}
          >
            <Item
              className={cn(
                `border-1 cursor-pointer transition-transform hover:bg-neutral-100
                 active:bg-neutral-200 ease-in-out`,
                convo.id === conversation?.id ? "bg-neutral-100!" : ""
              )}
            >
              <ItemContent>
                <ItemTitle className="responsive-text">{convo.title}</ItemTitle>
                <ItemDescription className="responsive-text text-wrap">
                  <span className="text-neutral-500">
                    {dayjs(convo.lastMessageCreatedAt).calendar()}
                  </span>
                </ItemDescription>
              </ItemContent>
            </Item>
          </Link>
        ))}
    </>
  );
}

export default ProjectConversationsList;
