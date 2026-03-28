"use client";
import React, { use, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { setCredentials, useLoginMutation, } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { isAuthenticated, server } from "@/redux/api/axiosBaseQuery";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/Cards/loading";
import toast from "react-hot-toast";

const LoginPage = ({ params }) => {
    const { auth_type, returnUrl } = use(params)
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const router = useRouter();
    const isAuth = isAuthenticated();


    const handleLogin = () => {
        if (window) window.location.href = `${server}/auth/google`; // Redirect to the backend authentication route
    };


    useEffect(() => {
        if (isAuth) {
            router.push("/");
        }
    }, [isAuth, router]);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(formData).unwrap();
            console.log(result);
            dispatch(setCredentials(result.data));
            toast.success("Login successful!");
            router.push(returnUrl || "/");
        } catch (err) {
            console.error("Login failed:", err);
            toast.error(err.data?.error || "Login failed");
        }
    };

    const handleGoogleSignUp = () => {
        console.log("Google sign up clicked");
    };

    const handleFacebookSignUp = () => {
        console.log("Facebook sign up clicked");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Image */}
            <div className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat">
                <img src="/images/bg1.jpg" className="object-cover" />
                <div className="absolute h-screen w-full top-0 left-0 opacity-50 inset-0 bg-gradient-to-br from-black via-black via-90% to-transparent "></div>
            </div>

            {/* Gradient Overlay */}

            {/* Sign Up Form */}
            <div className="absolute md:right-32 z-10 w-full max-w-md">
                <div className="bg-white rounded-2xl md:shadow-2xl px-4 md:p-8 backdrop-blur-sm">
                    {/* Header */}
                    <img src="/images/progressLogo.png" className="w-12 mx-auto" />
                    <div className="text-center !mb-6 md:mb-3 mt-2">
                        <h1 className="text-xl font-bold capitalize text-gray-900 mb-2">
                            welcome to {auth_type} Portal
                        </h1>
                    </div>
                    {/* Form */}
                    <div className="space-y-5 md:space-y-4">
                        {/* Email Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3 md:mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                }
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-xs rounded-lg focus:ring-2 focus:ring-[#79A637] focus:border-transparent outline-none transition-all duration-200"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3 md:mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "password",
                                            e.target.value
                                        )
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
                            <div className=" mt-2">
                                <a
                                    href={`/portals/auth/forgot-password?to=${auth_type}`}
                                    className="text-xs text-brand-500 hover:text-brand-700 font-medium"
                                >
                                    Forgot Password ?
                                </a>
                            </div>
                        </div>

                        {/* Register Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-[#79A637] text-white py-2.5 px-4 mt-4 rounded-lg font-semibold hover:bg-brand-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            {isLoading ? <LoadingSpinner size="sm" color="white" /> : "Login"}
                        </button>
                    </div>

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

export default LoginPage;
