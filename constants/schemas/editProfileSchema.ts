import * as yup from "yup"

export const editProfileFormSchema = yup.object({
    firstName: yup.string().trim(),
    lastName: yup.string().trim(),
    job: yup.string().trim(),
    city: yup.string().trim(),
    country: yup.string().trim(),
    bio: yup.string().trim(),
    email: yup.string().trim()
            .email("Invalid email address"),
    username: yup.string().trim()
  })