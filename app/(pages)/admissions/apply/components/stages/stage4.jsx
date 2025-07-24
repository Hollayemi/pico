const RenderStage4 = ({ formData, renderErrorMessage, handleInputChange, handleFileChange, errors }) => (
    <>


        {/* Supporting Documents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="bg-brand-100 rounded-t-lg px-6 py-4 border-l-4 border-brand-400">
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
                                {label} {required && <span className="text-red-500">*</span>}
                            </label>
                            <div className={`flex items-center ${renderErrorMessage(`documents.${key}`) ? 'border-red-300' : ''}`}>
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
                            {renderErrorMessage(`documents.${key}`) && (
                                <p className="text-red-500 text-xs mt-1">{renderErrorMessage(`documents.${key}`)}</p>
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
                        Correspondence Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={formData.correspondenceEmail}
                        onChange={(e) => handleInputChange('correspondenceEmail', e.target.value, contact)}
                        placeholder="Enter an email address with which we can contact you"
                        className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 transition-colors placeholder-gray-400 ${renderErrorMessage('correspondenceEmail')
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-brand-300 focus:ring-brand-500 focus:border-brand-500'
                            }`}
                    />
                    {renderErrorMessage('correspondenceEmail') && (
                        <p className="text-red-500 text-xs mt-1">{renderErrorMessage('correspondenceEmail')}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How did you know about our school?</label>
                    <textarea
                        value={formData.howDidYouKnow}
                        onChange={(e) => handleInputChange('howDidYouKnow', e.target.value, 'contact')}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>
        </div>
    </>
);

export default RenderStage4