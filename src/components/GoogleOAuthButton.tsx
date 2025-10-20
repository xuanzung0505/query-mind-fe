"use client";

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { DecodedUserInfoType } from "@/types/decodedUserInfoType";

function GoogleOAuthButton() {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const { credential } = credentialResponse;
        const decoded = jwtDecode<DecodedUserInfoType>(credential || "");
        const { email, given_name, name, iat, exp, picture } = decoded;
        console.log(
          email,
          picture,
          given_name,
          name,
          new Date(Date.now() + iat),
          new Date(Date.now() + exp)
        );
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}

export default GoogleOAuthButton;
