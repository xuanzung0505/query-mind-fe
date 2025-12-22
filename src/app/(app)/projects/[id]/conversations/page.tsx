"use client";

import MessagesClientList from "@/app/(app)/conversations/[id]/MessagesClientList";
import useRetrieveAIReply from "@/app/(app)/conversations/[id]/useRetrieveAIReply";
import ConversationsSheet from "@/components/ConversationsSheet";
import Divider from "@/components/Divider";
import PrimaryButton from "@/components/PrimaryButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConversationType } from "@/types/ConversationType";
import { MessageType } from "@/types/MessageType";
import { clientApiFetch } from "@/utils/clientApiFetch";
import fetchSseStream, { StreamStatus } from "@/utils/fetchSseStream";
import getIsTouchDevice from "@/utils/getIsTouchDevice";
import { useQuery } from "@tanstack/react-query";
import { Send, MessageCirclePlus } from "lucide-react";
import OpenAI from "openai";
import React, { useContext, useEffect, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import ProjectConversationsList from "../ProjectConversationsList";
import { ProjectContext } from "@/contexts/ProjectContext";

const currentUserId = "d68f";

function ProjectDetailsConversationsPage() {
  const { isProjectLoading, project } = useContext(ProjectContext);
  const [conversation, setConversation] = useState<
    undefined | ConversationType
  >();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  const {
    isLoading,
    isFetched,
    data: queriedMessages,
  } = useQuery({
    queryKey: [`conversations/${conversation?.id}/messages`],
    queryFn: () =>
      clientApiFetch<MessageType[]>(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/conversations/${conversation?.id}/messages`,
        {
          method: "GET",
        }
      ),
    enabled: conversation !== undefined,
  });
  const {
    status: AIStatus,
    setStatus: setAIStatus,
    incomingMessage: incomingAIWord,
    setIncomingMessage: setIncomingAIWord,
  } = useRetrieveAIReply();
  const { open: isSidebarOpen } = useSidebar();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isFetched && Array.isArray(queriedMessages)) {
      setMessages(queriedMessages);
    }
  }, [isFetched, queriedMessages]);

  const handleSendMessage = () => {
    if (isLoading || isProjectLoading || message.trim() === "") return;
    setMessages([
      {
        id: crypto.randomUUID(),
        text: message,
        createdById: currentUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
        conversationId: conversation!.id,
      },
      ...messages,
    ]);
    fetchSseStream({
      url: "/api/aiReplyStream",
      postData: { query: message },
      status: AIStatus,
      setStatus: setAIStatus,
      handleEvent: (parsedEvent: OpenAI.Responses.ResponseStreamEvent) => {
        if (parsedEvent.type === "response.created") {
        }
        if (parsedEvent.type === "response.output_text.delta") {
          setIncomingAIWord((prev) => prev + parsedEvent.delta);
        }
        if (parsedEvent.type === "response.completed") {
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
          conversationId: conversation!.id,
        },
        ...messages,
      ]);
      setIncomingAIWord("");
    }
  }, [AIStatus, setIncomingAIWord, incomingAIWord, conversation, messages]);

  if (isMobile)
    return (
      <div className="project-details-page p-2">
        <Card
          className={`w-full md:w-5/6 m-auto mt-4 border-0 shadow-md gap-0 cursor-pointer transition-transform 
             h-[80vh] p-0`}
        >
          <CardHeader className="p-0 gap-0">
            <CardTitle className="h-[32px] flex items-center px-2 py-6 gap-2">
              <ConversationsSheet
                title="Conversations in this project"
                defaultOpen={true}
              >
                <ProjectConversationsList
                  {...{ projectId: project?.id, conversation, setConversation }}
                />
              </ConversationsSheet>
              <span className="flex-9 line-clamp-2">
                {conversation === undefined ? (
                  <Skeleton className="h-4 w-[200px]" />
                ) : (
                  <>{conversation.title}</>
                )}
              </span>
            </CardTitle>
          </CardHeader>
          <Divider />
          <CardContent className="p-2 md:p-4 flex-1 overflow-y-scroll responsive-text flex justify-start flex-col-reverse gap-2 cursor-default">
            <MessagesClientList
              {...{
                messages,
                isLoading,
                currentUserId,
                incomingAIWord,
                AIStatus,
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

  return (
    <Group className="w-full mt-4 overflow-visible" orientation="horizontal">
      <Panel minSize={"30%"} maxSize={"50%"} defaultSize={25} className="p-2">
        <Card
          className="h-[80vh] border-0 shadow-md cursor-pointer transition-transform 
             p-0 gap-2"
        >
          <CardHeader className="p-2 gap-0">
            <PrimaryButton>
              <MessageCirclePlus />
              {!isSidebarOpen && "Create new conversation"}
            </PrimaryButton>
          </CardHeader>
          <Divider />
          <CardContent className="p-2 flex flex-col gap-2">
            <ProjectConversationsList
              {...{ projectId: project?.id, conversation, setConversation }}
            />
          </CardContent>
        </Card>
      </Panel>
      <Separator className="w-1 shadow-md rounded-md border-1 border-neutral-300" />
      <Panel defaultSize={75} className="p-2">
        <Card
          className={`border-0 shadow-md gap-0 cursor-pointer transition-transform 
             h-[80vh] p-0`}
        >
          <CardHeader className="p-2 gap-0">
            <CardTitle className="h-[32px] flex items-center px-2 py-6 gap-2">
              <span className="flex-9 line-clamp-2">
                {conversation === undefined ? (
                  <Skeleton className="h-4 w-[200px]" />
                ) : (
                  <>{conversation?.title}</>
                )}
              </span>
            </CardTitle>
          </CardHeader>
          <Divider />
          <CardContent className="p-2 md:p-4 flex-1 overflow-y-scroll responsive-text flex justify-start flex-col-reverse gap-2 cursor-default">
            <MessagesClientList
              {...{
                messages,
                isLoading,
                currentUserId,
                incomingAIWord,
                AIStatus,
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
      </Panel>
    </Group>
  );
}

export default ProjectDetailsConversationsPage;
