import PrimaryButton from "@/components/PrimaryButton";
import { Plus } from "lucide-react";
import ProjectsClientList from "./ProjectsClientList";

export default function ProjectsPage() {
  return (
    <div className="conversation-page p-2 sm:px-12 md:px-32 min-h-[80vh]">
      <div className="flex flex-col mt-4">
        <div className="flex justify-between items-center">
          <span
            className={`text-[20px] sm:text-[30px] font-extrabold tracking-tight bg-clip-text`}
          >
            Your projects
          </span>
          <PrimaryButton>
            <Plus />
            <span className="hidden xs:block">New project</span>
          </PrimaryButton>
        </div>
        <div className="mt-8">
          <ProjectsClientList />
        </div>
      </div>
    </div>
  );
}
