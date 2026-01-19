/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Brand from "./Brand";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "./ui/sidebar";
import Image from "next/image";
import { Avatar } from "./ui/avatar";
import { UserContext } from "@/contexts/UserContext";
import { UserType } from "@/types/UserType";
import { clientApiFetch } from "@/utils/clientApiFetch";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

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
  const { setUser } = useContext(UserContext);
  const pathname = usePathname();
  // const parentDir = pathname.split("/")[1];
  // const activeButtonClass = "opacity-100";
  // const menuList = [
  //   { title: "Conversations", url: "/conversations" },
  //   { title: "Projects", url: "/projects" },
  // ];

  const { isLoading, isFetched, data } = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      clientApiFetch<UserType>(`${process.env.NEXT_PUBLIC_HOST_URL}/api/me`, {
        method: "GET",
      }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isFetched && setUser) {
      setUser(data);
    }
  }, [setUser, isFetched, data]);

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
          {isLoading ? (
            <Skeleton className="h-[250px] w-[250px] rounded-full" />
          ) : (
            <Image
              src={(data as UserType).avatarUrl}
              alt="creator-avatar"
              width={200}
              height={200}
            />
          )}
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
