import * as Yup from "yup";

const reservationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email cannot be empty"),
});

export default reservationSchema;