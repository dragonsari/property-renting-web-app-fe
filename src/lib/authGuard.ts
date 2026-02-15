import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

type Options = {
  role?: "USER" | "TENANT";
  verified?: boolean;
};

export function useAuthGuard(options?: Options) {
  const { token, role, isVerified } = useAuthStore();

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    if (options?.role && role !== options.role) {
      window.location.href = "/";
      return;
    }

    if (options?.verified && !isVerified) {
      alert("Akun belum terverifikasi");
      window.location.href = "/";
    }
  }, [token, role, isVerified]);
}
