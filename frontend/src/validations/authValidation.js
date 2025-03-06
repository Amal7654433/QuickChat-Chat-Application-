import * as yup from "yup";

// Common validation schema for both Signup and Login
export const authSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup
        .string()
        .min(3, "Password must be at least 3 characters")
        .matches(/^\S*$/, "No spaces allowed in password")
        .required("Password is required"),
});

// Signup validation (extends authSchema with name & confirmPassword)
export const signupSchema = authSchema.shape({
    name: yup
        .string()
        .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed")
        .required("Name is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Please re-enter your password"),
});
