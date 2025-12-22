"use client";

import { ConversationType } from "@/types/ConversationType";
import { clientApiFetch } from "@/utils/clientApiFetch";
import { useQuery } from "@tanstack/react-query";
import { Item, ItemContent, ItemTitle, ItemDescription } from "./ui/item";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

/**
 *
 * Default sheet content which loads recent conversations
 */
function ConversationsSheetContent() {
  const { isLoading, data: conversations } = useQuery({
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
        conversations.map((conversation) => (
          <Link
            href={`/conversations/${conversation.id}`}
            key={conversation.id}
          >
            <Item
              className={`border-1 cursor-pointer transition-transform hover:bg-neutral-100
                 active:bg-neutral-200 ease-in-out`}
            >
              <ItemContent>
                <ItemTitle className="responsive-text">
                  {conversation.title}
                </ItemTitle>
                {conversation.projectId && (
                  <ItemDescription className="responsive-text">
                    In{" "}
                    <span className="font-bold">
                      {conversation.project?.title}
                    </span>
                  </ItemDescription>
                )}
              </ItemContent>
            </Item>
          </Link>
        ))}
    </>
  );
}
export default ConversationsSheetContent;
