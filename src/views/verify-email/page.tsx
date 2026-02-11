"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyEmailPage() {
  
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!token) return alert("Token tidak valid");
    if (password.length < 8) return alert("Password minimal 8 karakter");
    if (password !== confirm) return alert("Password tidak sama");

    try {
      setLoading(true);

      const res = await authService.verifyEmail({
        token,
        password,
      });

      alert("Verifikasi berhasil, silakan login");

      router.push(
        res.data.role === "TENANT"
          ? "/login/tenant"
          : "/login/user"
      );
    } catch (e: any) {
    alert(e.response?.data?.message || "Gagal verifikasi");
    } finally {
    setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-lg shadow-zinc-200/60">
    
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Set Your Password
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Create a password to secure your account
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Password (min 8 characters)"
            onChange={(e) => setPassword(e.target.value)}
            className="h-11"
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirm(e.target.value)}
            className="h-11"
          />

          <Button
            onClick={submit}
            disabled={loading}
            className="mt-2 h-11 w-full text-base font-medium bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Processing..." : "Verify & Login"}
         </Button>
        </div>
      </div>
    </div>

  );
}
