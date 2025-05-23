import * as yup from "yup"

export const forgotPasswordFormSchema = yup.object({
    email: yup.string().trim()
            .email("Please Enter a valid Email")
            .matches(/^\S+@\S+\.\S{2,}$/, "Please Enter a valid Email")
            .required("Email is required"),
  })