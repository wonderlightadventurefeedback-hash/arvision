import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface ContactLensMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ContactLensMegaMenu: React.FC<ContactLensMegaMenuProps> = ({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { setActiveCategory } = useStore();
  const [activeTab, setActiveTab] = useState<'lenses' | 'solutions'>('lenses');
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Smooth entrance/exit animation timing
  useEffect(() => {
    if (isOpen) {
      // Trigger entrance
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

  const handleCardClick = (subFilter?: string) => {
    setActiveCategory('Contact Lenses');
    onClose();
    const catalogEl = document.getElementById('product-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearContacts = [
    {
      id: 'distance',
      title: 'DISTANCE POWER',
      image: '/images/contact-lenses/distance-power.jpg',
      sub: 'Spherical Lenses',
    },
    {
      id: 'toric',
      title: 'TORIC/CYLINDRICAL',
      image: '/images/contact-lenses/toric-cylindrical.jpg',
      sub: 'For Astigmatism',
    },
    {
      id: 'multifocal',
      title: 'MULTI-FOCAL',
      image: '/images/contact-lenses/multi-focal.jpg',
      sub: 'For Presbyopia',
    },
    {
      id: 'allpowers',
      title: 'ALL POWERS',
      image: '/images/contact-lenses/all-powers.jpg',
      sub: 'Full Prescription Range',
    },
  ];

  const colourContacts = [
    {
      id: 'zeropower',
      title: 'ZERO POWER',
      image: '/images/contact-lenses/zero-power.jpg',
      sub: 'Cosmetic Plano',
      badge: '0',
    },
    {
      id: 'withpower',
      title: 'WITH POWER',
      image: '/images/contact-lenses/with-power.jpg',
      sub: 'Vision + Color',
      badge: '0 ±',
    },
    {
      id: 'combos',
      title: 'COLOUR COMBOS',
      image: '/images/contact-lenses/colour-combos.jpg',
      sub: 'Multi-Pack Sets',
    },
  ];

  const solutionsAndAccessories = [
    {
      id: 'solution',
      title: 'SOLUTION',
      image: '/images/contact-lenses/solution.jpg',
      sub: 'Multi-Purpose Disinfecting & Hydrating',
    },
    {
      id: 'accessories',
      title: 'ACCESSORIES',
      image: '/images/contact-lenses/accessories.jpg',
      sub: 'Travel Cases, Tweezers & Tools',
    },
  ];

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
      {/* Mega Menu Inner Card */}
      <div
        ref={menuRef}
        onMouseEnter={onMouseEnter}
        className={`w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 sm:py-12 transform transition-all duration-300 ease-out select-none ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-6 opacity-0 scale-[0.98]'
        }`}
      >
        {/* Top Close Button Bar */}
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
          <div className="md:col-span-3 space-y-6 sm:pt-4">
            {/* Tab 1: Contact Lenses */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('lenses')}
                onMouseEnter={() => setActiveTab('lenses')}
                className={`text-2xl sm:text-3xl lg:text-4xl font-serif text-left tracking-tight transition-all duration-200 cursor-pointer block w-full ${
                  activeTab === 'lenses'
                    ? 'text-white font-medium drop-shadow-md'
                    : 'text-stone-400 hover:text-stone-200 font-normal'
                }`}
              >
                Contact Lenses
              </button>
              {activeTab === 'lenses' && (
                <div className="mt-3 w-full h-[1px] bg-white/40 animate-fade-in" />
              )}
            </div>

            {/* Tab 2: Solution / Accessories */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('solutions')}
                onMouseEnter={() => setActiveTab('solutions')}
                className={`text-2xl sm:text-3xl lg:text-4xl font-serif text-left tracking-tight transition-all duration-200 cursor-pointer block w-full ${
                  activeTab === 'solutions'
                    ? 'text-white font-medium drop-shadow-md'
                    : 'text-stone-400 hover:text-stone-200 font-normal'
                }`}
              >
                Solution / Accessories
              </button>
              {activeTab === 'solutions' && (
                <div className="mt-3 w-full h-[1px] bg-white/40 animate-fade-in" />
              )}
            </div>

            {/* Bottom link: Explore All */}
            <div className="pt-6">
              <button
                onClick={() => handleCardClick()}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-300 hover:text-amber-200 transition group cursor-pointer"
              >
                <span>EXPLORE ALL CONTACTS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Objects Grid with Smooth Cross-fade Animation */}
          <div className="md:col-span-9">
            {activeTab === 'lenses' ? (
              <div
                key="tab-lenses"
                className="space-y-8 animate-fade-in duration-300 transition-all"
              >
                {/* 1. CLEAR CONTACTS / STARTING FROM ₹319 */}
                <div>
                  <div className="flex items-baseline gap-2 mb-4 text-xs sm:text-sm tracking-wider uppercase font-sans">
                    <span className="font-bold text-white tracking-widest">
                      CLEAR CONTACTS
                    </span>
                    <span className="text-white/40 font-light">/</span>
                    <span className="text-stone-300 font-light">
                      STARTING FROM ₹319
                    </span>
                  </div>

                  {/* 4 Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {clearContacts.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item.title)}
                        className="group cursor-pointer select-none"
                      >
                        {/* Square Image Card */}
                        <div className="relative aspect-square overflow-hidden bg-stone-900 border border-white/10 group-hover:border-amber-400/70 transition-all duration-300 shadow-md">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>

                        {/* Title Below */}
                        <div className="mt-2.5">
                          <h4 className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-white/90 group-hover:text-amber-300 transition-colors">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. COLOUR CONTACTS / STARTING FROM ₹189 */}
                <div>
                  <div className="flex items-baseline gap-2 mb-4 text-xs sm:text-sm tracking-wider uppercase font-sans">
                    <span className="font-bold text-white tracking-widest">
                      COLOUR CONTACTS
                    </span>
                    <span className="text-white/40 font-light">/</span>
                    <span className="text-stone-300 font-light">
                      STARTING FROM ₹189
                    </span>
                  </div>

                  {/* 3 Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
                    {colourContacts.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item.title)}
                        className="group cursor-pointer select-none"
                      >
                        {/* Square Image Card */}
                        <div className="relative aspect-square overflow-hidden bg-stone-900 border border-white/10 group-hover:border-amber-400/70 transition-all duration-300 shadow-md">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                          {/* Power badge if applicable */}
                          {item.badge && (
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/20">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {/* Title Below */}
                        <div className="mt-2.5">
                          <h4 className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-white/90 group-hover:text-amber-300 transition-colors">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                key="tab-solutions"
                className="space-y-6 animate-fade-in duration-300 transition-all sm:pt-2"
              >
                {/* SOLUTION & ACCESSORIES / STARTING FROM ₹149 */}
                <div>
                  <div className="flex items-baseline gap-2 mb-5 text-xs sm:text-sm tracking-wider uppercase font-sans">
                    <span className="font-bold text-white tracking-widest">
                      SOLUTION & ACCESSORIES
                    </span>
                    <span className="text-white/40 font-light">/</span>
                    <span className="text-stone-300 font-light">
                      STARTING FROM ₹149
                    </span>
                  </div>

                  {/* 2 Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-xl">
                    {solutionsAndAccessories.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item.title)}
                        className="group cursor-pointer select-none"
                      >
                        {/* Square Image Card */}
                        <div className="relative aspect-square overflow-hidden bg-stone-900 border border-white/10 group-hover:border-amber-400/70 transition-all duration-300 shadow-md">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>

                        {/* Title Below */}
                        <div className="mt-2.5">
                          <h4 className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-white/90 group-hover:text-amber-300 transition-colors">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    ))}
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

