export type MessageType = {
  id: string;
  text: string;
  conversationId: string;
  createdById: string | "AI";
  createdAt: Date;
  updatedAt: Date;
};
