import LayoutWithNavBar from "@/components/LayoutWithNavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutWithNavBar>{children}</LayoutWithNavBar>;
}
