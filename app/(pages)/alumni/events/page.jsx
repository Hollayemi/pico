"use client"
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Filter, Search, ArrowRight, Star, Globe, Video, Utensils, GraduationCap, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';

const AlumniEventsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const eventCategories = [
        { id: 'all', name: 'All Events', icon: Calendar },
        { id: 'reunion', name: 'Reunions', icon: Users },
        { id: 'networking', name: 'Networking', icon: Globe },
        { id: 'virtual', name: 'Virtual Events', icon: Video },
        { id: 'social', name: 'Social Events', icon: Utensils },
        { id: 'professional', name: 'Professional Development', icon: GraduationCap },
        { id: 'giving', name: 'Fundraising', icon: Heart }
    ];

    const upcomingEvents = [
        {
            id: 1,
            title: "Class of 2014 - 10 Year Reunion",
            date: "2025-08-15",
            time: "6:00 PM - 11:00 PM",
            location: "Grand Ballroom, Marriott Downtown",
            type: "In-Person",
            category: "reunion",
            price: "₦7,500",
            attendees: 156,
            maxAttendees: 200,
            description: "Join your classmates for an unforgettable evening of reconnection, memories, and celebration.",
            image: "/images/alumni-commitee.jpg",
            featured: true,
            tags: ["Dinner", "Dancing", "Awards"]
        },
        {
            id: 2,
            title: "Global Alumni Networking Night",
            date: "2025-08-22",
            time: "7:00 PM - 9:30 PM",
            location: "Virtual Event",
            type: "Virtual",
            category: "networking",
            price: "Free",
            attendees: 89,
            maxAttendees: 150,
            description: "Connect with fellow alumni from around the world in our monthly virtual networking session.",
            image: "/images/alumni.jpg",
            featured: false,
            tags: ["Professional", "International", "Career"]
        },
        {
            id: 3,
            title: "Annual Golf Tournament & Scholarship Fundraiser",
            date: "2025-09-05",
            time: "8:00 AM - 4:00 PM",
            location: "Pinebrook Country Club",
            type: "In-Person",
            category: "giving",
            price: "₦11,000",
            attendees: 67,
            maxAttendees: 144,
            description: "Support student scholarships while enjoying a day on the greens with fellow alumni.",
            image: "/images/alumni.jpg",
            featured: true,
            tags: ["Golf", "Fundraising", "Scholarships"]
        },
        {
            id: 4,
            title: "Young Alumni Happy Hour",
            date: "2025-09-12",
            time: "6:00 PM - 8:00 PM",
            location: "The Rooftop Bar, City Center",
            type: "In-Person",
            category: "social",
            price: "₦25",
            attendees: 43,
            maxAttendees: 80,
            description: "Casual networking for alumni who graduated in the last 10 years.",
            image: "/images/alumni.jpg",
            featured: false,
            tags: ["Young Alumni", "Casual", "Drinks"]
        },
        {
            id: 5,
            title: "Career Development Workshop: Leadership in Tech",
            date: "2025-09-18",
            time: "2:00 PM - 5:00 PM",
            location: "Innovation Center, Main Campus",
            type: "Hybrid",
            category: "professional",
            price: "₦40",
            attendees: 78,
            maxAttendees: 100,
            description: "Learn from successful alumni leaders in the technology sector.",
            image: "/images/alumni-commitee.jpg",
            featured: false,
            tags: ["Workshop", "Technology", "Leadership"]
        },
        {
            id: 6,
            title: "Homecoming Weekend 2025",
            date: "2025-10-14",
            time: "All Day",
            location: "Main Campus",
            type: "In-Person",
            category: "reunion",
            price: "Various",
            attendees: 890,
            maxAttendees: 1500,
            description: "The biggest alumni celebration of the year with activities for all class years.",
            image: "/images/alumni-commitee.jpg",
            featured: true,
            tags: ["Homecoming", "All Classes", "Festival"]
        }
    ];

    const pastEvents = [
        {
            id: 7,
            title: "Class of 1999 - 25 Year Silver Reunion",
            date: "2025-06-10",
            attendees: 178,
            image: "/images/alumni.jpg",
            highlights: ["Record attendance", "Scholarship fund raised $50,000", "3 lifetime achievement awards"]
        },
        {
            id: 8,
            title: "Spring Alumni Gala",
            date: "2025-05-18",
            attendees: 245,
            image: "/images/alumni.jpg",
            highlights: ["₦125,000 raised for new library", "Honorary doctorate ceremony", "Student performance showcase"]
        },
        {
            id: 9,
            title: "Regional Chapter Meetup - West Coast",
            date: "2025-04-22",
            attendees: 67,
            image: "/images/alumni-commitee.jpg",
            highlights: ["New chapter president elected", "Silicon Valley company tours", "Mentorship program launch"]
        }
    ];

    const filteredEvents = upcomingEvents.filter(event => {
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <HomeWrapper miniSlider>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b py-10">
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <h1 className="text-2xl lg:text-4xl font-bold mb-4">
                            Alumni Events & Reunions
                        </h1>
                        <p className="text-base md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                            Reconnect, celebrate, and create new memories with your fellow alumni through our diverse calendar of events, reunions, and networking opportunities.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="py-4 bg-white border-b border-brand-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-row gap-2 md:gap-6 items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    className="w-full pl-10 pr-4 py-3 border border-brand-200 rounded-full focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 border border-brand-300 rounded-full text-brand-700 hover:bg-brand-50 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mt-6 p-4 bg-brand-50 rounded-2xl">
                            <div className="flex flex-wrap gap-3">
                                {eventCategories.map((category) => {
                                    const IconComponent = category.icon;
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${selectedCategory === category.id
                                                ? 'bg-brand-600 text-white'
                                                : 'bg-white text-brand-600 hover:bg-brand-100 border border-brand-200'
                                                }`}
                                        >
                                            <IconComponent className="w-4 h-4" />
                                            {category.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Events */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-brand-900 mb-8 text-center">Featured Events</h2>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {filteredEvents.filter(event => event.featured).map((event) => (
                            <div key={event.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-brand-100">
                                <div className="relative h-64">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-brand-600 text-white text-sm font-semibold rounded-full">
                                            Featured
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${event.type === 'Virtual' ? 'bg-blue-100 text-blue-800' :
                                            event.type === 'Hybrid' ? 'bg-purple-100 text-purple-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {event.type}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-brand-900 mb-4">{event.title}</h3>

                                    <div className="space-y-1.5 mb-6">
                                        <div className="flex items-center text-brand-600">
                                            <Calendar className="w-5 h-5 mr-3" />
                                            {formatDate(event.date)}
                                        </div>
                                        <div className="flex items-center text-brand-600">
                                            <Clock className="w-5 h-5 mr-3" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center text-brand-600">
                                            <MapPin className="w-5 h-5 mr-3" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center text-brand-600">
                                            <Users className="w-5 h-5 mr-3" />
                                            {event.attendees} of {event.maxAttendees} registered
                                        </div>
                                    </div>

                                    <p className="text-brand-700 mb-6 leading-relaxed">{event.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {event.tags.map((tag, index) => (
                                            <span key={index} className="px-3 py-1 bg-brand-100 text-brand-700 text-sm rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-bold text-brand-800">{event.price}</div>
                                        <button className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors flex items-center gap-2">
                                            Register Now
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Upcoming Events */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-brand-900 mb-8 text-center">All Upcoming Events</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.filter(event => !event.featured).map((event) => (
                            <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-brand-100">
                                <div className="relative h-48">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${event.type === 'Virtual' ? 'bg-blue-100 text-blue-800' :
                                            event.type === 'Hybrid' ? 'bg-purple-100 text-purple-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {event.type}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-brand-900 mb-3">{event.title}</h3>

                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex items-center text-brand-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {formatDate(event.date)}
                                        </div>
                                        <div className="flex items-center text-brand-600">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center text-brand-600">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {event.location}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-lg font-bold text-brand-800">{event.price}</span>
                                        <span className="text-sm text-brand-600">{event.attendees}/{event.maxAttendees} registered</span>
                                    </div>

                                    <button className="w-full py-2 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Past Events */}
            <section className="py-16 bg-brand-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-brand-900 mb-8 text-center">Recent Past Events</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {pastEvents.map((event) => (
                            <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-brand-900 mb-2">{event.title}</h3>
                                    <p className="text-brand-600 mb-4">{formatDate(event.date)} • {event.attendees} attendees</p>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-brand-800">Event Highlights:</h4>
                                        <ul className="space-y-1">
                                            {event.highlights.map((highlight, index) => (
                                                <li key={index} className="flex items-start">
                                                    <Star className="w-4 h-4 text-brand-500 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-brand-700">{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-brand-800 to-brand-700">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Don't Miss Out on Future Events
                    </h2>
                    <p className="text-xl text-brand-100 mb-8">
                        Stay connected and be the first to know about upcoming alumni events, reunions, and special announcements.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-brand-200 text-brand-900 font-semibold rounded-full hover:bg-white transition-colors">
                            Subscribe to Event Updates
                        </button>
                        <button className="px-8 py-4 border-2 border-brand-200 text-brand-200 font-semibold rounded-full hover:bg-brand-200 hover:text-brand-900 transition-all">
                            Suggest an Event
                        </button>
                    </div>
                </div>
            </section>
        </HomeWrapper>
    );
};

export default AlumniEventsPage;