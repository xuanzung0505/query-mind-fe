import { ConversationType } from "@/types/ConversationType";
import { BACKEND_URL } from "./const";

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

const getConversationsById = async ({
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

export { getConversations, getConversationsById };
