import { useState } from "react";
import { authService } from "@/services/auth.service";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.registerUser({
        name: "USER",
        email,
      });
      alert("Cek email untuk verifikasi & set password");
    } catch (e: any) {
      setError(e.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const registerTenant = async (
    email: string,
    companyName: string,
    phoneNumber: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      await authService.registerTenant({
        name: "TENANT",
        email,
        companyName,
        phoneNumber,
      });
      alert("Cek email untuk verifikasi & set password");
    } catch (e: any) {
      setError(e.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, registerTenant, loading, error };
}
