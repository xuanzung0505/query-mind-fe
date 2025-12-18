import { AppSidebar } from "@/components/AppSidebar";
import LayoutWithNavBar from "@/components/LayoutWithNavBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <LayoutWithNavBar>{children}</LayoutWithNavBar>
    </SidebarProvider>
  );
}
