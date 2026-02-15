import { api } from "./api";
import * as T from "../type/auth.type";

export const authService = {
  registerUser: (body: T.RegisterUserBody) =>
    api.post("/auth/register/user", body),

  registerTenant: (body: T.RegisterTenantBody) =>
    api.post("/auth/register/tenant", body),

  verifyEmail: (body: T.VerifyEmailSetPasswordBody) =>
    api.post("/auth/verify", body),

  resendVerification: (email: string) =>
    api.post("/auth/verify/resend", { email }),

  login: (body: T.LoginBody) =>
    api.post("/auth/login", body),

  requestResetPassword: (body: T.ResetPasswordRequestBody) =>
    api.post("/auth/reset-password", body),

  confirmResetPassword: (body: T.ConfirmResetPasswordBody) =>
    api.post("/auth/reset-password/confirm", body),

  socialLogin: (body: T.SocialAuthBody) =>
    api.post("/auth/social", body),
};
