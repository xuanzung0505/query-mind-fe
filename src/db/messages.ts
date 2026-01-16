import { BACKEND_URL } from "./const";
import { MessageType } from "@/types/MessageType";

const createAMessage = async (
  payload: Omit<MessageType, "id" | "createdAt" | "updatedAt">
) => {
  const now = new Date();
  const res = await fetch(BACKEND_URL + `/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      createdAt: now,
      updatedAt: now,
    }),
  });
  const message = (await res.json()) as MessageType;
  return message;
};

const getMessages = async ({ conversationId }: { conversationId: string }) => {
  const res = await fetch(BACKEND_URL + `/messages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const messages = (await res.json()) as MessageType[];
  const filteredMessages = messages.filter(
    (message) => message.conversationId === conversationId
  );
  filteredMessages.sort((msg1, msg2) => (msg2.id > msg1.id ? 1 : -1)); // TODO: fix later
  return filteredMessages;
};

const saveMessage = async (message: MessageType) => {
  const res = await fetch(BACKEND_URL + `/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  const result = await res.json();
  return result;
};

export { createAMessage, getMessages, saveMessage };
