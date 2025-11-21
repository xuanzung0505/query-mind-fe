import React from "react";
import NavBar from "./NavBar";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

function LayoutWithNavBar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-neutral-100">
      <NavBar />
      {children}

      <footer className="flex gap-4 justify-between p-2 xs:px-12 md:px-32 w-screen text-sm sm:text-base md:text-xl mt-6 m-auto bg-white">
        <div className="flex gap-2">
          <Link href={"/about"}>
            <Button variant={"link"} className="cursor-pointer">
              About
            </Button>
          </Link>
          <Link href={"/documentation"}>
            <Button variant={"link"} className="cursor-pointer">
              Documentation
            </Button>
          </Link>
        </div>
        <div>
          <Link href={"https://github.com/xuanzung0505/query-mind-fe"}>
            <Button variant={"ghost"} size={"icon"} className="cursor-pointer">
              <Image
                src={"github-mark.svg"}
                width={500}
                height={500}
                alt="github logo"
                className="w-6 h-6"
              ></Image>
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default LayoutWithNavBar;
