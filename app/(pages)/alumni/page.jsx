'use client'
import React from 'react';
import { Users, Calendar, Heart, Share2, User, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';
import Image from 'next/image';

const AlumniLandingPage = () => {
    const alumniServices = [
        {
            title: "Alumni Giving",
            description: "Support future generations through our comprehensive giving programs",
            icon: Heart,
            image: "/images/donate.jpg",
            link: "/alumni/giving"
        },
        {
            title: "Events & Reunions",
            description: "Reconnect with classmates and celebrate our shared heritage",
            icon: Calendar,
            image: "/images/alumni.jpg",
            link: "/alumni/events"
        },
        {
            title: "Alumni Committees",
            description: "Join our volunteer committees and shape the future of our community",
            icon: Users,
            image: "/images/alumni-commitee.jpg",
            link: "/alumni/committees"
        },
        {
            title: "Share Your News",
            description: "Keep us updated on your achievements and life milestones",
            icon: Share2,
            image: "/images/alumi-news.jpeg",
            link: "/alumni/news"
        },
        {
            title: "Spotlight Alumni",
            description: "Celebrating outstanding achievements of our distinguished graduates",
            icon: User,
            image: "/images/alumni-spotlight.jpg",
            link: "/alumni/spotlight"
        },
        {
            title: "Yearbooks",
            description: "Browse through memories and milestones from years past",
            icon: BookOpen,
            image: "/images/donate.jpg",
            link: "/alumni/yearbooks"
        }
    ];

    return (
        <HomeWrapper noFooter>
            <div className="relative bg-gradient-to-r mt-24 from-brand-800 via-brand-700 to-brand-900 text-white overflow-hidden">
                <Image src="/images/alumni.jpg" alt='alumni' width={700} height={800} className=" w-full h-full object-cover absolute" />
                <div className="absolute inset-0 bg-black opacity-50"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-24">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white hidden md:block bg-opacity-20 p-4 rounded-full">
                                <GraduationCap className="w-12 h-12 text-brand-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl md:text-7xl font-bold mb-6 text-white">
                            Our <span className="text-brand-300">Alumni</span> Network
                        </h1>
                        <p className="text-lg md:text-2xl text-brand-100 max-w-4xl mx-auto leading-relaxed mb-8">
                            Celebrating the remarkable achievements of our graduates who are making
                            a difference across the globe in various fields and industries.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-brand-800 px-8 py-2 md:py-4 rounded-full font-bold text-lg hover:bg-brand-50 transition-colors shadow-lg">
                                Join Alumni Network
                            </button>
                            <button className="border-2 border-white text-white px-8 py-2 md:py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brand-800 transition-colors">
                                Update Your Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <section className="relative bg-gradient-to-br text-black">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-3 md:px-6 py-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-2xl lg:text-6xl font-bold leading-tight">
                                    Welcome to Our
                                    <span className="block text-brand-500">Alumni Community</span>
                                </h1>
                                <p className="text-lg text-brand-600 leading-relaxed">
                                    Once a student, always family. Join thousands of graduates who continue to shape the world and strengthen our legacy.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-white/20">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-16 h-16 shrink-0 bg-brand-800 rounded-full overflow-hidden flex items-center justify-center">
                                        <Image src="/images/student3.png" alt='alumni' width={200} height={200} className=" w-full h-full object-top object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg md:text-2xl font-semibold text-black">Message from the President</h3>
                                        <p className="text-gray-500">Dr. Samuel Adeniyi, Class of '97</p>
                                    </div>
                                </div>

                                <blockquote className="text-lg text-justify leading-relaxed text-gray-700 italic">
                                    "Our alumni represent the finest embodiment of our school's values and mission. Each graduate carries forward not just knowledge, but the spirit of excellence, integrity, and service that defines our institution. Your continued engagement strengthens not only our community but also paves the way for future generations to dream bigger and achieve more."
                                </blockquote>

                                <div className="mt-6 pt-6 border-t border-white/20">
                                    <p className="text-brand-500">
                                        As we celebrate over <strong className="text-brand-800">2,000 alumni</strong> across <strong className="text-brand-800">10+ countries</strong>, we invite you to remain connected, engaged, and proud of the lasting impact you continue to make in the world.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="sticky top-40">
                            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-2 border border-white/20">
                                <img
                                    src="/images/donate.jpg"
                                    alt="Alumni gathering"
                                    className="w-full h-96 object-cover rounded-2xl"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-brand-200/20 rounded-full blur-3xl"></div>
                            <div className="absolute -top-6 -left-6 w-96 h-96 bg-brand-300/20 rounded-full blur-3xl"></div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-brand-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: "2,000+", label: "Alumni Nationwide" },
                            { number: "10+", label: "Countries Represented" },
                            { number: "31+", label: "Years of Excellence" },
                            { number: "₦2.5M", label: "Annual Giving" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center w-24 mx-auto">
                                <div className="text-lg md:text-4xl font-bold text-brand-800 mb-2">{stat.number}</div>
                                <div className="text-base text-brand-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alumni Services Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-4 md:mb-12">
                        <h2 className="text-xl md:text-4xl font-bold text-brand-900 mb-2">
                            Alumni Services & Engagement
                        </h2>
                        <p className="text-sm md:text-xl text-brand-600 max-w-3xl mx-auto">
                            Discover the many ways to stay connected, give back, and continue growing with our vibrant alumni community.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {alumniServices.map((service, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-brand-100 hover:border-brand-300"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover object-right-top group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <div className="w-12 h-12 bg-brand-200 rounded-full flex items-center justify-center mb-3">
                                            <service.icon className="w-6 h-6 text-brand-800" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{service.title}</h3>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <p className="text-brand-600 mb-6 leading-relaxed">
                                        {service.description}
                                    </p>

                                    <a
                                        href={service.link}
                                        className="inline-flex items-center text-brand-700 hover:text-brand-800 font-semibold group-hover:translate-x-1 transition-all duration-300"
                                    >
                                        Learn More
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 bg-gradient-to-r from-brand-800 to-brand-700">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-xl md:text-4xl font-bold text-white mb-4">
                        Ready to Reconnect?
                    </h2>
                    <p className="text-sm md:text-xl text-brand-100 mb-10 leading-relaxed">
                        Update your information, join our network, and be part of our ongoing story of excellence and impact.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-2 md:py-3 bg-brand-200 text-brand-900 font-semibold rounded-full hover:bg-white transition-colors duration-300 hover:scale-105 transform">
                            Update Your Profile
                        </button>
                        <button className="px-8 py-2 md:py-3 border-2 border-brand-200 text-brand-200 font-semibold rounded-full hover:bg-brand-200 hover:text-brand-900 transition-all duration-300 hover:scale-105 transform">
                            Join Alumni Network
                        </button>
                    </div>
                </div>
            </section>

            {/* Contact Information Footer */}
            <section className="py-12 bg-brand-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold mb-4 text-brand-200">
                            Alumni Relations
                        </h3>
                        <div className="flex flex-col sm:flex-row justify-center items-center md:gap-8 text-brand-100">
                            <div>
                                <strong>Email:</strong> alumni@progressschools.com
                            </div>
                            <div>
                                <strong>Phone:</strong> +234 (814) 770 2684
                            </div>
                            
                        </div>
                    </div>
                </div>
            </section>
        </HomeWrapper>
    );
};

export default AlumniLandingPage;