export type MessageType = {
  id: string | "greeting";
  text: string;
  conversationId: string | undefined;
  createdById: string | "AI";
  createdAt: Date;
  updatedAt: Date;
};
