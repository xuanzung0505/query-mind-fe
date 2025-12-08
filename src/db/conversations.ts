import { ConversationType } from "@/types/ConversationType";
import { BACKEND_URL } from "./const";

const getConversations = async () => {
  const res = await fetch(BACKEND_URL + `/conversations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const conversations = (await res.json()) as ConversationType[];
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
