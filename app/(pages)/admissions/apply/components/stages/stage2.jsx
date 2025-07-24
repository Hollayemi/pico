const RenderStage2 = ({ formData, renderErrorMessage, handleInputChange, errors }) => (
    <div className="space-y-6">
        {/* Father's Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-brand-100 rounded-t-lg px-6 py-4 border-l-4 border-brand-400">
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors placeholder-gray-400 ${errors.father?.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
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
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-400"
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
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-400"
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors placeholder-gray-400 ${errors.father?.homeAddress ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors placeholder-gray-400 ${errors.father?.homePhone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
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
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-400"
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors placeholder-gray-400 ${errors.father?.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
                                }`}
                        />
                        {renderErrorMessage('father.email')}
                    </div>

                </div>
            </div>
        </div>

        {/* Mother's Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="bg-brand-100 rounded-t-lg px-6 py-4 border-l-4 border-brand-400">
                <h2 className="text-lg font-semibold text-gray-800">Mother's Details:</h2>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mother's Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.mother.name}
                            onChange={(e) => handleInputChange('name', e.target.value, 'mother')}
                            placeholder="Type mother's full name here"
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 transition-colors placeholder-gray-400 ${renderErrorMessage('name')
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-brand-300 focus:ring-brand-500 focus:border-brand-500'
                                }`}
                        />
                        {renderErrorMessage('name') && (
                            <p className="text-red-500 text-xs mt-1">{renderErrorMessage('name')}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                        <input
                            type="text"
                            value={formData.mother.occupation}
                            onChange={(e) => handleInputChange('occupation', e.target.value, 'mother')}
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
                            value={formData.mother.officeAddress}
                            onChange={(e) => handleInputChange('officeAddress', e.target.value, 'mother')}
                            placeholder="Mother's office address"
                            className="w-full px-4 py-3 border-2 border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Home Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.mother.homeAddress}
                            onChange={(e) => handleInputChange('homeAddress', e.target.value, 'mother')}
                            placeholder="Mother's home address"
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 transition-colors placeholder-gray-400 ${renderErrorMessage('homeAddress')
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-brand-300 focus:ring-brand-500 focus:border-brand-500'
                                }`}
                        />
                        {renderErrorMessage('homeAddress') && (
                            <p className="text-red-500 text-xs mt-1">{renderErrorMessage('homeAddress')}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Home Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={formData.mother.homePhone}
                            onChange={(e) => handleInputChange('homePhone', e.target.value, 'mother')}
                            placeholder="Mother's home phone"
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 transition-colors placeholder-gray-400 ${renderErrorMessage('homePhone')
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-brand-300 focus:ring-brand-500 focus:border-brand-500'
                                }`}
                        />
                        {renderErrorMessage('homePhone') && (
                            <p className="text-red-500 text-xs mt-1">{renderErrorMessage('homePhone')}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                        <input
                            type="tel"
                            value={formData.mother.whatsApp}
                            onChange={(e) => handleInputChange('whatsApp', e.target.value, 'mother')}
                            placeholder="Mother's whatsapp number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            E-mail Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.mother.email}
                            onChange={(e) => handleInputChange('email', e.target.value, 'mother')}
                            placeholder="Mother's e-mail address"
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 transition-colors placeholder-gray-400 ${renderErrorMessage('email')
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-brand-300 focus:ring-brand-500 focus:border-brand-500'
                                }`}
                        />
                        {renderErrorMessage('email') && (
                            <p className="text-red-500 text-xs mt-1">{renderErrorMessage('email')}</p>
                        )}
                    </div>
                </div>
            </div>


        </div>
    </div>
)

export default RenderStage2