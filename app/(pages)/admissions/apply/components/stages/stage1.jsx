import { bloodGroupOptions, genderOptions, genotypeOptions } from "..";

const { default: Input } = require("@/app/components/Form/Input");

const RenderStage1 = ({ formData, renderErrorMessage, handleInputChange, errors }) => (
    <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-brand-100 rounded-t-lg px-6 py-4 border-l-4 border-brand-400">
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors placeholder-gray-400 ${errors.surname ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors placeholder-gray-400 ${errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
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
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-400"
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors ${errors.dateOfBirth ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors ${errors.gender ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors ${errors.bloodGroup ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors ${errors.genotype ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors placeholder-gray-400 ${errors.nationality ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors placeholder-gray-400 ${errors.stateOfOrigin ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-brand-500 transition-colors placeholder-gray-400 ${errors.localGovernment ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
                                }`}
                        />
                        {renderErrorMessage('localGovernment')}
                    </div>
                </div>
            </div>
        </div>

        {/* Schooling Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-brand-100 rounded-t-lg px-6 py-4 border-l-4 border-brand-400">
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

export default RenderStage1