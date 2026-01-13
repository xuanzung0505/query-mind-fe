import { BACKEND_URL } from "./const";
import { ProjectType } from "@/types/ProjectType";

const getProjects = async ({ userId }: { userId: string }) => {
  const res = await fetch(BACKEND_URL + `/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  // TODO: filter later
  const projects = (await res.json()) as ProjectType[];
  return projects.filter(
    (project) =>
      project.createdById === userId || project.collaboratorsId.includes(userId)
  );
};

const getProjectById = async ({ projectId }: { projectId: string }) => {
  const res = await fetch(BACKEND_URL + `/projects/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const project = (await res.json()) as ProjectType;
  return project;
};

export { getProjects, getProjectById };
