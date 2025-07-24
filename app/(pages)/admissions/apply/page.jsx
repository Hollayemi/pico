"use client"
import React, { useState } from 'react';
import HomeWrapper from '@/app/components/wrapper';
import * as Yup from 'yup';
import Button from '@/app/components/Form/Button';
import RenderStage1 from './components/stages/stage1';
import useApplicationForm from '@/app/hook/application';
import RenderStage2 from './components/stages/stage2';


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


export default function ApplicationForm() {
    const {
        handleInputChange,
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
        currentStage
    } = useApplicationForm()

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



    return (
        <HomeWrapper miniSlider title="Application Form">
            <div className="mx-auto max-w-5xl pb-10">
                <h2 className='text-center text-2xl font-black mb-6'>ADMISSION FORM</h2>
                {renderStageProgress()}
                {currentStage == 1 && <RenderStage1
                    formData={formData}
                    errors={errors}
                    renderErrorMessage={renderErrorMessage}
                    handleInputChange={handleInputChange}
                />}
                {currentStage == 2 && <RenderStage2
                    formData={formData}
                    errors={errors}
                    renderErrorMessage={renderErrorMessage}
                    handleInputChange={handleInputChange}
                />}


                <div className='flex justify-between items-center py-5'>
                    <Button className="w-32 py-3" variant={currentStage === 1 ? "disabled" : "primary"} onClick={handlePrevious} disabled={currentStage === 1} title="Previoud" />
                    <Button className="w-32 py-3" onClick={handleNext} title="Next" />
                </div>

            </div>
        </HomeWrapper>
    )
}




