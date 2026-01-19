import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { MessageType } from "@/types/MessageType";
import dayjs from "@/utils/dayjs";
import { StreamStatus } from "@/utils/fetchSseStream";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import React from "react";
import { marked } from "marked";

function MessagesClientList({
  isLoading,
  messages,
  currentUserId,
  incomingAIWord,
  AIStatus,
  conversationId,
}: {
  isLoading: boolean;
  messages: MessageType[];
  currentUserId: string | undefined;
  incomingAIWord: string;
  AIStatus: string;
  conversationId: string | undefined;
}) {
  if (
    (isLoading && conversationId === undefined) ||
    currentUserId === undefined
  )
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
          {AIStatus == StreamStatus.LOADING && (
            <>
              {incomingAIWord == "" ? (
                <Collapsible
                  className={`flex flex-col-reverse gap-2`}
                  key={`loading`}
                >
                  <div className={"self-start"}>
                    <CollapsibleTrigger>
                      <div
                        className={cn(
                          "rounded-xl p-4 float-left",
                          "text-left sm:max-w-[500px] text-primary-bg inline-flex gap-2 items-center"
                        )}
                      >
                        <span>
                          <Spinner className="size-6" />
                        </span>
                        <span>Thinking...</span>
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
              ) : (
                <Collapsible
                  className={`flex flex-col-reverse gap-2`}
                  key={`incoming-ai`}
                >
                  <div className={"self-start"}>
                    <CollapsibleTrigger>
                      <div
                        className={cn(
                          "bg-neutral-200 rounded-xl p-4 float-left",
                          "text-left sm:max-w-[500px] message-block"
                        )}
                        dangerouslySetInnerHTML={{
                          __html: marked.parse(incomingAIWord),
                        }}
                      ></div>
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
            </>
          )}
          {messages.map(({ id, text, createdById, createdAt }, index) => (
            <Collapsible
              key={id ?? index}
              className={`flex flex-col-reverse gap-2${
                id === "greeting" ? " animate-bounce-up-custom" : ""
              }`}
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
                      "text-left sm:max-w-[500px] message-block"
                    )}
                    dangerouslySetInnerHTML={{ __html: marked.parse(text) }}
                  ></div>
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
