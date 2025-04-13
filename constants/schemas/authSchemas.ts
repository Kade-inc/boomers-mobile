import * as yup from "yup"

export const signUpFormSchema = yup.object({
    email: yup.string().trim()
            .email("Please Enter a valid Email")
            .matches(/^\S+@\S+\.\S{2,}$/, "Please Enter a valid Email")
            .required("Email is required"),
    username: yup.string().trim()
              .required("Username is required")
              .min(3, "Username must be at least 3 characters")
              .max(15, "Username must be at most 15 characters"),
    password: yup.string().trim()
              .required("Password is required")
              .min(8, "Password must be at least 8 characters"),
    confirmPassword: yup
              .string().trim()
              .required("Confirm Password is required")
              .oneOf([yup.ref("password")], "Passwords must match"),
  })