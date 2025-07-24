"use client"
import React, { useState } from 'react';
import * as Yup from 'yup';
import { bloodGroupOptions, genderOptions, genotypeOptions } from './components';
import HomeWrapper from '@/app/components/wrapper';
import Input from '@/app/components/Form/Input';

// Validation schemas for each stage
const stage1ValidationSchema = Yup.object().shape({
    mother: Yup.object().shape({
        name: Yup.string().required('Mother\'s name is required'),
        occupation: Yup.string(),
        officeAddress: Yup.string(),
        homeAddress: Yup.string().required('Home address is required'),
        homePhone: Yup.string().required('Home phone is required'),
        whatsApp: Yup.string(),
        email: Yup.string().email('Invalid email format').required('Email is required'),
    }),
    schoolsAttended: Yup.object().shape({
        school1: Yup.object().shape({
            name: Yup.string(),
            startDate: Yup.string(),
            endDate: Yup.string(),
        }),
        school2: Yup.object().shape({
            name: Yup.string(),
            startDate: Yup.string(),
            endDate: Yup.string(),
        }),
        school3: Yup.object().shape({
            name: Yup.string(),
            startDate: Yup.string(),
            endDate: Yup.string(),
        }),
    }),
    classPreferences: Yup.object().shape({
        presentClass: Yup.string(),
        classInterestedIn: Yup.string().required('Please select the class you\'re interested in'),
    }),
});

const stage2ValidationSchema = Yup.object().shape({
    health: Yup.object().shape({
        vaccinations: Yup.object(),
        otherVaccination: Yup.string(),
        infectiousDisease: Yup.string(),
        foodAllergy: Yup.string(),
    }),
    documents: Yup.object().shape({
        birthCertificate: Yup.mixed().required('Birth certificate is required'),
        formerSchoolReport: Yup.mixed().required('Former school report is required'),
        immunizationCertificate: Yup.mixed(),
        medicalReport: Yup.mixed(),
        proofOfPayment: Yup.mixed().required('Proof of payment is required'),
    }),
    correspondenceEmail: Yup.string().email('Invalid email format').required('Correspondence email is required'),
    howDidYouKnow: Yup.string(),
});

export default function ApplicationForm() {
    const [currentStage, setCurrentStage] = useState(1);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        // Mother's Details (grouped)
        mother: {
            name: '',
            occupation: '',
            officeAddress: '',
            homeAddress: '',
            homePhone: '',
            whatsApp: '',
            email: '',
        },

        // Schools Attended (grouped)
        schoolsAttended: {
            school1: {
                name: '',
                startDate: '',
                endDate: '',
            },
            school2: {
                name: '',
                startDate: '',
                endDate: '',
            },
            school3: {
                name: '',
                startDate: '',
                endDate: '',
            },
        },

        // Class Preferences (grouped)
        classPreferences: {
            presentClass: '',
            classInterestedIn: '',
        },

        // Health (grouped)
        health: {
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
            infectiousDisease: '',
            foodAllergy: '',
        },

        // Supporting Documents (grouped)
        documents: {
            birthCertificate: null,
            formerSchoolReport: null,
            immunizationCertificate: null,
            medicalReport: null,
            proofOfPayment: null,
        },

        // Personal info (not grouped)
        correspondenceEmail: '',
        howDidYouKnow: ''
    });

    const handleInputChange = (path, value) => {
        const pathArray = path.split('.');
        setFormData(prev => {
            const newData = { ...prev };
            let current = newData;

            for (let i = 0; i < pathArray.length - 1; i++) {
                if (!current[pathArray[i]]) {
                    current[pathArray[i]] = {};
                }
                current[pathArray[i]] = { ...current[pathArray[i]] };
                current = current[pathArray[i]];
            }

            current[pathArray[pathArray.length - 1]] = value;
            return newData;
        });

        // Clear specific field error when user starts typing
        if (errors[path]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[path];
                return newErrors;
            });
        }
    };

    const handleVaccinationChange = (vaccinationType, checked) => {
        handleInputChange(`health.vaccinations.${vaccinationType}`, checked);
    };

    const handleFileChange = (fieldName, file) => {
        handleInputChange(`documents.${fieldName}`, file);
    };

    const validateStage = async (stage) => {
        try {
            setErrors({});

            if (stage === 1) {
                const dataToValidate = {
                    mother: formData.mother,
                    schoolsAttended: formData.schoolsAttended,
                    classPreferences: formData.classPreferences,
                };
                await stage1ValidationSchema.validate(dataToValidate, { abortEarly: false });
            } else {
                const dataToValidate = {
                    health: formData.health,
                    documents: formData.documents,
                    correspondenceEmail: formData.correspondenceEmail,
                    howDidYouKnow: formData.howDidYouKnow,
                };
                await stage2ValidationSchema.validate(dataToValidate, { abortEarly: false });
            }

            return true;
        } catch (validationErrors) {
            const errorMessages = {};
            validationErrors.inner.forEach(error => {
                errorMessages[error.path] = error.message;
            });
            setErrors(errorMessages);
            return false;
        }
    };

    const handleNext = async () => {
        const isValid = await validateStage(1);
        if (isValid) {
            setCurrentStage(2);
        }
    };

    const handlePrevious = () => {
        setCurrentStage(1);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await validateStage(2);
        if (isValid) {
            // Handle form submission
            console.log('Form submitted:', formData);
            alert('Form submitted successfully!');
        }
    };

    const getFieldError = (path) => {
        return errors[path];
    };

    const renderStage1 = () => (
        <>
        
            {/* Record Of Schools Attended */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
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
                                    value={formData.schoolsAttended[`school${num}`].name}
                                    onChange={(e) => handleInputChange(`schoolsAttended.school${num}.name`, e.target.value)}
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
                                        value={formData.schoolsAttended[`school${num}`].startDate}
                                        onChange={(e) => handleInputChange(`schoolsAttended.school${num}.startDate`, e.target.value)}
                                        placeholder="Start Date"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 text-sm"
                                    />
                                    <span className="text-gray-500 text-sm">to</span>
                                    <input
                                        type="text"
                                        value={formData.schoolsAttended[`school${num}`].endDate}
                                        onChange={(e) => handleInputChange(`schoolsAttended.school${num}.endDate`, e.target.value)}
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                    <h2 className="text-lg font-semibold text-gray-800">Class Preferences</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Present Class</label>
                            <select
                                value={formData.classPreferences.presentClass}
                                onChange={(e) => handleInputChange('classPreferences.presentClass', e.target.value)}
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
                                value={formData.classPreferences.classInterestedIn}
                                onChange={(e) => handleInputChange('classPreferences.classInterestedIn', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 transition-colors ${getFieldError('classPreferences.classInterestedIn')
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-orange-300 focus:ring-orange-500 focus:border-orange-500'
                                    }`}
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
                            {getFieldError('classPreferences.classInterestedIn') && (
                                <p className="text-red-500 text-xs mt-1">{getFieldError('classPreferences.classInterestedIn')}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderStage2 = () => (
        <>
            {/* Vaccinations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
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
                                    checked={formData.health.vaccinations[key]}
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
                            value={formData.health.otherVaccination}
                            onChange={(e) => handleInputChange('health.otherVaccination', e.target.value)}
                            placeholder="Others. Please specify"
                            className="w-full px-4 py-3 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Health Challenges */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                    <h2 className="text-lg font-semibold text-gray-800">Health Challenges</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Record Of Infectious (If Any)</label>
                            <textarea
                                value={formData.health.infectiousDisease}
                                onChange={(e) => handleInputChange('health.infectiousDisease', e.target.value)}
                                placeholder="Please indicate any infectious diseases that this child might have had"
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Food Allergy</label>
                            <textarea
                                value={formData.health.foodAllergy}
                                onChange={(e) => handleInputChange('health.foodAllergy', e.target.value)}
                                placeholder="What food allergy does this child have?"
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Supporting Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                    <h2 className="text-lg font-semibold text-gray-800">Supporting Documents</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { key: 'birthCertificate', label: 'Birth Certificate', required: true },
                            { key: 'formerSchoolReport', label: 'Former School Report', required: true },
                            { key: 'immunizationCertificate', label: 'Immunization Certificate', required: false },
                            { key: 'medicalReport', label: 'Medical Report', required: false },
                            { key: 'proofOfPayment', label: 'Proof Of Payment', required: true },
                        ].map(({ key, label, required }) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {label} {required && <span className="text-orange-500 text-xs">[compulsory]</span>}
                                </label>
                                <div className={`flex items-center ${getFieldError(`documents.${key}`) ? 'border-red-300' : ''}`}>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(key, e.target.files[0])}
                                        className="hidden"
                                        id={key}
                                    />
                                    <label
                                        htmlFor={key}
                                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-l-md border border-gray-300 text-sm cursor-pointer"
                                    >
                                        Choose File
                                    </label>
                                    <span className="flex-1 px-4 py-2 bg-gray-50 border-t border-b border-r border-gray-300 rounded-r-md text-sm text-gray-500">
                                        {formData.documents[key] ? formData.documents[key].name : "No file chosen"}
                                    </span>
                                </div>
                                {getFieldError(`documents.${key}`) && (
                                    <p className="text-red-500 text-xs mt-1">{getFieldError(`documents.${key}`)}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 transition-colors placeholder-gray-400 ${getFieldError('correspondenceEmail')
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-orange-300 focus:ring-orange-500 focus:border-orange-500'
                                }`}
                        />
                        {getFieldError('correspondenceEmail') && (
                            <p className="text-red-500 text-xs mt-1">{getFieldError('correspondenceEmail')}</p>
                        )}
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
        </>
    );

    return (
        <HomeWrapper miniSlider title="Application Form">
            <h2 className='text-center'></h2>
        </HomeWrapper>
    )
}