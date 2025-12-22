import { ProjectType } from "@/types/ProjectType";
import { createContext } from "react";

export const ProjectContext = createContext<{
  isProjectLoading: boolean;
  project: undefined | ProjectType;
}>({
  isProjectLoading: true,
  project: undefined,
});
