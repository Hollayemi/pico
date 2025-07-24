import Button from '@/app/components/Form/Button';
import React, { useState } from 'react';

export default function SendInformation() {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (email) {
            console.log('Email submitted:', email);
          
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <p className="text-gray-500 text-lg uppercase tracking-wide mb-2">
                            Begin Registration
                        </p>
                        <h1 className="text-sm font-normal text-gray-800 leading-tight">
                           Progress Intellectual School, Okeigbo
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                    <div className="space-y-6">
                        <div>
                            <p className="text-gray-700 mb-2">
                                Thank you for your interest in  <span className='font-bold'>Progress!</span>
                            </p>
                            <p className="text-gray-700">
                                Before getting started, please submit your email address.
                            </p>
                        </div>

                        <div className="border-t border-brand-500 pt-6">
                            <p className="text-gray-700 mb-6">
                                If you already have an Admissions Portal account, please{' '}
                                <a
                                    href="#"
                                    className="text-brand-600 hover:text-brand-800 underline font-medium"
                                >
                                    click here
                                </a>
                                {' '}to log back in.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-600 mb-2"
                                    >
                                        EMAIL ADDRESS
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div>
                                    <Button title='Submit' onClick={handleSubmit} variant={email ? "primary" : "disabled"} />
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-brand-500">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="text-center text-sm text-gray-500 space-x-4">
                        <span>PISO©{new Date().getFullYear()}</span>
                        <span>•</span>
                        <a
                            href="#"
                            className="hover:text-gray-700 underline"
                        >
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}