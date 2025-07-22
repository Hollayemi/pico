"use client"
import React, { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Navigation items with dropdown support
    const navItems = [
        {
            id: 'about',
            label: 'ABOUT',
            href: '/about',
            dropdown: [
                { label: 'Our Mission', href: '/about/mission' },
                { label: 'History', href: '/about/history' },
                { label: 'Leadership', href: '/about/leadership' }
            ]
        },
        {
            id: 'admissions',
            label: 'ADMISSIONS',
            href: '/admissions',
            dropdown: [
                { label: 'Apply Now', href: '/admissions/apply' },
                { label: 'Requirements', href: '/admissions/requirements' },
                { label: 'Tuition & Fees', href: '/admissions/tuition' }
            ]
        },
        {
            id: 'experience',
            label: 'EXPERIENCE',
            href: '/experience',
            dropdown: [
                { label: 'Academic Programs', href: '/experience/academics' },
                { label: 'Student Life', href: '/experience/student-life' },
                { label: 'Facilities', href: '/experience/facilities' }
            ]
        },
        {
            id: 'alumni',
            label: 'ALUMNI',
            href: '/alumni',
            dropdown: [
                { label: 'Alumni Directory', href: '/alumni/directory' },
                { label: 'Events', href: '/alumni/events' },
                { label: 'Get Involved', href: '/alumni/get-involved' }
            ]
        },
        {
            id: 'giving',
            label: 'GIVING',
            href: '/giving'
        },
        {
            id: 'news',
            label: 'NEWS & EVENTS',
            href: '/news'
        }
    ];

    // Secondary nav items
    const secondaryNavItems = [
        { label: 'PISO', href: '/piso' },
        { label: 'Inquire', href: '/inquire' },
        { label: 'Admissions Portal', href: '/admissions-portal' },
        { label: 'Parent Portal', href: '/parent-portal' },
        { label: 'Boarding', href: '/boarding' },
        { label: 'Kiddies', href: '/kiddies' },
        { label: 'Contact', href: '/contact' },
        { label: 'Donate Now', href: '/donate' }
    ];

    const toggleDropdown = (itemId) => {
        setActiveDropdown(activeDropdown === itemId ? null : itemId);
    };

    return (
        <header className="w-full sticky top-0 z-50">
            {/* Top Alert Bar */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-4 py-2 sticky z-50 top-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-yellow-300">⚠</span>
                        <span className="text-sm font-medium">Godliness and Excellence</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Search className="w-4 h-4 cursor-pointer hover:text-yellow-300" />
                        <div className="flex items-center space-x-6 text-sm">
                            {secondaryNavItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="hover:text-yellow-300 transition-colors duration-200"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Main Header */}
            <div className="bg-white md:opacity-95 hover:opacity-100 absolute z-50 top-10 w-full transition-colors shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <Image src="/images/progressLogo.png" width={200} height={200} className="w-14 " />
                            <div className="flex flex-col">
                                <div className="text-sm text-brand-700 font-medium">Progress</div>
                                <div className="text-sm text-brand-700 font-bold">Intellectual School</div>
                                <div className="text-xs text-brand-700">Okeigbo</div>
                            </div>
                            {/* <div className="hidden md:flex flex-col text-right text-sm text-brand-700">
                                <div className="font-hebrew">האקדמיה</div>
                                <div className="font-hebrew">העברית</div>
                                <div className="font-hebrew">עיין טובאנטו</div>
                            </div> */}
                        </div>

                        <div className='flex items-center justify-between'>
                            {/* Main Navigation - Desktop */}
                            <nav className="hidden lg:flex items-center space-x-5 mr-5">
                                {navItems.map((item) => (
                                    <div key={item.id} className="relative group">
                                        <div
                                            className="flex items-center space-x-1 text-brand-700 font-medium cursor-pointer hover:text-brand-800 transition-colors duration-200"
                                            onClick={() => item.dropdown && toggleDropdown(item.id)}
                                        >
                                            <span className='text-[15px] font-bold'>{item.label}</span>
                                            {item.dropdown && (
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            )}
                                        </div>

                                        {/* Dropdown Menu */}
                                        {item.dropdown && activeDropdown === item.id && (
                                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                                                {item.dropdown.map((dropdownItem, index) => (
                                                    <a
                                                        key={index}
                                                        href={dropdownItem.href}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-700"
                                                    >
                                                        {dropdownItem.label}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            {/* Donate Button */}
                            <button className="hidden lg:block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200">
                                DONATE NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-4 space-y-4">
                        {/* Secondary nav for mobile */}
                        <div className="border-b border-gray-200 pb-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {secondaryNavItems.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.href}
                                        className="text-brand-700 hover:text-brand-800 py-1"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Main nav for mobile */}
                        <div className="space-y-3">
                            {navItems.map((item) => (
                                <div key={item.id}>
                                    <div
                                        className="flex items-center justify-between text-brand-700 font-medium py-2"
                                        onClick={() => item.dropdown && toggleDropdown(item.id)}
                                    >
                                        <a href={item.href} className="flex-1">
                                            {item.label}
                                        </a>
                                        {item.dropdown && (
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        )}
                                    </div>

                                    {/* Mobile Dropdown */}
                                    {item.dropdown && activeDropdown === item.id && (
                                        <div className="pl-4 space-y-2">
                                            {item.dropdown.map((dropdownItem, index) => (
                                                <a
                                                    key={index}
                                                    href={dropdownItem.href}
                                                    className="block text-sm text-gray-600 hover:text-brand-700 py-1"
                                                >
                                                    {dropdownItem.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mobile Donate Button */}
                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-medium mt-4">
                            DONATE NOW
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;