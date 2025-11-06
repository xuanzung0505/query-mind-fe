import React from "react";
import NavBar from "./NavBar";

function LayoutWithNavBar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export default LayoutWithNavBar;
