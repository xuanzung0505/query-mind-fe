import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

function PrimaryButton({
  children,
  size,
  additionalClassName,
  ...props
}: React.ComponentProps<"button"> & {
  children: React.ReactNode;
  size?: "default" | "sm" | "icon" | "lg";
  additionalClassName?: string;
}) {
  return (
    <Button
      size={size}
      {...props}
      className={cn(
        `px-4 sm:px-8 md:px-10 bg-primary-bg text-primary-foreground hover:opacity-90 cursor-pointer 
        active:border-black active:opacity-90`,
        additionalClassName
      )}
    >
      {children}
    </Button>
  );
}

export default PrimaryButton;
