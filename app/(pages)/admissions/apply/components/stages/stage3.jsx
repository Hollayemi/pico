import { useGetAllClassesQuery } from "@/redux/slices/academicsSlice";

const RenderStage3 = ({ formData, renderErrorMessage, handleInputChange, handleVaccinationChange, errors }) => {
    const { data, isLoading } = useGetAllClassesQuery()

    let classes = []
    data?.data?.classes?.map(e => !classes.includes(e.group) && classes.push(e.group)) || []

    return (
        <>
            {/* Record Of Schools Attended */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="bg-brand-100 rounded-t-lg px-6 py-4 border-l-4 border-brand-400">
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
                                    value={formData.schools[`school${num}`]}
                                    onChange={(e) => handleInputChange(`school${num}`, e.target.value, 'schools')}
                                    placeholder={num === 1 ? "First school attended" : num === 2 ? "Second school attended" : "Third school attended"}
                                    className={`w-full px-4 py-3 border-2 border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-400`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    School {num} Attendance Date:
                                </label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="month"
                                        value={formData.schools[`school${num}StartDate`]}
                                        onChange={(e) => handleInputChange(`school${num}StartDate`, e.target.value, 'schools')}
                                        placeholder="Start Date"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 text-sm"
                                    />
                                    <span className="text-gray-500 text-sm">to</span>
                                    <input
                                        type="month"
                                        value={formData.schools[`school${num}EndDate`]}
                                        onChange={(e) => handleInputChange(`school${num}EndDate`, e.target.value, 'schools')}
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
                <div className="bg-brand-100 rounded-t-lg px-6 py-4 border-l-4 border-brand-400">
                    <h2 className="text-lg font-semibold text-gray-800">Class Preferences</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Present Class</label>
                            <select
                                value={formData.classPreferences.presentClass}
                                onChange={(e) => handleInputChange('presentClass', e.target.value, "classPreferences")}
                                className="w-full px-4 py-3 border-2 border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                            >
                                <option value="">Which Class</option>
                                {classes.map((e, i) =>
                                    <option key={i} value={e}>{e}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class Into Which Admission Is Sought <span className="text-brand-500 text-xs">[compulsory]</span>
                            </label>
                            <select
                                value={formData.classPreferences.classInterestedIn}
                                onChange={(e) => handleInputChange('classInterestedIn', e.target.value, "classPreferences")}
                                className={`w-full px-4 py-3 border-2 rounded-md focus:ring-2 transition-colors ${renderErrorMessage('classPreferences.classInterestedIn')
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-brand-300 focus:ring-brand-500 focus:border-brand-500'
                                    }`}
                            >
                                <option value="">Which Class</option>
                                {classes.map((e, i) =>
                                    <option key={i} value={e}>{e}</option>
                                )}
                            </select>
                            {renderErrorMessage('classPreferences.classInterestedIn') && (
                                <p className="text-red-500 text-xs mt-1">{renderErrorMessage('classPreferences.classInterestedIn')}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Challenges */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="bg-brand-100 rounded-t-lg px-6 py-4 border-l-4 border-brand-400">
                    <h2 className="text-lg font-semibold text-gray-800">Health Challenges</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Record Of Infectious (If Any)</label>
                            <textarea
                                value={formData.health.infectiousDisease}
                                onChange={(e) => handleInputChange('infectiousDisease', e.target.value, 'health')}
                                placeholder="Please indicate any infectious diseases that this child might have had"
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Food Allergy</label>
                            <textarea
                                value={formData.health.foodAllergy}
                                onChange={(e) => handleInputChange('foodAllergy', e.target.value, 'health')}
                                placeholder="What food allergy does this child have?"
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default RenderStage3
