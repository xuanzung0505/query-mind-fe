import { ObjectId } from "mongodb";

export type ChunkType = {
  pageContent: string;
  metadata: Record<string, unknown>;
  id: ObjectId;
};
