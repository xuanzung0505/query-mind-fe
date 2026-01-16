import { ConversationType } from "./ConversationType";

type CustomEventType = ConversationCreated;

type ConversationCreated = {
  type: "conversation.created";
  data: { conversation: ConversationType };
};

export default CustomEventType;
