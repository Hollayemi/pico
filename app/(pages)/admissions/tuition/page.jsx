"use client"
import React, { useState } from 'react';
import { Calculator, Download, CreditCard, Calendar, Info, CheckCircle } from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';
import { feeStructure, paymentPlans, classOptions } from '@/app/content/tuition';

export default function TuitionFees() {
    const [selectedClass, setSelectedClass] = useState('');
    const [paymentPlan, setPaymentPlan] = useState('full');



    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const calculatePayment = (fees, plan) => {
        if (!fees) return 0;

        let total = fees.total;
        if (plan === 'full') {
            total = total * 0.95; // 5% discount
        }

        switch (plan) {
            case 'full':
                return total;
            case 'termly':
                return total / 3;
            case 'monthly':
                return total / 10;
            default:
                return total;
        }
    };

    const selectedFees = selectedClass ? feeStructure[selectedClass] : null;

    return (
        <HomeWrapper miniSlider title="Tuition Fees">
            <div className="max-w-6xl px-2 mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-700 mb-4">
                        Tuition Fees & Payment Plans
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Transparent and affordable fee structure designed to provide quality education
                        with flexible payment options for all families.
                    </p>
                </div>

                {/* Fee Calculator */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center mb-6">
                        <Calculator className="w-6 h-6 text-brand-600 mr-3" />
                        <h2 className="text-xl font-semibold text-brand-700">Fee Calculator</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                            >
                                <option value="">Choose a class</option>
                                {classOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Plan
                            </label>
                            <select
                                value={paymentPlan}
                                onChange={(e) => setPaymentPlan(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-secondary-500 focus:border-brand-secondary-500 transition-colors"
                            >
                                {paymentPlans.map(plan => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedFees && (
                        <div className="bg-brand-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-brand-700 mb-4">
                                Fee Breakdown for {classOptions.find(c => c.value === selectedClass)?.label}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tuition Fee:</span>
                                        <span className="font-medium">{formatCurrency(selectedFees.tuition)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Registration Fee:</span>
                                        <span className="font-medium">{formatCurrency(selectedFees.registration)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Development Levy:</span>
                                        <span className="font-medium">{formatCurrency(selectedFees.development)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Uniform & Sports:</span>
                                        <span className="font-medium">{formatCurrency(selectedFees.uniform)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Books & Materials:</span>
                                        <span className="font-medium">{formatCurrency(selectedFees.books)}</span>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-2">
                                            {paymentPlans.find(p => p.id === paymentPlan)?.name}
                                        </p>
                                        {paymentPlan === 'full' && (
                                            <div className="text-green-600 text-sm mb-2">
                                                5% Discount Applied!
                                            </div>
                                        )}
                                        <div className="text-2xl font-bold text-brand-600">
                                            {formatCurrency(calculatePayment(selectedFees, paymentPlan))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {paymentPlan === 'full' ? 'Total for the year' :
                                                paymentPlan === 'termly' ? 'Per term' : 'Per month'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Plans Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {paymentPlans.map((plan, index) => (
                        <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className={`bg-brand-${index === 0 ? 'success' : index === 1 ? 'warning' : 'info'}-50 px-6 py-4 border-l-4 border-brand-${index === 0 ? 'success' : index === 1 ? 'warning' : 'info'}-400`}>
                                <h3 className="text-lg font-semibold text-brand-700 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    {plan.name}
                                </h3>
                                {plan.discount > 0 && (
                                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                                        {plan.discount}% Discount
                                    </span>
                                )}
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 text-sm mb-4">
                                    {plan.description}
                                </p>
                                <ul className="space-y-2 text-sm">
                                    {plan.id === 'full' && (
                                        <>
                                            <li className="flex items-center text-green-600">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Save 5% on total fees
                                            </li>
                                            <li className="flex items-center text-green-600">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                No payment reminders
                                            </li>
                                        </>
                                    )}
                                    {plan.id === 'termly' && (
                                        <>
                                            <li className="flex items-center text-brand-600">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Pay every 4 months
                                            </li>
                                            <li className="flex items-center text-brand-600">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Manageable amounts
                                            </li>
                                        </>
                                    )}
                                    {plan.id === 'monthly' && (
                                        <>
                                            <li className="flex items-center text-brand-600">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Lowest monthly burden
                                            </li>
                                            <li className="flex items-center text-brand-600">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Budget-friendly option
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Important Information */}
                <div className="bg-brand-warning-50 border border-brand-warning-200 rounded-lg p-6 mb-8">
                    <div className="flex items-start">
                        <Info className="w-6 h-6 text-brand-warning-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-brand-warning-800 mb-3">
                                Important Fee Information
                            </h3>
                            <ul className="space-y-2 text-brand-warning-700 text-sm">
                                <li>• Registration fee is non-refundable and paid once per academic year</li>
                                <li>• Development levy contributes to school infrastructure and facilities</li>
                                <li>• Uniform and sports kits are mandatory for all students</li>
                                <li>• Books and materials fee covers textbooks, workbooks, and learning resources</li>
                                <li>• Late payment attracts a 2% monthly penalty charge</li>
                                <li>• Fees are subject to review annually</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-brand-700 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Accepted Payment Methods
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="bg-brand-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                                <CreditCard className="w-6 h-6 text-brand-600" />
                            </div>
                            <h4 className="font-medium">Bank Transfer</h4>
                            <p className="text-sm text-gray-600">Direct bank transfer to school account</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="bg-brand-secondary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                                <span className="text-brand-secondary-600 font-bold">₦</span>
                            </div>
                            <h4 className="font-medium">Online Payment</h4>
                            <p className="text-sm text-gray-600">Pay securely through our portal</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="bg-brand-accent-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                                <span className="text-brand-accent-600 font-bold">💰</span>
                            </div>
                            <h4 className="font-medium">Bank Draft</h4>
                            <p className="text-sm text-gray-600">Banker's draft payable to school</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-gradient-to-r from-brand-50 to-brand-secondary-50 rounded-lg p-8 mb-10">
                    <h3 className="text-xl font-semibold text-brand-700 mb-4">
                        Ready to Secure Your Child's Spot?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Start the application process today and choose the payment plan that works best for your family.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                            Apply Now
                        </button>
                        <button className="border border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                            <Download className="w-4 h-4 mr-2" />
                            Download Fee Schedule
                        </button>
                    </div>
                </div>
            </div>
        </HomeWrapper>
    );
}