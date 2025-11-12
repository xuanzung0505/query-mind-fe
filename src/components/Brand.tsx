import React from "react";
import BrandMark from "./BrandMark";
import Link from "next/link";
import mergeClasses from "@/utils/mergeClasses";

function Brand(props: { [key: string]: string }) {
  const { className } = props;

  return (
    <div
      className={mergeClasses("hover:opacity-100", className)}
    >
      <Link href={"/"}>
        <div className="inline-flex items-center">
          <BrandMark className="h-5 w-5 sm:w-7 sm:h-7 md:h-9 md:w-9" />
          <span
            className={`text-[20px] sm:text-[30px] md:text-[36px] font-bold tracking-tight 
            bg-clip-text bg-neutral-800 italic`}
          >
            QueryMind
          </span>
        </div>
      </Link>
    </div>
  );
}

export default Brand;
