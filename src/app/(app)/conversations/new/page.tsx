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
import { useContext, useEffect, useRef, useState } from "react";
import MessagesClientList from "../[id]/MessagesClientList";
import { MessageType } from "@/types/MessageType";
import fetchSseStream, { StreamStatus } from "@/utils/fetchSseStream";
import useRetrieveAIReply from "../[id]/useRetrieveAIReply";
import OpenAI from "openai";
import { ConversationType } from "@/types/ConversationType";
import getIsTouchDevice from "@/utils/getIsTouchDevice";
import { useRouter } from "next/navigation";
import CustomEventType from "@/types/CustomEventType";
import { UserContext } from "@/contexts/UserContext";

function ConversationDetailsPage() {
  const router = useRouter();
  const currentUserId = useContext(UserContext).user?.id;
  const conversationRef = useRef<undefined | ConversationType>(undefined);
  const conversationId = undefined;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "greeting",
      text: "Hi, I am QueryMind Bot, how can i help you?",
      conversationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "AI",
    },
  ]);
  const {
    status: AIStatus,
    setStatus: setAIStatus,
    incomingMessage: incomingAIWord,
    setIncomingMessage: setIncomingAIWord,
  } = useRetrieveAIReply();

  const handleSendMessage = () => {
    if (message.trim() === "" || currentUserId === undefined) return;
    setMessages([
      {
        id: crypto.randomUUID(),
        text: message,
        createdById: currentUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
        conversationId,
      },
      ...messages,
    ]);
    fetchSseStream({
      url: `/api/aiReplyStream/new`,
      postData: { query: message },
      status: AIStatus,
      setStatus: setAIStatus,
      handleEvent: (
        parsedEvent: OpenAI.Responses.ResponseStreamEvent | CustomEventType
      ) => {
        if (parsedEvent.type === "conversation.created") {
          conversationRef.current = parsedEvent.data.conversation;
        }
        if (parsedEvent.type === "response.created") {
        }
        if (parsedEvent.type === "response.output_text.delta") {
          setIncomingAIWord((prev) => prev + parsedEvent.delta);
        }
        if (parsedEvent.type === "response.completed") {
          if (conversationRef.current) {
            router.replace(`/conversations/${conversationRef.current.id}`);
          }
        }
      },
    });
    setMessage("");
  };

  useEffect(() => {
    if (AIStatus === StreamStatus.FINISHED && incomingAIWord) {
      setMessages([
        {
          id: crypto.randomUUID(),
          text: incomingAIWord,
          createdById: "AI",
          createdAt: new Date(),
          updatedAt: new Date(),
          conversationId,
        },
        ...messages,
      ]);
      setIncomingAIWord("");
    }
  }, [AIStatus, setIncomingAIWord, incomingAIWord, conversationId, messages]);

  return (
    <div className="conversation-details-page p-2">
      <Card
        className={`w-full md:w-5/6 m-auto mt-4 border-0 shadow-md gap-0 cursor-pointer transition-transform 
             h-[80vh] p-0`}
      >
        <CardHeader className="p-0 gap-0">
          <CardTitle className="h-[32px] flex items-center px-2 py-6 gap-2">
            <span className="flex-9 line-clamp-2">New conversation</span>
          </CardTitle>
        </CardHeader>
        <Divider />
        <CardContent className="p-2 md:p-4 flex-1 overflow-y-scroll responsive-text flex justify-start flex-col-reverse gap-2 cursor-default">
          <MessagesClientList
            {...{
              messages,
              isLoading: false,
              currentUserId,
              incomingAIWord,
              AIStatus,
              conversationId,
            }}
          />
        </CardContent>
        <Divider />
        <CardFooter className="flex flex-col items-start p-4">
          <div className="w-full flex gap-2">
            <Textarea
              placeholder="Ask QueryMind Bot"
              className="min-h-9 max-h-44 responsive-text"
              autoFocus
              maxLength={1000}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  if (getIsTouchDevice() || message.trim() == "") {
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
              disabled={AIStatus == StreamStatus.LOADING}
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
