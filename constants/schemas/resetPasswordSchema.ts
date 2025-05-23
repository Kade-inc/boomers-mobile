import * as yup from "yup"

const regexPattern = /^(?=.*[-\#\$\.\%\&\@\!\+\=\<\>\*])(?=.*[a-zA-Z])(?=.*\d).{8,}$/;


export const resetPasswordFormSchema = yup.object({
    password: yup.string().trim()
              .required("Password is required")
              .min(8, "Password must be at least 8 characters")
              .matches(
                regexPattern,
                "Password must contain at least one letter, one number, and one special character (-#$.%&@!+=<>*)"
              ),
    confirmPassword: yup
              .string().trim()
              .required("Confirm Password is required")
              .oneOf([yup.ref("password")], "Passwords must match"),
  })