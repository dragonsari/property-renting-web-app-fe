export type RegisterUserBody = {
  name: string;
  email: string;
};

export type RegisterTenantBody = {
  name: string;
  email: string;
  companyName: string;
  phoneNumber: string;
};

export type VerifyEmailSetPasswordBody = {
  token: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type ResetPasswordRequestBody = {
  email: string;
};

export type ConfirmResetPasswordBody = {
  token: string;
  newPassword: string;
};

export type SocialAuthBody = {
  role: "USER" | "TENANT";
  provider: "google";
  token: string;
};

