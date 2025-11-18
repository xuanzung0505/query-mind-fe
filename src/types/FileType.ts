import { UserType } from "./UserType";

export type FileType = {
  id: string;
  type: string;
  size: number;
  // projectId: string; -> 1 file can belong to multiple projects
  createdById: string;
  createdBy?: Pick<UserType, "id">;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
