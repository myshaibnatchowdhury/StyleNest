import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroCarousel: React.FC = () => {
  const { slides, setSelectedCategorySlug } = useStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeSlides = slides.filter((s) => s.is_active);

  // Auto advance carousel every 6s
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handleCtaClick = () => {
    const el = document.getElementById('latest-collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF5ED] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#292824] rounded-2xl overflow-hidden shadow-card text-white min-h-[460px] sm:min-h-[500px] flex items-center">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentSlide.image_url}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-top sm:object-center transform scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Dark warm gradient mask so text is crisp */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#173B32]/95 via-[#173B32]/85 to-transparent sm:via-[#173B32]/75" />
          </div>

          {/* Carousel Left Content */}
          <div className="relative z-10 max-w-xl p-8 sm:p-12 lg:p-16 space-y-6">
            <div className="inline-block">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#F9D8CE] bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                {currentSlide.tag || 'NEW SEASON COLLECTION'}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-white">
              {currentSlide.title}
            </h1>

            <p className="text-sm sm:text-base text-[#FAF5ED]/90 max-w-md font-normal leading-relaxed">
              {currentSlide.subtitle}
            </p>

            <div className="pt-2">
              <button
                onClick={handleCtaClick}
                className="bg-[#C9684B] hover:bg-[#B25439] text-white px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide inline-flex items-center gap-2.5 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{currentSlide.cta_text || 'Shop Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel Arrow Controls */}
          {activeSlides.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer"
                title="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer"
                title="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlideIndex === idx
                        ? 'w-7 bg-[#C9684B]'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
