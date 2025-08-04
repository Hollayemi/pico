"use client"
import React, { useState } from 'react';
import { 
    Scissors, 
    Palette, 
    ChefHat, 
    ShirtIcon as Shoe,
    Camera, 
    Music, 
    Brush,
    Award,
    Users,
    Clock,
    Target,
    Star,
    ArrowRight,
    CheckCircle
} from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';
import {programBenefits, vocationalPrograms} from '@/app/content/vocational'

export default function VocationalTraining() {
    const [selectedProgram, setSelectedProgram] = useState(null);


    return (
        <HomeWrapper miniSlider title="Vocational Training">
            <div className="max-w-7xl mx-auto px-2">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className=" text-xl md:text-4xl font-bold text-brand-600 mb-6">
                        Vocational Training & Creative Groups
                    </h1>
                    <p className="text-sm text-gray-600 max-w-4xl mx-auto mb-8">
                        Empowering students with practical skills and creative talents through comprehensive vocational training programs. 
                        Our hands-on approach prepares students for entrepreneurship and specialized careers while fostering creativity and innovation.
                    </p>
                    
                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {programBenefits.map((benefit, index) => (
                            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                                <div className="bg-brand-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-brand-600">{benefit.icon}</span>
                                </div>
                                <h3 className="font-semibold text-brand-600 mb-2">{benefit.title}</h3>
                                <p className="text-sm text-gray-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vocational Programs */}
                <div className="space-y-12">
                    {vocationalPrograms.map((program, index) => (
                        <div key={program.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                                {/* Image Section */}
                                <div className={`relative h-64 lg:h-auto ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                                    <img 
                                        src={program.image} 
                                        alt={program.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                                    <div className={`absolute top-4 left-4 bg-${program.color}-600 text-white p-3 rounded-full`}>
                                        {program.icon}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className={`p-8 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                                    <div className="flex items-center mb-4">
                                        <h2 className="text-2xl font-bold text-brand-600">{program.title}</h2>
                                        <span className={`ml-4 px-3 py-1 bg-${program.color}-100 text-${program.color}-700 text-sm rounded-full`}>
                                            {program.duration}
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {program.description}
                                    </p>

                                    {/* Quick Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <h4 className="font-semibold text-brand-600 mb-2 flex items-center">
                                                <Star className="w-4 h-4 mr-2 text-brand-warning-500" />
                                                Key Skills
                                            </h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {program.skillsLearned.slice(0, 3).map((skill, skillIndex) => (
                                                    <li key={skillIndex} className="flex items-center">
                                                        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mr-2"></span>
                                                        {skill}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-semibold text-brand-600 mb-2 flex items-center">
                                                <Award className="w-4 h-4 mr-2 text-brand-success-500" />
                                                Certifications
                                            </h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {program.certifications.map((cert, certIndex) => (
                                                    <li key={certIndex} className="flex items-center">
                                                        <CheckCircle className="w-3 h-3 mr-2 text-brand-success-500" />
                                                        {cert}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <button 
                                            onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
                                            className={`bg-${program.color}-600 hover:bg-${program.color}-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center`}
                                        >
                                            {selectedProgram === program.id ? 'Hide Details' : 'View Details'}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </button>
                                        <button className={`border border-${program.color}-600 text-${program.color}-600 hover:bg-${program.color}-50 px-6 py-2 rounded-lg font-medium transition-colors`}>
                                            Enroll Now
                                        </button>
                                    </div>

                                    {/* Expanded Details */}
                                    {selectedProgram === program.id && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-semibold text-brand-600 mb-3">Complete Skills Curriculum</h4>
                                                    <ul className="text-sm text-gray-600 space-y-2">
                                                        {program.skillsLearned.map((skill, skillIndex) => (
                                                            <li key={skillIndex} className="flex items-start">
                                                                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mr-2 mt-2"></span>
                                                                {skill}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                
                                                <div>
                                                    <h4 className="font-semibold text-brand-600 mb-3">Career Opportunities</h4>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {program.careerPaths.map((career, careerIndex) => (
                                                            <span key={careerIndex} className={`px-3 py-1 bg-${program.color}-50 text-${program.color}-700 text-xs rounded-full border border-${program.color}-200`}>
                                                                {career}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    
                                                    <h4 className="font-semibold text-brand-600 mb-3">Equipment & Resources</h4>
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        {program.equipmentProvided.slice(0, 3).map((equipment, equipIndex) => (
                                                            <li key={equipIndex} className="flex items-center">
                                                                <CheckCircle className="w-3 h-3 mr-2 text-brand-success-500" />
                                                                {equipment}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enrollment Information */}
                <div className="bg-gradient-to-r from-brand-50 to-brand-secondary-50 rounded-lg p-8 my-12">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-brand-600 mb-4">
                            Ready to Develop Your Skills?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Join our vocational training programs and unlock your creative potential. 
                            Our expert instructors and state-of-the-art facilities ensure you receive the best practical education.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-brand-600 mb-1">500+</div>
                                <div className="text-sm text-gray-600">Students Trained</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-brand-secondary-600 mb-1">85%</div>
                                <div className="text-sm text-gray-600">Employment Rate</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-brand-success-600 mb-1">7</div>
                                <div className="text-sm text-gray-600">Programs Available</div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center ">
                            <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                                Apply
                            </button>
                            <button className="border border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-3 rounded-lg font-medium transition-colors">
                                Schedule a Visit
                            </button>
                            <button className="border border-brand-secondary-600 text-brand-secondary-600 hover:bg-brand-secondary-50 px-8 py-3 rounded-lg font-medium transition-colors">
                                Download Brochure
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </HomeWrapper>
    );
}