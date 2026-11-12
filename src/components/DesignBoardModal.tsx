import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { DESIGN_SLIDES } from '../data/mockData';
import { DesignSlide } from '../types';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Monitor,
  Smartphone,
  Cpu,
  Eye,
  Sliders,
  X,
} from 'lucide-react';

export const DesignBoardModal: React.FC = () => {
  const {
    activeView,
    setActiveView,
    designBoardInitialSlide,
    openLensCustomizer,
    products,
    openPDP,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsOrderTrackingOpen,
    setIsStoreLocatorOpen,
    setIsBookAppointmentOpen,
    setIsCompareModalOpen,
  } = useStore();

  const [viewMode, setViewMode] = useState<'matrix' | 'presentation'>('presentation');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Handle initial slide jump if requested
  useEffect(() => {
    if (designBoardInitialSlide !== null && designBoardInitialSlide >= 1 && designBoardInitialSlide <= 45) {
      setCurrentSlideIndex(designBoardInitialSlide - 1);
      setViewMode('presentation');
    }
  }, [designBoardInitialSlide]);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeView !== 'design-board' || viewMode !== 'presentation') return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => (prev + 1) % DESIGN_SLIDES.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => (prev - 1 + DESIGN_SLIDES.length) % DESIGN_SLIDES.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, viewMode]);

  const categories = [
    'All',
    'Storefront & Hero',
    'Catalog & Discovery',
    'PDP & 360 Showcase',
    '360° Inspection & Fit Guide',
    'Lens Customization',
    'Prescriptions',
    'Cart & Checkout',
    'Customer Account',
    'Enterprise Admin',
  ];

  const filteredSlides = DESIGN_SLIDES.filter((slide) => {
    if (selectedCategory !== 'All' && slide.category !== selectedCategory) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        slide.title.toLowerCase().includes(q) ||
        slide.screenCode.toLowerCase().includes(q) ||
        slide.uxGoal.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const currentSlide: DesignSlide = DESIGN_SLIDES[currentSlideIndex] || DESIGN_SLIDES[0];

  const handleLaunchLiveTarget = (target: string) => {
    setActiveView('storefront');

    setTimeout(() => {
      if (target === 'lens-wizard' || target.includes('lens')) {
        if (products[0]) openLensCustomizer(products[0]);
      } else if (target === 'cart') {
        setIsCartOpen(true);
      } else if (target.includes('checkout') || target === 'invoice-view') {
        setIsCheckoutOpen(true);
      } else if (target === 'order-tracking' || target.includes('order')) {
        setIsOrderTrackingOpen(true);
      } else if (target === 'store-locator' || target === 'book-eye-test') {
        setIsStoreLocatorOpen(true);
      } else if (target === 'compare') {
        setIsCompareModalOpen(true);
      } else if (target.includes('admin')) {
        setActiveView('admin-portal');
      } else if (target.includes('pdp')) {
        if (products[0]) openPDP(products[0]);
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Design Board Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-heading text-white">
                AR VISION 45-SCREEN UX/UI DESIGN BOARD
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase">
                COMPLETE 45 SLIDES
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Design System, Specifications & 1-Click Live Screen Launcher
            </p>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('presentation')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'presentation'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Slides Presentation
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'matrix'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              45-Screen Matrix Board
            </button>
          </div>

          <button
            onClick={() => setActiveView('storefront')}
            className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
          >
            Exit to Storefront
          </button>
        </div>
      </header>

      {/* 1. SLIDES PRESENTATION DECK MODE */}
      {viewMode === 'presentation' && (
        <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-between space-y-6">
          {/* Slide Deck Top Control Ribbon */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-indigo-400 font-bold">SLIDE {currentSlide.slideNumber} OF 45</span>
              <span>•</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-bold">
                {currentSlide.screenCode}
              </span>
              <span>•</span>
              <span className="text-slate-300 font-semibold">{currentSlide.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentSlideIndex((prev) => (prev - 1 + DESIGN_SLIDES.length) % DESIGN_SLIDES.length)
                }
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1"
                title="Previous Slide (← Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <span className="font-mono text-slate-200 font-bold px-2">
                {currentSlide.slideNumber} / 45
              </span>

              <button
                onClick={() =>
                  setCurrentSlideIndex((prev) => (prev + 1) % DESIGN_SLIDES.length)
                }
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1"
                title="Next Slide (→ Arrow or Space)"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Slide Card Presentation Container */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex-1 flex flex-col justify-between space-y-6">
            {/* Slide Title & UX Objective */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold tracking-wider uppercase">
                  {currentSlide.category}
                </span>

                <button
                  onClick={() => handleLaunchLiveTarget(currentSlide.liveScreenTarget)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-lg transition hover:scale-105 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Interactive Screen Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                {currentSlide.title}
              </h2>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-sm text-slate-300 leading-relaxed">
                <strong className="text-amber-400 font-semibold block mb-1 uppercase text-xs tracking-wider">
                  UX & Product Objective:
                </strong>
                {currentSlide.uxGoal}
              </div>
            </div>

            {/* Middle Grid: Key Features & Technical Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3 text-xs">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Core UX Components & Functional Behaviors
                </h4>
                <ul className="space-y-2 text-slate-300">
                  {currentSlide.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3 text-xs">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Technical Stack & Responsive Layout
                </h4>
                <div className="space-y-3 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Engine & Frameworks:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {currentSlide.techStack.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 text-cyan-300 border border-cyan-800/50 font-mono text-[11px]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Responsive Breakpoints:</span>
                    <p className="text-slate-200 font-medium mt-0.5">
                      {currentSlide.responsiveBreakpoints}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Clinical Standard: AR-Vision Eyecare Certified</span>
                    <span className="text-emerald-400 font-bold">100% Tested Fit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Navigation Thumbnails Scroller */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap mr-2">
                All 45 Slides:
              </span>
              {DESIGN_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-9 h-8 rounded-lg flex items-center justify-center font-mono font-bold transition shrink-0 ${
                    idx === currentSlideIndex
                      ? 'bg-amber-400 text-slate-950 scale-110 shadow-md ring-2 ring-white/20'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                  title={`${s.screenCode}: ${s.title}`}
                >
                  {s.slideNumber}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. 45-SCREEN MATRIX BOARD VIEW */}
      {viewMode === 'matrix' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search screen, code, feature..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 45 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSlides.map((slide) => (
              <div
                key={slide.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 hover:shadow-xl transition flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {slide.screenCode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Slide {slide.slideNumber} of 45
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition line-clamp-1 font-heading">
                    {slide.title}
                  </h3>

                  <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {slide.uxGoal}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {slide.techStack.map((tech, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setCurrentSlideIndex(slide.slideNumber - 1);
                      setViewMode('presentation');
                    }}
                    className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Inspect Specs
                  </button>

                  <button
                    onClick={() => handleLaunchLiveTarget(slide.liveScreenTarget)}
                    className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
