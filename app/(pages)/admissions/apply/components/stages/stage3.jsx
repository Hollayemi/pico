const RenderStage3 = ({ formData, renderErrorMessage, handleInputChange, errors }) => (
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
                            className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 transition-colors ${renderErrorMessage('classPreferences.classInterestedIn')
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
                        {renderErrorMessage('classPreferences.classInterestedIn') && (
                            <p className="text-red-500 text-xs mt-1">{renderErrorMessage('classPreferences.classInterestedIn')}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
);


export default RenderStage3