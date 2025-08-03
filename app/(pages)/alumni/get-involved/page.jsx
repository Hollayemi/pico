"use client"
import React, { useState } from 'react';
import { User, Mail, Calendar, MapPin, Briefcase, Heart, Users, CheckCircle, ArrowRight } from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';

const AlumniGetInvolvedForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        graduationYear: '',
        currentCity: '',
        currentJob: '',
        company: '',
        interests: [],
        volunteerTime: '',
        skills: '',
        preferredContact: 'email',
        updates: true
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const involvementOptions = [
        { id: 'mentoring', label: 'Student Mentoring', icon: Users },
        { id: 'events', label: 'Event Planning', icon: Calendar },
        { id: 'fundraising', label: 'Fundraising', icon: Heart },
        { id: 'recruiting', label: 'Student Recruiting', icon: Briefcase },
        { id: 'speaking', label: 'Guest Speaking', icon: User },
        { id: 'networking', label: 'Professional Networking', icon: Users },
        { id: 'reunion', label: 'Class Reunion Planning', icon: Calendar },
        { id: 'social', label: 'Social Media & Marketing', icon: Mail }
    ];

    const timeCommitmentOptions = [
        { value: '1-2 hours/month', label: '1-2 hours per month' },
        { value: '3-5 hours/month', label: '3-5 hours per month' },
        { value: '6-10 hours/month', label: '6-10 hours per month' },
        { value: 'flexible', label: 'Flexible - as available' }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleInterestChange = (interestId) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interestId)
                ? prev.interests.filter(id => id !== interestId)
                : [...prev.interests, interestId]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-brand-50 flex items-center justify-center py-20">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <div className="bg-white rounded-3xl shadow-xl p-12">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-brand-900 mb-6">Thank You!</h1>
                        <p className="text-xl text-brand-600 mb-8 leading-relaxed">
                            We're excited to have you join our alumni community! Our team will review your information and reach out within 3-5 business days to discuss how you can get involved.
                        </p>
                        <div className="space-y-4 text-brand-700">
                            <p><strong>What's Next?</strong></p>
                            <ul className="space-y-2 text-left max-w-md mx-auto">
                                <li>• You'll receive a welcome email with resources</li>
                                <li>• A volunteer coordinator will contact you</li>
                                <li>• You'll be added to our monthly newsletter</li>
                                <li>• Invitations to upcoming events will be sent</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="mt-8 px-8 py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors"
                        >
                            Submit Another Form
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <HomeWrapper miniSlider>
            {/* Hero Section */}
            <section className="py-4 text-black">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-2xl md:text-4xl font-bold mb-6">
                        Get Involved with
                        <span className="text-brand-500 ml-2"> Alumni Community</span>
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed">
                        Join thousands of alumni making a difference. Share your time, talents, and expertise to help current students and strengthen our community.
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="p-8 lg:p-12">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information */}
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-900 mb-6 flex items-center">
                                        <User className="w-6 h-6 mr-3 text-brand-600" />
                                        Personal Information
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-brand-700 font-semibold mb-2">First Name *</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                                placeholder="Enter your first name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-brand-700 font-semibold mb-2">Last Name *</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                                placeholder="Enter your last name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-brand-700 font-semibold mb-2">Email Address *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                                placeholder="email address"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-brand-700 font-semibold mb-2">Phone Number (Whatsapp Preferrably)</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                                placeholder="+234 (814) 770 2684"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-brand-700 font-semibold mb-2">Graduation Year *</label>
                                            <input
                                                type="number"
                                                name="graduationYear"
                                                value={formData.graduationYear}
                                                onChange={handleInputChange}
                                                required
                                                min="1950"
                                                max="2030"
                                                className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                                placeholder="2020"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-brand-700 font-semibold mb-2">Current City</label>
                                            <input
                                                type="text"
                                                name="currentCity"
                                                value={formData.currentCity}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                                placeholder="Lagos, Nigeria"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Information */}
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-900 mb-6 flex items-center">
                                        <Briefcase className="w-6 h-6 mr-3 text-brand-600" />
                                        Professional Information
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-brand-700 font-semibold mb-2">Current Job Title</label>
                                            <input
                                                type="text"
                                                name="currentJob"
                                                value={formData.currentJob}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                                placeholder="Software Engineer"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-brand-700 font-semibold mb-2">Company/Organization</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                                placeholder="Tech Company Inc."
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-brand-700 font-semibold mb-2">Skills & Expertise</label>
                                        <textarea
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                                            placeholder="Tell us about your professional skills, areas of expertise, or special talents you'd like to share..."
                                        />
                                    </div>
                                </div>

                                {/* Involvement Interests */}
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-900 mb-6 flex items-center">
                                        <Heart className="w-6 h-6 mr-3 text-brand-600" />
                                        How Would You Like to Get Involved?
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {involvementOptions.map((option) => {
                                            const IconComponent = option.icon;
                                            return (
                                                <label
                                                    key={option.id}
                                                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.interests.includes(option.id)
                                                        ? 'border-brand-500 bg-brand-50'
                                                        : 'border-brand-200 hover:border-brand-300'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.interests.includes(option.id)}
                                                        onChange={() => handleInterestChange(option.id)}
                                                        className="sr-only"
                                                    />
                                                    <IconComponent className={`w-5 h-5 mr-3 ${formData.interests.includes(option.id) ? 'text-brand-600' : 'text-brand-400'
                                                        }`} />
                                                    <span className={`font-medium ${formData.interests.includes(option.id) ? 'text-brand-800' : 'text-brand-600'
                                                        }`}>
                                                        {option.label}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Communication Preferences */}
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-900 mb-6 flex items-center">
                                        <Mail className="w-6 h-6 mr-3 text-brand-600" />
                                        Communication Preferences
                                    </h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-brand-700 font-semibold mb-3">Preferred Contact Method</label>
                                            <div className="flex gap-6">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="preferredContact"
                                                        value="email"
                                                        checked={formData.preferredContact === 'email'}
                                                        onChange={handleInputChange}
                                                        className="mr-2 text-brand-600"
                                                    />
                                                    <span className="text-brand-700">Email</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="preferredContact"
                                                        value="phone"
                                                        checked={formData.preferredContact === 'phone'}
                                                        onChange={handleInputChange}
                                                        className="mr-2 text-brand-600"
                                                    />
                                                    <span className="text-brand-700">Phone</span>
                                                </label>
                                            </div>
                                        </div>

                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="updates"
                                                checked={formData.updates}
                                                onChange={handleInputChange}
                                                className="mr-3 text-brand-600"
                                            />
                                            <span className="text-brand-700">I'd like to receive updates about alumni events and opportunities</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6 border-t border-brand-100">
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-8 py-4 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 transform"
                                    >
                                        Submit Application
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                    <p className="text-sm text-brand-500 mt-4">
                                        Thank you for your interest
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </HomeWrapper>
    );
};

export default AlumniGetInvolvedForm;