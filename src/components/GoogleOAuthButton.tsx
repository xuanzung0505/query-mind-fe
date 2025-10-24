"use client";

import React from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { serverApiFetch } from "@/utils/apiFetch";
import { ClientTokenType } from "@/types/ClientTokenType";

function GoogleOAuthButton() {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential: google_token } = credentialResponse;
    await serverApiFetch<Omit<ClientTokenType, "google_token">>(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ google_token }),
      }
    );
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
