"use client";
import React, { useEffect, useState } from "react";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { schoolSlides } from "@/app/content/landingPage";
import Button from "../Form/Button";

const SlideDisplay = ({ noContent, pageTitle }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (autoPlay && !isPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % schoolSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, isPlaying, schoolSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % schoolSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + schoolSlides.length) % schoolSlides.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setAutoPlay(false);
  };

  const currentSlideData = schoolSlides[currentSlide];

  return (
    <div className="relative w-full h-[340px] overflow-hidden mb-10">
      <div className="absolute inset-0">
        {currentSlideData.type === "video" && currentSlideData.videoUrl ? (
          <video
            className="w-full h-full object-cover"
            src={currentSlideData.videoUrl}
            poster={currentSlideData.backgroundImage}
            muted
            loop
            playsInline
            autoPlay={isPlaying}
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat object-top"
            style={{
              backgroundImage: `url('${currentSlideData.backgroundImage}')`,
            }}
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      {!noContent && (
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-6 max-w-4xl mx-auto">
            {/* Play Button (for video slides) */}
            {currentSlideData.type === "video" && (
              <div className="mb-8">
                <button
                  onClick={togglePlay}
                  className="w-20 h-20 bg-brand-500 bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 mx-auto backdrop-blur-sm border-2 border-white border-opacity-50"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white ml-1" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 leading-tight">
              {currentSlideData.title}
            </h1>

            {/* Subtitle */}
            {currentSlideData.subtitle && (
              <p className="text-lg md:text-2xl lg:text-3xl font-light opacity-90 mb-8">
                {currentSlideData.subtitle}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                title="Apply Now"
                className="py-3 !rounded-full w-40 md:w-44"
              />
              <Button
                title="Learn More"
                variant="outline"
                className="border-white py-3 w-44 !rounded-full text-white hover:text-black"
              />
            </div>
          </div>
        </div>
      )}

      {pageTitle && (
        <div className="w-80 h-40 border-t-5 z-30 absolute bottom-4 left-10 md:left-20 border-brand-600 p-5 px-10">
          <h2 className="text-2xl font-bold text-white text-center z-20 relative leading-9">
            {pageTitle}
          </h2>
          <div className="absolute inset-0 bg-brand-200 opacity-50" />
        </div>
      )}

      {/* Navigation Arrows */}
      {!noContent && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-brand-500 bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20  bg-brand-500 bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {schoolSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>

      {/* Auto-play Control */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            autoPlay
              ? "bg-brand-500 bg-opacity-20 text-white hover:bg-opacity-30"
              : "bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-opacity-70"
          } backdrop-blur-sm`}
        >
          Auto: {autoPlay ? "ON" : "OFF"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20 z-20">
        <div
          className="h-full bg-brand-500 transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / schoolSlides.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default SlideDisplay;
