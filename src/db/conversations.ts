import { ConversationType } from "@/types/ConversationType";
import { BACKEND_URL } from "./const";
import { getProjectById, getProjects } from "./projects";

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

const getConversations = async ({
  userId,
  projectId,
}: {
  userId: string;
  projectId?: string;
}) => {
  const res = await fetch(BACKEND_URL + `/conversations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const conversations = (await res.json()) as ConversationType[];
  // TODO: aggregate later
  const projects = await getProjects({ userId });
  const aggConversations = conversations.map((convo) => {
    if (convo.projectId) {
      const project = projects.find(
        (project) => project.id === convo.projectId
      );
      return { ...convo, project };
    } else return convo;
  });
  // TODO: filter conversations later
  let filteredConversations = aggConversations;
  if (projectId)
    filteredConversations = aggConversations.filter(
      (convo) => convo.projectId === projectId
    );

  return filteredConversations;
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
  // TODO: aggregate later
  if (conversation.projectId) {
    const project = await getProjectById({ projectId: conversation.projectId });
    conversation.project = project;
  }
  return conversation;
};

export { createAConversation, getConversations, getConversationById };
