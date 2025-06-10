import * as yup from "yup"

export const editProfileFormSchema = yup.object({
    firstName: yup.string().trim()
            .required("First Name is required"),
    lastName: yup.string().trim()
            .required("Last Name is required"),
    job: yup.string().trim()
            .required("Job is required"),
    city: yup.string().trim()
            .required("City is required"),
    country: yup.string().trim()
            .required("Country is required"),
    bio: yup.string().trim()
            .required("Bio is required"),
    email: yup.string().trim()
            .required("Email is required")
            .email("Invalid email address"),
    username: yup.string().trim()
            .required("Username is required"),
  })