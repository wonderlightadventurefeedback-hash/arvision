import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ArrowRight, Eye, Sparkles, Glasses, CheckCircle2, ShieldCheck, Calendar, Truck } from 'lucide-react';

interface TryAtHomeMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const TryAtHomeMegaMenu: React.FC<TryAtHomeMegaMenuProps> = ({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { setIsBookAppointmentOpen, setActiveCategory, setSearchQuery } = useStore();
  const [activeTab, setActiveTab] = useState<'eye-test' | 'try-before-buy'>('eye-test');
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Smooth entrance/exit animation timing
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen && !isVisible) return null;

  const handleBookEyeTest = () => {
    onClose();
    setIsBookAppointmentOpen(true);
  };

  const handleTryFramesClick = () => {
    onClose();
    setActiveCategory('All');
    setSearchQuery('');
    const catalogEl = document.getElementById('product-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`fixed inset-0 top-[60px] sm:top-[70px] z-50 transition-all duration-300 ease-out flex justify-center ${
        isVisible ? 'opacity-100 backdrop-blur-md bg-black/60' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Mega Menu Inner Container */}
      <div
        ref={menuRef}
        onMouseEnter={onMouseEnter}
        className={`w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 sm:py-12 transform transition-all duration-300 ease-out select-none ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-6 opacity-0 scale-[0.98]'
        }`}
      >
        {/* Top Close Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5 text-xs tracking-wider uppercase"
            aria-label="Close menu"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: At Home Services title & Tabs */}
          <div className="md:col-span-4 lg:col-span-4 space-y-7 sm:pt-2">
            {/* Title matching screenshot */}
            <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-[1.15] tracking-tight">
              At Home<br />Services
            </h3>

            {/* Tab 1: Free Eye Test */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('eye-test')}
                onMouseEnter={() => setActiveTab('eye-test')}
                className={`text-2xl sm:text-3xl font-serif text-left tracking-tight transition-all duration-200 cursor-pointer block w-full ${
                  activeTab === 'eye-test'
                    ? 'text-white font-medium drop-shadow-md'
                    : 'text-stone-400 hover:text-stone-200 font-normal'
                }`}
              >
                Free Eye Test
              </button>
              <div
                className={`h-[1px] mt-2.5 transition-all duration-200 ${
                  activeTab === 'eye-test' ? 'bg-white/40' : 'bg-white/10'
                }`}
              />
            </div>

            {/* Tab 2: Try Before You Buy */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('try-before-buy')}
                onMouseEnter={() => setActiveTab('try-before-buy')}
                className={`text-2xl sm:text-3xl font-serif text-left tracking-tight transition-all duration-200 cursor-pointer block w-full ${
                  activeTab === 'try-before-buy'
                    ? 'text-white font-medium drop-shadow-md'
                    : 'text-stone-400 hover:text-stone-200 font-normal'
                }`}
              >
                Try Before You Buy
              </button>
              <div
                className={`h-[1px] mt-2.5 transition-all duration-200 ${
                  activeTab === 'try-before-buy' ? 'bg-white/40' : 'bg-white/10'
                }`}
              />
            </div>

            {/* Bottom Link matching screenshot */}
            <div className="pt-6">
              <button
                onClick={handleBookEyeTest}
                className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-white/90 hover:text-white transition-all cursor-pointer"
              >
                <span className="border-b border-transparent group-hover:border-white transition-colors pb-0.5">
                  BOOK APPOINTMENT
                </span>
                <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Showcase matching screenshot */}
          <div className="md:col-span-8 lg:col-span-8">
            {activeTab === 'eye-test' ? (
              /* Tab 1 Content: Exact photo banner from screenshot */
              <div className="relative group max-w-2xl overflow-hidden rounded-md shadow-2xl border border-white/10 bg-black/40">
                {/* Main Eye Test Photograph from user screenshot */}
                <div
                  onClick={handleBookEyeTest}
                  className="cursor-pointer overflow-hidden relative aspect-[495/275]"
                >
                  <img
                    src="/images/try-at-home/eye-test-banner.jpg"
                    alt="At Home Eye Test with certified optometrist"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />

                  {/* Subtle hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Interactive Hotspot Overlay for the 3 features at bottom */}
                  <div className="absolute bottom-0 inset-x-0 h-20 grid grid-cols-3 z-10">
                    {/* Hotspot 1: 12 STEPS EYE CHECKUP */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookEyeTest();
                      }}
                      className="cursor-pointer hover:bg-white/10 transition-colors rounded-sm flex items-end justify-center pb-2 group/hotspot"
                      title="Click to book 12-step eye checkup at home"
                    >
                      <span className="opacity-0 group-hover/hotspot:opacity-100 transition-opacity bg-black/80 text-[10px] text-amber-300 px-2 py-0.5 rounded font-mono mb-1">
                        Book Test ↗
                      </span>
                    </div>

                    {/* Hotspot 2: LATEST EQUIPMENT */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookEyeTest();
                      }}
                      className="cursor-pointer hover:bg-white/10 transition-colors rounded-sm flex items-end justify-center pb-2 group/hotspot"
                      title="Click to schedule examination with computer autorefractor"
                    >
                      <span className="opacity-0 group-hover/hotspot:opacity-100 transition-opacity bg-black/80 text-[10px] text-amber-300 px-2 py-0.5 rounded font-mono mb-1">
                        Equipment Details ↗
                      </span>
                    </div>

                    {/* Hotspot 3: TRY 150+ FRAMES AT HOME */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTryFramesClick();
                      }}
                      className="cursor-pointer hover:bg-white/10 transition-colors rounded-sm flex items-end justify-center pb-2 group/hotspot"
                      title="Click to explore all 150+ trial frames"
                    >
                      <span className="opacity-0 group-hover/hotspot:opacity-100 transition-opacity bg-black/80 text-[10px] text-amber-300 px-2 py-0.5 rounded font-mono mb-1">
                        Explore Frames ↗
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Clickable Bar with Quick Actions */}
                <div className="bg-black/90 p-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-white">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-stone-300 font-medium">
                      Certified Optometrist & 150+ frames brought right to your door
                    </span>
                  </div>
                  <button
                    onClick={handleBookEyeTest}
                    className="px-4 py-1.5 rounded-lg bg-white text-black hover:bg-amber-300 transition-colors text-xs font-bold tracking-wide cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Book Free Home Visit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Tab 2 Content: Exact photo banner from screenshot 1 (Try Before You Buy) */
              <div className="relative group max-w-2xl overflow-hidden rounded-md shadow-2xl border border-white/10 bg-black/40">
                <div
                  onClick={handleBookEyeTest}
                  className="cursor-pointer overflow-hidden relative aspect-[494/271]"
                >
                  <img
                    src="/images/try-at-home/try-before-buy-banner.jpg"
                    alt="Try Before You Buy - Home frame trial with optician"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />

                  {/* Subtle hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Interactive Hotspot Overlay for the 3 features at bottom matching screenshot */}
                  <div className="absolute bottom-0 inset-x-0 h-20 grid grid-cols-3 z-10">
                    {/* Hotspot 1: CHOOSE ANY 7 FAV FRAMES */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTryFramesClick();
                      }}
                      className="cursor-pointer hover:bg-white/10 transition-colors rounded-sm flex items-end justify-center pb-2 group/hotspot"
                      title="Choose up to 7 favorite frames for trial"
                    >
                      <span className="opacity-0 group-hover/hotspot:opacity-100 transition-opacity bg-black/80 text-[10px] text-amber-300 px-2 py-0.5 rounded font-mono mb-1">
                        Select 7 Frames ↗
                      </span>
                    </div>

                    {/* Hotspot 2: BOOK A FREE SLOT */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookEyeTest();
                      }}
                      className="cursor-pointer hover:bg-white/10 transition-colors rounded-sm flex items-end justify-center pb-2 group/hotspot"
                      title="Book a convenient free slot at home"
                    >
                      <span className="opacity-0 group-hover/hotspot:opacity-100 transition-opacity bg-black/80 text-[10px] text-amber-300 px-2 py-0.5 rounded font-mono mb-1">
                        Book Slot ↗
                      </span>
                    </div>

                    {/* Hotspot 3: PERFORMED BY EYE-CARE EXPERTS */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookEyeTest();
                      }}
                      className="cursor-pointer hover:bg-white/10 transition-colors rounded-sm flex items-end justify-center pb-2 group/hotspot"
                      title="Certified optical specialists accompany frames"
                    >
                      <span className="opacity-0 group-hover/hotspot:opacity-100 transition-opacity bg-black/80 text-[10px] text-amber-300 px-2 py-0.5 rounded font-mono mb-1">
                        Expert Visit ↗
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="bg-black/90 p-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-white">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs text-stone-300 font-medium">
                      Select up to 7 favorite frames to try at home with expert consultation
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTryFramesClick}
                      className="px-3.5 py-1.5 rounded-lg border border-white/20 hover:border-white text-stone-200 hover:text-white transition text-xs font-semibold cursor-pointer"
                    >
                      Browse Frames
                    </button>
                    <button
                      onClick={handleBookEyeTest}
                      className="px-4 py-1.5 rounded-lg bg-white text-black hover:bg-amber-300 transition-colors text-xs font-bold tracking-wide cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Book Free Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

