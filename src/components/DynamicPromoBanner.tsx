import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { PromoBanner } from '../types';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react';

interface DynamicPromoBannerProps {
  position?: 'homepage_top' | 'below_hero' | 'mid_homepage' | 'above_catalog' | 'bottom_promo';
}

export const DynamicPromoBanner: React.FC<DynamicPromoBannerProps> = ({
  position = 'below_hero',
}) => {
  const { promoBanners, products, openPDP, setActiveCategory } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Filter only published and non-expired banners for this position (or below_hero as default)
  const activeBanners = promoBanners.filter((banner) => {
    if (banner.status !== 'published') return false;
    if (position && banner.displayPosition && banner.displayPosition !== position) {
      return false;
    }
    const now = new Date().toISOString().split('T')[0];
    if (banner.startDate && banner.startDate > now) return false;
    if (banner.endDate && banner.endDate < now) return false;
    return true;
  });

  // Autoplay slider every 5.5s
  useEffect(() => {
    if (isPaused || activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  // Resolve linked product if any
  const linkedProduct = currentBanner.productId
    ? products.find((p) => p.id === currentBanner.productId)
    : undefined;

  const handleCtaClick = () => {
    if (linkedProduct) {
      openPDP(linkedProduct);
    } else if (currentBanner.ctaLink.startsWith('PDP:')) {
      const pid = currentBanner.ctaLink.replace('PDP:', '');
      const prod = products.find((p) => p.id === pid);
      if (prod) openPDP(prod);
    } else if (currentBanner.ctaLink) {
      setActiveCategory(currentBanner.ctaLink);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  // Determine theme styles
  const isGold = currentBanner.theme === 'black-gold';
  const isPurple = currentBanner.theme === 'black-purple';
  const isCyan = currentBanner.theme === 'black-cyan';
  const isMinimal = currentBanner.theme === 'minimal';

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-6 sm:my-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.targetTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (!touchStartX.current) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 50) handleNext();
        if (diff < -50) handlePrev();
        touchStartX.current = null;
      }}
    >
      <div
        className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl ${
          isGold
            ? 'bg-[#09080C] text-amber-100 shadow-[0_10px_40px_rgba(245,158,11,0.15)]'
            : isPurple
            ? 'bg-[#090714] text-purple-100 shadow-[0_10px_40px_rgba(168,85,247,0.2)]'
            : isCyan
            ? 'bg-[#050B14] text-cyan-100 shadow-[0_10px_40px_rgba(6,182,212,0.2)]'
            : 'bg-slate-950 text-white shadow-xl'
        }`}
        style={
          currentBanner.bgImage
            ? {
                backgroundImage: `url(${currentBanner.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : currentBanner.bgColor
            ? { backgroundColor: currentBanner.bgColor }
            : {}
        }
      >
        {/* 1. Atmospheric Purple & Cyan Lighting Effects */}
        {currentBanner.hasLightingEffects && (
          <>
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-[90px] pointer-events-none" />
            <div className="absolute top-1/2 right-10 w-72 h-72 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />
          </>
        )}

        {/* 2. Hanging Glowing Festive Light Bulbs (From Reference) */}
        {currentBanner.hasGlowingLights && (
          <div className="absolute top-0 inset-x-0 h-6 flex justify-between items-start px-6 sm:px-12 pointer-events-none z-20 overflow-hidden">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-[1px] h-2 bg-amber-400/40" />
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    i % 2 === 0
                      ? 'bg-amber-300 shadow-[0_0_12px_#f59e0b]'
                      : 'bg-yellow-200 shadow-[0_0_10px_#fbbf24]'
                  } animate-pulse`}
                  style={{ animationDelay: `${(i % 5) * 0.3}s` }}
                />
              </div>
            ))}
          </div>
        )}

        {/* 3. Gold Decorative Filigree Border & Frame (From Reference) */}
        {currentBanner.borderStyle === 'gold-filigree' && (
          <>
            {/* Outer Gold Border */}
            <div className="absolute inset-0 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl pointer-events-none z-20" />
            {/* Inner Delicate Gold Inset */}
            <div className="absolute inset-2 sm:inset-3 border border-amber-400/30 rounded-xl sm:rounded-2xl pointer-events-none z-20" />

            {/* Corner Filigree Accents */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-400 pointer-events-none z-20" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-amber-400 pointer-events-none z-20" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-amber-400 pointer-events-none z-20" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-400 pointer-events-none z-20" />
          </>
        )}

        {/* Cyber Neon Glow Border */}
        {currentBanner.borderStyle === 'neon-glow' && (
          <div className="absolute inset-0 border-2 border-purple-500/50 rounded-2xl sm:rounded-3xl pointer-events-none z-20 shadow-[inset_0_0_20px_rgba(168,85,247,0.3)]" />
        )}

        {/* 4. Advertisement (AD) Pill Label */}
        <div className="absolute top-4 left-5 sm:top-5 sm:left-7 z-30 flex items-center gap-2">
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase border backdrop-blur-md ${
              isGold
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : isPurple
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            }`}
          >
            {currentBanner.adLabel || 'AD'}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-200/80">
            <Sparkles className="w-3 h-3 text-amber-400" />
            WONDERLIX SIGNATURE COLLECTION
          </span>
        </div>

        {/* 5. Main Responsive Grid Content */}
        <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-12 lg:py-14 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Column: Typography, Prices, Call to Action */}
          <div className="w-full lg:w-3/5 space-y-4 text-center lg:text-left">
            {/* Promotional Super Heading */}
            <div className="space-y-1">
              <div
                className={`text-xs sm:text-sm font-extrabold tracking-widest uppercase ${
                  isGold ? 'text-amber-400' : isPurple ? 'text-purple-400' : 'text-cyan-400'
                }`}
              >
                {currentBanner.promotionalHeading}
              </div>
              <h2
                className={`text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight sm:leading-none ${
                  isGold
                    ? 'bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(245,158,11,0.3)]'
                    : isPurple
                    ? 'bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent'
                    : 'text-white'
                }`}
              >
                {currentBanner.productName}
              </h2>
            </div>

            {/* Subtitle / Description */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed line-clamp-2">
              {currentBanner.productDescription || currentBanner.subtitle}
            </p>

            {/* Pricing Box & Discount Badge */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <div className="flex items-baseline gap-2.5">
                <span className="text-xs sm:text-sm text-slate-400 uppercase font-semibold">
                  Special Price:
                </span>
                <span
                  className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight font-heading ${
                    isGold ? 'text-amber-300' : isPurple ? 'text-cyan-300' : 'text-emerald-400'
                  }`}
                >
                  ₹{currentBanner.discountedPrice.toLocaleString()}
                </span>
                {currentBanner.originalPrice > currentBanner.discountedPrice && (
                  <span className="text-sm sm:text-base text-slate-400 line-through font-medium">
                    ₹{currentBanner.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Discount Percentage Pill */}
              {currentBanner.discountPercentage > 0 && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1 ${
                    isGold
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  {currentBanner.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* CTA Button & Guarantees */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleCtaClick}
                className={`px-7 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center gap-2.5 shadow-lg group cursor-pointer ${
                  isGold
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105'
                    : isPurple
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-105'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold shadow-cyan-500/30'
                }`}
              >
                <span>{currentBanner.ctaText || 'Shop This Frame'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  1-Year Hinge Warranty
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Free Zero-Power / BLU Lenses</span>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Product Image Showcase */}
          <div className="w-full lg:w-2/5 flex items-center justify-center relative">
            {/* Glowing Pedestal / Circular Glow Underneath */}
            <div
              className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-[60px] pointer-events-none ${
                isGold ? 'bg-amber-500/25' : isPurple ? 'bg-purple-600/30' : 'bg-cyan-500/25'
              }`}
            />

            {/* Product Image with Soft Float Animation */}
            <div className="relative group cursor-pointer" onClick={handleCtaClick}>
              <img
                src={currentBanner.productImage}
                alt={currentBanner.productName}
                className="max-h-56 sm:max-h-72 lg:max-h-80 w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500"
              />

              {/* Quick View Badge */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1 shadow-md">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>Quick View</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Navigation Controls (When multiple banners active) */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition opacity-80 hover:opacity-100 z-30 cursor-pointer"
              aria-label="Previous Banner"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition opacity-80 hover:opacity-100 z-30 cursor-pointer"
              aria-label="Next Banner"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-30">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? isGold
                        ? 'w-6 bg-amber-400'
                        : 'w-6 bg-cyan-400'
                      : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
