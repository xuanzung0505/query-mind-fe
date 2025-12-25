import { FileStatusEnum } from "@/const/FileStatusEnum";
import { UserType } from "./UserType";

export type FileType = {
  id: string;
  mimeType: string;
  size: number;
  status: string | FileStatusEnum;
  // projectId: string; -> 1 file can belong to multiple projects
  createdById: string;
  createdBy?: Pick<UserType, "id">;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
