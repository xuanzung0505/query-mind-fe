import React from "react";
import { Button } from "./ui/button";

function PrimaryButton({
  children,
}: {
  children: (React.JSX.Element | string)[];
}) {
  return (
    <Button
      className={`px-4 sm:px-8 md:px-10 bg-primary-bg text-primary-foreground hover:opacity-90 cursor-pointer 
        active:border-black active:opacity-90`}
    >
      {children}
    </Button>
  );
}

export default PrimaryButton;
