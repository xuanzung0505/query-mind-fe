"use client";

import { AppSidebar } from "@/components/AppSidebar";
import LayoutWithNavBar from "@/components/LayoutWithNavBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserContext } from "@/contexts/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserContext.Provider value={{ userId: "fee0" }}>
      <SidebarProvider>
        <AppSidebar />
        <LayoutWithNavBar>{children}</LayoutWithNavBar>
      </SidebarProvider>
    </UserContext.Provider>
  );
}
