import * as yup from "yup"

const regexPattern = /^(?=.*[-\#\$\.\%\&\@\!\+\=\<\>\*])(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

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
              .min(8, "Password must be at least 8 characters")
              .matches(
                regexPattern,
                "Password must contain at least one letter, one number, and one special character (-#$.%&@!+=<>*)"
              ),
    confirmPassword: yup
              .string().trim()
              .required("Confirm Password is required")
              .oneOf([yup.ref("password")], "Passwords must match"),
    source: yup.string().trim()
              .required("Source is required")
              .oneOf(['web', 'mobile'], "Source must be either 'web' or 'mobile'")
  })