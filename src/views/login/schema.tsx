import * as Yup from "yup";

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email cannot be empty"),
    password: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email cannot be empty"),
});

export default loginSchema;