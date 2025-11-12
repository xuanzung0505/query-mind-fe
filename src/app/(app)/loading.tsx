import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="flex flex-col space-y-3 gap-4">
        <Skeleton className="h-[300px] w-[500px] rounded-xl" />
        <div className="space-y-2 flex flex-col gap-4">
          <Skeleton className="h-[50px] w-[500px]" />
          <Skeleton className="h-4 w-[500px]" />
          <Skeleton className="h-4 w-[500px]" />
          <Skeleton className="h-4 w-[500px]" />
          <Skeleton className="m-auto mt-4 h-9 w-[200px]" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
