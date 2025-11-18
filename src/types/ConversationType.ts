import { ProjectType } from "./ProjectType";
import { UserType } from "./UserType";

export type ConversationType = {
  id: string;
  title: string;
  projectId: string;
  project?: Pick<ProjectType, "title">;
  lastMessage: string;
  lastMessageCreatedAt: Date;
  createdById: string;
  createdBy?: Pick<UserType, "id">;
  createdAt: Date;
  updatedAt: Date;
};
