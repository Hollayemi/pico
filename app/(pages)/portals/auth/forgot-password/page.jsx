"use client";
import Link from "next/link";
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/redux/slices/authSlice";

const ForgotPassword = ({ searchParams }) => {
    const { to } = use(searchParams)
    const [sendEmail, { isLoading }] = useForgotPasswordMutation()
    const [emailSent, setSent] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true)
        // sendEmail(formData.email).then(() => {
        // });
        console.log("Form submitted:", formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Image */}
            <div
                className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat">
                <img src="/images/bg1.jpg" className="object-cover" />
                <div className="absolute h-screen w-full top-0 left-0 opacity-50 inset-0 bg-gradient-to-br from-black via-black via-90% to-transparent "></div>
            </div>
            {/* Gradient Overlay */}
            {/* Sign Up Form */}
            <div className="absolute md:right-32 z-10 w-full max-w-md">
                <div className="bg-white rounded-2xl md:shadow-2xl px-4 md:p-8 backdrop-blur-sm">
                    {/* Header */}
                    <img src="/images/progressLogo.png" className="w-12 mx-auto" />
                    {/* Form */}
                    <div className="text-center mb-8 mt-2">
                        <h1 className="text-xl font-bold text-gray-900 mb-2">
                            Forgot Password?
                        </h1>
                        <h4 className="text-sm leading-5 text-gray-500 mb-2">
                            {!emailSent
                                ? " No worries, we’ll send you reset instructions"
                                : "A reset link has been sent to your email address kindly check it for the next process in resetting your password."}
                        </h4>
                    </div>
                    {!emailSent ? (
                        <div className="space-y-4">
                            {/* Email Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-xs rounded-lg focus:ring-2 focus:ring-[#79A637] focus:border-transparent outline-none transition-all duration-200"
                                    required
                                />
                            </div>

                            {/* Register Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-[#79A637] text-white py-2.5 px-4 mt-4 rounded-lg font-semibold hover:bg-brand-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                Send Reset Link
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center mb-4">
                            <img
                                src="/images/emailSent.png"
                                className="w-24 text-center"
                            />
                        </div>
                    )}

                    {/* Divider */}
                    {to && <div className="mt-3 text-center">
                        <Link href={`/portals/auth/${to}/login`}>
                            <span className="text-sm text-[#79A637]">
                                Go back to login
                            </span>
                        </Link>
                    </div>}

                    {/* Terms and Privacy */}
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
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
