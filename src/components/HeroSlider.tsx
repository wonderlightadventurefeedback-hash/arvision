import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Pause, Play } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { heroSlides, setActiveCategory, setIsBookAppointmentOpen } = useStore();
  const activeSlides = heroSlides.filter((s) => s.isActive);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-slide effect every 4.5 seconds
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext(); // swiped left
    } else if (diff < -50) {
      handlePrev(); // swiped right
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleCtaClick = (destination: string) => {
    if (destination === 'EyeTest') {
      setIsBookAppointmentOpen(true);
    } else {
      setActiveCategory(destination);
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-900 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Image Background with Gradient Overlay */}
      <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center">
        {/* Background Image Container */}
        <div className="absolute inset-0">
          <picture>
            <source media="(max-width: 640px)" srcSet={currentSlide.mobileImage} />
            <img
              src={currentSlide.desktopImage}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
            />
          </picture>
          {/* Subtle multi-stop gradient scrim for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent sm:hidden" />
        </div>

        {/* Hero Content Container */}
        <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16 w-full z-10">
          <div className="max-w-xl text-white space-y-4">
            {/* Slide Badge */}
            {currentSlide.badge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {currentSlide.badge}
              </span>
            )}

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-heading text-white drop-shadow-sm">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed line-clamp-3">
              {currentSlide.subtitle}
            </p>

            {/* Tagline / Deal */}
            {currentSlide.tagline && (
              <p className="text-amber-300 font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                {currentSlide.tagline}
              </p>
            )}

            {/* CTA Button */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleCtaClick(currentSlide.ctaLink)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsBookAppointmentOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition cursor-pointer"
              >
                <span>Book Free Eye Exam</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition opacity-80 hover:opacity-100 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition opacity-80 hover:opacity-100 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pagination Indicators & Pause Control */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-2">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? 'w-8 h-2 bg-amber-400'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="ml-3 p-1 rounded-full bg-black/40 text-white/70 hover:text-white transition text-xs"
          title={isPaused ? 'Resume auto-sliding' : 'Pause sliding'}
        >
          {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
