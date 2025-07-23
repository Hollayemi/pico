import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, ArrowRight, Heart } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
    const mainLinks = [
        {
            title: 'About',
            links: [
              
                { label: 'Our Mission', href: '/about/mission' },
                { label: 'History', href: '/about/history' },
                { label: 'Leadership', href: '/about/leadership' },
                { label: 'Board of Directors', href: '/about/board' },
                { label: 'Accreditation', href: '/about/accreditation' }
            ]
        },
        {
            title: 'Admissions',
            links: [
                { label: 'Apply Now', href: '/admissions/apply' },
                { label: 'Requirements', href: '/admissions/requirements' },
                { label: 'Tuition & Fees', href: '/admissions/tuition' },
                { label: 'Financial Aid', href: '/admissions/financial-aid' },
                { label: 'Visit School', href: '/admissions/visit' }
            ]
        },
        {
            title: 'Experience',
            links: [
                { label: 'Academic Programs', href: '/experience/academics' },
                { label: 'Science', href: '/experience/science' },
                { label: 'Facilities', href: '/experience/facilities' },
                { label: 'Athletics', href: '/experience/athletics' },
                { label: 'Arts & Culture', href: '/experience/arts' }
            ]
        },
        {
            title: 'Community',
            links: [
                { label: 'Alumni Directory', href: '/alumni/directory' },
                { label: 'Events', href: '/alumni/events' },
                { label: 'News & Updates', href: '/news' },
                { label: 'Parent Portal', href: '/parent-portal' },
                { label: 'Careers', href: '/careers' }
            ]
        }
    ];

    const quickLinks = [
        { label: 'PISO Portal', href: '/piso' },
        { label: 'Admissions Portal', href: '/admissions-portal' },
        { label: 'Emergency Info', href: '/emergency' },
        { label: 'School Calendar', href: '/calendar' },
        { label: 'Contact Us', href: '/contact' }
    ];

    const socialLinks = [
        { icon: Facebook, href: 'https://facebook.com/progressschools', label: 'Facebook' },
        { icon: Instagram, href: 'https://instagram.com/progressschools', label: 'Instagram' },
        { icon: Twitter, href: 'https://twitter.com/progressschools', label: 'Twitter' },
        { icon: Youtube, href: 'https://youtube.com/progressschools', label: 'YouTube' },
        { icon: Linkedin, href: 'https://linkedin.com/school/progressschools', label: 'LinkedIn' }
    ];

    return (
        <footer className="relative bg-gradient-to-br from-slate-900 via-brand-900 to-slate-800 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
            </div>

            {/* Main Footer Content */}
            <div className="relative z-10">
                {/* Top Section */}
                <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Logo and Description */}
                        <div className="lg:col-span-4">
                            <div className="flex items-center space-x-3 mb-6">
                                <Image src="/images/progressLogo.png" alt="schoolLogo" width={200} height={200} className="w-14 " />
                                <div>
                                    <h3 className="text-xl font-bold">Progress Intellectual School</h3>
                                    <p className="text-brand-200 text-sm">Ondo State</p>
                                </div>
                            </div>

                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Empowering students to excel academically and strengthen their identity in a meaningful,
                                relevant way. Building tomorrow's leaders through excellence in education and community values.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 text-gray-300">
                                    <MapPin className="w-5 h-5 text-brand-400" />
                                    <span>Okeigbo, Ondo State, Nigeria</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-300">
                                    <Phone className="w-5 h-5 text-brand-400" />
                                    <span>(+234) 555-0123</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-300">
                                    <Mail className="w-5 h-5 text-brand-400" />
                                    <span>info@progressschools.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="lg:col-span-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {mainLinks.map((section, index) => (
                                    <div key={index}>
                                        <h4 className="text-lg font-semibold mb-4 text-brand-200">{section.title}</h4>
                                        <ul className="space-y-2">
                                            {section.links.map((link, linkIndex) => (
                                                <li key={linkIndex}>
                                                    <a
                                                        href={link.href}
                                                        className="text-gray-300 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                                    >
                                                        <ArrowRight className="w-0 h-4 group-hover:w-4 transition-all duration-200 mr-0 group-hover:mr-2 text-brand-400" />
                                                        {link.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                        </div>
                        {/* Quick Links */}
                        <div className="mb-6 lg:col-span-2">
                            <h5 className="font-medium mb-3 text-brand-200">Quick Links</h5>
                            <ul className="space-y-2">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            {/* Newsletter Signup */}
                            <div className="lg:col-span-6">
                                <h4 className="text-lg font-semibold mb-4 text-brand-200">Stay Connected</h4>
                                <p className="text-gray-300 mb-4 text-sm">
                                    Get the latest news and updates from our community.
                                </p>

                                <div className="mb-6">
                                    <div className="flex">
                                        <input
                                            type="email"
                                            placeholder="Your email address"
                                            className="flex-1 px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:bg-opacity-20 transition-all duration-200"
                                        />
                                        <button className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 px-6 py-3 rounded-r-lg transition-all duration-200 transform hover:scale-105">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-brand-600 to-brand-500 py-12">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join Our Community?</h3>
                        <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
                            Discover how Progress Intellectual School can provide your child with an exceptional education
                            rooted in top notch values and academic excellence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="bg-white text-brand-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                                Schedule a Visit
                            </button>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                                Donate Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="bg-black bg-opacity-50 py-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">

                            {/* Copyright */}
                            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                                <span className="text-gray-400">© {new Date().getFullYear()} Progress Intellectual School.</span>
                                <span className="text-gray-400 hidden md:block">Made with</span>
                                <Heart className="w-4 h-4  text-red-500 fill-current hidden md:block" />
                                <span className="text-gray-400 hidden md:block">for our community</span>
                            </div>

                            {/* Social Media */}
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-400 text-sm mr-2">Follow us:</span>
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-10 h-10 bg-slate-900 bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 group"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Legal Links */}
                        <div className="flex flex-wrap justify-center md:justify-start space-x-6 mt-6 pt-6 border-t border-gray-700">
                            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Privacy Policy</a>
                            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Terms of Service</a>
                            <a href="/accessibility" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Accessibility</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;