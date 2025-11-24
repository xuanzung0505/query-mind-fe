"use client";

import Divider from "@/components/Divider";
import PrimaryButton from "@/components/PrimaryButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import dayjs from "@/utils/dayjs";
import { Send } from "lucide-react";
import { useState } from "react";
import ConversationsSheet from "./ConversationsSheet";
import { cn } from "@/lib/utils";

const currentUserId = "d68f";

const fakeMessages = [
  {
    text: "1st message",
    createdAt: "2025-11-21T10:15:50.915Z",
    sentById: "d68f",
  },
  {
    text: "2nd message",
    createdAt: "2025-11-21T10:12:50.915Z",
    sentById: "d68f",
  },
  {
    text: "AI message",
    createdAt: "2025-11-20T10:12:50.915Z",
    sentById: "AI",
  },
  {
    text: "Can i have ughhhh????",
    createdAt: "2025-11-19T10:11:50.915Z",
    sentById: "d68f",
  },
];

function ConversationDetailsPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<typeof fakeMessages>(fakeMessages);

  const handleSendMessage = () => {
    setMessages([
      { text: message, createdAt: Date(), sentById: "d68f" },
      ...messages,
    ]);
    setMessage("");
  };

  return (
    <div className="conversation-details-page p-2">
      <Card
        className={`w-full md:w-5/6 m-auto mt-4 border-0 shadow-md gap-0 cursor-pointer transition-transform 
             h-[80vh] p-0`}
      >
        <CardHeader className="p-0 gap-0">
          <CardTitle className="h-[32px] flex items-center px-2 py-6 gap-2">
            <ConversationsSheet></ConversationsSheet>
            <span className="flex-9 line-clamp-2">
              AI Model Evaluation - Q1 2024
            </span>
          </CardTitle>
        </CardHeader>
        <Divider />
        <CardContent className="p-2 md:p-4 flex-1 overflow-y-scroll responsive-text flex justify-start flex-col-reverse gap-2">
          {messages.map(({ text, sentById, createdAt }, index) => (
            <Collapsible key={index} className={`flex flex-col-reverse gap-2`}>
              <div
                className={
                  sentById == currentUserId ? "self-end" : "self-start"
                }
              >
                <CollapsibleTrigger>
                  <div
                    className={cn(
                      sentById == currentUserId
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
        </CardContent>
        <Divider />
        <CardFooter className="flex flex-col items-start p-4">
          <div className="w-full flex gap-2">
            <Textarea
              wrap="off"
              placeholder="Type your message here."
              className="min-h-9 max-h-44 responsive-text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <PrimaryButton
              size={"icon"}
              additionalClassName={`rounded bg-primary-bg text-white border-0`}
              onClick={() => handleSendMessage()}
            >
              <Send />
            </PrimaryButton>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ConversationDetailsPage;
