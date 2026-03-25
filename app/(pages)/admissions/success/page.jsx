"use client";
import React, { use } from 'react';
import { CheckCircle, Download, Mail, Home, Calendar, User } from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';
import { useRouter } from 'next/navigation';

const ApplicationSuccess = ({ searchParams }) => {
    const { ref } = use(searchParams);
    const router = useRouter();

    return (
        <HomeWrapper miniSlider title="Application Submitted">
            <div className="max-w-4xl mx-auto md:px-4 md:py-16">
                <div className="bg-white rounded-3xl shadow-xl px-4 py-8 md:p-12">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                            Application Submitted Successfully!
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Thank you for applying to Progress Intellectual School. Your application has been received and is being processed.
                        </p>
                    </div>

                    {/* Application Reference */}
                    <div className="bg-brand-50 border-2 border-brand-200 rounded-xl p-6 mb-8">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Your Application Reference Number</p>
                                <p className="text-3xl font-bold text-brand-600">{ref}</p>
                            </div>
                            <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Save
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-4">
                            Please save this reference number. You'll need it to check your application status.
                        </p>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-brand-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Email Confirmation</h3>
                                    <p className="text-sm text-gray-600">
                                        You will receive an email confirmation with your application details and reference number.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-brand-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Application Review</h3>
                                    <p className="text-sm text-gray-600">
                                        Our admissions team will review your application within 3-5 business days.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-brand-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Interview Invitation</h3>
                                    <p className="text-sm text-gray-600">
                                        If your application is successful, you'll be contacted to schedule an interview and placement test.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                        <h3 className="font-semibold text-yellow-800 mb-3">Important Notes</h3>
                        <ul className="space-y-2 text-sm text-yellow-700">
                            <li>• Keep your application reference number safe for future reference</li>
                            <li>• Check your email regularly for updates on your application</li>
                            <li>• Contact us if you don't receive confirmation within 24 hours</li>
                            <li>• You can track your application status using your reference number</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </button>
                        <button
                            onClick={() => router.push(`/admissions/track?ref=${ref}`)}
                            className="flex items-center justify-center gap-2 border-2 border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Track Application
                        </button>
                    </div>

                    {/* Contact Information */}
                    <div className="mt-8 pt-8 border-t text-center">
                        <p className="text-gray-600 mb-2">Need help or have questions?</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                            <a href="mailto:admissions@progressschools.com" className="text-brand-600 hover:text-brand-700">
                                admissions@progressschools.com
                            </a>
                            <span className="hidden sm:inline text-gray-400">|</span>
                            <a href="tel:+2348147702684" className="text-brand-600 hover:text-brand-700">
                                +234 (814) 770 2684
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </HomeWrapper>
    );
};

export default ApplicationSuccess;