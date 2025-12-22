"use client";

import PrimaryButton from "@/components/PrimaryButton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageSquareText } from "lucide-react";

/**
 *
 * The default sheet to view a list of recent conversations -> integrate into sidebar
 */
function ConversationsSheet({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>
        <PrimaryButton size="icon" additionalClassName="p-0!">
          <MessageSquareText />
        </PrimaryButton>
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-white! border-0">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col py-2 px-4 gap-2 overflow-y-scroll">
          {children}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <PrimaryButton>Close</PrimaryButton>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ConversationsSheet;
