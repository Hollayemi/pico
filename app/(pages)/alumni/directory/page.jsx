"use client"
import React, { useState } from 'react';
import {
    Users, Award, Calendar, MapPin, Briefcase, GraduationCap,
    Heart, Star, ChevronRight, Mail, Phone, Linkedin,
    Trophy, Building, Globe, ArrowRight, X, Filter
} from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';

const AlumniPage = () => {
    const [selectedAlumni, setSelectedAlumni] = useState(null);
    const [selectedYear, setSelectedYear] = useState('All');
    const [selectedField, setSelectedField] = useState('All');

    const featuredAlumni = [
        {
            id: 1,
            name: "Oluwasusi Stephen",
            graduationYear: "2017",
            currentPosition: "Senior Software Developer at Givitec",
            company: "Adekunle Ajasin University",
            field: "Computer Science",
            location: "Lagos, Nigeria",
            image: "/images/stephen.jpeg",
            achievements: [
                "*** ***",
                "*** ***",
                "*** ***"
            ],
            quote: "The foundation I received here shaped my dedication to serving others.",
            email: "stephen@gmail.com",
            linkedin: "stephanyemmitty",
            story: "Oluwasusi Stephen graduated in year 2017 and has since become one of Nigeria's most respected Developer. His journey from our classrooms to founding a company to make life easier"
        },
        {
            id: 2,
            name: "Engr. Michael Okonkwo",
            graduationYear: "2010",
            currentPosition: "Senior Software Engineer",
            company: "Microsoft Corporation",
            field: "Technology",
            location: "Seattle, USA",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            achievements: [
                "Lead Developer for Microsoft Teams",
                "Patent holder in AI communications",
                "Tech Innovation Award 2022"
            ],
            quote: "The problem-solving skills I learned here became the cornerstone of my tech career.",
            email: "m.okonkwo@microsoft.com",
            linkedin: "michael-okonkwo-eng",
            story: "Michael's passion for technology was evident during his time here. Today, he leads critical projects at Microsoft and regularly mentors young Nigerian developers through various tech initiatives."
        },
        {
            id: 3,
            name: "Barr. Amina Hassan",
            graduationYear: "2006",
            currentPosition: "Senior Partner",
            company: "Hassan & Associates Law Firm",
            field: "Law",
            location: "Abuja, Nigeria",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
            achievements: [
                "Successfully argued 50+ Supreme Court cases",
                "Human Rights Advocate of the Year 2021",
                "Founded free legal aid clinic"
            ],
            quote: "The values of justice and integrity instilled here guide every case I take on.",
            email: "amina@hassanlaw.ng",
            linkedin: "amina-hassan-law",
            story: "Amina has become one of Nigeria's most prominent human rights lawyers, using her platform to defend the underprivileged and advocate for social justice across the country."
        },
        {
            id: 4,
            name: "Prof. David Igwe",
            graduationYear: "2005",
            currentPosition: "Professor of Economics",
            company: "OAU-IFE",
            field: "Academia",
            location: "Ife, Osun State",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            achievements: [
                "Youngest African professor at OAU",
                "Published 3 acclaimed economics books",
                "Economic Policy Advisor to World Bank"
            ],
            quote: "The critical thinking skills developed here opened doors to academic excellence worldwide.",
            email: "d.igwe@cam.ac.uk",
            linkedin: "prof-david-igwe",
            story: "David's academic journey from our school to OAU represents the pinnacle of scholarly achievement. His research on African economic development continues to influence global policy."
        },
        {
            id: 5,
            name: "Mrs. Grace Okoro",
            graduationYear: "2009",
            currentPosition: "Creative Director",
            company: "Okoro Fashion House",
            field: "Creative Arts",
            location: "Milan, Italy",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
            achievements: [
                "Featured in Milan Fashion Week 2023",
                "African Designer of the Year 2022",
                "Dressed 3 Nobel Prize winners"
            ],
            quote: "The creativity and confidence nurtured here gave me wings to fly globally.",
            email: "grace@okorofashion.com",
            linkedin: "grace-okoro-designer",
            story: "Grace has taken African fashion to the global stage, showcasing the rich cultural heritage of Nigeria through her innovative designs at international fashion weeks."
        },
        {
            id: 6,
            name: "Mr. James Adeleke",
            graduationYear: "2007",
            currentPosition: "CEO & Founder",
            company: "GreenTech Solutions",
            field: "Business",
            location: "Accra, Ghana",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
            achievements: [
                "Built $10M renewable energy company",
                "Young Entrepreneur Award 2020",
                "Provided clean energy to 100+ communities"
            ],
            quote: "The entrepreneurial spirit cultivated here drives my mission to power Africa sustainably.",
            email: "james@greentech-africa.com",
            linkedin: "james-adeleke-ceo",
            story: "James has revolutionized renewable energy access across West Africa, combining business acumen with social impact to transform communities through clean technology."
        }
    ];

    const alumniStats = [
        { number: "2,500+", label: "Total Alumni", icon: <Users className="w-6 h-6" /> },
        { number: "45", label: "Countries Worldwide", icon: <Globe className="w-6 h-6" /> },
        { number: "89%", label: "Career Success Rate", icon: <Trophy className="w-6 h-6" /> },
        { number: "15+", label: "Years of Excellence", icon: <Award className="w-6 h-6" /> }
    ];

    const upcomingEvents = [
        {
            id: 1,
            title: "Annual Alumni Homecoming",
            date: "December 15, 2024",
            location: "School Premises",
            type: "Reunion",
            description: "Join fellow alumni for a weekend of memories, networking, and celebration."
        },
        {
            id: 2,
            title: "Career Mentorship Program Launch",
            date: "January 20, 2025",
            location: "Lagos Business Hub",
            type: "Professional",
            description: "Connect with current students and share your professional journey."
        },
        {
            id: 3,
            title: "Alumni Excellence Awards Gala",
            date: "March 10, 2025",
            location: "Abuja International Hotel",
            type: "Awards",
            description: "Celebrating outstanding achievements of our distinguished alumni."
        }
    ];

    const graduationYears = ['All', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    const fields = ['All', 'Medicine', 'Technology', 'Law', 'Academia', 'Creative Arts', 'Business'];

    const filteredAlumni = featuredAlumni.filter(alumni => {
        const yearMatch = selectedYear === 'All' || alumni.graduationYear === selectedYear;
        const fieldMatch = selectedField === 'All' || alumni.field === selectedField;
        return yearMatch && fieldMatch;
    });

    const openAlumniModal = (alumni) => {
        setSelectedAlumni(alumni);
    };

    const closeAlumniModal = () => {
        setSelectedAlumni(null);
    };

    const getFieldColor = (field) => {
        const colors = {
            Medicine: "bg-red-100 text-red-800",
            Technology: "bg-blue-100 text-blue-800",
            Law: "bg-purple-100 text-purple-800",
            Academia: "bg-brand-100 text-brand-800",
            "Creative Arts": "bg-pink-100 text-pink-800",
            Business: "bg-orange-100 text-orange-800"
        };
        return colors[field] || "bg-gray-100 text-gray-800";
    };

    return (
        <HomeWrapper title="Meet Our Alumni (Our Pride)">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-brand-50 mt-24">
                {/* Hero Section */}
                


                <div className="py-4 md:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-3 md:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8">
                            {alumniStats.map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className="bg-brand-100 p-2 py-4 md:p-6 rounded-2xl group-hover:bg-brand-200 transition-colors mb-4">
                                        <div className="text-brand-600 flex justify-center mb-3">
                                            {stat.icon}
                                        </div>
                                        <div className="text-xl md:text-4xl font-bold text-brand-800 mb-2">{stat.number}</div>
                                        <div className="text-xs md:text-xl text-gray-600 font-medium">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-2 md:px-6 py-16">
                    {/* Featured Alumni Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-xl md:text-4xl font-bold text-gray-800 mb-4">Distinguished Alumni</h2>
                            <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto">
                                Meet some of our most accomplished graduates who continue to excel
                                in their respective fields and inspire the next generation.
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700 font-medium">Filter by:</span>
                            </div>

                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            >
                                <option value="All">All Years</option>
                                {graduationYears.slice(1).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>

                            <select
                                value={selectedField}
                                onChange={(e) => setSelectedField(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            >
                                <option value="All">All Fields</option>
                                {fields.slice(1).map(field => (
                                    <option key={field} value={field}>{field}</option>
                                ))}
                            </select>
                        </div>

                        {/* Alumni Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredAlumni.map((alumni) => (
                                <div
                                    key={alumni.id}
                                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                                    onClick={() => openAlumniModal(alumni)}
                                >
                                    {/* Image */}
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={alumni.image}
                                            alt={alumni.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFieldColor(alumni.field)}`}>
                                                {alumni.field}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-sm italic">"{alumni.quote}"</p>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-brand-600 transition-colors">
                                                {alumni.name}
                                            </h3>
                                            <span className="text-sm text-brand-600 font-medium">
                                                Class of {alumni.graduationYear}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-brand-700 font-semibold">{alumni.currentPosition}</p>
                                            <p className="text-gray-600">{alumni.company}</p>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {alumni.location}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {alumni.achievements.slice(0, 2).map((achievement, index) => (
                                                <div key={index} className="flex items-center text-sm text-gray-600">
                                                    <Star className="w-3 h-3 text-brand-500 mr-2 flex-shrink-0" />
                                                    {achievement}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex space-x-2">
                                                <button className="p-2 bg-brand-100 hover:bg-brand-200 rounded-full transition-colors">
                                                    <Mail className="w-4 h-4 text-brand-600" />
                                                </button>
                                                <button className="p-2 bg-brand-100 hover:bg-brand-200 rounded-full transition-colors">
                                                    <Linkedin className="w-4 h-4 text-brand-600" />
                                                </button>
                                            </div>
                                            <div className="text-brand-500 font-medium text-sm flex items-center">
                                                Read Story <ArrowRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Upcoming Alumni Events</h2>
                            <p className="text-xl text-gray-600">
                                Stay connected with your alma mater through exclusive alumni events and gatherings.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.type === 'Reunion' ? 'bg-brand-100 text-brand-800' :
                                            event.type === 'Professional' ? 'bg-blue-100 text-blue-800' :
                                                'bg-purple-100 text-purple-800'
                                            }`}>
                                            {event.type}
                                        </span>
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                                    <p className="text-gray-600 mb-4">{event.description}</p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {event.date}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {event.location}
                                        </div>
                                    </div>

                                    <button className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-full font-medium transition-colors">
                                        Register Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl p-4 md:p-12 text-white">
                            <div className="max-w-3xl mx-auto">
                                <Heart className="w-12 h-12 mx-auto mb-4 text-brand-200" />
                                <h2 className="text-xl md:text-4xl font-bold md:mb-6">Give Back to Your Alma Mater</h2>
                                <p className="text-sm md:text-xl mb-8 text-brand-100">
                                    Your success story can inspire current students. Join our mentorship program
                                    or contribute to scholarship funds to help the next generation achieve their dreams.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button className="bg-white text-brand-600 px-8 py-2 md:py-3 rounded-full font-bold text-lg hover:bg-brand-50 transition-colors">
                                        Become a Mentor
                                    </button>
                                    <button className="border-2 border-white text-white px-8 py-2 md:py-3 rounded-full font-bold text-lg hover:bg-white hover:text-brand-600 transition-colors">
                                        Support Scholarships
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {
                    selectedAlumni && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="relative">
                                    <div className="relative h-80 overflow-hidden rounded-t-3xl">
                                        <img
                                            src={selectedAlumni.image}
                                            alt={selectedAlumni.name}
                                            className="w-full h-full object-cover object-top"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                                        {/* Close Button */}
                                        <button
                                            onClick={closeAlumniModal}
                                            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
                                        >
                                            <X className="w-6 h-6 text-red-500" />
                                        </button>

                                        {/* Name and Title Overlay */}
                                        <div className="absolute bottom-6 left-6 right-6 text-white">
                                            <h2 className="text-4xl font-bold mb-2">{selectedAlumni.name}</h2>
                                            <p className="text-xl text-brand-200 mb-1">{selectedAlumni.currentPosition}</p>
                                            <p className="text-lg text-brand-300">{selectedAlumni.company}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                        <div className="md:col-span-2">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Success Story</h3>
                                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                                {selectedAlumni.story}
                                            </p>

                                            <blockquote className="bg-brand-50 border-l-4 border-brand-500 p-6 rounded-r-lg mb-6">
                                                <p className="text-brand-800 text-lg italic">"{selectedAlumni.quote}"</p>
                                            </blockquote>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800 mb-3">Quick Facts</h4>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-center">
                                                        <GraduationCap className="w-4 h-4 text-brand-500 mr-2" />
                                                        <span>Class of {selectedAlumni.graduationYear}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Briefcase className="w-4 h-4 text-brand-500 mr-2" />
                                                        <span>{selectedAlumni.field}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MapPin className="w-4 h-4 text-brand-500 mr-2" />
                                                        <span>{selectedAlumni.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800 mb-3">Key Achievements</h4>
                                                <div className="space-y-2">
                                                    {selectedAlumni.achievements.map((achievement, index) => (
                                                        <div key={index} className="flex items-start">
                                                            <Trophy className="w-4 h-4 text-brand-500 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span className="text-sm text-gray-600">{achievement}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800 mb-3">Connect</h4>
                                                <div className="flex space-x-3">
                                                    <button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors flex items-center justify-center">
                                                        <Mail className="w-4 h-4 mr-2" />
                                                        Email
                                                    </button>
                                                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors flex items-center justify-center">
                                                        <Linkedin className="w-4 h-4 mr-2" />
                                                        LinkedIn
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </HomeWrapper>
    );
};

export default AlumniPage;