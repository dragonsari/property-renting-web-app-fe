import * as Yup from "yup";

export const ForgotPasswordRequestSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const ForgotPasswordConfirmSchema = Yup.object({
  password : Yup.string()
  .required("Password is required")
  .trim()
});



