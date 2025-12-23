"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ProjectContext } from "@/contexts/ProjectContext";
import { cn } from "@/lib/utils";
import { ProjectType } from "@/types/ProjectType";
import { clientApiFetch } from "@/utils/clientApiFetch";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect, useMemo } from "react";

function useProjectDetails({ projectId }: { projectId: string }) {
  const {
    isLoading,
    isFetched,
    data: project,
  } = useQuery({
    queryKey: ["projects", projectId],
    queryFn: () =>
      clientApiFetch<ProjectType>(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/projects/${projectId}`,
        {
          method: "GET",
        }
      ),
    staleTime: 30 * 1000,
  });

  return { isLoading, isFetched, project };
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id: projectId } = use(params);
  const { isLoading: isProjectLoading, project } = useProjectDetails({
    projectId,
  });
  const router = useRouter();
  const pathname = usePathname();
  const paths = pathname.split("/");

  const tabs = useMemo(() => ["conversations", "files", "sharing"], []);
  const defaultTab = "conversations";
  const currentTab = tabs.includes(paths[paths.length - 1])
    ? paths[paths.length - 1]
    : defaultTab;

  // redirect to default tab if none is present
  useEffect(() => {
    if (!tabs.includes(paths[paths.length - 1])) {
      router.push(`/projects/${projectId}/${defaultTab}`);
    }
  }, [tabs, router, projectId, paths]);

  return (
    <div className="project-details-page p-2">
      <div className="mt-4 mx-2">
        <h1 className="text-[20px] sm:text-[30px] font-extrabold tracking-tight flex gap-2 items-center">
          You are viewing:{" "}
          {project !== undefined ? (
            <span className="text-primary-bg">{project?.title}</span>
          ) : (
            <Skeleton className="w-80 h-8 inline-block"></Skeleton>
          )}
        </h1>
      </div>
      <div className="mt-4 flex justify-center">
        <Tabs value={currentTab}>
          <TabsList className="bg-white p-2 rounded">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  `px-3 data-[state=inactive]:text-neutral-500 data-[state=active]:font-bold`,
                  `data-[state=active]:bg-primary-bg data-[state=active]:text-white cursor-pointer`,
                  `rounded`
                )}
                onClick={() => {
                  router.push(`/projects/${projectId}/${tab}`);
                }}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <ProjectContext.Provider value={{ isProjectLoading, project }}>
        {children}
      </ProjectContext.Provider>
    </div>
  );
}
