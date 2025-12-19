"use client";

import { ConversationsSheetContent } from "@/app/(app)/conversations/[id]/ConversationsSheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, MessageCircle, Folder } from "lucide-react";
import { usePathname } from "next/navigation";

export function AppSidebar() {
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

  return (
    <Sidebar className="h-full">
      <SidebarContent>
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
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
              <ConversationsSheetContent></ConversationsSheetContent>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
