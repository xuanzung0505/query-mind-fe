import { ConversationType } from "./ConversationType";
import { FileType } from "./FileType";
import { UserType } from "./UserType";

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  collaboratorsId: string[];
  collaborators?: Pick<UserType, "id" | "avatarUrl">[];
  conversationsId: string[];
  conversations?: Pick<ConversationType, "id">[];
  filesId: string[]; // must be limited
  files?: Pick<FileType, "id">[];
  createdById: string;
  createdBy: Pick<UserType, "id" | "avatarUrl">;
  createdAt: Date;
  updatedAt: Date;
};
