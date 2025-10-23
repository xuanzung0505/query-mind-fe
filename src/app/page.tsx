import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Query Mind",
  description: "Query Mind index page",
};

export default async function Home() {
  return "Building index...";
}
