"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = ({ isHome }) => {
    const clickOutRef = useRef(null)
    const router = useRouter()
    const menuRef = useRef(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);


    useEffect(() => {
        const handdleRemove = (e) => {
            if (clickOutRef.current && !clickOutRef.current.contains(e.target)) {
                setActiveDropdown(null)
            }
        }
        document.addEventListener("mousedown", handdleRemove)

        return () => document.removeEventListener("mousedown", handdleRemove)
    }, [])


    // Navigation items with dropdown support
    const navItems = [
        {
            id: 'about',
            label: 'ABOUT',
            href: '/about-us',
            note: 'Learn about our mission, values, and leadership. This section gives an overview of our history and what drives our institution forward in delivering quality education and community impact.',
            dropdown: [
                { label: "Welcome From The Head Of School", href: "/about-us/welcome-message" },
                { label: 'Our Mission', href: '/about-us/mission' },
                { label: 'History', href: '/about-us/history' },
                { label: 'Leadership', href: '/about-us/leadership' }
            ]
        },
        {
            id: 'admissions',
            label: 'ADMISSIONS',
            href: '/admissions',
            note: 'Explore how to apply, the requirements for enrollment, and tuition information. This section guides prospective students through the application and admission process step-by-step.',
            dropdown: [
                { label: 'Admissions', href: '/admissions' },
                { label: 'Apply Now', href: '/admissions/apply' },
                { label: 'Requirements', href: '/admissions/requirements' },
                { label: 'Tuition & Fees', href: '/admissions/tuition' }
            ]
        },
        {
            id: 'experience',
            label: 'EXPERIENCE',
            href: '/experience',
            note: 'Discover campus life, academic offerings, and the unique facilities we provide. This section helps you imagine what daily life looks like as a student at our institution.',
            dropdown: [
                { label: 'Academic Programs', href: '/experience/academics' },
                { label: 'Vocational Training', href: '/experience/vocational-trainings' },
                { label: 'Student Life', href: '/experience/student-life' },
                { label: 'Facilities', href: '/experience/facilities' }
            ]
        },
        {
            id: 'alumni',
            label: 'ALUMNI',
            href: '/alumni',
            note: 'Stay connected with fellow graduates, attend alumni events, and discover ways to support and engage with your alma mater. This section is your hub for lifelong connections.',
            dropdown: [
                { label: 'Alumni', href: '/alumni' },
                { label: 'Alumni Directory', href: '/alumni/directory' },
                { label: 'Events', href: '/alumni/events' },
                { label: 'Get Involved', href: '/alumni/get-involved' }
            ]
        },
        {
            id: 'giving',
            label: 'GIVING',
            href: '/giving',
            note: 'Support our mission by giving back. Whether through donations, scholarships, or endowments, your contributions make a lasting impact on students and campus development.'
        },
        {
            id: 'news',
            label: 'NEWS & EVENTS',
            href: '/news',
            note: 'Stay updated with the latest happenings, achievements, and upcoming events within our institution. This section keeps you informed and engaged with what’s going on.'
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
        <header className="w-full sticky top-0 z-50" ref={clickOutRef}>
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
                    <div className="flex relative items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <Link href="/">
                                <Image src="/images/progressLogo.png" alt="schoolLogo" width={200} height={200} className="w-14 " />
                            </Link>
                            <div className="flex flex-col">
                                <div className="text-sm text-brand-700 font-medium">Progress</div>
                                <div className="text-sm text-brand-700 font-bold">Intellectual School</div>
                                <div className="text-xs text-brand-700">Okeigbo</div>
                            </div>
                        </div>

                        <div className='flex items-center  justify-between'>
                            {/* Main Navigation - Desktop */}
                            <nav className="hidden lg:flex items-center space-x-5 mr-5">
                                {navItems.map((item) => (
                                    <div key={item.id} className="relative md:static group" >
                                        <div
                                            className="flex items-center space-x-1 text-brand-700 font-medium cursor-pointer hover:text-brand-800 transition-colors duration-200"
                                            onClick={() => item.dropdown ? toggleDropdown(item.id) : router.push(item.href)}
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
                                            <div className="absolute w-40 md:w-[90vw] flex items-start  h-fit md:h-80 top-full !left-0 mt-2 md:mt-4  bg-white rounded-md shadow-lg border md:border-none py-5 md:py-0 border-gray-200  ">
                                                <div className='w-2/5 h-full hidden md:block bg-brand-800 text-white p-6'>
                                                    <h1 className='text-3xl font-black'>{item.label}</h1>
                                                    <h1 className='text-[16px] leading-9 font-normal mt-3'>{item.note}</h1>
                                                </div>
                                                <div className='p-5'>
                                                    {item.dropdown.map((dropdownItem, index) => (
                                                        <a
                                                            key={index}
                                                            href={dropdownItem.href}
                                                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-700"
                                                        >
                                                            {dropdownItem.label}
                                                        </a>
                                                    ))}
                                                </div>
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

            {!isHome && <div className='h-20 mb-2' />}

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