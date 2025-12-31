import { Binary, ObjectId } from "mongodb";
import { ChunkType } from "./ChunkType";

export type EmbeddingType = {
  document: ChunkType;
  embedding: number[];
  bindataEmbedding: Binary;
  fileId: ObjectId;
  projectId: string;
};
