"use client";

import React from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { clientApiFetch } from "@/utils/clientApiFetch";
import { ClientTokenType } from "@/types/ClientTokenType";
import { redirect } from "next/navigation";

function GoogleOAuthButton() {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const google_token = credentialResponse.credential as string;
    const credentials = await clientApiFetch<ClientTokenType>(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${google_token}`,
        },
      }
    );
    if (credentials) redirect("/");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}

export default GoogleOAuthButton;
