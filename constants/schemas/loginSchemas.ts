import * as yup from "yup"

export const loginFormSchema = yup.object({
    username: yup.string().trim()
              .required("Email/Username is required"),
    password: yup.string().trim()
              .required("Password is required")
  })