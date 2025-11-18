import { ConversationType } from "@/types/ConversationType";
import { BACKEND_URL } from "./const";

const getProjects = async () => {
  const res = await fetch(BACKEND_URL + `/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const projects = (await res.json()) as ConversationType[];
  return projects;
};

export { getProjects };
