import React, { useState } from 'react';
import HomeWrapper from '@/app/components/wrapper';
import * as Yup from 'yup';


const Input = ({ className, ...props }) => (
    <input className={className} {...props} />
);

// Options data
const bloodGroupOptions = [
    { value: '', label: 'Select Blood Group' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
];

const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
];

const genotypeOptions = [
    { value: '', label: 'Select Genotype' },
    { value: 'AA', label: 'AA' },
    { value: 'AS', label: 'AS' },
    { value: 'SS', label: 'SS' },
    { value: 'AC', label: 'AC' },
    { value: 'SC', label: 'SC' }
];

const classOptions = [
    { value: '', label: 'Select Class' },
    { value: 'nursery1', label: 'Nursery 1' },
    { value: 'nursery2', label: 'Nursery 2' },
    { value: 'kg1', label: 'KG 1' },
    { value: 'kg2', label: 'KG 2' },
    { value: 'primary1', label: 'Primary 1' },
    { value: 'primary2', label: 'Primary 2' },
    { value: 'primary3', label: 'Primary 3' },
    { value: 'primary4', label: 'Primary 4' },
    { value: 'primary5', label: 'Primary 5' },
    { value: 'primary6', label: 'Primary 6' }
];

// Validation schemas for each stage
const stage1Schema = Yup.object().shape({
    surname: Yup.string().required('Surname is required'),
    firstName: Yup.string().required('First name is required'),
    middleName: Yup.string(),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    bloodGroup: Yup.string().required('Blood group is required'),
    genotype: Yup.string().required('Genotype is required'),
    nationality: Yup.string().required('Nationality is required'),
    stateOfOrigin: Yup.string().required('State of origin is required'),
    localGovernment: Yup.string().required('Local government is required'),
    schoolingOption: Yup.string().required('Schooling option is required')
});

const stage2Schema = Yup.object().shape({
    father: Yup.object().shape({
        name: Yup.string().required("Father's name is required"),
        occupation: Yup.string(),
        officeAddress: Yup.string(),
        homeAddress: Yup.string().required("Father's home address is required"),
        homePhone: Yup.string().required("Father's home phone is required"),
        whatsApp: Yup.string(),
        email: Yup.string().email('Invalid email').required("Father's email is required")
    }),
    mother: Yup.object().shape({
        name: Yup.string().required("Mother's name is required"),
        occupation: Yup.string(),
        officeAddress: Yup.string(),
        homeAddress: Yup.string().required("Mother's home address is required"),
        homePhone: Yup.string().required("Mother's home phone is required"),
        whatsApp: Yup.string(),
        email: Yup.string().email('Invalid email').required("Mother's email is required")
    })
});

const stage3Schema = Yup.object().shape({
    schools: Yup.object().shape({
        school1: Yup.string(),
        school1StartDate: Yup.string(),
        school1EndDate: Yup.string(),
        school2: Yup.string(),
        school2StartDate: Yup.string(),
        school2EndDate: Yup.string(),
        school3: Yup.string(),
        school3StartDate: Yup.string(),
        school3EndDate: Yup.string()
    }),
    classPreferences: Yup.object().shape({
        presentClass: Yup.string(),
        classInterestedIn: Yup.string().required('Class interested in is required')
    }),
    health: Yup.object().shape({
        vaccinations: Yup.object(),
        otherVaccination: Yup.string(),
        infectiousDisease: Yup.string(),
        foodAllergy: Yup.string()
    })
});

const stage4Schema = Yup.object().shape({
    documents: Yup.object().shape({
        birthCertificate: Yup.mixed(),
        formerSchoolReport: Yup.mixed(),
        immunizationCertificate: Yup.mixed(),
        medicalReport: Yup.mixed(),
        proofOfPayment: Yup.mixed()
    }),
    contact: Yup.object().shape({
        correspondenceEmail: Yup.string().email('Invalid email').required('Correspondence email is required'),
        howDidYouKnow: Yup.string()
    })
});

export default function ApplicationForm() {
    const [currentStage, setCurrentStage] = useState(1);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        // Personal info (not in object form)
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
        schoolingOption: '',

        // Father's Details
        father: {
            name: '',
            occupation: '',
            officeAddress: '',
            homeAddress: '',
            homePhone: '',
            whatsApp: '',
            email: ''
        },

        // Mother's Details
        mother: {
            name: '',
            occupation: '',
            officeAddress: '',
            homeAddress: '',
            homePhone: '',
            whatsApp: '',
            email: ''
        },

        // Schools Attended
        schools: {
            school1: '',
            school1StartDate: '',
            school1EndDate: '',
            school2: '',
            school2StartDate: '',
            school2EndDate: '',
            school3: '',
            school3StartDate: '',
            school3EndDate: ''
        },

        // Class Preferences
        classPreferences: {
            presentClass: '',
            classInterestedIn: ''
        },

        // Health
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
            foodAllergy: ''
        },

        // Supporting Documents
        documents: {
            birthCertificate: null,
            formerSchoolReport: null,
            immunizationCertificate: null,
            medicalReport: null,
            proofOfPayment: null
        },

        // Contact
        contact: {
            correspondenceEmail: '',
            howDidYouKnow: ''
        }
    });

    const handleInputChange = (field, value, parentField = null) => {
        if (parentField) {
            setFormData(prev => ({
                ...prev,
                [parentField]: {
                    ...prev[parentField],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }

        // Clear specific field error when user starts typing
        if (errors[parentField || field]) {
            setErrors(prev => ({
                ...prev,
                [parentField || field]: parentField
                    ? { ...prev[parentField], [field]: undefined }
                    : undefined
            }));
        }
    };

    const handleVaccinationChange = (vaccination, checked) => {
        setFormData(prev => ({
            ...prev,
            health: {
                ...prev.health,
                vaccinations: {
                    ...prev.health.vaccinations,
                    [vaccination]: checked
                }
            }
        }));
    };

    const validateCurrentStage = async () => {
        let schema;
        let dataToValidate;

        switch (currentStage) {
            case 1:
                schema = stage1Schema;
                dataToValidate = {
                    surname: formData.surname,
                    firstName: formData.firstName,
                    middleName: formData.middleName,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    bloodGroup: formData.bloodGroup,
                    genotype: formData.genotype,
                    nationality: formData.nationality,
                    stateOfOrigin: formData.stateOfOrigin,
                    localGovernment: formData.localGovernment,
                    schoolingOption: formData.schoolingOption
                };
                break;
            case 2:
                schema = stage2Schema;
                dataToValidate = {
                    father: formData.father,
                    mother: formData.mother
                };
                break;
            case 3:
                schema = stage3Schema;
                dataToValidate = {
                    schools: formData.schools,
                    classPreferences: formData.classPreferences,
                    health: formData.health
                };
                break;
            case 4:
                schema = stage4Schema;
                dataToValidate = {
                    documents: formData.documents,
                    contact: formData.contact
                };
                break;
            default:
                return true;
        }

        try {
            await schema.validate(dataToValidate, { abortEarly: false });
            setErrors({});
            return true;
        } catch (validationErrors) {
            const newErrors = {};
            validationErrors.inner.forEach(error => {
                const path = error.path.split('.');
                if (path.length === 1) {
                    newErrors[path[0]] = error.message;
                } else {
                    if (!newErrors[path[0]]) newErrors[path[0]] = {};
                    newErrors[path[0]][path[1]] = error.message;
                }
            });
            setErrors(newErrors);
            return false;
        }
    };

    const handleNext = async () => {
        const isValid = await validateCurrentStage();
        if (isValid && currentStage < 4) {
            setCurrentStage(currentStage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStage > 1) {
            setCurrentStage(currentStage - 1);
        }
    };

    const handleSubmit = async () => {
        const isValid = await validateCurrentStage();
        if (isValid) {
            console.log('Form submitted:', formData);
            // Handle form submission here
            alert('Form submitted successfully!');
        }
    };

    const renderStageProgress = () => (
        <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3, 4].map((stage) => (
                    <div key={stage} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStage >= stage
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                            }`}>
                            {stage}
                        </div>
                        {stage < 4 && (
                            <div className={`w-16 h-1 ${currentStage > stage ? 'bg-orange-500' : 'bg-gray-300'
                                }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <span className="text-sm text-gray-600">
                    Stage {currentStage} of 4: {
                        currentStage === 1 ? 'Personal Information' :
                            currentStage === 2 ? 'Parent Details' :
                                currentStage === 3 ? 'Academic & Health' :
                                    'Documents & Contact'
                    }
                </span>
            </div>
        </div>
    );

    const renderErrorMessage = (fieldPath) => {
        const pathArray = fieldPath.split('.');
        let error = errors;

        for (const path of pathArray) {
            error = error?.[path];
        }

        return error ? (
            <p className="text-red-500 text-xs mt-1">{error}</p>
        ) : null;
    };

    const renderStage1 = () => (
        <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                    <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                </div>
                <div className="p-6 space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Surname <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.surname}
                                onChange={(e) => handleInputChange('surname', e.target.value)}
                                placeholder="Type your surname"
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors placeholder-gray-400 ${errors.surname ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            />
                            {renderErrorMessage('surname')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                placeholder="Type your first name"
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors placeholder-gray-400 ${errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            />
                            {renderErrorMessage('firstName')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Middle Name
                            </label>
                            <Input
                                type="text"
                                value={formData.middleName}
                                onChange={(e) => handleInputChange('middleName', e.target.value)}
                                placeholder="Type your middle name"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Date of Birth and Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors ${errors.dateOfBirth ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            />
                            {renderErrorMessage('dateOfBirth')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors ${errors.gender ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            >
                                {genderOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {renderErrorMessage('gender')}
                        </div>
                    </div>

                    {/* Blood Group and Genotype */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Blood Group <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.bloodGroup}
                                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors ${errors.bloodGroup ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            >
                                {bloodGroupOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {renderErrorMessage('bloodGroup')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Genotype <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.genotype}
                                onChange={(e) => handleInputChange('genotype', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors ${errors.genotype ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            >
                                {genotypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {renderErrorMessage('genotype')}
                        </div>
                    </div>

                    {/* Location Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nationality <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.nationality}
                                onChange={(e) => handleInputChange('nationality', e.target.value)}
                                placeholder="Nationality"
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors placeholder-gray-400 ${errors.nationality ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            />
                            {renderErrorMessage('nationality')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State Of Origin <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.stateOfOrigin}
                                onChange={(e) => handleInputChange('stateOfOrigin', e.target.value)}
                                placeholder="State Of Origin"
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors placeholder-gray-400 ${errors.stateOfOrigin ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            />
                            {renderErrorMessage('stateOfOrigin')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Local Government <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.localGovernment}
                                onChange={(e) => handleInputChange('localGovernment', e.target.value)}
                                placeholder="Local Government Area"
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors placeholder-gray-400 ${errors.localGovernment ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            />
                            {renderErrorMessage('localGovernment')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Schooling Options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Schooling Options <span className="text-red-500">*</span>
                    </h2>
                </div>
                <div className="p-6">
                    <div className="flex gap-6">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="schoolingOption"
                                checked={formData.schoolingOption === 'boarding'}
                                onChange={(e) => handleInputChange('schoolingOption', 'boarding')}
                                className="mr-2"
                            />
                            Boarding School
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="schoolingOption"
                                checked={formData.schoolingOption === 'day'}
                                onChange={(e) => handleInputChange('schoolingOption', 'day')}
                                className="mr-2"
                            />
                            Day School
                        </label>
                    </div>
                    {renderErrorMessage('schoolingOption')}
                </div>
            </div>
        </div>
    );

    const renderStage2 = () => (
        <div className="space-y-6">
            {/* Father's Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="bg-orange-100 rounded-t-lg px-6 py-4 border-l-4 border-orange-400">
                    <h2 className="text-lg font-semibold text-gray-800">Father's Details</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Father's Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.father.name}
                                onChange={(e) => handleInputChange('name', e.target.value, 'father')}
                                placeholder="Type father's full name here"
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors placeholder-gray-400 ${errors.father?.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            />
                            {renderErrorMessage('father.name')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                            <input
                                type="text"
                                value={formData.father.occupation}
                                onChange={(e) => handleInputChange('occupation', e.target.value, 'father')}
                                placeholder="What is the father's occupation?"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Office Address</label>
                            <input
                                type="text"
                                value={formData.father.officeAddress}
                                onChange={(e) => handleInputChange('officeAddress', e.target.value, 'father')}
                                placeholder="Father's office address"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Home Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.father.homeAddress}
                                onChange={(e) => handleInputChange('homeAddress', e.target.value, 'father')}
                                placeholder="Father's home address"
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors placeholder-gray-400 ${errors.father?.homeAddress ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            />
                            {renderErrorMessage('father.homeAddress')}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Home Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.father.homePhone}
                                onChange={(e) => handleInputChange('homePhone', e.target.value, 'father')}
                                placeholder="Father's home phone"
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors placeholder-gray-400 ${errors.father?.homePhone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            />
                            {renderErrorMessage('father.homePhone')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                            <input
                                type="tel"
                                value={formData.father.whatsApp}
                                onChange={(e) => handleInputChange('whatsApp', e.target.value, 'father')}
                                placeholder="Father's whatsapp number"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                E-mail Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.father.email}
                                onChange={(e) => handleInputChange('email', e.target.value, 'father')}
                                placeholder="Father's e-mail address"
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors placeholder-gray-400 ${errors.father?.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                            />
                            {renderErrorMessage('father.email')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <HomeWrapper miniSlider title="Application Form">
            <h2 className='text-center'></h2>
            {renderStage1}
        </HomeWrapper>
    )
}




