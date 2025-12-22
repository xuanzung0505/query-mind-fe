"use client";

import ConversationsSheetContent from "./ConversationsSheetContent";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, MessageCircle, Folder } from "lucide-react";
import { usePathname } from "next/navigation";
import PrimaryButton from "./PrimaryButton";
import Link from "next/link";
import { useEffect } from "react";

export function AppSidebar() {
  const { isMobile, setOpen, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const parentDir = pathname.split("/")[1];
  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Conversations",
      url: "/conversations",
      icon: MessageCircle,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Folder,
    },
  ];

  // close app sidebar if pathname is changed
  useEffect(() => {
    if (isMobile) setOpenMobile(false);
    else setOpen(false);
  }, [pathname]);

  return (
    <Sidebar side="left">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      (parentDir == "" && item.url == "/") ||
                      (parentDir !== "" && item.url.endsWith(parentDir))
                    }
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Recent conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col gap-2">
              <ConversationsSheetContent />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <PrimaryButton
          onClick={() => {
            if (isMobile) setOpenMobile(false);
            else setOpen(false);
          }}
        >
          close
        </PrimaryButton>
      </SidebarFooter>
    </Sidebar>
  );
}
