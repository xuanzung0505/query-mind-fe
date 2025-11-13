import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="flex flex-col space-y-3 gap-4">
        <Skeleton className="h-52 w-72 xs:h-60 xs:w-96 sm:h-[300px] sm:w-[500px] rounded-xl" />
        <div className="space-y-2 flex flex-col gap-4">
          <Skeleton className="h-12 w-72 xs:h-10 xs:w-96 sm:h-[50px] sm:w-[500px]" />
          <Skeleton className="h-4 w-72 xs:h-5 xs:w-96 sm:h-[25px] sm:w-[500px]" />
          <Skeleton className="h-4 w-72 xs:h-5 xs:w-96 sm:h-[25px] sm:w-[500px]" />
          <Skeleton className="h-6 w-32 xs:h-10 xs:w-40 m-auto mt-4 sm:h-12 sm:w-[200px]" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
