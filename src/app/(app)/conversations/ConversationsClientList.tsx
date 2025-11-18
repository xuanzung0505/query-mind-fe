"use client";

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

function ConversationsClientList() {
  const {
    isLoading,
    error,
    data: conversations,
    isFetching,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      clientApiFetch<ConversationType[]>(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/conversations`,
        {
          method: "GET",
        }
      ),
  });

  if (isLoading)
    return (
      <>
        <Skeleton className="h-20 sm:h-[70px]" />
        <Skeleton className="h-20 sm:h-[70px]" />
        <Skeleton className="h-20 sm:h-[70px]" />
        <Skeleton className="h-20 sm:h-[70px]" />
        <Skeleton className="h-20 sm:h-[70px]" />
      </>
    );

  if (Array.isArray(conversations) && conversations.length == 0)
    return (
      <div className="text-neutral-500 italic text-xs xs:text-base">
        It seems quiet here...
      </div>
    );

  return (
    <>
      {Array.isArray(conversations) &&
        conversations.length > 0 &&
        conversations.map((conversation) => (
          <Item
            className={`border-1 shadow-md cursor-pointer transition-transform hover:translate-x-2
                 active:translate-x-1 ease-in-out`}
            key={conversation.id}
          >
            <ItemContent>
              <ItemTitle className="text-xs xs:text-base">{conversation.title}</ItemTitle>
              <ItemDescription className="text-neutral-500 text-xs xs:text-base">
                {conversation.lastMessage}
              </ItemDescription>
            </ItemContent>
            <ItemActions className="text-neutral-500 text-xs xs:text-base">
              {dayjs(conversation.lastMessageCreatedAt).fromNow()}
            </ItemActions>
          </Item>
        ))}
    </>
  );
}

export default ConversationsClientList;
