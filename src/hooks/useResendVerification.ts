import { useState } from "react";
import { authService } from "@/services/auth.service";

export function useResendVerification() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const resend = async (email: string) => {
    try {
      setLoading(true);
      setMessage(null);

      await authService.resendVerification(email);

      setMessage("Email verifikasi berhasil dikirim ulang");
    } catch (e: any) {
      setMessage(e.response?.data?.message || "Gagal kirim email");
    } finally {
      setLoading(false);
    }
  };

  return { resend, loading, message };
}
