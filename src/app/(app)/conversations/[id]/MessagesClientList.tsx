import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MessageType } from "@/types/MessageType";
import dayjs from "@/utils/dayjs";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import React from "react";

function MessagesClientList({
  isLoading,
  messages,
  currentUserId,
  incomingAIWord,
}: {
  isLoading: boolean;
  messages: MessageType[];
  currentUserId: string;
  incomingAIWord: string;
}) {
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
      {Array.isArray(messages) && (
        <>
          {incomingAIWord != "" && (
            <Collapsible
              className={`flex flex-col-reverse gap-2`}
              key={`incoming-ai`}
            >
              <div className={"self-start"}>
                <CollapsibleTrigger>
                  <div
                    className={cn(
                      "bg-neutral-200 rounded-xl p-4 float-left",
                      "text-left sm:max-w-[500px]"
                    )}
                  >
                    {incomingAIWord}
                  </div>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent
                className="self-center transition-all duration-500 data-[state=open]:animate-in 
                data-[state=open]:fade-in-0"
              >
                {dayjs(Date()).calendar()}
              </CollapsibleContent>
            </Collapsible>
          )}
          {messages.map(({ id, text, createdById, createdAt }, index) => (
            <Collapsible
              key={id ?? index}
              className={`flex flex-col-reverse gap-2`}
            >
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
      )}
    </>
  );
}

export default MessagesClientList;
