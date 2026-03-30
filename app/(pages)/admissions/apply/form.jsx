"use client"
import React, { useState } from 'react';
import HomeWrapper from '@/app/components/wrapper';
import Button from '@/app/components/Form/Button';
import RenderStage1 from './components/stages/stage1';
import useApplicationForm from '@/hook/application';
import RenderStage2 from './components/stages/stage2';
import RenderStage3 from './components/stages/stage3';
import RenderStage4 from './components/stages/stage4';
import { AlertCircle, X, ChevronDown, ChevronRight } from 'lucide-react';

// ─── Error Modal ──────────────────────────────────────────────────────────────
const ErrorModal = ({ errors, onClose }) => {
    const [expanded, setExpanded] = useState(true);

    // Flatten nested errors to a readable list
    const flattenErrors = (obj, prefix = '') => {
        const messages = [];
        if (!obj || typeof obj !== 'object') return messages;
        Object.entries(obj).forEach(([key, value]) => {
            const fieldName = prefix
                ? `${prefix} › ${key.charAt(0).toUpperCase() + key.slice(1)}`
                : key.charAt(0).toUpperCase() + key.slice(1);
            if (typeof value === 'string') {
                messages.push({ field: fieldName, message: value });
            } else if (typeof value === 'object') {
                messages.push(...flattenErrors(value, fieldName));
            }
        });
        return messages;
    };

    const errorList = flattenErrors(errors);
    if (!errorList.length) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-red-500 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Please fix the following</p>
                            <p className="text-red-100 text-xs">{errorList.length} field{errorList.length !== 1 ? 's' : ''} require attention</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Error list */}
                <div className="p-5 max-h-72 overflow-y-auto space-y-2">
                    {errorList.map((err, i) => (
                        <div key={i} className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-red-700">{err.field}</p>
                                <p className="text-xs text-red-600">{err.message}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors"
                    >
                        Fix Errors
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function ApplicationForm() {
    const [showErrorModal, setShowErrorModal] = useState(false);

    const {
        handleInputChange,
        handleFileChange,
        handleNext,
        handlePrevious,
        handleVaccinationChange,
        handleSubmit,
        formData,
        errors,
        currentStage
    } = useApplicationForm();

    // Show error modal whenever errors change (and there are errors)
    const hasErrors = Object.keys(errors).length > 0;

    const renderStageProgress = () => (
        <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3, 4].map((stage) => (
                    <div key={stage} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            currentStage >= stage ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                            {stage}
                        </div>
                        {stage < 4 && (
                            <div className={`w-16 h-1 ${currentStage > stage ? 'bg-orange-500' : 'bg-gray-300'}`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <span className="text-sm text-gray-600">
                    Stage {currentStage} of 4:{' '}
                    {currentStage === 1 ? 'Personal Information' :
                     currentStage === 2 ? 'Parent Details' :
                     currentStage === 3 ? 'Academic & Health' :
                     'Documents & Contact'}
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
        return error ? <p className="text-red-500 text-xs mt-1">{error}</p> : null;
    };

    // Wrap handleNext/handleSubmit to show modal on validation failure
    const handleNextWithModal = async () => {
        await handleNext();
        // If errors were set, show modal
        setTimeout(() => {
            if (Object.keys(errors).length > 0) setShowErrorModal(true);
        }, 100);
    };

    const handleSubmitWithModal = async () => {
        await handleSubmit();
        setTimeout(() => {
            if (Object.keys(errors).length > 0) setShowErrorModal(true);
        }, 100);
    };

    return (
        <div className="mx-auto px-1 max-w-5xl pb-10">
            <h2 className='text-center text-2xl font-black mb-6'>ADMISSION FORM</h2>
            {renderStageProgress()}

            {/* Inline error banner (collapsed) */}
            {hasErrors && (
                <div
                    onClick={() => setShowErrorModal(true)}
                    className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-red-100 transition-colors"
                >
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700 flex-1">
                        <span className="font-semibold">{Object.keys(errors).length} field{Object.keys(errors).length !== 1 ? 's' : ''} need attention.</span>{' '}
                        Click to view details.
                    </p>
                    <ChevronRight className="w-4 h-4 text-red-400" />
                </div>
            )}

            {currentStage === 1 && <RenderStage1
                formData={formData}
                errors={errors}
                renderErrorMessage={renderErrorMessage}
                handleInputChange={handleInputChange}
            />}
            {currentStage === 2 && <RenderStage2
                formData={formData}
                errors={errors}
                renderErrorMessage={renderErrorMessage}
                handleInputChange={handleInputChange}
            />}
            {currentStage === 3 && <RenderStage3
                formData={formData}
                errors={errors}
                renderErrorMessage={renderErrorMessage}
                handleInputChange={handleInputChange}
                handleVaccinationChange={handleVaccinationChange}
            />}
            {currentStage === 4 && <RenderStage4
                formData={formData}
                errors={errors}
                renderErrorMessage={renderErrorMessage}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
            />}

            <div className='flex justify-between items-center py-5'>
                <Button
                    className="w-32 py-3"
                    variant={currentStage === 1 ? "disabled" : "primary"}
                    onClick={handlePrevious}
                    disabled={currentStage === 1}
                    title="Previous"
                />
                {currentStage !== 4 && (
                    <Button
                        className="w-32 py-3"
                        onClick={handleNextWithModal}
                        title="Next"
                    />
                )}
                {currentStage === 4 && (
                    <Button
                        className="w-32 py-3"
                        onClick={handleSubmitWithModal}
                        title="Submit"
                    />
                )}
            </div>

            {/* Error Modal */}
            {showErrorModal && hasErrors && (
                <ErrorModal
                    errors={errors}
                    onClose={() => setShowErrorModal(false)}
                />
            )}
        </div>
    );
}
