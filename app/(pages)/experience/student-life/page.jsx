'use client'
import React, { useState } from 'react';
import { Clock, Calendar, Users, BookOpen, Monitor, Trophy, Music, Wrench, MessageCircle, Church, Moon } from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';

const StudentLifeSchedule = () => {
    const [selectedView, setSelectedView] = useState('daily');
    const [selectedDay, setSelectedDay] = useState('monday');

    const dailySchedule = {
        morning: [
            { time: '6:00 AM', activity: 'Wake Up & Personal Hygiene', icon: <Clock className="w-4 h-4" />, type: 'boarding' },
            { time: '6:30 AM', activity: 'Morning Exercise/Jogging', icon: <Trophy className="w-4 h-4" />, type: 'boarding' },
            { time: '7:00 AM', activity: 'Breakfast', icon: <Users className="w-4 h-4" />, type: 'all' },
            { time: '7:30 AM', activity: 'Morning Devotion', icon: <Church className="w-4 h-4" />, type: 'all' },
            { time: '8:00 AM', activity: 'School Assembly', icon: <Users className="w-4 h-4" />, type: 'all', highlight: true },
            { time: '8:30 AM', activity: 'First Period Classes Begin', icon: <BookOpen className="w-4 h-4" />, type: 'all', highlight: true }
        ],
        midday: [
            { time: '10:30 AM', activity: 'Short Break', icon: <Clock className="w-4 h-4" />, type: 'all' },
            { time: '10:45 AM', activity: 'Classes Continue', icon: <BookOpen className="w-4 h-4" />, type: 'all' },
            { time: '12:30 PM', activity: 'Lunch Break', icon: <Users className="w-4 h-4" />, type: 'all' },
            { time: '1:30 PM', activity: 'Afternoon Classes', icon: <BookOpen className="w-4 h-4" />, type: 'all' },
            { time: '2:30 PM', activity: 'Computer Training', icon: <Monitor className="w-4 h-4" />, type: 'all', highlight: true }
        ],
        afternoon: [
            { time: '3:30 PM', activity: 'Classes End for Day Students', icon: <Clock className="w-4 h-4" />, type: 'day' },
            { time: '4:00 PM', activity: 'Special Activities (Varies by Day)', icon: <Calendar className="w-4 h-4" />, type: 'all', highlight: true },
            { time: '5:30 PM', activity: 'Dinner', icon: <Users className="w-4 h-4" />, type: 'boarding' },
            { time: '6:30 PM', activity: 'Prep Time/Study Hour', icon: <BookOpen className="w-4 h-4" />, type: 'boarding' },
            { time: '8:30 PM', activity: 'Social Time/Recreation', icon: <Users className="w-4 h-4" />, type: 'boarding' },
            { time: '9:30 PM', activity: 'Bedtime Preparation', icon: <Moon className="w-4 h-4" />, type: 'boarding' },
            { time: '10:00 PM', activity: 'Lights Out', icon: <Moon className="w-4 h-4" />, type: 'boarding' }
        ]
    };

    const weeklyActivities = {
        monday: {
            title: 'Regular Academic Day',
            special: 'Focus on Core Subjects',
            activities: [
                // { time: '4:00 PM', activity: 'Mathematics Club', icon: <BookOpen className="w-4 h-4" /> },
                // { time: '4:30 PM', activity: 'Library Study Time', icon: <BookOpen className="w-4 h-4" /> }
            ],
            color: 'bg-brand-400'
        },
        tuesday: {
            title: 'Sports Day',
            special: 'Physical Education & Sports',
            activities: [
                { time: '4:00 PM', activity: 'Football Training', icon: <Trophy className="w-4 h-4" /> },
                { time: '4:00 PM', activity: 'Basketball Practice', icon: <Trophy className="w-4 h-4" /> },
                { time: '4:00 PM', activity: 'Track & Field', icon: <Trophy className="w-4 h-4" /> },
            ],
            color: 'bg-brand-400'
        },
        wednesday: {
            title: 'Social Activities Day',
            special: 'Cultural & Social Development',
            activities: [
                { time: '4:00 PM', activity: 'Drama Club', icon: <Music className="w-4 h-4" /> },
                { time: '4:00 PM', activity: 'Music & Choir Practice', icon: <Music className="w-4 h-4" /> },
                { time: '4:00 PM', activity: 'Art & Craft Workshop', icon: <Music className="w-4 h-4" /> },
                { time: '4:00 PM', activity: 'Cultural Dance', icon: <Music className="w-4 h-4" /> }
            ],
            color: 'bg-brand-400'
        },
        thursday: {
            title: 'Vocational Training Day',
            special: 'Practical Skills Development',
            activities: [
                { time: '4:00 PM', activity: 'Photography', icon: <Monitor className="w-4 h-4" /> },
                { time: '4:00 PM', activity: 'Baking and Cooking', icon: <Wrench className="w-4 h-4" /> },
                { time: '4:00 PM', activity: 'Tailoring & Fashion Design', icon: <Wrench className="w-4 h-4" /> },
                { time: '4:00 PM', activity: 'Shoe Making', icon: <Wrench className="w-4 h-4" /> },
                { time: '4:00 PM', activity: 'Tie And Die', icon: <Wrench className="w-4 h-4" /> }
            ],
            color: 'bg-brand-400'
        },
        friday: {
            title: 'Intellectual Development Day',
            special: 'Debate, Quiz & Literary Activities',
            activities: [
                { time: '2:00 PM', activity: 'Debate Club Meeting', icon: <MessageCircle className="w-4 h-4" /> },
                { time: '2:00 PM', activity: 'Quiz Competition Prep', icon: <MessageCircle className="w-4 h-4" /> },
                { time: '2:00 PM', activity: 'Creative Writing Workshop', icon: <BookOpen className="w-4 h-4" /> },
                { time: '2:00 PM', activity: 'Public Speaking Practice', icon: <MessageCircle className="w-4 h-4" /> }
            ],
            color: 'bg-brand-400'
        },
        saturday: {
            title: 'Study & Recreation Day',
            special: 'Boarding Students Activities',
            activities: [
                { time: '8:00 AM', activity: 'Extended Study Period', icon: <BookOpen className="w-4 h-4" /> },
                { time: '10:00 AM', activity: 'Group Study Sessions', icon: <Users className="w-4 h-4" /> },
                { time: '12:00 PM', activity: 'Lunch Break', icon: <Users className="w-4 h-4" /> },
                { time: '2:00 PM', activity: 'Free Time/Rest', icon: <Clock className="w-4 h-4" /> },
                { time: '4:00 PM', activity: 'Outdoor / Indoor Games & Recreation', icon: <Trophy className="w-4 h-4" /> },
                { time: '6:00 PM', activity: 'Dinner', icon: <Users className="w-4 h-4" /> },
                { time: '7:30 PM', activity: 'Evening Prep (Light Study)', icon: <BookOpen className="w-4 h-4" /> }
            ],
            color: 'bg-brand-400',
            boarding: true
        },
        sunday: {
            title: 'Spiritual & Social Day',
            special: 'Boarding Students Activities',
            activities: [
                { time: '8:00 AM', activity: 'Church Service', icon: <Church className="w-4 h-4" /> },
                { time: '10:30 AM', activity: 'Sunday School', icon: <Church className="w-4 h-4" /> },
                { time: '12:00 PM', activity: 'Lunch & Rest Time', icon: <Users className="w-4 h-4" /> },
                { time: '3:00 PM', activity: 'Family Time/Visiting', icon: <Users className="w-4 h-4" /> },
                { time: '5:00 PM', activity: 'Social Activities & Games', icon: <Music className="w-4 h-4" /> },
                { time: '6:00 PM', activity: 'Dinner', icon: <Users className="w-4 h-4" /> },
                { time: '7:30 PM', activity: 'Evening Prep (Light Study)', icon: <BookOpen className="w-4 h-4" /> }
            ],
            color: 'bg-brand-400',
            boarding: true
        }
    };

    const ActivityCard = ({ time, activity, icon, type, highlight = false }) => (
        <div className={`flex items-center space-x-4 p-4 rounded-lg border ${highlight ? 'bg-brand-50 border-brand-200' : 'bg-white border-gray-200'
            } ${type === 'boarding' ? 'border-l-4 border-l-brand-400' : type === 'day' ? 'border-l-4 border-l-green-400' : ''}`}>
            <div className="flex-shrink-0">
                <div className={`p-2 rounded-full ${highlight ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-600'}`}>
                    {icon}
                </div>
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className={`font-medium ${highlight ? 'text-brand-800' : 'text-gray-800'}`}>{activity}</p>
                    <span className="text-base text-gray-500 font-mono">{time}</span>
                </div>
                {type && (
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${type === 'boarding' ? 'bg-brand-100 text-brand-700' :
                            type === 'day' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                        }`}>
                        {type === 'boarding' ? 'Boarding Students' : type === 'day' ? 'Day Students' : 'All Students'}
                    </span>
                )}
            </div>
        </div>
    );

    const WeeklyActivityCard = ({ day, data }) => (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className={`${data.color} text-white p-4`}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold capitalize">{day}</h3>
                    {data.boarding && (
                        <span className="bg-black bg-opacity-20 px-2 py-1 rounded-full text-xs">
                            Boarding Only
                        </span>
                    )}
                </div>
                <p className="text-base opacity-90">{data.title}</p>
                <p className="text-xs opacity-75 mt-1">{data.special}</p>
            </div>
            <div className="p-4 space-y-3">
                {data.activities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <div className="p-1.5 bg-gray-100 rounded-full text-gray-600">
                                {activity.icon}
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-base font-medium text-gray-800">{activity.activity}</p>
                            <p className="text-xs text-gray-500 font-mono">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <HomeWrapper miniSlider title="Student Life At Our School">
            <div className="max-w-7xl mx-auto p-6  min-h-screen">
                <div className="mb-8  max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Student Life at Our School</h1>
                    <p className="text-lg text-center text-gray-600 mb-6">
                        Experience a well-structured daily routine designed to nurture academic excellence,
                        character development, and holistic growth for both day and boarding students.
                    </p>

                    {/* View Toggle */}
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={() => setSelectedView('daily')}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedView === 'daily'
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Daily Schedule
                        </button>
                        <button
                            onClick={() => setSelectedView('weekly')}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedView === 'weekly'
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Weekly Activities
                        </button>
                    </div>
                </div>

                {selectedView === 'daily' && (
                    <div className="space-y-8">
                        {/* Legend */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-800 mb-3">Student Categories</h3>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-brand-400 rounded"></div>
                                    <span className="text-base text-gray-700">Boarding Students</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-green-400 rounded"></div>
                                    <span className="text-base text-gray-700">Day Students</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                                    <span className="text-base text-gray-700">All Students</span>
                                </div>
                            </div>
                        </div>

                        {/* Morning Schedule */}
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-brand-400 to-brand-600 text-white p-6">
                                <h2 className="text-2xl font-bold flex items-center">
                                    <Clock className="w-6 h-6 mr-3" />
                                    Morning Schedule (6:00 AM - 12:30 PM)
                                </h2>
                                <p className="opacity-90 mt-2">Starting the day with structure and purpose</p>
                            </div>
                            <div className="p-6 space-y-4">
                                {dailySchedule.morning.map((item, index) => (
                                    <ActivityCard key={index} {...item} />
                                ))}
                            </div>
                        </div>

                        {/* Midday Schedule */}
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-brand-400 to-brand-600 text-white p-6">
                                <h2 className="text-2xl font-bold flex items-center">
                                    <BookOpen className="w-6 h-6 mr-3" />
                                    Midday Schedule (12:30 PM - 4:00 PM)
                                </h2>
                                <p className="opacity-90 mt-2">Academic focus and skill development</p>
                            </div>
                            <div className="p-6 space-y-4">
                                {dailySchedule.midday.map((item, index) => (
                                    <ActivityCard key={index} {...item} />
                                ))}
                            </div>
                        </div>

                        {/* Afternoon/Evening Schedule */}
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-brand-400 to-brand-600 text-white p-6">
                                <h2 className="text-2xl font-bold flex items-center">
                                    <Moon className="w-6 h-6 mr-3" />
                                    Afternoon & Evening (4:00 PM - 10:00 PM)
                                </h2>
                                <p className="opacity-90 mt-2">Extracurricular activities and rest</p>
                            </div>
                            <div className="p-6 space-y-4">
                                {dailySchedule.afternoon.map((item, index) => (
                                    <ActivityCard key={index} {...item} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selectedView === 'weekly' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Special Activities</h2>
                            <p className="text-gray-600 mb-4">
                                Each day of the week features unique activities designed to develop different aspects of student life:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                                    <span>Sports & Physical Education</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-brand-500 rounded"></div>
                                    <span>Arts & Cultural Activities</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-brand-500 rounded"></div>
                                    <span>Vocational Training</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                                    <span>Academic Enhancement</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(weeklyActivities).map(([day, data]) => (
                                <WeeklyActivityCard key={day} day={day} data={data} />
                            ))}
                        </div>

                        {/* Additional Information */}
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-brand-800 to-brand-600 text-white p-6">
                                <h3 className="text-xl font-bold">Important Notes</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">For Day Students</h4>
                                        <ul className="space-y-2 text-base text-gray-600">
                                            <li>• School hours: 8:00 AM - 3:30 PM</li>
                                            <li>• Lesson: 4:00 PM - 5:30 PM (Optional)</li>
                                            <li>• Transport provided for late activities</li>
                                            <li>• Weekend activities are optional</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">For Boarding Students</h4>
                                        <ul className="space-y-2 text-base text-gray-600">
                                            <li>• 24/7 supervised care and guidance</li>
                                            <li>• Structured study time and recreation</li>
                                            <li>• Weekend programs for holistic development</li>
                                            <li>• Regular communication with parents</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </HomeWrapper>
    );
};

export default StudentLifeSchedule;