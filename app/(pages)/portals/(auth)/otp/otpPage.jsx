"use client";
import React, { useState, useRef, useEffect } from "react";
import { useResendOtpMutation } from "../../../redux/slices/authSlice";

export default function OTPVerification({
    email,
    hideTerms,
    onSubmit,
    isLoading: initialLoading = false,
}) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
    const [isLoading, setIsLoading] = useState(initialLoading);
    const [resending, setResending] = useState(isResending);
    const inputRefs = useRef([]);

    useEffect(() => {
        // Focus on first input when component mounts
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleInputChange = (index, value) => {
        // Only allow single digit
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle paste
        if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then((text) => {
                const digits = text.replace(/\D/g, "").slice(0, 6);
                const newOtp = [...otp];
                for (let i = 0; i < 6; i++) {
                    newOtp[i] = digits[i] || "";
                }
                setOtp(newOtp);

                // Focus on the last filled input or next empty one
                const nextIndex = Math.min(digits.length, 5);
                inputRefs.current[nextIndex]?.focus();
            });
        }
    };

    const handleResend = () => {
        // Simulate resend action
        if (isResending || isLoading) return;
        setResending(true);
        resendOtp(email)
            .unwrap()
            .then(() => {
                setResending(false);
            })
            .catch((error) => {
                console.error("Failed to resend OTP:", error);
                alert("Failed to resend OTP. Please try again later.");
                setResending(false);
            });
    };

    const handleVerify = () => {
        const otpValue = otp.join("");
        console.log(email);
        if (otpValue.length !== 6) {
            alert("Please enter all 6 digits");
            return;
        }

        setIsLoading(true);
        // Simulate verification process
        onSubmit(otpValue);
    };

    const isComplete = otp.every((digit) => digit !== "");

    return (
        <div className="min-h-fit  flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Email Verification
                    </h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Please check your provided email address, we've sent a 6
                        digit code to verify the email address
                    </p>
                </div>

                {/* OTP Input Fields */}
                <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) =>
                                handleInputChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none transition-all duration-200 ${digit
                                ? "border-green-500 bg-brand-50 text-brand-800"
                                : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                                }`}
                        />
                    ))}
                </div>

                {/* Resend Code */}
                {!resending && (
                    <div className="text-center mb-6">
                        <span className="text-gray-500 text-sm">
                            Can't see the code??{" "}
                        </span>
                        <button
                            onClick={handleResend}
                            className="text-brand-600 text-sm font-medium hover:text-brand-700 transition-colors duration-200"
                        >
                            Resend
                        </button>
                    </div>
                )}

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={!isComplete || isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${isComplete && !isLoading
                        ? "bg-brand-600 hover:bg-brand-700 transform hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Verifying...
                        </div>
                    ) : resending ? (
                        "Resending..."
                    ) : (
                        "Verify"
                    )}
                </button>

                {/* Terms and Privacy */}
                {!hideTerms && (
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500 leading-relaxed">
                            By continuing, you agree to Urban Lagos's{" "}
                            <a
                                href="#"
                                className="text-brand-600 hover:text-brand-700 underline"
                            >
                                Terms of Service
                            </a>{" "}
                            and acknowledge that you've read our{" "}
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
    );
}
