"use client";

import React, { use, useRef } from "react";
import type { ListBlobResultBlob } from "@vercel/blob";
import { clientApiFetch } from "@/utils/clientApiFetch";
import { FileDataTable } from "./FileDataTable";
import { FileColumns } from "./FileColumns";
import { FileType } from "@/types/FileType";
import PrimaryButton from "@/components/PrimaryButton";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; //5MB

function ProjectDetailsFilesPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id: projectId } = use(params);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { isLoading: isBlobsLoading, data: files } = useQuery({
    queryKey: ["blobs"],
    queryFn: () =>
      clientApiFetch<FileType[]>(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/blobs`,
        {
          method: "GET",
        }
      ),
  });
  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      clientApiFetch<ListBlobResultBlob[]>(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/blobs?filename=${file.name}&projectId=${projectId}`,
        {
          method: "POST",
          body: file,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blobs"] });
      toast.success("File has been uploaded successfully");
    },
  });

  const publishMutation = useMutation({
    mutationFn: (file: FileType) =>
      clientApiFetch("/api/blobs/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(file),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blobs/publish"] });
      toast.success("Document published successfully");
    },
  });

  return (
    <div className="mt-4 flex flex-col gap-2 mx-2 bg-white rounded-xl p-4 shadow-md">
      <div className="text-neutral-700 responsive-text">
        Upload and publish files to let QueryMind bot analyze and extract
        knowledge, thus enabling query anything you like.
      </div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
          }
          const file = inputFileRef.current.files[0];
          if (file.size > MAX_FILE_SIZE)
            throw new Error("Max file size exceeded! (5MB)");
          uploadMutation.mutate(file);
        }}
        className="flex justify-center gap-1"
      >
        <Input
          name="embedDocuments"
          ref={inputFileRef}
          type="file"
          accept=".pdf"
          required
          className="w-auto responsive-text"
        />
        <PrimaryButton type="submit" disabled={uploadMutation.isPending}>
          {uploadMutation.isPending ? "Uploading..." : "Upload"}
        </PrimaryButton>
      </form>
      {isBlobsLoading || !Array.isArray(files) ? (
        <div className="container mx-auto">
          <Skeleton className="w-full h-60" />
        </div>
      ) : (
        <div className="container mx-auto">
          <FileDataTable
            columns={FileColumns(publishMutation.mutate)}
            data={files}
          />
        </div>
      )}
    </div>
  );
}

export default ProjectDetailsFilesPage;
