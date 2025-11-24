import { BACKEND_URL } from "./const";
import { MessageType } from "@/types/MessageType";

const getMessages = async () => {
  const res = await fetch(BACKEND_URL + `/messages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const messages = (await res.json()) as MessageType[];
  messages.sort((msg1, msg2) => Number(msg2.id) - Number(msg1.id)); // TODO: fix later
  return messages;
};

export { getMessages };
