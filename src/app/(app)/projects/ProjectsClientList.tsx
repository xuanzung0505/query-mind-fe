"use client";

import Divider from "@/components/Divider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProjectType } from "@/types/ProjectType";
import { clientApiFetch } from "@/utils/clientApiFetch";
import { Avatar } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import { Folder, File } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const VISIBLE_COLLABORATORS_SIZE = 2;

function ProjectsClientList() {
  const { isLoading, data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () =>
      clientApiFetch<ProjectType[]>(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/projects`,
        {
          method: "GET",
        }
      ),
  });

  if (isLoading)
    return (
      <div className="text-neutral-500 italic responsive-text">Loading...</div>
    );

  if (Array.isArray(projects) && projects.length == 0)
    return (
      <div className="text-neutral-500 italic responsive-text">
        It seems quiet here...
      </div>
    );

  return (
    <>
      <Input
        type="text"
        placeholder="Search project..."
        className="responsive-text"
      />
      <div className="flex flex-wrap w-full mt-4 gap-3">
        {Array.isArray(projects) &&
          projects.map((project, index) => (
            <Link
              className="w-full md:w-[calc(50%-6px)] lg:w-[calc(33%-6px)]"
              href={`projects/${project.id}`}
              key={project.id}
            >
              <Card
                className={`border-0 shadow-md gap-2 p-4 
                 cursor-pointer transition-transform hover:-translate-y-1 active:-translate-y-1`}
              >
                <CardHeader className="p-0">
                  <CardTitle className="h-[32px] flex items-center gap-2">
                    <Folder className="text-primary-bg flex-1" />
                    <span className="flex-9 line-clamp-2">{project.title}</span>
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-neutral-500">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <Divider />
                <CardFooter className="grid grid-cols-2 p-0">
                  <div className="flex gap-1 items-center text-xs text-neutral-500">
                    {Array.isArray(project.filesId) &&
                      project.filesId.length > 0 && (
                        <>
                          <File className="w-4 h-4 xs:w-5 xs:h-5" />
                          {project.filesId.length} Files
                        </>
                      )}
                  </div>
                  <div className="flex gap-1 justify-end">
                    <div className="*:data-[slot=avatar]:ring-background h-7 flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                      <Avatar
                        key={index}
                        className="rounded-full overflow-hidden"
                      >
                        <Image
                          src={project.createdBy.avatarUrl}
                          alt="creator-avatar"
                          width={200}
                          height={200}
                          className="w-7 h-7"
                        />
                      </Avatar>
                      {Array.isArray(project.collaborators) &&
                        project.collaborators.length > 0 && (
                          <>
                            {project.collaborators
                              .slice(
                                0,
                                Math.min(
                                  project.collaborators.length,
                                  VISIBLE_COLLABORATORS_SIZE
                                )
                              )
                              .map((user, index) => (
                                <Avatar
                                  key={index}
                                  className="rounded-full overflow-hidden"
                                >
                                  <Image
                                    src={user.avatarUrl}
                                    alt="collaborator-avatar"
                                    width={200}
                                    height={200}
                                    className="w-7 h-7"
                                  />
                                </Avatar>
                              ))}
                          </>
                        )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
      </div>
    </>
  );
}

export default ProjectsClientList;
