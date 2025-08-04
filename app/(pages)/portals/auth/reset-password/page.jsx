"use client";
import React, { use, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "@/redux/slices/authSlice";

const ResetPassword = ({ searchParams }) => {
    const { token = "" } = use(searchParams);
    const [ResetHandler, { isLoading }] = useResetPasswordMutation()
    const [passUpdated, setSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState();
    const [consfirmPassword, setConfirmPassword] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== consfirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        ResetHandler({
            token,
            password,
        }).then(() => {
            setSent(true);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Image */}
            <div
                className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
            >
                <img src="/images/bg1.jpg" className="object-cover" />
                <div className="absolute h-screen w-full top-0 left-0 opacity-50 inset-0 bg-gradient-to-br from-black via-black via-90% to-transparent "></div>
            </div>

            {/* Gradient Overlay */}

            {/* Sign Up Form */}
            <div className="absolute md:right-32 z-10 w-full max-w-md">
                <div className="bg-white rounded-2xl md:shadow-2xl p-8 backdrop-blur-sm">
                    {/* Header */}
                    {!passUpdated ? (
                        <>
                            <img src="/images/progressLogo.png" className="w-12 mx-auto" />
                            <div className="text-center mb-8">
                                <h1 className="text-xl font-bold text-gray-900 mb-2">
                                    Reset Password?
                                </h1>
                                <h4 className="text-xs leading-5 text-gray-500 mb-2">
                                    Set new login password
                                </h4>
                            </div>

                            <div className="space-y-4">
                                {/* Email Address */}
                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="w-full px-4 py-2.5 pr-12 bg-gray-50 border border-gray-200 text-xs rounded-lg focus:ring-2 focus:ring-[#79A637] focus:border-transparent outline-none transition-all duration-200"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>
                                    {/* Confirm Password */}
                                    <div className="mt-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter your password to confirm"
                                                value={consfirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 pr-12 bg-gray-50 border border-gray-200 text-xs rounded-lg focus:ring-2 focus:ring-[#79A637] focus:border-transparent outline-none transition-all duration-200"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Register Button */}
                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-[#79A637] text-white py-2.5 px-4 mt-4 rounded-lg font-semibold hover:bg-brand-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center mb-4">
                            <img
                                src="/images/password-reset.png"
                                className="w-24 text-center mb-4"
                            />
                            <div className="text-center ">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Your Password Has Been Set Successfully!
                                </h1>
                                <h4 className="text-xs leading-5 text-gray-500 mb-2">
                                    You can now log in with your new password.
                                </h4>
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="mt-3 text-center">
                        <Link href="/auth/login">
                            <span className="text-sm text-[#79A637]">
                                Go back to login
                            </span>
                        </Link>
                    </div>

                    {/* Terms and Privacy */}
                    {!passUpdated && (
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500 leading-relaxed">
                                By continuing, you agree to PISO's{" "}
                                <a
                                    href="#"
                                    className="text-brand-600 hover:text-brand-700 underline"
                                >
                                    Terms of Service
                                </a>{" "}
                                and acknowledge that you have read our{" "}
                                <a
                                    href="#"
                                    className="text-brand-600 hover:text-brand-700 underline"
                                >
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
