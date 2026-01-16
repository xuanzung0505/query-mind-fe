import { ConversationType } from "@/types/ConversationType";
import { BACKEND_URL } from "./const";
import { getProjectById } from "./projects";

const createAConversation = async (
  payload: Omit<
    ConversationType,
    "id" | "lastMessageCreatedAt" | "createdAt" | "updatedAt"
  >
) => {
  const now = new Date();
  const res = await fetch(BACKEND_URL + `/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      lastMessageCreatedAt: now,
      createdAt: now,
      updatedAt: now,
    }),
  });
  const conversation = (await res.json()) as ConversationType;

  // TODO: aggregate later
  if (conversation.projectId) {
    const project = await getProjectById({ projectId: conversation.projectId });
    conversation.project = project;
  }
  return conversation;
};

const getConversations = async (params?: { projectId?: string }) => {
  const res = await fetch(BACKEND_URL + `/conversations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let conversations = (await res.json()) as ConversationType[];
  if (params) {
    const { projectId } = params;
    if (projectId)
      conversations = conversations.filter(
        (convo) => convo.projectId === projectId
      );
  }
  return conversations;
};

const getConversationById = async ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const res = await fetch(BACKEND_URL + `/conversations/${conversationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const conversation = (await res.json()) as ConversationType;
  return conversation;
};

export { createAConversation, getConversations, getConversationById };
