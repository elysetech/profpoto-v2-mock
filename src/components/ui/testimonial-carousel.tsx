"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoplaySpeed?: number;
}

export function TestimonialCarousel({ 
  testimonials, 
  autoplaySpeed = 5000 
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, autoplaySpeed);
    
    return () => clearInterval(interval);
  }, [testimonials.length, autoplaySpeed]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden py-10">
      <div className="relative mx-auto max-w-3xl px-4">
        {/* Testimonial Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all duration-300 transform">
          <div className="flex flex-col items-center text-center">
            {testimonials[currentIndex].image && (
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-blue-200">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="relative mb-6">
              <svg className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-gray-100 dark:text-gray-700" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.7662 12.86C3.84023 12.86 3.05263 12.5533 2.4034 11.94C1.75417 11.3266 1.42953 10.4467 1.42953 9.29999C1.42953 8.07332 1.83616 6.87332 2.64942 5.69999C3.46268 4.49999 4.31458 3.55332 5.20513 2.85999L6.2802 4.25999C5.4736 4.73999 4.79477 5.27332 4.2437 5.85999C3.69262 6.44666 3.36555 7.12666 3.26204 7.89999C3.45207 7.79332 3.6421 7.73999 3.83213 7.73999C4.16916 7.73999 4.48955 7.79999 4.79329 7.91999C5.09703 8.03999 5.3642 8.21332 5.5948 8.43999C5.82539 8.66666 6.00913 8.93999 6.14601 9.25999C6.28289 9.57999 6.35133 9.92666 6.35133 10.3ZM14.6701 10.3C14.6701 11.0733 14.4213 11.7 13.9239 12.18C13.4264 12.6333 12.798 12.86 12.0387 12.86C11.1127 12.86 10.3251 12.5533 9.67588 11.94C9.02665 11.3266 8.70201 10.4467 8.70201 9.29999C8.70201 8.07332 9.10864 6.87332 9.9219 5.69999C10.7351 4.49999 11.5871 3.55332 12.4776 2.85999L13.5527 4.25999C12.7461 4.73999 12.0673 5.27332 11.5162 5.85999C10.9651 6.44666 10.638 7.12666 10.5345 7.89999C10.7246 7.79332 10.9146 7.73999 11.1046 7.73999C11.4416 7.73999 11.762 7.79999 12.0658 7.91999C12.3695 8.03999 12.6367 8.21332 12.8673 8.43999C13.0979 8.66666 13.2816 8.93999 13.4185 9.25999C13.5554 9.57999 13.6238 9.92666 13.6238 10.3H14.6701Z" fill="currentColor" />
              </svg>
              <p className="text-gray-600 dark:text-gray-300 text-lg relative z-10">
                {testimonials[currentIndex].content}
              </p>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {testimonials[currentIndex].name}
            </h3>
            
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {testimonials[currentIndex].role}
            </p>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        {testimonials.length > 1 && (
          <>
            <button 
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              aria-label="Témoignage précédent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={goToNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              aria-label="Témoignage suivant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Dots Indicator */}
        {testimonials.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full focus:outline-none ${
                  index === currentIndex 
                    ? "bg-blue-600 dark:bg-blue-400" 
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
