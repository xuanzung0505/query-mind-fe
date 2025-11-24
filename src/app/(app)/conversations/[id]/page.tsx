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
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";
import ConversationsSheet from "./ConversationsSheet";
import MessagesClientList from "./MessagesClientList";

const fakeMessages = [
  {
    text: "1st message",
    createdAt: "2025-11-21T10:15:50.915Z",
    createdById: "d68f",
  },
  {
    text: "2nd message",
    createdAt: "2025-11-21T10:12:50.915Z",
    createdById: "d68f",
  },
  {
    text: "AI message",
    createdAt: "2025-11-20T10:12:50.915Z",
    createdById: "AI",
  },
  {
    text: "Can i have ughhhh????",
    createdAt: "2025-11-19T10:11:50.915Z",
    createdById: "d68f",
  },
];

function ConversationDetailsPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<typeof fakeMessages>(fakeMessages);

  const handleSendMessage = () => {
    setMessages([
      { text: message, createdAt: Date(), createdById: "d68f" },
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
          <MessagesClientList />
        </CardContent>
        <Divider />
        <CardFooter className="flex flex-col items-start p-4">
          <div className="w-full flex gap-2">
            <Textarea
              placeholder="Type your message here."
              className="min-h-9 max-h-44 responsive-text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                // Detect touch/mobile devices — don't submit on Enter there.
                const isTouchDevice =
                  typeof window !== "undefined" &&
                  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

                if (e.key === "Enter" && !e.shiftKey) {
                  if (isTouchDevice) {
                    // allow newline on mobile keyboards
                    return;
                  }
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
