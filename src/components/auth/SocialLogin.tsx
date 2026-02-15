"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useSocialLogin } from "@/hooks/useSocialLogin";

type Props = {
  role: "USER" | "TENANT";
};

export default function SocialLogin({ role }: Props) {
  const { login } = useSocialLogin(role);

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        if (!credentialResponse.credential) return;

        await login("google", {
          token: credentialResponse.credential,
        });
      }}
      onError={() => {
        alert("Google Login Failed");
      }}
    />
  );
}
