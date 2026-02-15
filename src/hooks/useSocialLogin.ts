import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

type Provider = "google";
type Role = "USER" | "TENANT";

export function useSocialLogin(role: Role) {
  const setAuth = useAuthStore((s) => s.setAuth);

  const login = async (
    provider: Provider,
    body: { token: string }
  ) => {
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("REQUEST:", {
  role,
  provider,
  token: body.token,
});

const res = await authService.socialLogin({
  role,
  provider,
  token: body.token,
});


    localStorage.setItem("token", res.data.token);

    setAuth({
      token: res.data.token,
      role: res.data.role,
      isVerified: res.data.isVerified,
    });

    window.location.href =
      res.data.role === "TENANT"
        ? "/tenant/properties"
        : "/";
  };

  return { login };
}
