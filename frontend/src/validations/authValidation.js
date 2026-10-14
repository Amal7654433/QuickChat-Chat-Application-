import * as yup from "yup";

export const authSchema = yup.object().shape({
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    password: yup
        .string()
        .min(3, "Password must be at least 3 characters")
        .matches(/^\S*$/, "No spaces allowed in password")
        .required("Password is required"),
});

export const signupSchema = authSchema.shape({
    name: yup
        .string()
        .matches(/^[a-zA-Z\s]+$/, "Only letters are allowed")
        .required("Name is required"),
    username: yup
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be 20 characters or less")
        .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and _ allowed")
        .matches(/^\S*$/, "No spaces allowed")
        .required("Username is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Please re-enter your password"),
});
