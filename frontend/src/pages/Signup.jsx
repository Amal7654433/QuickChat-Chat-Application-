import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { signupSchema } from '../validations/authValidation';
import { userAuthStore } from '../store/userAuth';

const Signup = () => {
    const { isSignup, signup } = userAuthStore()
    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        confirmPassword: false,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signupSchema),
    });

    const onSubmit = async (data) => {
        await signup(data)
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    return (

        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                    Sign Up
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">
                            Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <User className="size-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                {...register("name")}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter your name"
                            />
                        </div>

                        <p className="text-red-500 text-sm">{errors.name?.message}</p>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <Mail className="size-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                {...register("email")}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter your email"
                            />
                        </div>
                        <p className="text-red-500 text-sm">{errors.email?.message}</p>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("password")}
                                className="absolute inset-y-0 right-3 flex items-center"
                            >
                                {passwordVisibility.password ? (
                                    <EyeOff className="size-5 text-gray-400" />
                                ) : (
                                    <Eye className="size-5 text-gray-400" />
                                )}
                            </button>
                            <input
                                type={passwordVisibility.password ? "text" : "password"}
                                {...register("password")}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter your password"
                            />
                        </div>
                        <p className="text-red-500 text-sm">{errors.password?.message}</p>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">
                            Re-enter Password
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("confirmPassword")}
                                className="absolute inset-y-0 right-3 flex items-center"
                            >
                                {passwordVisibility.confirmPassword ? (
                                    <EyeOff className="size-5 text-gray-400" />
                                ) : (
                                    <Eye className="size-5 text-gray-400" />
                                )}
                            </button>
                            <input
                                type={passwordVisibility.confirmPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Re-enter your password"
                            />
                        </div>
                        <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={isSignup}
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        {isSignup ? (
                            <>
                                <span className="loading loading-ring loading-xl"> Loading...</span>

                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-sm text-gray-600 text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="link link-primary no-underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup