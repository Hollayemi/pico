"use client"
import React, { useState } from 'react';
import { 
    Microscope, 
    Palette, 
    Calculator, 
    BookOpen, 
    Users, 
    Award, 
    Target,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    TrendingUp,
    Globe
} from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';
import { departments, generalSubjects } from "@/app/content/secondary"
import { useRouter } from 'next/navigation'

export default function SecondaryDepartments() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('science');
    const [expandedCard, setExpandedCard] = useState(null);

  

    const toggleCard = (cardId) => {
        setExpandedCard(expandedCard === cardId ? null : cardId);
    };

    const currentDept = departments[activeTab];

    return (
        <HomeWrapper miniSlider title="Secondary Departments">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-brand-600 mb-4">
                        Secondary School Departments
                    </h1>
                    <p className="text-sm text-gray-500 max-w-4xl mx-auto">
                        Our secondary school is structured into three major departments - Science, Arts, and Commercial - designed to help students achieve their specific academic and career goals. Each department offers specialized curriculum and facilities to prepare students for higher education and professional success.
                    </p>
                </div>

                {/* Department Tabs */}
                <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg  border border-gray-200 p-2">
                    {Object.entries(departments).map(([key, dept]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex-1 min-w-0 px-6 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                                activeTab === key
                                    ? `bg-${dept.color}-600 text-white shadow-lg`
                                    : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
                            }`}
                        >
                            <span className="mr-2">{dept.icon}</span>
                            <span className="hidden sm:inline">{dept.title}</span>
                            <span className="sm:hidden">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        </button>
                    ))}
                </div>

                {/* Department Content */}
                <div className="bg-white rounded-lg  border border-gray-200 overflow-hidden mb-8">
                    <div className={`bg-${currentDept.color}-50 px-8 py-6 border-l-4 border-${currentDept.color}-400`}>
                        <div className="flex items-center mb-4">
                            <div className={`text-${currentDept.color}-600 mr-4`}>
                                {currentDept.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-brand-600">
                                {currentDept.title}
                            </h2>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            {currentDept.description}
                        </p>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Subject Information */}
                            <div className="space-y-6">
                                {/* Core Subjects */}
                                <div>
                                    <h3 className="text-lg font-semibold text-brand-600 mb-4 flex items-center">
                                        <BookOpen className="w-5 h-5 mr-2 text-brand-600" />
                                        Core Subjects Offered
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {currentDept.coreSubjects.map((subject, index) => (
                                            <div key={index} className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700 border">
                                                {subject}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Compulsory Subjects */}
                                <div>
                                    <h3 className="text-lg font-semibold text-brand-600 mb-4 flex items-center">
                                        <Target className="w-5 h-5 mr-2 text-brand-warning-600" />
                                        WAEC/NECO Requirements
                                    </h3>
                                    <div className="space-y-2">
                                        {currentDept.compulsorySubjects.map((subject, index) => (
                                            <div key={index} className={`bg-${currentDept.color}-50 px-3 py-2 rounded-lg text-sm border border-${currentDept.color}-200 flex items-center`}>
                                                <span className="w-2 h-2 bg-brand-warning-500 rounded-full mr-2"></span>
                                                {subject}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Career Paths */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-brand-600 mb-4 flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2 text-brand-success-600" />
                                        Career Pathways
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {currentDept.careerPaths.map((career, index) => (
                                            <div key={index} className="bg-gradient-to-r from-brand-success-50 to-transparent px-3 py-2 rounded-lg text-sm text-gray-700 border border-brand-success-200">
                                                {career}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Department Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Facilities Card */}
                    <div className="bg-white rounded-lg  border border-gray-200">
                        <div 
                            className="px-6 py-4 cursor-pointer flex items-center justify-between"
                            onClick={() => toggleCard('facilities')}
                        >
                            <h3 className="text-lg font-semibold text-brand-600 flex items-center">
                                <Lightbulb className="w-5 h-5 mr-2 text-brand-info-600" />
                                Department Facilities
                            </h3>
                            {expandedCard === 'facilities' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                        {expandedCard === 'facilities' && (
                            <div className="px-6 pb-6">
                                <ul className="space-y-3">
                                    {currentDept.facilities.map((facility, index) => (
                                        <li key={index} className="flex items-center text-gray-700">
                                            <span className="w-2 h-2 bg-brand-info-500 rounded-full mr-3"></span>
                                            {facility}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Achievements Card */}
                    <div className="bg-white rounded-lg  border border-gray-200">
                        <div 
                            className="px-6 py-4 cursor-pointer flex items-center justify-between"
                            onClick={() => toggleCard('achievements')}
                        >
                            <h3 className="text-lg font-semibold text-brand-600 flex items-center">
                                <Award className="w-5 h-5 mr-2 text-brand-warning-600" />
                                Recent Achievements
                            </h3>
                            {expandedCard === 'achievements' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                        {expandedCard === 'achievements' && (
                            <div className="px-6 pb-6">
                                <ul className="space-y-3">
                                    {currentDept.achievements.map((achievement, index) => (
                                        <li key={index} className="flex items-center text-gray-700">
                                            <span className="w-2 h-2 bg-brand-warning-500 rounded-full mr-3"></span>
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* General Information */}
                <div className="bg-white rounded-lg  border border-gray-200 p-8 mb-8">
                    <h3 className="text-xl font-semibold text-brand-600 mb-6 flex items-center">
                        <Globe className="w-6 h-6 mr-3 text-brand-600" />
                        General Requirements for All Departments
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-medium text-brand-600 mb-4">Common Subjects</h4>
                            <div className="space-y-2">
                                {generalSubjects.map((subject, index) => (
                                    <div key={index} className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700 border">
                                        {subject}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-brand-600 mb-4">Examination Requirements</h4>
                            <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex items-start">
                                    <span className="w-2 h-2 bg-brand-500 rounded-full mr-3 mt-2"></span>
                                    <span>Minimum of 9 subjects for WAEC/NECO including English Language, Mathematics, and Civic Education</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="w-2 h-2 bg-brand-500 rounded-full mr-3 mt-2"></span>
                                    <span>At least 6 subjects must be passed at credit level for university admission</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="w-2 h-2 bg-brand-500 rounded-full mr-3 mt-2"></span>
                                    <span>Department-specific subjects must align with chosen career path</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="w-2 h-2 bg-brand-500 rounded-full mr-3 mt-2"></span>
                                    <span>Trade subjects are compulsory for skill development</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Department Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-brand-600 mb-2">95%</div>
                        <div className="text-sm text-gray-700">WAEC Pass Rate</div>
                    </div>
                    <div className="bg-gradient-to-br from-brand-secondary-50 to-brand-secondary-100 rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-brand-secondary-600 mb-2">500+</div>
                        <div className="text-sm text-gray-700">Students Enrolled</div>
                    </div>
                    <div className="bg-gradient-to-br from-brand-success-50 to-brand-success-100 rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-brand-success-600 mb-2">87%</div>
                        <div className="text-sm text-gray-700">University Admission Rate</div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mb-10 bg-gradient-to-r from-brand-50 to-brand-secondary-50 rounded-lg p-8">
                    <h3 className="text-2xl font-semibold text-brand-600 mb-4">
                        Choose Your Path to Success
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Our comprehensive departmental structure ensures every student finds their passion and develops the skills needed for academic and professional excellence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => router.push("/admissions/apply")} className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                            Apply for Admission
                        </button>
                        <button className="border border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-3 rounded-lg font-medium transition-colors">
                            Schedule a Visit
                        </button>
                    </div>
                </div>
            </div>
        </HomeWrapper>
    );
}