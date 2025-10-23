"use client";

import React from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { serverApiFetch } from "@/utils/apiFetch";

function GoogleOAuthButton() {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    const response = await serverApiFetch(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ google_token: credential }),
      }
    );
    console.log(await response.json());
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
