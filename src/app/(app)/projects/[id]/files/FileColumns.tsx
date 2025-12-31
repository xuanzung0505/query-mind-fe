"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { FileStatusEnum } from "@/const/FileStatusEnum";
import { FileType } from "@/types/FileType";
import dayjs from "@/utils/dayjs";
import formatBytes from "@/utils/formatBytes";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import Link from "next/link";

export const FileColumns: ColumnDef<FileType>[] = [
  {
    accessorKey: "_id",
    header: () => <div className="text-left text-neutral-600">ID</div>,
  },
  {
    accessorKey: "fileUrl",
    header: () => <div className="text-center text-neutral-600">File url</div>,
    cell: ({ row }) => {
      const { original } = row;
      return (
        <div>
          <Link
            href={original.url}
            target="_blank"
            className="text-primary-bg underline"
          >
            {original.url}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "contentType",
    header: () => (
      <div className="text-center text-neutral-600">contentType</div>
    ),
  },
  {
    accessorKey: "size",
    header: () => <div className="text-center text-neutral-600">Size</div>,
    cell: ({ row }) => {
      return <>{formatBytes(row.original.size)}</>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center text-neutral-600">Status</div>,
    cell: ({ row }) => {
      const { original } = row;
      switch (original.status) {
        case FileStatusEnum.UPLOADED:
          return (
            <div className="text-green-600 font-bold text-center">Uploaded</div>
          );
        case FileStatusEnum.CHUNKING:
        case FileStatusEnum.ADDING_METADATA:
        case FileStatusEnum.SAVING_EMBEDDINGS:
        case FileStatusEnum.UPLOADING:
          return (
            <div className="text-yellow-500 font-bold text-center">
              Chunking...
            </div>
          );
        case FileStatusEnum.ADDED_TO_CONTEXT:
          return (
            <div className="text-primary-bg font-bold text-center">
              Added to context
            </div>
          );
        default:
          return <div className="font-bold text-center">{original.status}</div>;
      }
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="text-center text-neutral-600">Created at</div>
    ),
    cell: ({ row }) => {
      const { original } = row;
      return <div>{dayjs(original.createdAt).calendar()}</div>;
    },
  },
  {
    accessorKey: "action",
    header: () => <div className="text-center text-neutral-600">Actions</div>,
    cell: ({ row }) => {
      const { original } = row;
      return (
        <div className="flex items-center">
          <ButtonGroup>
            {original.status === FileStatusEnum.UPLOADED && (
              <PrimaryButton>Publish</PrimaryButton>
            )}
            {original.status === FileStatusEnum.ADDED_TO_CONTEXT && (
              <PrimaryButton>Unpublish</PrimaryButton>
            )}
            {original.status === FileStatusEnum.UPLOADED && (
              <Button
                size={"icon"}
                variant={"destructive"}
                className="px-4 sm:px-6 md:px-8 hover:opacity-90 cursor-pointer 
            active:border-black active:opacity-90 bg-red-500"
              >
                <Trash />
              </Button>
            )}
          </ButtonGroup>
        </div>
      );
    },
  },
];
