"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import mergeClasses from "@/utils/mergeClasses";
import Brand from "./Brand";

const BrandButtonNavBar = (props: {
  className: string;
  pathname: string;
  [key: string]: string;
}) => {
  const mergedClassName = mergeClasses(
    props.className ?? "",
    props.pathname === "/" ? "opacity-100" : "opacity-80"
  );
  return <Brand {...{ ...props, className: mergedClassName }}></Brand>;
};

function NavBar() {
  const pathname = usePathname();
  const activeButtonClass = "opacity-100";
  const menuList = [
    { title: "Conversations", url: "/conversations" },
    { title: "Projects", url: "/projects" },
  ];

  return (
    <div className="bg-[#0076D2FF] p-2 md:px-4 flex text-white items-center justify-between lg:grid lg:grid-cols-3 sticky top-0">
      <BrandButtonNavBar {...{ pathname, className: "" }} />
      <div className="flex text-sm sm:text-base md:text-xl sm:gap-2 md:gap-4 justify-center lg:gap-6">
        {menuList.map((menu, index) => (
          <Link href={menu.url} key={index}>
            <button
              className={`p-1 sm:p-2 cursor-pointer opacity-80 hover:opacity-100 active:opacity-100 active:underline ${
                pathname === menu.url ? activeButtonClass : ""
              }`}
            >
              {menu.title}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default NavBar;
