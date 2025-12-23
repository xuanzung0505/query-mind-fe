import ReactQueryProviderClient from "../components/ReactQueryProviderClient";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Metadata } from "next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactQueryProviderClient>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
        >
          <body>{children}</body>
        </GoogleOAuthProvider>
      </ReactQueryProviderClient>
    </html>
  );
}

export const metadata: Metadata = {
  title: "QueryMind chatbot application",
  description: `QueryMind is an AI chat application, which helps you analyze your documents, query the extracted knowledge 
  by utilizing a RAG model and third-party LLMs. It thereby helps you to ask anything you like without having to 
  manually searching pages after pages.`,
};
