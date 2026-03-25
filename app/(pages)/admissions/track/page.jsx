// app/(pages)/admissions/track/page.jsx
"use client";
import React, { use, useState } from 'react';
import { Search, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';
import { useGetApplicationQuery } from '@/redux/slices/admissionSlice';
import LoadingSpinner from '@/app/components/Cards/loading';

const TrackApplication = ({ searchParams }) => {
    const params = use(searchParams);
    const [refNumber, setRefNumber] = useState(params.ref || '');
    const [email, setEmail] = useState('');
    const [shouldFetch, setShouldFetch] = useState(false);

    const { data, isLoading, error } = useGetApplicationQuery(
        { ref: refNumber, email },
        { skip: !shouldFetch || !refNumber || !email }
    );

    const handleTrack = (e) => {
        e.preventDefault();
        if (refNumber && email) {
            setShouldFetch(true);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle className="w-8 h-8 text-green-500" />;
            case 'Rejected':
                return <XCircle className="w-8 h-8 text-red-500" />;
            case 'Under Review':
                return <AlertCircle className="w-8 h-8 text-blue-500" />;
            case 'Waitlisted':
                return <Clock className="w-8 h-8 text-orange-500" />;
            default:
                return <Clock className="w-8 h-8 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'Rejected':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'Under Review':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'Waitlisted':
                return 'bg-orange-50 border-orange-200 text-orange-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    return (
        <HomeWrapper miniSlider >
            <div className="max-w-4xl mx-auto px-4 my-2 md:py-16">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
                        Track Your Application
                    </h1>
                    <p className="text-gray-600 mb-8 text-center">
                        Enter your application reference number and email to check your application status
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleTrack} className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Application Reference Number
                                </label>
                                <input
                                    type="text"
                                    value={refNumber}
                                    onChange={(e) => setRefNumber(e.target.value.toUpperCase())}
                                    placeholder="e.g., ADM2025ABC123"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <LoadingSpinner size="sm" color="white" />
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Track Application
                                </>
                            )}
                        </button>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                            <p className="text-red-800">
                                {error.data?.message || 'Application not found. Please check your reference number and email.'}
                            </p>
                        </div>
                    )}

                    {/* Application Details */}
                    {data && (
                        <div className="space-y-6">
                            {/* Status Card */}
                            <div className={`border-2 rounded-xl p-6 ${getStatusColor(data.data.status)}`}>
                                <div className="flex items-center gap-4">
                                    {getStatusIcon(data.data.status)}
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold mb-1">
                                            Application Status: {data.data.status}
                                        </h2>
                                        <p className="text-sm opacity-75">
                                            Submitted on {new Date(data.data.submittedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Applicant Information */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Applicant Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Full Name</p>
                                        <p className="font-semibold">
                                            {data.data.firstName} {data.data.middleName} {data.data.surname}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date of Birth</p>
                                        <p className="font-semibold">
                                            {new Date(data.data.dateOfBirth).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Class Applied For</p>
                                        <p className="font-semibold">
                                            {data.data.classPreferences.classInterestedIn}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Schooling Option</p>
                                        <p className="font-semibold capitalize">
                                            {data.data.schoolingOption}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Notes (if any) */}
                            {data.data.adminNotes && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-blue-900 mb-2">Message from Admissions Office</h3>
                                    <p className="text-blue-800">{data.data.adminNotes}</p>
                                </div>
                            )}

                            {/* Timeline */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Application Timeline</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Application Submitted</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(data.data.submittedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {data.data.lastUpdated && data.data.lastUpdated !== data.data.submittedAt && (
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <AlertCircle className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Status Updated</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(data.data.lastUpdated).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-brand-50 border border-brand-200 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-brand-900 mb-2">Need Help?</h3>
                                <p className="text-brand-800 mb-4">
                                    If you have any questions about your application, please contact our admissions office:
                                </p>
                                <div className="space-y-2 text-brand-800">
                                    <p>📧 admissions@progressschools.com</p>
                                    <p>📞 +234 (814) 770 2684</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </HomeWrapper>
    );
};

export default TrackApplication;