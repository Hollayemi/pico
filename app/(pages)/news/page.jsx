'use client'
import React, { useState } from 'react';
import { Calendar, Clock, User, Tag, Search, Filter, ChevronRight, Trophy, GraduationCap, Users, Building, Heart, Star, ArrowRight } from 'lucide-react';
import HomeWrapper from '@/app/components/wrapper';

const SchoolNewsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const newsCategories = [
        { id: 'all', name: 'All News', count: 24 },
        { id: 'events', name: 'Events', count: 5, icon: Calendar },
        { id: 'facilities', name: 'Facilities', count: 2, icon: Building },
        { id: 'academics', name: 'Academics', count: 8, icon: GraduationCap },
        { id: 'athletics', name: 'Athletics', count: 6, icon: Trophy },
        { id: 'community', name: 'Community', count: 3, icon: Users },
    ];

    const featuredNews = [
        {
            id: 1,
            "title": "Okeigbo NAOS Quick Competition: Spelling Bee",
            "excerpt": "Top students from schools in Okeigbo showcased their spelling skills in a thrilling NAOS Quick Competition, promoting academic excellence and friendly rivalry.",
            "content": "The Okeigbo NAOS Quick Competition: Spelling Bee brought together brilliant minds from schools across the community in a highly engaging contest. Students battled through challenging rounds, demonstrating their vocabulary mastery and quick thinking. The event not only celebrated academic talent but also fostered healthy competition and unity among the youths of Okeigbo. Parents, teachers, and local leaders applauded the initiative, encouraging more of such intellectually stimulating programs in the future.",
            category: 'athletics',
            date: '2025-07-28',
            author: 'English Teachers',
            image: '/images/students.jpg',
            featured: true,
            tags: ['Quiz', 'Championship', 'Victory'],
            readTime: '4 min read'
        },
        {
            id: 2,
            "title": "School Alumni Surprised the School with 20 Tailoring Machines for Vocational Training",
            "excerpt": "A generous gesture by the school’s alumni has equipped the vocational center with 20 new tailoring machines, boosting hands-on training for students interested in fashion and design.",
            "content": "In a remarkable act of generosity and commitment to youth empowerment, the school's alumni donated 20 brand-new tailoring machines to support vocational training. The machines, unveiled during a special assembly, will be used to train students in fashion design and sewing, opening up practical career pathways for many. The alumni encouraged students to take full advantage of the opportunity, promising continued support for skill-based education.",
            "category": "alumni",
            date: '2025-07-25',
            author: 'Alumni',
            image: '/images/tailoring.jpg',
            featured: true,
            tags: ['STEM', 'Facilities', 'Innovation'],
            readTime: '3 min read'
        }
    ];

    const recentNews = [
        {
            id: 3,
            title: "Student Art Exhibition Showcases Creative Talent",
            excerpt: "The annual student art exhibition features over 150 pieces from talented artists across all grade levels.",
            category: 'academics',
            date: '2025-07-22',
            author: 'Ms. Jennifer Walsh',
            image: '/images/students2.jpg',
            tags: ['Art', 'Students', 'Exhibition'],
            readTime: '2 min read'
        },
        {
            id: 4,
            title: "Scholarship Recipients Announced for Academic Excellence",
            excerpt: "Ten outstanding seniors have been awarded full scholarships to prestigious universities nationwide.",
            category: 'academics',
            date: '2025-07-20',
            author: 'Mrs. Patricia Johnson',
            image: '/images/students2.jpg',
            tags: ['Scholarships', 'Seniors', 'Achievement'],
            readTime: '3 min read'
        },
        {
            id: 5,
            title: "Community Service Day: Students Give Back",
            excerpt: "Over 500 students participated in our annual community service day, volunteering at local organizations.",
            category: 'community',
            date: '2025-07-18',
            author: 'Mr. David Thompson',
            image: '/images/students2.jpg',
            tags: ['Service', 'Community', 'Volunteering'],
            readTime: '2 min read'
        },
        {
            id: 6,
            title: "Drama Club's 'Romeo and Juliet' Receives Standing Ovation",
            excerpt: "The spring production of Shakespeare's classic tragedy was performed to sold-out audiences.",
            category: 'events',
            date: '2025-07-15',
            author: 'Ms. Rebecca Martinez',
            image: '/images/students2.jpg',
            tags: ['Theater', 'Drama', 'Performance'],
            readTime: '2 min read'
        },
        {
            id: 7,
            title: "Robotics Team Advances to National Competition",
            excerpt: "Our robotics team earned first place at regionals and will compete at the national level next month.",
            category: 'academics',
            date: '2025-07-12',
            author: 'Mr. Alan Foster',
            image: '/images/students2.jpg',
            tags: ['Robotics', 'Competition', 'STEM'],
            readTime: '3 min read'
        },
        {
            id: 8,
            title: "Spring Sports Awards Ceremony Celebrates Athletes",
            excerpt: "Outstanding achievements in track, tennis, and soccer were recognized at our annual awards ceremony.",
            category: 'athletics',
            date: '2025-07-10',
            author: 'Athletic Department',
            image: '/images/students2.jpg',
            tags: ['Awards', 'Spring Sports', 'Recognition'],
            readTime: '2 min read'
        }
    ];

    const quickUpdates = [
        {
            id: 'update1',
            text: 'Okeigbo NAOS Quick Competition: Spelling Bee',
            date: '2025-08-01',
            type: 'important'
        },
        {
            id: 'update2',
            text: 'Alumni Surprised the School with 20 Tailoring Machines for Vocational Training',
            date: '2025-07-30',
            type: 'info'
        },
        {
            id: 'update3',
            text: 'New student orientation: August 28th at 9:00 AM',
            date: '2025-07-28',
            type: 'info'
        },
        {
            id: 'update4',
            text: 'School cafeteria menu updated with healthier options',
            date: '2025-07-25',
            type: 'general'
        }
    ];

    const allNews = [...featuredNews, ...recentNews];

    const filteredNews = allNews.filter(article => {
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCategoryIcon = (category) => {
        const categoryData = newsCategories.find(cat => cat.id === category);
        return categoryData?.icon || Tag;
    };

    const getCategoryColor = (category) => {
        const colors = {
            academics: 'blue',
            athletics: 'orange',
            events: 'purple',
            community: 'green',
            facilities: 'indigo'
        };
        return colors[category] || 'brand';
    };

    return (
        <HomeWrapper miniSlider title="News and Updates">
            {/* Hero Section */}
            <section className="md:py-10">
                <div className="max-w-6xl mx-auto px-2 md:px-6">
                    <div className="text-center">
                        <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-6">
                            School News &
                            <span className="text-brand-500 ml-2">Updates</span>
                        </h1>
                        <p className="text-sm md:text-base text-gray-500 max-w-3xl mx-auto leading-relaxed">
                            Stay informed about the latest happenings, achievements, and important announcements from our school community.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Updates Bar */}
            <section className="py-6 bg-white border-b border-brand-100">
                <div className="max-w-7xl mx-auto px-2 md:px-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-brand-800">Quick Updates</h3>
                        <button className="text-brand-600 hover:text-brand-700 text-sm font-medium">
                            View All Updates →
                        </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickUpdates.map((update) => (
                            <div
                                key={update.id}
                                className={`p-4 rounded-xl border-l-4 ${update.type === 'important'
                                    ? 'bg-red-50 border-red-500 text-red-800'
                                    : update.type === 'info'
                                        ? 'bg-blue-50 border-blue-500 text-blue-800'
                                        : 'bg-brand-50 border-brand-500 text-brand-800'
                                    }`}
                            >
                                <p className="text-xs font-medium mb-2">{update.text.substring(0, 40)}...</p>
                                <p className="text-xs opacity-75">{formatDate(update.date)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Search and Filter */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-2 md:px-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        <div className="flex-1 w-full md:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search news and updates..."
                                    className="w-full pl-10 pr-4 py-3 border border-brand-200 rounded-full focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1 md:gap-3">
                            {newsCategories.map((category) => {
                                const IconComponent = category.icon || Tag;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex text-xs md:text-base items-center gap-2 px-2.5 md:px-4 py-1 md:py-2 rounded-full transition-all ${selectedCategory === category.id
                                            ? 'bg-brand-600 text-white'
                                            : 'bg-brand-100 text-brand-600 hover:bg-brand-200'
                                            }`}
                                    >
                                        {category.icon && <IconComponent className="w-4 h-4" />}
                                        {category.name}
                                        <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === category.id
                                            ? 'bg-white/20 text-white'
                                            : 'bg-brand-200 text-brand-700'
                                            }`}>
                                            {category.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured News */}
            {featuredNews.some(article => selectedCategory === 'all' || article.category === selectedCategory) && (
                <section className=" py-4 md:py-16 bg-brand-50">
                    <div className="max-w-7xl mx-auto px-2 md:px-6">
                        <h2 className="text-xl md:text-3xl font-bold text-brand-900 mb-4 md:mb-8">Featured Stories</h2>
                        <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
                            {featuredNews
                                .filter(article => selectedCategory === 'all' || article.category === selectedCategory)
                                .map((article) => {
                                    const CategoryIcon = getCategoryIcon(article.category);
                                    const categoryColor = getCategoryColor(article.category);

                                    return (
                                        <article key={article.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                                            <div className="relative h-64">
                                                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 bg-brand-600 text-white text-sm font-semibold rounded-full">
                                                        Featured
                                                    </span>
                                                </div>
                                                <div className="absolute top-4 right-4">
                                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full bg-${categoryColor}-100 text-${categoryColor}-800`}>
                                                        <CategoryIcon className="w-4 h-4 inline mr-1" />
                                                        {newsCategories.find(cat => cat.id === article.category)?.name}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="px-3 py-4 md:p-8">
                                                <h2 className="md:text-2xl font-bold text-brand-900 mb-4 line-clamp-2">
                                                    {article.title}
                                                </h2>

                                                <p className="text-sm md:text-base text-brand-600 mb-6 leading-relaxed line-clamp-3">
                                                    {article.excerpt}
                                                </p>

                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex flex-wrap items-center space-x-4 text-sm text-brand-500">
                                                        <div className="flex shrink-0 items-center">
                                                            <User className="w-4 h-4 mr-1" />
                                                            {article.author}
                                                        </div>
                                                        <div className="flex shrink-0 items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {formatDate(article.date)}
                                                        </div>
                                                        <div className="flex shrink-0 items-center">
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            {article.readTime}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {article.tags.map((tag, index) => (
                                                        <span key={index} className="px-3 py-1 bg-brand-100 text-brand-700 text-sm rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <button className="w-full py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
                                                    Read Full Story
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                        </div>
                    </div>
                </section>
            )}

            {/* Recent News Grid */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-2 md:px-6">
                    <h2 className="text-xl md:text-3xl font-bold text-brand-900 mb-4 md:mb-8">Recent News</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentNews
                            .filter(article => selectedCategory === 'all' || article.category === selectedCategory)
                            .map((article) => {
                                const CategoryIcon = getCategoryIcon(article.category);
                                const categoryColor = getCategoryColor(article.category);

                                return (
                                    <article key={article.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-brand-100">
                                        <div className="relative h-48">
                                            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${categoryColor}-100 text-${categoryColor}-800`}>
                                                    <CategoryIcon className="w-3 h-3 inline mr-1" />
                                                    {newsCategories.find(cat => cat.id === article.category)?.name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-2 pb-6 md:p-6">
                                            <h3 className="md:text-xl font-bold text-brand-900 mb-3 line-clamp-2">
                                                {article.title}
                                            </h3>

                                            <p className="text-brand-600 mb-4 text-sm leading-relaxed line-clamp-3">
                                                {article.excerpt}
                                            </p>

                                            <div className="flex items-center justify-between mb-4 text-xs text-brand-500">
                                                <div className="flex items-center">
                                                    <User className="w-3 h-3 mr-1" />
                                                    {article.author}
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(article.date)}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {article.tags.slice(0, 2).map((tag, index) => (
                                                    <span key={index} className="px-2 py-1 bg-brand-100 text-brand-700 text-xs rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <button className="w-full py-2 text-brand-600 border border-brand-600 font-medium rounded-full hover:bg-brand-600 hover:text-white transition-colors text-sm">
                                                Read More
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                    </div>

                    {filteredNews.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-brand-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-brand-700 mb-2">No articles found</h3>
                            <p className="text-sm md:text-base text-brand-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Signup */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-3 md:px-6 text-center">
                    <h2 className="text-xl md:text-4xl font-bold text-black mb-6">
                        Stay Updated
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mb-8">
                        Subscribe to our newsletter and never miss important school news and announcements.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-4 py-2 md:py-3 rounded-full border-1 border-brand-400 focus:ring-2 focus:ring-brand-300"
                        />
                        <button className="px-8 py-2 md:py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-white transition-colors">
                            Subscribe
                        </button>
                    </div>

                    <p className="text-xs md:text-base text-gray-400 mt-4">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </section>
        </HomeWrapper>
    );
};

export default SchoolNewsPage;