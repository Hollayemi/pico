"use client"
import React from 'react';
import { CheckCircle, FileText, Users, Heart, GraduationCap, Phone } from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';

export default function ApplicationRequirements() {
    const requirementSections = [
        {
            title: "Personal Information",
            icon: <Users className="w-6 h-6" />,
            color: "brand-primary",
            items: [
                "Full name (surname, first name, middle name)",
                "Date of birth and gender",
                "Blood group and genotype",
                "Nationality, state of origin, and local government",
                "Preferred schooling option"
            ]
        },
        {
            title: "Parents' Details",
            icon: <Users className="w-6 h-6" />,
            color: "brand-secondary",
            items: [
                "Father's full details (name, occupation, addresses)",
                "Mother's full details (name, occupation, addresses)",
                "Contact information (phone, WhatsApp, email)",
                "Office and home addresses for both parents"
            ]
        },
        {
            title: "Educational Background",
            icon: <GraduationCap className="w-6 h-6" />,
            color: "brand-accent",
            items: [
                "Previous schools attended (up to 3 schools)",
                "Attendance dates for each school",
                "Present class and desired class for admission",
                "Academic records and reports"
            ]
        },
        {
            title: "Health Information",
            icon: <Heart className="w-6 h-6" />,
            color: "brand-success",
            items: [
                "Complete vaccination records",
                "History of infectious diseases (if any)",
                "Food allergies and dietary restrictions",
                "Medical reports and health certificates"
            ]
        },
        {
            title: "Required Documents",
            icon: <FileText className="w-6 h-6" />,
            color: "brand-warning",
            items: [
                "Birth certificate (compulsory)",
                "Former school report (compulsory)",
                "Proof of payment (compulsory)",
                "Immunization certificate",
                "Medical report"
            ]
        },
        {
            title: "Contact & Communication",
            icon: <Phone className="w-6 h-6" />,
            color: "brand-info",
            items: [
                "Primary correspondence email address",
                "How you learned about our school",
                "Preferred communication method",
                "Emergency contact information"
            ]
        }
    ];

    const importantNotes = [
        "All compulsory fields marked with [compulsory] must be completed",
        "Documents should be clear, legible scans or photos",
        "Ensure all contact information is accurate and up-to-date",
        "The correspondence email will be used for all official communication"
    ];

    return (
        <HomeWrapper miniSlider title="Application Requirements">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-800 mb-4">
                        Application Requirements
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Please review the following requirements before starting your application.
                        Ensure you have all necessary information and documents ready.
                    </p>
                </div>

                {/* Requirements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {requirementSections.map((section, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className={`bg-brand-50 px-6 py-4 border-l-4 border-brand-400`}>
                                <div className="flex items-center">
                                    <div className={`text-brand-600 mr-3`}>
                                        {section.icon}
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {section.title}
                                    </h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-3">
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start">
                                            <CheckCircle className={`w-4 h-4 text-brand-500 mt-0.5 mr-3 flex-shrink-0`} />
                                            <span className="text-gray-700 text-sm leading-relaxed">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Important Notes */}
                <div className="bg-brand-warning-50 border border-brand-warning-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-brand-warning-800 mb-4 flex items-center">
                        <span className="bg-brand-warning-100 rounded-full p-1 mr-3">
                            ⚠️
                        </span>
                        Important Notes
                    </h3>
                    <ul className="space-y-2">
                        {importantNotes.map((note, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-brand-warning-600 mr-2">•</span>
                                <span className="text-brand-warning-700 text-sm">
                                    {note}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Application Process Steps */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">
                        Application Process
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="bg-brand-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <span className="text-brand-primary-600 font-bold">1</span>
                            </div>
                            <h4 className="font-medium text-gray-800 mb-2">Prepare Documents</h4>
                            <p className="text-sm text-gray-600">
                                Gather all required documents and information
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-brand-secondary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <span className="text-brand-secondary-600 font-bold">2</span>
                            </div>
                            <h4 className="font-medium text-gray-800 mb-2">Complete Application</h4>
                            <p className="text-sm text-gray-600">
                                Fill out the multi-stage application form
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-brand-success-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <span className="text-brand-success-600 font-bold">3</span>
                            </div>
                            <h4 className="font-medium text-gray-800 mb-2">Submit & Review</h4>
                            <p className="text-sm text-gray-600">
                                Submit application and await review
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50 rounded-lg p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Ready to Apply?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Make sure you have reviewed all requirements and have the necessary documents ready.
                    </p>
                    <button className="bg-brand-primary-600 hover:bg-brand-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                        Start Application
                    </button>
                </div>
            </div>
        </HomeWrapper>
    );
}