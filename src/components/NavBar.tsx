/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Brand from "./Brand";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "./ui/sidebar";
import Image from "next/image";
import { Avatar } from "./ui/avatar";

const BrandButtonNavBar = (props: {
  className: string;
  pathname: string;
  [key: string]: string;
}) => {
  const mergedClassName = cn(
    props.className ?? "",
    props.pathname === "/" ? "opacity-100" : "opacity-80"
  );
  return <Brand {...{ ...props, className: mergedClassName }}></Brand>;
};

function NavBar() {
  const pathname = usePathname();
  const parentDir = pathname.split("/")[1];
  const activeButtonClass = "opacity-100";
  const menuList = [
    { title: "Conversations", url: "/conversations" },
    { title: "Projects", url: "/projects" },
  ];

  return (
    <div
      className={`bg-[#0076D2FF] p-2 md:px-4 text-white items-center grid grid-cols-3
        sticky top-0 z-[1]`}
    >
      <SidebarTrigger
        className="md:size-10 border-1 opacity-60 hover:opacity-100 cursor-pointer 
        active:opacity-100"
      />
      <BrandButtonNavBar {...{ pathname, className: "flex justify-center" }} />
      <div className="flex justify-end">
        <Avatar className="rounded-full">
          <Image
            src={
              "https://lh3.googleusercontent.com/a/ACg8ocIMhnvazXFsi7p-5zN2qeTgn_m-q5RCRViXduFn2fohYDY-fD_B=s96-c"
            }
            alt="creator-avatar"
            width={200}
            height={200}
          />
        </Avatar>
      </div>
      {/* <div className="flex text-sm sm:text-base sm:gap-2 md:gap-4 justify-center lg:gap-6">
        {menuList.map((menu, index) => (
          <Link href={menu.url} key={index}>
            <button
              className={`p-1 sm:p-2 cursor-pointer opacity-80 hover:opacity-100 active:opacity-100 active:underline ${
                parentDir !== "" && menu.url.endsWith(parentDir)
                  ? activeButtonClass
                  : ""
              }`}
            >
              {menu.title}
            </button>
          </Link>
        ))}
      </div> */}
    </div>
  );
}

export default NavBar;
