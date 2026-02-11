import { api } from "./api";

export const userService = {
  getProfile: () => api.get("/user/profile"),

  updateProfile: (formData: FormData) =>
    api.patch("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateEmail: (email: string) =>
    api.patch("/user/email", { email }),

  updatePassword: (body: {
    currentPassword: string;
    newPassword: string;
  }) => api.patch("/user/password", body),

};
