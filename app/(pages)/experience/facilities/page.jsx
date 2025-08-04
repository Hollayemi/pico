"use client"
import React, { useState } from 'react';
import { MapPin, Users, Calendar, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';
import { useRouter } from 'next/navigation';

const FacilitiesPage = () => {
    const router = useRouter()
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const facilities = [
        {
            id: 1,
            name: "Modern Computer Laboratory",
            description: "State-of-the-art computer lab equipped with 40 high-performance workstations, interactive whiteboards, and high-speed internet connectivity for digital learning excellence.",
            category: "Technology",
            capacity: "40 Students",
            features: ["High-speed Internet", "Interactive Whiteboards", "Modern Software", "Air Conditioned"],
            images: [
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop"
            ]
        },
        {
            id: 2,
            name: "Science Laboratory",
            description: "Fully equipped physics, chemistry, and biology laboratories with modern apparatus and safety equipment to foster hands-on scientific exploration and discovery.",
            category: "Academic",
            capacity: "30 Students",
            features: ["Modern Equipment", "Safety Systems", "Chemical Storage", "Microscopes"],
            images: [
                "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop"
            ]
        },
        {
            id: 3,
            name: "Sports Field",
            description: "Outdoor sports facility featuring Track sports and Football, with professionals in athletic activities.",
            category: "Sports",
            capacity: "200 Students",
            features: ["Football", "Soccer",],
            images: [
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop"
            ]
        },
        {
            id: 4,
            name: "Premium Library & Learning Center",
            description: "Extensive collection of books, digital resources, and quiet study spaces designed to promote reading culture and independent learning among students.",
            category: "Academic",
            capacity: "80 Students",
            features: ["10,000+ Books", "Digital Resources", "Study Pods", "Reading Areas"],
            images: [
                "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop"
            ]
        },
        {
            id: 5,
            name: "Creative Arts Studio",
            description: "Inspiring space for music, drama, and visual arts with professional equipment, instruments, and performance areas to nurture creative talents.",
            category: "Arts",
            capacity: "35 Students",
            features: ["Musical Instruments", "Art Supplies", "Performance Stage", "Recording Equipment"],
            images: [
                "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
            ]
        },
        {
            id: 6,
            name: "Modern Cafeteria & Dining Hall",
            description: "Spacious dining facility serving nutritious meals in a clean, welcoming environment with modern kitchen equipment and hygienic food preparation areas.",
            category: "Dining",
            capacity: "300 Students",
            features: ["Modern Kitchen", "Nutritious Meals", "Hygienic Environment", "Spacious Seating"],
            images: [
                "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop"
            ]
        },
        {
            id: 7,
            name: "Comfortable Dormitories",
            description: "Well-furnished boarding facilities with comfortable beds, study areas, and recreational spaces, providing a home-away-from-home experience for students.",
            category: "Accommodation",
            capacity: "120 Students",
            features: ["Comfortable Beds", "Study Areas", "Recreation Rooms", "24/7 Supervision"],
            images: [
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
            ]
        },
        {
            id: 8,
            name: "Outdoor Playground & Fields",
            description: "Expansive outdoor recreation areas including football field, playground equipment, and landscaped gardens for physical activities and relaxation.",
            category: "Recreation",
            capacity: "400+ Students",
            features: ["Football Field", "Playground Equipment", "Basketball Court", "Landscaped Gardens"],
            images: [
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop"
            ]
        }
    ];

    const categories = ["All", "Technology", "Academic", "Sports", "Dining", "Accommodation",];
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredFacilities = selectedCategory === "All"
        ? facilities
        : facilities.filter(facility => facility.category === selectedCategory);

    const openFacilityModal = (facility) => {
        setSelectedFacility(facility);
        setCurrentImageIndex(0);
    };

    const closeFacilityModal = () => {
        setSelectedFacility(null);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        if (selectedFacility) {
            setCurrentImageIndex((prev) =>
                prev === selectedFacility.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedFacility) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedFacility.images.length - 1 : prev - 1
            );
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            Technology: "bg-blue-100 text-blue-800",
            Academic: "bg-brand-100 text-brand-800",
            Sports: "bg-green-100 text-green-800",
            Arts: "bg-purple-100 text-purple-800",
            Dining: "bg-orange-100 text-orange-800",
            Accommodation: "bg-indigo-100 text-indigo-800",
            Recreation: "bg-yellow-100 text-yellow-800"
        };
        return colors[category] || "bg-gray-100 text-gray-800";
    };

    return (
        <HomeWrapper miniSlider title="School Facilities">
            <div className="min-h-screen -mt-6 bg-gradient-to-br from-gray-50 to-brand-50">
              
                <div className="max-w-7xl mx-auto px-2 md:px-6 py-10">
                    {/* Category Filter */}
                    <div className="mb-12">
                        <h2 className="md:text-3xl font-bold text-gray-800 mb-4 text-center">
                            Explore Our Facilities
                        </h2>
                        <div className="flex flex-wrap justify-center gap-1 md:gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={` px-4 md:px-6 mb-1.5 py-0.5 min-w- md:py-3 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                                        ? 'bg-brand-500 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-brand-50 hover:border-brand-300'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Facilities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredFacilities.map((facility) => (
                            <div
                                key={facility.id}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                                onClick={() => openFacilityModal(facility)}
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={facility.images[0]}
                                        alt={facility.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(facility.category)}`}>
                                            {facility.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-brand-600 transition-colors">
                                            {facility.name}
                                        </h3>
                                        <ArrowRight className="w-5 h-5 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {facility.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Users className="w-4 h-4 mr-1" />
                                            {facility.capacity}
                                        </div>
                                        <div className="text-brand-500 font-medium text-sm">
                                            View Details →
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="text-center mb-10 bg-gradient-to-r from-brand-500 to-brand-600 mt-10 rounded-lg p-8">
                        <h3 className="text-xl font-semibold text-gray-50 mb-4">
                            Ready to Apply?
                        </h3>
                        <p className="text-gray-200 mb-6">
                            Make sure you have reviewed all requirements and have the necessary documents ready.
                        </p>
                        <button onClick={() => router.push("/admissions/apply")} className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                            Start Application
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {selectedFacility && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="relative">
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={selectedFacility.images[currentImageIndex]}
                                        alt={selectedFacility.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                                    {/* Navigation Arrows */}
                                    {selectedFacility.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
                                            >
                                                <ChevronLeft className="w-6 h-6 text-white" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
                                            >
                                                <ChevronRight className="w-6 h-6 text-white" />
                                            </button>
                                        </>
                                    )}

                                    {/* Image Indicators */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {selectedFacility.images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Close Button */}
                                    <button
                                        onClick={closeFacilityModal}
                                        className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-3xl font-bold text-gray-800">{selectedFacility.name}</h2>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(selectedFacility.category)}`}>
                                        {selectedFacility.category}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                    {selectedFacility.description}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">Capacity</h3>
                                        <div className="flex items-center text-brand-600">
                                            <Users className="w-5 h-5 mr-2" />
                                            <span className="text-lg font-medium">{selectedFacility.capacity}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">Key Features</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedFacility.features.map((feature, index) => (
                                                <div key={index} className="flex items-center text-gray-600">
                                                    <div className="w-2 h-2 bg-brand-500 rounded-full mr-2"></div>
                                                    <span className="text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
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

export default FacilitiesPage;