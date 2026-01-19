"use client";

import { Toaster } from "sonner";
import ReactQueryProviderClient from "../components/ReactQueryProviderClient";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { UserType } from "@/types/UserType";
import { UserContext } from "@/contexts/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<UserType | undefined>(undefined);
  return (
    <html lang="en">
      <UserContext.Provider value={{ user, setUser }}>
        <ReactQueryProviderClient>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
          >
            <body>
              {children}
              <Toaster />
            </body>
          </GoogleOAuthProvider>
        </ReactQueryProviderClient>
      </UserContext.Provider>
    </html>
  );
}

// export const metadata: Metadata = {
//   title: "QueryMind chatbot application",
//   description: `QueryMind is an AI chat application, which helps you analyze your documents, query the extracted knowledge
//   by utilizing a RAG model and third-party LLMs. It thereby helps you to ask anything you like without having to
//   manually searching pages after pages.`,
// };
