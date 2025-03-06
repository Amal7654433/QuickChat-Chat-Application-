import React from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff, Mail } from "lucide-react";
import { authSchema } from '../validations/authValidation';
import { Link } from 'react-router-dom';
import { userAuthStore } from '../store/userAuth';
const Login = () => {
    const { isLogged, login } = userAuthStore()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(authSchema),
    });

    const onSubmit = async (data) => {
        await login(data)
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            placeholder="Enter your email"
                        />
                        <p className="text-red-500 text-sm">{errors.email?.message}</p>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            placeholder="Enter your password"
                        />
                        <p className="text-red-500 text-sm">{errors.password?.message}</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-gray-600 text-sm mt-4">
                    Don't have an account?
                    <Link to="/signup" className="text-blue-500 hover:underline ml-1">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;