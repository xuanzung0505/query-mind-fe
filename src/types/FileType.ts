import { FileStatusEnum } from "@/const/FileStatusEnum";
import { UserType } from "./UserType";

export type FileType = {
  _id: string;
  contentType: string;
  size: number;
  status: string | FileStatusEnum;
  // projectId: string; -> 1 file can belong to multiple projects
  createdById: string;
  createdBy?: Pick<UserType, "id">;
  projectId: string;
  url: string;
  downloadUrl: string;
  pathname: string;
  createdAt: Date;
  updatedAt: Date;
};
