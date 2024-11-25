import * as yup from "yup";

export const formSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid Email")
    .required("Email is required"),
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
confirmpassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
