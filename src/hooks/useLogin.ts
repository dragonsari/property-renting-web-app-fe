import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function useLogin(expectedRole: "USER" | "TENANT") {
  const setAuth = useAuthStore((s) => s.setAuth);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });

    if (res.data.role !== expectedRole) {
      throw new Error("Role mismatch");
    }

    localStorage.setItem("token", res.data.token);

    setAuth({
      token: res.data.token,
      role: res.data.role,
      isVerified: res.data.isVerified,
    });

    window.location.href = "/"
  };

  return { login };
}
