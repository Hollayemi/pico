"use client"
import React, { useState } from 'react';
import HomeWrapper from '@/app/components/wrapper';
import * as Yup from 'yup';
import Button from '@/app/components/Form/Button';
import RenderStage1 from './components/stages/stage1';
import useApplicationForm from '@/hook/application';
import RenderStage2 from './components/stages/stage2';
import RenderStage3 from './components/stages/stage3';
import RenderStage4 from './components/stages/stage4';


export default function ApplicationForm() {
    const {
        handleInputChange,
        handleFileChange,
        handleNext,
        handlePrevious,
        handleVaccinationChange,
        handleSubmit,

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
            <div className="mx-auto px-1 max-w-5xl pb-10">
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
                {currentStage == 3 && <RenderStage3
                    formData={formData}
                    errors={errors}
                    renderErrorMessage={renderErrorMessage}
                    handleInputChange={handleInputChange}
                    handleVaccinationChange={handleVaccinationChange}
                />}

                {currentStage == 4 && <RenderStage4
                    formData={formData}
                    renderErrorMessage={renderErrorMessage}
                    handleInputChange={handleInputChange}
                    handleFileChange={handleFileChange}
                />}


                <div className='flex justify-between items-center py-5'>
                    <Button className="w-32 py-3" variant={currentStage === 1 ? "disabled" : "primary"} onClick={handlePrevious} disabled={currentStage === 1} title="Previoud" />
                    {currentStage !== 4 && <Button className="w-32 py-3" onClick={handleNext} title="Next" />}
                    {currentStage === 4 && <Button className="w-32 py-3" onClick={handleSubmit} title="Submit" />}
                </div>

            </div>
    )
}




