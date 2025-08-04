"use client"
import React, { useState } from 'react';
import { Instagram, Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Play } from 'lucide-react';
import { socialPosts } from '@/app/content/landingPage';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

const SocialMediaFeed = () => {
    const [likedPosts, setLikedPosts] = useState(new Set());

    const toggleLike = (postId) => {
        const newLikedPosts = new Set(likedPosts);
        if (newLikedPosts.has(postId)) {
            newLikedPosts.delete(postId);
        } else {
            newLikedPosts.add(postId);
        }
        setLikedPosts(newLikedPosts);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Follow Us on Social Media</h2>
                <p className="text-gray-600">Stay connected with our community and latest updates</p>
                <div className="flex justify-center mt-4">
                    <a href="#" className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                        <Instagram className="w-5 h-5" />
                        <span>@pisoschool</span>
                    </a>
                </div>
            </div>

            {/* Posts Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={
                    typeof window !== "undefined"
                        ? window.innerWidth < 700
                            ? 1.4
                            : 3
                        :1.6
                } // Show 1.5 slides
                centeredSlides={false}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true, modifierClass: "-mt-10" }}
                loop={true}
                className="pure-image-slider"
            >
                {socialPosts.map((post) => (
                    <SwiperSlide>
                        <div key={post.id} className="bg-white rounded-lg shadow-md max-h-[600px] overflow-hidden hover:shadow-lg transition-shadow duration-200">
                            {/* Post Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <Instagram className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">{post.username}</p>
                                        <p className="text-xs text-gray-500">{post.timeAgo}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Post Image/Video */}
                            <div className="relative">
                                <img
                                    src={post.image}
                                    alt="Post content"
                                    className="w-full h-64 object-cover"
                                />

                                {/* Carousel Indicator */}
                                {post.isCarousel && (
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-black bg-opacity-50 rounded-full px-2 py-1">
                                            <span className="text-white text-xs">1/3</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Post Actions */}
                            <div className="p-4">
                               

                                {/* Likes Count */}
                                <p className="font-semibold text-sm text-gray-800 mb-2">
                                    {likedPosts.has(post.id) ? post.likes + 1 : post.likes} likes
                                </p>

                                {/* Caption */}
                                <div className="text-sm text-gray-800 mb-2">
                                    <span className="font-semibold">{post.username}</span>
                                    <span className="ml-2">{post.caption}</span>
                                </div>

                                {/* Hashtags */}
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {post.hashtags.map((hashtag, index) => (
                                        <span key={index} className="text-blue-500 text-sm hover:underline cursor-pointer">
                                            {hashtag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>           
        </div>
    );
};

export default SocialMediaFeed;