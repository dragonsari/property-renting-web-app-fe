import { authService } from "@/services/auth.service";

export function useForgotPassword() {
  const requestReset = async (email: string) => {
    await authService.requestResetPassword({ email });
  };

  return { requestReset };
}
