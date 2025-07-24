"use client"
import React, { useState } from 'react';
import { bloodGroupOptions, genderOptions, genotypeOptions } from './components';
import HomeWrapper from '@/app/components/wrapper';
import Input from '@/app/components/Form/Input';

export default function ApplicationForm() {
    const [formData, setFormData] = useState({
        // personal info
        surname: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        genotype: '',
        nationality: '',
        stateOfOrigin: '',
        localGovernment: '',

        // Schooling Options
        schoolingOption: '',

        // Father's Details
        fatherName: '',
        fatherOccupation: '',
        fatherOfficeAddress: '',
        fatherHomeAddress: '',
        fatherHomePhone: '',
        fatherWhatsApp: '',
        fatherEmail: '',

        // Mother's Details
        motherName: '',
        motherOccupation: '',
        motherOfficeAddress: '',
        motherHomeAddress: '',
        motherHomePhone: '',
        motherWhatsApp: '',
        motherEmail: '',

        // Schools Attended
        school1: '',
        school1StartDate: '',
        school1EndDate: '',
        school2: '',
        school2StartDate: '',
        school2EndDate: '',
        school3: '',
        school3StartDate: '',
        school3EndDate: '',

        // Class Preferences
        presentClass: '',
        classInterestedIn: '',

        // Vaccinations
        vaccinations: {
            polio: false,
            smallPox: false,
            others: false,
            tetanus: false,
            measles: false,
            yellowFever: false,
            whoopingCough: false,
            diphtheria: false,
            cholera: false
        },
        otherVaccination: '',

        // Health
        infectiousDisease: '',
        foodAllergy: '',

        // Supporting Documents
        birthCertificate: null,
        formerSchoolReport: null,
        immunizationCertificate: null,
        medicalReport: null,
        proofOfPayment: null,

        // Contact
        correspondenceEmail: '',
        howDidYouKnow: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    return (
        <HomeWrapper miniSlider title="Application From">
            <h2 className='text-center text-2xl font-black mb-6'>ADMISSION FORM</h2>
            <div className="bg-gray-50 p-4">
                <div className="max-w-6xl mx-auto">

                    {/* Form Header */}
                    <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Applicant's Identity:
                        </h2>
                    </div>

                    {/* Form Content */}
                    <div className="bg-white rounded-b-lg shadow-sm p-6 border border-gray-200">

                        {/* Row 1: Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                            {/* Surname */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Surname <span className="text-orange-500 text-xs">[compulsory]</span>
                                </label>
                                <Input
                                    type="text"
                                    value={formData.surname}
                                    onChange={(e) => handleInputChange('surname', e.target.value)}
                                    placeholder="Type your surname"
                                    className="w-full px-4 py-3 border-2 border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-400"
                                />
                            </div>

                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name <span className="text-orange-500 text-xs">[compulsory]</span>
                                </label>
                                <Input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    placeholder="Type your first name"
                                    className="w-full px-4 py-3 border-2 border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-400"
                                />
                            </div>

                            {/* Middle Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Middle Name
                                </label>
                                <Input
                                    type="text"
                                    value={formData.middleName}
                                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                                    placeholder="Type your middle name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Row 2: Date of Birth and Gender */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of birth <span className="text-orange-500 text-xs">[compulsory]</span>
                                </label>
                                <Input
                                    type="text"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    placeholder="Date of birth - Day/Month/Year"
                                    className="w-full px-4 py-3 border-2 border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-400"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender <span className="text-orange-500 text-xs">[compulsory]</span>
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors text-gray-500 appearance-none bg-white"
                                >
                                    {genderOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 3: Blood Group and Genotype */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                            {/* Blood Group */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Blood Group <span className="text-orange-500 text-xs">[compulsory]</span>
                                </label>
                                <select
                                    value={formData.bloodGroup}
                                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors text-gray-500 appearance-none bg-white"
                                >
                                    {bloodGroupOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Genotype */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Genotype <span className="text-orange-500 text-xs">[compulsory]</span>
                                </label>
                                <select
                                    value={formData.genotype}
                                    onChange={(e) => handleInputChange('genotype', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors text-gray-500 appearance-none bg-white"
                                >
                                    {genotypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 4: Location Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Nationality */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nationality <span className="text-orange-500 text-xs">[compulsory]</span>
                                </label>
                                <Input
                                    type="text"
                                    value={formData.nationality}
                                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                                    placeholder="Nationality"
                                    className="w-full px-4 py-3 border-2 border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-400"
                                />
                            </div>

                            {/* State Of Origin */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State Of Origin <span className="text-orange-500 text-xs">[compulsory]</span>
                                </label>
                                <Input
                                    type="text"
                                    value={formData.stateOfOrigin}
                                    onChange={(e) => handleInputChange('stateOfOrigin', e.target.value)}
                                    placeholder="State Of Origin"
                                    className="w-full px-4 py-3 border-2 border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-400"
                                />
                            </div>

                            {/* Local Government */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Local Government <span className="text-orange-500 text-xs">[compulsory]</span>
                                </label>
                                <Input
                                    type="text"
                                    value={formData.localGovernment}
                                    onChange={(e) => handleInputChange('localGovernment', e.target.value)}
                                    placeholder="Local Government Area"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* Schooling Options */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Schooling Options: <span className="text-orange-500 text-xs">[compulsory]</span>
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.schoolingOption === 'boarding'}
                                        onChange={(e) => handleInputChange('schoolingOption', e.target.checked ? 'boarding' : '')}
                                        className="mr-2"
                                    />
                                    Boarding School
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.schoolingOption === 'day'}
                                        onChange={(e) => handleInputChange('schoolingOption', e.target.checked ? 'day' : '')}
                                        className="mr-2"
                                    />
                                    Day School
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Father's Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                            <h2 className="text-lg font-semibold text-gray-800">Father's Details:</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Father's Name <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fatherName}
                                        onChange={(e) => handleInputChange('fatherName', e.target.value)}
                                        placeholder="Type father's full name here"
                                        className="w-full px-4 py-3 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                                    <input
                                        type="text"
                                        value={formData.fatherOccupation}
                                        onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                                        placeholder="What is the father's occupation?"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Office Address</label>
                                    <input
                                        type="text"
                                        value={formData.fatherOfficeAddress}
                                        onChange={(e) => handleInputChange('fatherOfficeAddress', e.target.value)}
                                        placeholder="Father's office address"
                                        className="w-full px-4 py-3 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Home Address <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fatherHomeAddress}
                                        onChange={(e) => handleInputChange('fatherHomeAddress', e.target.value)}
                                        placeholder="Father's home address"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Home Phone <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.fatherHomePhone}
                                        onChange={(e) => handleInputChange('fatherHomePhone', e.target.value)}
                                        placeholder="Father's home phone"
                                        className="w-full px-4 py-3 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                                    <input
                                        type="tel"
                                        value={formData.fatherWhatsApp}
                                        onChange={(e) => handleInputChange('fatherWhatsApp', e.target.value)}
                                        placeholder="Father's whatsapp number"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        E-mail Address <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.fatherEmail}
                                        onChange={(e) => handleInputChange('fatherEmail', e.target.value)}
                                        placeholder="Father's e-mail address"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mother's Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                            <h2 className="text-lg font-semibold text-gray-800">Mother's Details:</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mother's Name <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.motherName}
                                        onChange={(e) => handleInputChange('motherName', e.target.value)}
                                        placeholder="Type mother's full name here"
                                        className="w-full px-4 py-3 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                                    <input
                                        type="text"
                                        value={formData.motherOccupation}
                                        onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                                        placeholder="What is the mother's occupation?"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Office Address</label>
                                    <input
                                        type="text"
                                        value={formData.motherOfficeAddress}
                                        onChange={(e) => handleInputChange('motherOfficeAddress', e.target.value)}
                                        placeholder="Mother's office address"
                                        className="w-full px-4 py-3 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Home Address <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.motherHomeAddress}
                                        onChange={(e) => handleInputChange('motherHomeAddress', e.target.value)}
                                        placeholder="Mother's home address"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Home Phone <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.motherHomePhone}
                                        onChange={(e) => handleInputChange('motherHomePhone', e.target.value)}
                                        placeholder="Mother's home phone"
                                        className="w-full px-4 py-3 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                                    <input
                                        type="tel"
                                        value={formData.motherWhatsApp}
                                        onChange={(e) => handleInputChange('motherWhatsApp', e.target.value)}
                                        placeholder="Mother's whatsapp number"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        E-mail Address <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.motherEmail}
                                        onChange={(e) => handleInputChange('motherEmail', e.target.value)}
                                        placeholder="Mother's e-mail address"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Record Of Schools Attended */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                            <h2 className="text-lg font-semibold text-gray-800">Record Of Schools Attended With Dates:</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            School {num}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData[`school${num}`]}
                                            onChange={(e) => handleInputChange(`school${num}`, e.target.value)}
                                            placeholder={num === 1 ? "First school attended" : num === 2 ? "Second school attended" : "Third school attended"}
                                            className="w-full px-4 py-3 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            School {num} Attendance Date:
                                        </label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                value={formData[`school${num}StartDate`]}
                                                onChange={(e) => handleInputChange(`school${num}StartDate`, e.target.value)}
                                                placeholder="Start Date"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 text-sm"
                                            />
                                            <span className="text-gray-500 text-sm">to</span>
                                            <input
                                                type="text"
                                                value={formData[`school${num}EndDate`]}
                                                onChange={(e) => handleInputChange(`school${num}EndDate`, e.target.value)}
                                                placeholder="End Date"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Class Preferences */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                            <h2 className="text-lg font-semibold text-gray-800">Class Preferences</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Present Class</label>
                                    <select
                                        value={formData.presentClass}
                                        onChange={(e) => handleInputChange('presentClass', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    >
                                        <option value="">Which Class</option>
                                        <option value="nursery1">Nursery 1</option>
                                        <option value="nursery2">Nursery 2</option>
                                        <option value="kg1">KG 1</option>
                                        <option value="kg2">KG 2</option>
                                        <option value="primary1">Primary 1</option>
                                        <option value="primary2">Primary 2</option>
                                        <option value="primary3">Primary 3</option>
                                        <option value="primary4">Primary 4</option>
                                        <option value="primary5">Primary 5</option>
                                        <option value="primary6">Primary 6</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Class Into Which Admission Is Sought <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <select
                                        value={formData.classInterestedIn}
                                        onChange={(e) => handleInputChange('classInterestedIn', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">Choose Class</option>
                                        <option value="nursery1">Nursery 1</option>
                                        <option value="nursery2">Nursery 2</option>
                                        <option value="kg1">KG 1</option>
                                        <option value="kg2">KG 2</option>
                                        <option value="primary1">Primary 1</option>
                                        <option value="primary2">Primary 2</option>
                                        <option value="primary3">Primary 3</option>
                                        <option value="primary4">Primary 4</option>
                                        <option value="primary5">Primary 5</option>
                                        <option value="primary6">Primary 6</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vaccinations */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                            <h2 className="text-lg font-semibold text-gray-800">Record of vaccinations or immunizations</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                {Object.entries({
                                    polio: 'Polio',
                                    smallPox: 'Small Pox',
                                    others: 'Others',
                                    tetanus: 'Tetanus',
                                    measles: 'Measles',
                                    yellowFever: 'Yellow Fever',
                                    whoopingCough: 'Whooping Cough',
                                    diphtheria: 'Diphtheria',
                                    cholera: 'Cholera'
                                }).map(([key, label]) => (
                                    <label key={key} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.vaccinations[key]}
                                            onChange={(e) => handleVaccinationChange(key, e.target.checked)}
                                            className="mr-2"
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={formData.otherVaccination}
                                    onChange={(e) => handleInputChange('otherVaccination', e.target.value)}
                                    placeholder="Others. Please specify"
                                    className="w-full px-4 py-3 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Health Challenges */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                            <h2 className="text-lg font-semibold text-gray-800">Health Challenges</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Record Of Infectious (If Any)</label>
                                    <textarea
                                        value={formData.infectiousDisease}
                                        onChange={(e) => handleInputChange('infectiousDisease', e.target.value)}
                                        placeholder="Please indicate any infectious diseases that this child might have had"
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Food Allergy</label>
                                    <textarea
                                        value={formData.foodAllergy}
                                        onChange={(e) => handleInputChange('foodAllergy', e.target.value)}
                                        placeholder="What food allergy does this child have?"
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Supporting Documents */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                            <h2 className="text-lg font-semibold text-gray-800">Supporting Documents</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Birth Certificate <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <div className="flex items-center">
                                        <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-l-md border border-gray-300 text-sm">
                                            Choose File
                                        </button>
                                        <span className="flex-1 px-4 py-2 bg-gray-50 border-t border-b border-r border-gray-300 rounded-r-md text-sm text-gray-500">
                                            No file chosen
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Former School Report <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <div className="flex items-center">
                                        <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-l-md border border-gray-300 text-sm">
                                            Choose File
                                        </button>
                                        <span className="flex-1 px-4 py-2 bg-gray-50 border-t border-b border-r border-gray-300 rounded-r-md text-sm text-gray-500">
                                            No file chosen
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Immunization Certificate</label>
                                    <div className="flex items-center">
                                        <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-l-md border border-gray-300 text-sm">
                                            Choose File
                                        </button>
                                        <span className="flex-1 px-4 py-2 bg-gray-50 border-t border-b border-r border-gray-300 rounded-r-md text-sm text-gray-500">
                                            No file chosen
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Report</label>
                                    <div className="flex items-center">
                                        <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-l-md border border-gray-300 text-sm">
                                            Choose File
                                        </button>
                                        <span className="flex-1 px-4 py-2 bg-gray-50 border-t border-b border-r border-gray-300 rounded-r-md text-sm text-gray-500">
                                            No file chosen
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Proof Of Payment <span className="text-orange-500 text-xs">[compulsory]</span>
                                    </label>
                                    <div className="flex items-center">
                                        <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-l-md border border-gray-300 text-sm">
                                            Choose File
                                        </button>
                                        <span className="flex-1 px-4 py-2 bg-gray-50 border-t border-b border-r border-gray-300 rounded-r-md text-sm text-gray-500">
                                            No file chosen
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                *Please provide a correspondence email address in the text below. This correspondence email may or may not be any of the email addresses you provided earlier!
                            </p>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correspondence Email <span className="text-orange-500 text-xs">[compulsory]</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.correspondenceEmail}
                                    onChange={(e) => handleInputChange('correspondenceEmail', e.target.value)}
                                    placeholder="Enter an email address with which we can contact you"
                                    className="w-full px-4 py-3 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">How did you know about our school?</label>
                                <textarea
                                    value={formData.howDidYouKnow}
                                    onChange={(e) => handleInputChange('howDidYouKnow', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </HomeWrapper>
    );
}