import { useState } from 'react';
import { Calculator, School, CreditCard, BookOpen } from 'lucide-react';
import { feeStructure, bankingDetails, paymentPlans, classOptions } from '@/app/content/tuition';

// Fee Structure Data


export default function FeeCalculator() {
    const [selectedClass, setSelectedClass] = useState('');
    const [paymentPlan, setPaymentPlan] = useState('first');
    const [includeBus, setIncludeBus] = useState(false);

    const selectedFees = selectedClass ? feeStructure[selectedClass] : null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const calculatePayment = (fees, plan) => {
        if (!fees) return 0;

        let amount = 0;
        const busFee = includeBus ? 15000 : 0;

        switch (plan) {
            case 'first':
                amount = fees.totalFirstTerm;
                break;
            case 'second':
                amount = fees.totalSecondTerm;
                break;
            case 'third':
                amount = fees.totalThirdTerm;
                break;
            case 'full':
                const yearlyTotal = fees.totalFirstTerm + fees.totalSecondTerm + fees.totalThirdTerm;
                amount = yearlyTotal * 0.95; // 5% discount
                break;
            default:
                amount = fees.totalFirstTerm;
        }

        return amount + busFee;
    };

    const getTermSpecificFees = (fees, term) => {
        if (!fees) return [];

        const baseFees = [
            { label: 'Tuition Fee', amount: term === 'first' ? fees.tuition : term === 'second' ? fees.tuitionSecond : fees.tuitionThird },
            { label: 'Examination Fee', amount: fees.examination },
            { label: 'Computer Fee', amount: fees.computer },
            { label: 'Development Levy', amount: fees.development },
            { label: 'Science Levy', amount: fees.science },
            { label: 'Coaching/Coding/Phonics', amount: fees.coaching },
            { label: 'Report Sheet', amount: fees.reportSheet }
        ];

        // Add first term specific fees
        if (term === 'first') {
            baseFees.push(
                { label: 'Uniform (2 pairs with socks)', amount: fees.uniform },
                { label: 'School Shoes', amount: fees.shoes },
                { label: 'Chair Subsidy', amount: fees.chair || 0 },
                { label: 'Identity Card', amount: fees.identityCard || 0 },
                { label: 'Cardigan', amount: fees.cardigan || 0 },
                { label: 'Student File', amount: fees.studentFile || 0 },
                { label: 'Exercise Books', amount: fees.exerciseBooks },
                { label: 'Sport Wears', amount: fees.sportWears || 0 }
            );

            // Add boarder-specific items
            if (fees.hostelWears) {
                baseFees.push({ label: 'Hostel Wears', amount: fees.hostelWears });
            }
            if (fees.churchWears) {
                baseFees.push({ label: 'Church Wears', amount: fees.churchWears });
            }
            if (fees.socialWears) {
                baseFees.push({ label: 'Social Wears', amount: fees.socialWears });
            }
        }

        // Add health/laundry fees
        if (fees.healthLaundry) {
            baseFees.push({ label: 'Health Levy/Laundry', amount: fees.healthLaundry });
        } else if (fees.health) {
            baseFees.push({ label: 'Health Levy', amount: fees.health });
        }

        // Add term 2 & 3 specific fees
        if (term === 'second' || term === 'third') {
            if (fees.anniversary) {
                baseFees.push({ label: '30th Anniversary Levy', amount: fees.anniversary });
            }
        }

        // Add term 3 specific fees
        if (term === 'third' && fees.endOfSession) {
            baseFees.push({ label: 'End of Session Levy', amount: fees.endOfSession });
        }

        return baseFees.filter(fee => fee.amount > 0);
    };

    const getCurrentTerm = () => {
        switch (paymentPlan) {
            case 'first': return 'first';
            case 'second': return 'second';
            case 'third': return 'third';
            default: return 'first';
        }
    };

    return (
        <div className="max-w-6xl mx-auto  min-h-screen">
            {/* <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    <School className="w-12 h-12 text-brand-600 mr-4" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Progress Intellectual Schools</h1>
                        <p className="text-gray-600">P.M.B 001, Oke-Igbo, Ondo State</p>
                    </div>
                </div>
            </div> */}

            {/* Fee Calculator */}
            <div className="bg-white rounded-lg  border-gray-200 p-6 mb-8">
                <div className="flex items-center mb-6">
                    <Calculator className="w-6 h-6 text-brand-600 mr-3" />
                    <h2 className="text-xl font-semibold text-brand-700">Fee Calculator</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 sticky top-32 py-4 border-b border-gray-200 bg-white">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Class/Level
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
                            className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        >
                            {paymentPlans.map(plan => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center mt-6">
                            <input
                                type="checkbox"
                                id="busFeе"
                                checked={includeBus}
                                onChange={(e) => setIncludeBus(e.target.checked)}
                                className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                            />
                            <label htmlFor="busFee" className="ml-2 text-sm text-gray-700">
                                Include Bus Fee (₦15,000)
                            </label>
                        </div>
                    </div>
                </div>

                {selectedFees && (
                    <div className="rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-brand-700 mb-4">
                            Fee Breakdown for {classOptions.find(c => c.value === selectedClass)?.label}
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Detailed Fee Breakdown */}
                            <div className="lg:col-span-2 space-y-4">
                                {paymentPlan !== 'full' ? (
                                    <>
                                        <h4 className="font-medium text-gray-800 mb-3 text-lg">
                                            {paymentPlan === 'first' ? '1st Term' : paymentPlan === 'second' ? '2nd Term' : '3rd Term'} Fee Breakdown:
                                        </h4>

                                        <div className="bg-white rounded-lg border overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">S/N</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {getTermSpecificFees(selectedFees, getCurrentTerm()).map((fee, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">{fee.label}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                                                                {formatCurrency(fee.amount)}
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {includeBus && (
                                                        <tr className="hover:bg-gray-50 border-t-2">
                                                            <td className="px-4 py-3 text-sm text-gray-500">{getTermSpecificFees(selectedFees, getCurrentTerm()).length + 1}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">Bus Fee (Optional)</td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                                                                {formatCurrency(15000)}
                                                            </td>
                                                        </tr>
                                                    )}

                                                    <tr className="bg-brand-50 font-semibold">
                                                        <td className="px-4 py-3 text-sm"></td>
                                                        <td className="px-4 py-3 text-sm text-brand-900 uppercase">Total =</td>
                                                        <td className="px-4 py-3 text-sm text-brand-900 text-right font-bold">
                                                            {formatCurrency(calculatePayment(selectedFees, paymentPlan))}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-3 text-lg">Annual Fee Breakdown:</h4>

                                        {/* All Terms Breakdown */}
                                        <div className="space-y-6">
                                            {['first', 'second', 'third'].map((term, termIndex) => (
                                                <div key={term} className="bg-white rounded-lg border overflow-hidden">
                                                    <div className="bg-gray-100 px-4 py-2">
                                                        <h5 className="font-medium text-gray-800">
                                                            {term === 'first' ? '1st Term' : term === 'second' ? '2nd Term' : '3rd Term'} Fees
                                                        </h5>
                                                    </div>
                                                    <table className="w-full">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">S/N</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Items</th>
                                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {getTermSpecificFees(selectedFees, term).map((fee, index) => (
                                                                <tr key={index} className="text-sm">
                                                                    <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                                                                    <td className="px-3 py-2 text-gray-900">{fee.label}</td>
                                                                    <td className="px-3 py-2 text-right font-medium">
                                                                        {formatCurrency(fee.amount)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            <tr className="bg-gray-50 font-semibold text-sm">
                                                                <td className="px-3 py-2"></td>
                                                                <td className="px-3 py-2 text-gray-900">Term Total</td>
                                                                <td className="px-3 py-2 text-right">
                                                                    {formatCurrency(
                                                                        term === 'first' ? selectedFees.totalFirstTerm :
                                                                            term === 'second' ? selectedFees.totalSecondTerm :
                                                                                selectedFees.totalThirdTerm
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ))}

                                            {/* Annual Summary */}
                                            <div className="bg-white rounded-lg border overflow-hidden">
                                                <div className="bg-brand-100 px-4 py-2">
                                                    <h5 className="font-medium text-brand-800">Annual Summary</h5>
                                                </div>
                                                <div className="p-4 space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Total Annual Fees:</span>
                                                        <span className="font-medium">{formatCurrency(selectedFees.totalFirstTerm + selectedFees.totalSecondTerm + selectedFees.totalThirdTerm)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-green-600">
                                                        <span>Annual Discount (5%):</span>
                                                        <span className="font-medium">-{formatCurrency((selectedFees.totalFirstTerm + selectedFees.totalSecondTerm + selectedFees.totalThirdTerm) * 0.05)}</span>
                                                    </div>
                                                    {includeBus && (
                                                        <div className="flex justify-between border-t pt-2">
                                                            <span className="text-gray-600">Bus Fee (Annual):</span>
                                                            <span className="font-medium">{formatCurrency(45000)}</span>
                                                        </div>
                                                    )}
                                                    <hr />
                                                    <div className="flex justify-between font-bold text-lg text-brand-600">
                                                        <span>Final Amount:</span>
                                                        <span>{formatCurrency(calculatePayment(selectedFees, paymentPlan))}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <BookOpen className="w-5 h-5 text-yellow-600 mr-2" />
                                        <span className="font-medium text-yellow-800">Additional Information</span>
                                    </div>
                                    <ul className="text-sm text-yellow-700 space-y-1">
                                        <li>• Text Books: {formatCurrency(selectedFees.textBooks)} (purchased separately)</li>
                                        <li>• Bus Fee: ₦15,000 per term (optional)</li>
                                        <li>• Fees are due at the beginning of each term</li>
                                        <li>• Late payment may incur additional charges</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <div className="text-center">
                                    <div className="bg-brand-100 rounded-lg p-4 mb-4">
                                        <p className="text-lg font-semibold text-brand-800 mb-1">
                                            {paymentPlans.find(p => p.id === paymentPlan)?.name}
                                        </p>
                                        {paymentPlan === 'full' && (
                                            <div className="text-green-600 text-sm mb-2 font-medium">
                                                🎉 5% Discount Applied!
                                            </div>
                                        )}
                                        <div className="text-4xl font-bold text-brand-700 mb-2">
                                            {formatCurrency(calculatePayment(selectedFees, paymentPlan))}
                                        </div>
                                        <p className="text-sm text-brand-600 font-medium">
                                            {paymentPlan === 'full' ? 'Total for the Academic Year' :
                                                paymentPlan === 'first' ? '1st Term Payment' :
                                                    paymentPlan === 'second' ? '2nd Term Payment' : '3rd Term Payment'}
                                        </p>
                                    </div>

                                    {/* Quick Payment Summary */}
                                    <div className="text-left space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Base Amount:</span>
                                            <span className="font-medium">
                                                {paymentPlan === 'full' ?
                                                    formatCurrency((selectedFees.totalFirstTerm + selectedFees.totalSecondTerm + selectedFees.totalThirdTerm) * 0.95) :
                                                    formatCurrency(
                                                        paymentPlan === 'first' ? selectedFees.totalFirstTerm :
                                                            paymentPlan === 'second' ? selectedFees.totalSecondTerm :
                                                                selectedFees.totalThirdTerm
                                                    )
                                                }
                                            </span>
                                        </div>

                                        {includeBus && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Bus Fee:</span>
                                                <span className="font-medium">
                                                    {formatCurrency(paymentPlan === 'full' ? 45000 : 15000)}
                                                </span>
                                            </div>
                                        )}

                                        <hr />
                                        <div className="flex justify-between font-bold text-base">
                                            <span>Total Due:</span>
                                            <span className="text-brand-600">
                                                {formatCurrency(calculatePayment(selectedFees, paymentPlan))}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t">
                                        <button className="w-full bg-brand-600 text-white py-3 px-4 rounded-lg hover:bg-brand-700 transition-colors font-medium">
                                            Print Fee Receipt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Banking Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                    <CreditCard className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold text-green-700">Payment Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {bankingDetails.map((bank, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="font-medium text-gray-800">{bank.bank} Bank</div>
                            <div className="text-sm text-gray-600">Branch: {bank.branch}</div>
                            <div className="text-sm text-gray-600">Account: {bank.accountNumber}</div>
                            <div className="text-sm text-gray-600">Name: {bank.owner}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                    <strong>Note:</strong> Please ensure to include the student's name and class when making payments.
                    All payments should be made to Progress Intellectual Schools' official accounts listed above.
                </div>
            </div>
        </div>
    );
}