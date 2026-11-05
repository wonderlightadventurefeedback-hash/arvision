import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ArrowRight } from 'lucide-react';

interface SunglassesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'buying-for' | 'by-shape' | 'by-brand' | 'powered';
}

export const SunglassesMegaMenu: React.FC<SunglassesMegaMenuProps> = ({
  isOpen,
  onClose,
  initialTab = 'buying-for',
}) => {
  const { setActiveCategory, setSearchQuery } = useStore();
  const [activeTab, setActiveTab] = useState<'buying-for' | 'by-shape' | 'by-brand' | 'powered'>(initialTab);
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Reset to 1st image ("buying-for") whenever menu opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('buying-for');
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

  const handleCardClick = (filterLabel: string, searchQueryVal?: string) => {
    setActiveCategory('Sunglasses');
    if (searchQueryVal) {
      setSearchQuery(searchQueryVal);
    }
    onClose();
    const catalogEl = document.getElementById('product-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Data for Tab 1: Buying for
  const buyingForItems = [
    {
      id: 'men',
      title: 'MEN',
      image: '/images/sunglasses/buying-for-men.jpg',
      query: 'Men',
    },
    {
      id: 'women',
      title: 'WOMEN',
      image: '/images/sunglasses/buying-for-women.jpg',
      query: 'Women',
    },
    {
      id: 'kids',
      title: 'KIDS',
      image: '/images/sunglasses/buying-for-kids.jpg',
      query: 'Kids',
    },
  ];

  // Data for Tab 2: By Shape
  const shapesRow1 = [
    { id: 'square', title: 'SQUARE', image: '/images/sunglasses/shape-square.jpg', query: 'Square' },
    { id: 'rectangle', title: 'RECTANGLE', image: '/images/sunglasses/shape-rectangle.jpg', query: 'Rectangle' },
    { id: 'aviator', title: 'AVIATOR', image: '/images/sunglasses/shape-aviator.jpg', query: 'Aviator' },
    { id: 'cateye', title: 'CATEYE', image: '/images/sunglasses/shape-cateye.jpg', query: 'Cat Eye' },
    { id: 'geometric', title: 'GEOMETRIC', image: '/images/sunglasses/shape-geometric.jpg', query: 'Geometric' },
  ];

  const shapesRow2 = [
    { id: 'round', title: 'ROUND', image: '/images/sunglasses/shape-round.jpg', query: 'Round' },
    { id: 'clubmaster', title: 'CLUBMASTER', image: '/images/sunglasses/shape-clubmaster.jpg', query: 'Clubmaster' },
  ];

  // Data for Tab 3: By Brand
  const premiumBrands = [
    { id: 'john-jacobs', title: 'JOHN JACOBS', image: '/images/sunglasses/brand-john-jacobs.jpg', query: 'John Jacobs' },
    { id: 'meller', title: 'MELLER', image: '/images/sunglasses/brand-meller.jpg', query: 'Meller' },
  ];

  const classicBrands = [
    { id: 'vincent-chase', title: 'VINCENT CHASE', image: '/images/sunglasses/brand-vincent-chase.jpg', query: 'Vincent Chase' },
    { id: 'hustlr', title: 'hustlr', image: '/images/sunglasses/brand-hustlr.jpg', query: 'Hustlr' },
    { id: 'arvision-studio', title: 'AR-Vision STUDIO', image: '/images/sunglasses/brand-lenskart-studio.jpg', query: 'Studio' },
  ];

  // Data for Tab 4: Powered Sunglasses
  const poweredItems = [
    { id: 'p-men', title: 'MEN', image: '/images/sunglasses/powered-men.jpg', query: 'Men' },
    { id: 'p-women', title: 'WOMEN', image: '/images/sunglasses/powered-women.jpg', query: 'Women' },
  ];

  return (
    <div
      className={`fixed inset-0 top-[60px] sm:top-[70px] z-50 transition-all duration-300 ease-out flex justify-center ${
        isVisible ? 'opacity-100 backdrop-blur-2xl bg-black/85' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Mega Menu Inner Container */}
      <div
        ref={menuRef}
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
          {/* Left Column: Category Tabs (Styled with elegant serif font) */}
          <div className="md:col-span-3 space-y-5 sm:pt-2">
            {/* 1. Buying for (1st image view) */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('buying-for')}
                onMouseEnter={() => setActiveTab('buying-for')}
                className={`text-2xl sm:text-3xl font-serif text-left tracking-tight transition-all duration-200 cursor-pointer block w-full ${
                  activeTab === 'buying-for'
                    ? 'text-white font-medium drop-shadow-md'
                    : 'text-stone-400 hover:text-stone-200 font-normal'
                }`}
              >
                Buying for
              </button>
              {activeTab === 'buying-for' && (
                <div className="mt-2.5 w-full h-[1px] bg-white/40 animate-fade-in" />
              )}
            </div>

            {/* 2. By Shape */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('by-shape')}
                onMouseEnter={() => setActiveTab('by-shape')}
                className={`text-2xl sm:text-3xl font-serif text-left tracking-tight transition-all duration-200 cursor-pointer block w-full ${
                  activeTab === 'by-shape'
                    ? 'text-white font-medium drop-shadow-md'
                    : 'text-stone-400 hover:text-stone-200 font-normal'
                }`}
              >
                By Shape
              </button>
              {activeTab === 'by-shape' && (
                <div className="mt-2.5 w-full h-[1px] bg-white/40 animate-fade-in" />
              )}
            </div>

            {/* 3. By Brand */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('by-brand')}
                onMouseEnter={() => setActiveTab('by-brand')}
                className={`text-2xl sm:text-3xl font-serif text-left tracking-tight transition-all duration-200 cursor-pointer block w-full ${
                  activeTab === 'by-brand'
                    ? 'text-white font-medium drop-shadow-md'
                    : 'text-stone-400 hover:text-stone-200 font-normal'
                }`}
              >
                By Brand
              </button>
              {activeTab === 'by-brand' && (
                <div className="mt-2.5 w-full h-[1px] bg-white/40 animate-fade-in" />
              )}
            </div>

            {/* 4. Powered Sunglasses */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('powered')}
                onMouseEnter={() => setActiveTab('powered')}
                className={`text-2xl sm:text-3xl font-serif text-left tracking-tight transition-all duration-200 cursor-pointer block w-full ${
                  activeTab === 'powered'
                    ? 'text-white font-medium drop-shadow-md'
                    : 'text-stone-400 hover:text-stone-200 font-normal'
                }`}
              >
                Powered Sunglasses
              </button>
              {activeTab === 'powered' && (
                <div className="mt-2.5 w-full h-[1px] bg-white/40 animate-fade-in" />
              )}
            </div>

            {/* Bottom link: View All Sunglasses */}
            <div className="pt-6">
              <button
                onClick={() => handleCardClick('All Sunglasses')}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-300 hover:text-amber-200 transition group cursor-pointer"
              >
                <span>EXPLORE ALL SUNGLASSES</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Objects Grid with Smooth Cross-fade Animation */}
          <div className="md:col-span-9">
            {/* VIEW 1: Buying for (Image 1) */}
            {activeTab === 'buying-for' && (
              <div
                key="tab-buying-for"
                className="animate-fade-in duration-300 transition-all sm:pt-1"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl">
                  {buyingForItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item.title, item.query)}
                      className="group cursor-pointer select-none"
                    >
                      {/* Square Image Card */}
                      <div className="relative aspect-square overflow-hidden bg-stone-900 border border-white/10 group-hover:border-amber-400/70 transition-all duration-300 shadow-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      </div>

                      {/* Title Below */}
                      <div className="mt-2.5">
                        <h4 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/90 group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 2: By Shape (Image 2) */}
            {activeTab === 'by-shape' && (
              <div
                key="tab-by-shape"
                className="space-y-4 animate-fade-in duration-300 transition-all"
              >
                {/* Row 1: 5 Shapes */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-3.5">
                  {shapesRow1.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item.title, item.query)}
                      className="group cursor-pointer select-none"
                    >
                      <div className="relative aspect-square overflow-hidden bg-stone-900 border border-white/10 group-hover:border-amber-400/70 transition-all duration-300 shadow-md">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>
                      <div className="mt-2">
                        <h4 className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-white/90 group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 2: 2 Shapes */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-3.5">
                  {shapesRow2.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item.title, item.query)}
                      className="group cursor-pointer select-none"
                    >
                      <div className="relative aspect-square overflow-hidden bg-stone-900 border border-white/10 group-hover:border-amber-400/70 transition-all duration-300 shadow-md">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>
                      <div className="mt-2">
                        <h4 className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-white/90 group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 3: By Brand (Image 3) */}
            {activeTab === 'by-brand' && (
              <div
                key="tab-by-brand"
                className="space-y-6 animate-fade-in duration-300 transition-all"
              >
                {/* 1. PREMIUM / STARTING FROM ₹3000 */}
                <div>
                  <div className="flex items-baseline gap-2 mb-3.5 text-xs sm:text-sm tracking-wider uppercase font-sans">
                    <span className="font-bold text-white tracking-widest">
                      PREMIUM
                    </span>
                    <span className="text-white/40 font-light">/</span>
                    <span className="text-stone-300 font-light">
                      STARTING FROM ₹3000
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl">
                    {premiumBrands.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item.title, item.query)}
                        className="group cursor-pointer select-none"
                      >
                        <div className="relative aspect-square overflow-hidden bg-stone-900 border border-white/10 group-hover:border-amber-400/70 transition-all duration-300 shadow-md">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center p-2 text-center">
                            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase drop-shadow-md group-hover:scale-105 transition-transform">
                              {item.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. CLASSICS / STARTING FROM ₹1000 */}
                <div>
                  <div className="flex items-baseline gap-2 mb-3.5 text-xs sm:text-sm tracking-wider uppercase font-sans">
                    <span className="font-bold text-white tracking-widest">
                      CLASSICS
                    </span>
                    <span className="text-white/40 font-light">/</span>
                    <span className="text-stone-300 font-light">
                      STARTING FROM ₹1000
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
                    {classicBrands.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item.title, item.query)}
                        className="group cursor-pointer select-none"
                      >
                        <div className="relative aspect-square overflow-hidden bg-stone-900 border border-white/10 group-hover:border-amber-400/70 transition-all duration-300 shadow-md">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center p-2 text-center">
                            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase drop-shadow-md group-hover:scale-105 transition-transform">
                              {item.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: Powered Sunglasses (Image 4) */}
            {activeTab === 'powered' && (
              <div
                key="tab-powered"
                className="animate-fade-in duration-300 transition-all sm:pt-1"
              >
                <div className="flex items-baseline gap-2 mb-4 text-xs sm:text-sm tracking-wider uppercase font-sans">
                  <span className="font-bold text-white tracking-widest">
                    STARTING FROM ₹1200
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-lg">
                  {poweredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item.title, item.query)}
                      className="group cursor-pointer select-none"
                    >
                      <div className="relative aspect-square overflow-hidden bg-stone-900 border border-white/10 group-hover:border-amber-400/70 transition-all duration-300 shadow-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      </div>

                      <div className="mt-2.5">
                        <h4 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/90 group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

