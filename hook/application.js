// hook/application.js
import { useState } from "react";
import { useSubmitApplicationMutation } from "@/redux/slices/admissionSlice";
import { stage1Schema, stage2Schema, stage3Schema, stage4Schema } from "../app/(pages)/admissions/apply/components/yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useApplicationForm = () => {
    const router = useRouter();
    const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();
    const [currentStage, setCurrentStage] = useState(1);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        surname: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        genotype: '',
        nationality: 'Nigeria',
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
            // email: ''
        },

        // Mother's Details
        mother: {
            name: '',
            occupation: '',
            officeAddress: '',
            homeAddress: '',
            homePhone: '',
            whatsApp: '',
            // email: ''
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

        
            correspondenceEmail: '',
            howDidYouKnow: ''
        
    });
    console.log(errors)
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

    const handleFileChange = (fieldName, file) => {
        handleInputChange(fieldName, file, 'documents');
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
                    correspondenceEmail: formData.correspondenceEmail,
                    howDidYouKnow: formData.howDidYouKnow
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
        if (!isValid) {
            toast.error("Please fill all required fields correctly");
            return;
        }

        try {
            // Create FormData for file upload
            const submitData = new FormData();

            // Add all text fields
            Object.keys(formData).forEach(key => {
                if (key === 'documents') {
                    // Handle file uploads
                    Object.keys(formData.documents).forEach(docKey => {
                        if (formData.documents[docKey]) {
                            submitData.append(docKey, formData.documents[docKey]);
                        }
                    });
                } else if (typeof formData[key] === 'object') {
                    // Handle nested objects (father, mother, etc.)
                    submitData.append(key, JSON.stringify(formData[key]));
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            // Submit the application
            const result = await submitApplication(formData).unwrap();

            // Show success message
            toast.success("Application submitted successfully!");

            // Redirect to success page with application reference
            router.push(`/portals/parent/admissions?ref=${result.data.applicationRef}`);

        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error?.data?.message || "Failed to submit application. Please try again.");
        }
    };

    return {
        handleInputChange,
        handleFileChange,
        handleNext,
        handlePrevious,
        handleSubmit,
        validateCurrentStage,
        handleVaccinationChange,
        setCurrentStage,
        setErrors,
        setFormData,
        // data
        formData,
        errors,
        currentStage,
        isSubmitting
    }
}

export default useApplicationForm;