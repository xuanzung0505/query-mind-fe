import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MessageType } from "@/types/MessageType";
import { clientApiFetch } from "@/utils/clientApiFetch";
import dayjs from "@/utils/dayjs";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const currentUserId = "d68f";

function MessagesClientList() {
  const { isLoading, data: messages } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      clientApiFetch<MessageType[]>(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/messages`,
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
          .map((_, index) => {
            if (index % 2 == 0)
              return (
                <Skeleton
                  key={index}
                  className="h-20 w-48 sm:h-[70px] sm:w-[500px] self-end rounded-xl rounded-tr-none"
                ></Skeleton>
              );
            return (
              <Skeleton
                key={index}
                className="h-20 w-24 sm:h-[70px] sm:w-[200px] self-start rounded-xl"
              ></Skeleton>
            );
          })}
      </>
    );

  return (
    <>
      {Array.isArray(messages) &&
        messages.map(({ text, createdById, createdAt }, index) => (
          <Collapsible key={index} className={`flex flex-col-reverse gap-2`}>
            <div
              className={
                createdById == currentUserId ? "self-end" : "self-start"
              }
            >
              <CollapsibleTrigger>
                <div
                  className={cn(
                    createdById == currentUserId
                      ? "bg-primary-bg text-white rounded-xl rounded-tr-none p-4 float-right"
                      : "bg-neutral-200 rounded-xl p-4 float-left",
                    "text-left sm:max-w-[500px]"
                  )}
                >
                  {text}
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent
              className="self-center transition-all duration-500 data-[state=open]:animate-in 
                data-[state=open]:fade-in-0"
            >
              {dayjs(createdAt).calendar()}
            </CollapsibleContent>
          </Collapsible>
        ))}
    </>
  );
}

export default MessagesClientList;
