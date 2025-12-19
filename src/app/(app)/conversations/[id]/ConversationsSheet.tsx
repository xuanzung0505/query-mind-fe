"use client";

import PrimaryButton from "@/components/PrimaryButton";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationType } from "@/types/ConversationType";
import { clientApiFetch } from "@/utils/clientApiFetch";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareText } from "lucide-react";
import Link from "next/link";
import React from "react";

export function ConversationsSheetContent() {
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
              className={`border-1 shadow-md cursor-pointer transition-transform hover:translate-x-2
                 active:translate-x-1 ease-in-out`}
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

/**
 * 
 * The default sheet to view a list of recent conversations -> integrate into sidebar
 */
function ConversationsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <PrimaryButton size="icon" additionalClassName="p-0!">
          <MessageSquareText />
        </PrimaryButton>
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-white border-0">
        <SheetHeader>
          <SheetTitle>Recent conversations</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col py-2 px-4 gap-2 overflow-y-scroll">
          <ConversationsSheetContent />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <PrimaryButton>Close</PrimaryButton>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ConversationsSheet;
