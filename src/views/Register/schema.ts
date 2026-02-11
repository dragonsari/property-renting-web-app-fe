import * as Yup from "yup";

export const RegisterTenantSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email cannot be empty"),

  companyName: Yup.string()
    .trim()
    .required("Company name cannot be empty"),

  phoneNumber: Yup.string()
    .trim()
    .required("Phone number cannot be empty"),
});


export const RegisterUserSchema = Yup.object({
    email: Yup.string().trim().email("Invalid email format").required("Email cannot be empty"),
});
