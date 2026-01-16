import { ProjectType } from "./ProjectType";
import { UserType } from "./UserType";

export type ConversationType = {
  id: string;
  title: string;
  projectId?: string;
  project?: Pick<ProjectType, "title" | "collaboratorsId" | "createdById">;
  lastMessage: string;
  lastMessageCreatedAt: Date;
  openAIConversationId: string;
  createdById: string;
  createdBy?: Pick<UserType, "id">;
  createdAt: Date;
  updatedAt: Date;
};
