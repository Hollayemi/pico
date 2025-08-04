"use client"
import React, { useState } from 'react';
import { Heart, GraduationCap, BookOpen, Users, Building, Laptop, Trophy, Gift, CheckCircle, CreditCard, DollarSign } from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';

const SchoolGivingPage = () => {
    const [selectedAmount, setSelectedAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [selectedFund, setSelectedFund] = useState('general');
    const [donationType, setDonationType] = useState('one-time');
    const [showThankYou, setShowThankYou] = useState(false);
    const suggestedAmounts = ['2500', '5000', '10000', '25000', '500000', '1000000'];

    const givingFunds = [
        {
            id: 'general',
            name: 'Greatest Need Fund',
            description: 'Support the areas where funding is needed most',
            icon: Heart,
            color: 'brand-600'
        },
        {
            id: 'scholarships',
            name: 'Student Scholarships',
            description: 'Help deserving students access quality education',
            icon: GraduationCap,
            color: 'brand-600'
        },
        {
            id: 'library',
            name: 'Library & Resources',
            description: 'Enhance learning resources and technology',
            icon: BookOpen,
            color: 'brand-600'
        },
        {
            id: 'facilities',
            name: 'Campus Facilities',
            description: 'Improve and maintain our campus infrastructure',
            icon: Building,
            color: 'brand-600'
        },
        {
            id: 'technology',
            name: 'Technology & Innovation',
            description: 'Upgrade classrooms with modern technology',
            icon: Laptop,
            color: 'brand-600'
        },
        {
            id: 'athletics',
            name: 'Athletics & Sports',
            description: 'Support our student athletes and programs',
            icon: Trophy,
            color: 'brand-600'
        }
    ];

    const handleDonate = () => {
        setShowThankYou(true);
    };

    const getDonationAmount = () => {
        return customAmount || selectedAmount;
    };

    return (
        <HomeWrapper miniSlider title="Giving">
            {/* Hero Section */}
            <section className="md:py-10">
                <div className="max-w-6xl mx-auto px-2 md:px-6 text-center">
                    <h1 className="text-xl md:text-4xl font-bold mb-2 md:mb-6">
                        Make a Difference
                        <span className="black ml-2 md:inline-block text-brand-500">Through Giving</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 max-w-3xl mx-auto leading-relaxed mb-8">
                        Your support helps us provide exceptional education, create opportunities, and build a brighter future for our students and community.
                    </p>
                    <div className="backdrop-blur-sm bg-brand-500 rounded-2xl p-6 max-w-2xl mx-auto">
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                                <div className=" text-xl md:text-3xl font-bold text-white">₦2.5M</div>
                                <div className="text-sm md:text-base text-gray-100">Raised This Year</div>
                            </div>
                            <div>
                                <div className=" text-xl md:text-3xl font-bold text-white">850+</div>
                                <div className="text-sm md:text-base text-gray-100">Generous Donors</div>
                            </div>
                            <div>
                                <div className=" text-xl md:text-3xl font-bold text-white">1,200</div>
                                <div className="text-sm md:text-base text-gray-100">Students Supported</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Donation Form Section */}
            <section className="py-4 md:py-10">
                <div className="max-w-4xl mx-auto px-2 md:px-6">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="py-4 px-2 md:p-8 lg:p-12">
                            <h2 className=" text-xl md:text-3xl font-bold text-brand-900 mb-8 text-center">Make Your Gift Today</h2>

                            {/* Donation Type */}
                            <div className="mb-8">
                                <h3 className=" md:text-xl font-semibold text-brand-800 mb-4">Donation Type</h3>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setDonationType('one-time')}
                                        className={`text-sm md:text-base flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${donationType === 'one-time'
                                            ? 'bg-brand-600 text-white'
                                            : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                                            }`}
                                    >
                                        One-Time Gift
                                    </button>
                                    <button
                                        onClick={() => setDonationType('monthly')}
                                        className={`text-sm md:text-base flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${donationType === 'monthly'
                                            ? 'bg-brand-600 text-white'
                                            : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                                            }`}
                                    >
                                        Monthly Giving
                                    </button>
                                </div>
                            </div>

                            {/* Amount Selection */}
                            <div className="mb-8">
                                <h3 className="md:text-xl font-semibold text-brand-800 mb-4">
                                    Select Amount {donationType === 'monthly' && '(Per Month)'}
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                                    {suggestedAmounts.map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => {
                                                setSelectedAmount(amount);
                                                setCustomAmount('');
                                            }}
                                            className={`text-sm md:text-base py-3 px-4 rounded-xl font-semibold transition-all ${selectedAmount === amount && !customAmount
                                                ? 'bg-brand-600 text-white'
                                                : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                                                }`}
                                        >
                                            ₦{amount.toLocaleLowerCase()}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-400 w-5 h-5">₦</div>
                                    <input
                                        type="number"
                                        placeholder="Enter custom amount"
                                        value={customAmount}
                                        onChange={(e) => {
                                            setCustomAmount(e.target.value);
                                            setSelectedAmount('');
                                        }}
                                        className="w-full pl-10 pr-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Fund Selection */}
                            <div className="mb-8">
                                <h3 className="md:text-xl font-semibold text-brand-800 mb-4">Choose Where Your Gift Goes</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {givingFunds.map((fund) => {
                                        const IconComponent = fund.icon;
                                        return (
                                            <label
                                                key={fund.id}
                                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedFund === fund.id
                                                    ? 'border-brand-500 bg-brand-50'
                                                    : 'border-brand-200 hover:border-brand-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="fund"
                                                    value={fund.id}
                                                    checked={selectedFund === fund.id}
                                                    onChange={(e) => setSelectedFund(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-start">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-brand-600 bg-opacity-10`}>
                                                        <IconComponent className={`w-6 h-6 text-white`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-semibold mb-1 ${selectedFund === fund.id ? 'text-brand-800' : 'text-brand-700'
                                                            }`}>
                                                            {fund.name}
                                                        </h4>
                                                        <p className="text-sm text-brand-600">{fund.description}</p>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Donation Summary */}
                            {(selectedAmount || customAmount) && (
                                <div className="mb-8 p-6 bg-brand-50 rounded-xl">
                                    <h3 className="text-lg font-semibold text-brand-800 mb-4">Donation Summary</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-brand-700">Amount:</span>
                                            <span className="font-semibold text-brand-800">
                                                ₦{getDonationAmount()} {donationType === 'monthly' && '/month'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-700">Fund:</span>
                                            <span className="font-semibold text-brand-800">
                                                {givingFunds.find(f => f.id === selectedFund)?.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-700">Type:</span>
                                            <span className="font-semibold text-brand-800">
                                                {donationType === 'one-time' ? 'One-Time Gift' : 'Monthly Recurring'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Donate Button */}
                            <button
                                onClick={handleDonate}
                                disabled={!getDonationAmount()}
                                className={`w-full text-sm md:text-base py-4 px-8 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${getDonationAmount()
                                    ? 'bg-brand-600 text-white hover:bg-brand-700 hover:scale-105 transform'
                                    : 'bg-brand-200 text-brand-400 cursor-not-allowed'
                                    }`}
                            >
                                <CreditCard className="w-5 h-5" />
                                {getDonationAmount() ? `Donate ${getDonationAmount()}` : 'Select Amount to Continue'}
                            </button>

                            <p className="text-sm text-brand-500 text-center mt-4">
                                Your donation is secure and tax-deductible. You'll receive a receipt via email.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stories */}
            <section className="py-8 md:py-16 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-xl md:text-3xl font-bold text-brand-900 mb-12 text-center">Your Impact in Action</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <GraduationCap className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-brand-900 mb-2 md:mb-4">Scholarships Created</h3>
                            <p className="text-sm md:text-base text-brand-600 mb-4">
                                Last year, donor contributions funded 45 full scholarships, helping students from all backgrounds access quality education.
                            </p>
                            <div className="md:text-2xl font-bold text-blue-600">45 Students</div>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-brand-900 mb-2 md:mb-4">Library Expansion</h3>
                            <p className="text-sm md:text-base text-brand-600 mb-4">
                                Thanks to generous donors, we added 5,000 new books and upgraded our digital learning resources.
                            </p>
                            <div className="md:text-2xl font-bold text-green-600">5,000 Books</div>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Laptop className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-brand-900 mb-2 md:mb-4">Technology Upgrades</h3>
                            <p className="text-sm md:text-base text-brand-600 mb-4">
                                New computer labs and smart classrooms were made possible through community support and donations.
                            </p>
                            <div className="md:text-2xl font-bold text-purple-600">12 Classrooms</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Ways to Give */}
            <section className="py-16 bg-brand-50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-xl md:text-3xl font-bold text-brand-900 mb-8">Other Ways to Support</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <Gift className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-brand-900 mb-4">Corporate Partnerships</h3>
                            <p className="text-sm md:text-base text-brand-600 mb-6">
                                Partner with us through corporate sponsorships, matching gift programs, or employee volunteer initiatives.
                            </p>
                            <button className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors">
                                Learn More
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <Users className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-brand-900 mb-4">Volunteer Your Time</h3>
                            <p className="text-sm md:text-base text-brand-600 mb-6">
                                Share your skills and expertise by volunteering as a mentor, guest speaker, or event coordinator.
                            </p>
                            <button className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors">
                                Get Involved
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-12 text-black">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-2xl font-semibold mb-4 text-brand-500">
                        Questions About Giving?
                    </h3>
                    <p className="text-sm md:text-base text-brand-500 mb-6">
                        Our development team is here to help you make the most meaningful impact with your generosity.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center md:gap-8 text-brand-300">
                        <div>
                            <strong>Email:</strong> giving@progressschools.com
                        </div>
                        <div>
                            <strong>Phone:</strong> +234 (814) 770 2684
                        </div>
                    </div>
                </div>
            </section>
            {showThankYou &&
                <div className="fixed top-0 z-[20000] w-full flex items-center justify-center py-20">
                    <div onClick={() => setShowThankYou(false)} className='w-full h-full z-10 absolute top-0 bg-black opacity-25' />
                    <div className="max-w-2xl mx-auto z-40 px-6 text-center">
                        <div className="bg-white rounded-3xl shadow-xl p-12">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-4xl font-bold text-brand-900 mb-6">Thank You!</h1>
                            <p className="text-xl text-brand-600 mb-8 leading-relaxed">
                                Your generous donation of <strong>₦{getDonationAmount()}</strong> makes a real difference in our students' lives. We are grateful for your support!
                            </p>
                            <div className="space-y-4 text-brand-700">
                                <p><strong>What happens next?</strong></p>
                                <ul className="space-y-2 text-left max-w-md mx-auto">
                                    <li>• You'll receive an email receipt for tax purposes</li>
                                    <li>• Your donation will be processed within 24 hours</li>
                                    <li>• You'll get updates on how your gift is making an impact</li>
                                    <li>• You'll be added to our donor appreciation list</li>
                                </ul>
                            </div>
                            <button
                                onClick={() => setShowThankYou(false)}
                                className="mt-8 px-8 py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors"
                            >
                                Make Another Donation
                            </button>
                        </div>
                    </div>
                </div>}
        </HomeWrapper>
    );
};

export default SchoolGivingPage;