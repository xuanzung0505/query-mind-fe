import { Binary } from "mongodb";
import { ChunkType } from "./ChunkType";

export type EmbeddingType = {
  document: ChunkType;
  embedding: number[];
  bindataEmbedding: Binary;
  projectId: string;
};
