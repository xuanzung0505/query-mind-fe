"use client";
import { clientApiFetch } from "@/utils/clientApiFetch";
// import type { Metadata } from "next";
import { useEffect } from "react";

// export const metadata: Metadata = {
//   title: "Query Mind",
//   description: "Query Mind index page",
// };

export default function Home() {
  useEffect(() => {
    clientApiFetch<unknown>(`${process.env.NEXT_PUBLIC_HOST_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response);
    });
  }, []);
  return <div className="">hehe</div>;
}
