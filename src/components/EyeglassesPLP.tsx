import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Eye,
  Heart,
  SlidersHorizontal,
  X,
  Check,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import { Product } from '../types';

export const EyeglassesPLP: React.FC = () => {
  const {
    products,
    openPDP,
    setIsTryOnModalOpen,
    wishlist,
    toggleWishlist,
    setActiveCategory,
    setActiveView,
    searchQuery,
    setSearchQuery,
  } = useStore();

  // Sort state
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating' | 'newest'>('recommended');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Filter drawer state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedShape, setSelectedShape] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  // Filter eyeglasses products dynamically from products state
  const eyeglassesProducts = useMemo(() => {
    return products.filter((p) => {
      // Must belong to Eyeglasses category and be published
      if (p.category !== 'Eyeglasses' || !p.isPublished) return false;

      // Filter by Gender
      if (selectedGender !== 'All' && p.gender !== selectedGender && p.gender !== 'Unisex') {
        return false;
      }

      // Filter by Shape
      if (selectedShape !== 'All' && p.shape !== selectedShape) {
        return false;
      }

      // Filter by Brand
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) {
        return false;
      }

      // Filter by Material
      if (selectedMaterial !== 'All' && p.material !== selectedMaterial) {
        return false;
      }

      // Filter by Max Price
      if (p.sellingPrice > maxPrice) {
        return false;
      }

      // Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchShape = p.shape?.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchShape) return false;
      }

      return true;
    });
  }, [products, selectedGender, selectedShape, selectedBrand, selectedMaterial, maxPrice, searchQuery]);

  // Sort the filtered eyeglasses
  const sortedProducts = useMemo(() => {
    const list = [...eyeglassesProducts];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.sellingPrice - b.sellingPrice);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.sellingPrice - a.sellingPrice);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }
    return list; // recommended default
  }, [eyeglassesProducts, sortBy]);

  // Count of admin listed live eyeglasses
  const liveEyeglassesCount = useMemo(() => {
    return products.filter((p) => p.category === 'Eyeglasses' && p.isPublished).length;
  }, [products]);

  // Calculate dynamic items count to show in header matching user screenshot
  // Base catalog number 2558 + any items added by admin
  const totalItemsCount = useMemo(() => {
    return 2558 + liveEyeglassesCount;
  }, [liveEyeglassesCount]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedGender !== 'All') count++;
    if (selectedShape !== 'All') count++;
    if (selectedBrand !== 'All') count++;
    if (selectedMaterial !== 'All') count++;
    if (maxPrice < 10000) count++;
    return count;
  }, [selectedGender, selectedShape, selectedBrand, selectedMaterial, maxPrice]);

  const resetFilters = () => {
    setSelectedGender('All');
    setSelectedShape('All');
    setSelectedBrand('All');
    setSelectedMaterial('All');
    setMaxPrice(10000);
    setSearchQuery('');
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price-low':
        return 'PRICE: LOW TO HIGH';
      case 'price-high':
        return 'PRICE: HIGH TO LOW';
      case 'rating':
        return 'TOP RATED';
      case 'newest':
        return 'NEW ARRIVALS';
      default:
        return 'RECOMMENDED';
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-16 pt-16 sm:pt-20 selection:bg-slate-900 selection:text-white">
      {/* Top Navigation Row: Back to Home + Breadcrumbs matching user request */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => {
            setActiveCategory('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full border border-slate-200 transition-all group shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-950 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium select-none">
          <button
            onClick={() => {
              setActiveCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-slate-700 transition cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => {
              setActiveCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-slate-700 transition cursor-pointer"
          >
            Eyewear
          </button>
          <span>/</span>
          <button
            onClick={() => resetFilters()}
            className="hover:text-slate-700 transition cursor-pointer"
          >
            Eyeglasses
          </button>
          <span>/</span>
          <span className="text-slate-400">Promotions</span>
          <span>/</span>
          <span className="text-slate-800 font-bold">Eyeglasses</span>
        </nav>
      </div>

      {/* Main Header Row with Serif Title and Top Right Controls matching user screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          {/* Left: Serif Eyeglasses Title + Dynamic Items count */}
          <div className="flex items-baseline gap-2.5">
            <h1
              className="text-3xl sm:text-4xl lg:text-[40px] font-normal text-slate-900 tracking-tight select-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Eyeglasses
            </h1>
            <span className="text-xs sm:text-sm font-normal text-slate-500 font-sans tracking-wide">
              {totalItemsCount} items
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {products.filter((p) => p.category === 'Eyeglasses' && p.isPublished).length} Admin Listed
            </span>
          </div>

          {/* Right: 3 Action Controls matching user screenshot */}
          <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-7 select-none border-t sm:border-t-0 pt-3 sm:pt-0">
            {/* 1. 3D Try-on > */}
            <button
              onClick={() => setIsTryOnModalOpen(true)}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-1 text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-indigo-900 transition">
                <span>3D Try-on</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                SETUP NOW
              </div>
            </button>

            {/* 2. Sort by v */}
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="text-left group cursor-pointer"
              >
                <div className="flex items-center gap-1 text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-indigo-900 transition">
                  <span>Sort by</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-600 transition-transform ${
                      isSortDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {getSortLabel()}
                </div>
              </button>

              {/* Sort Dropdown Menu */}
              {isSortDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 text-xs font-semibold animate-in fade-in">
                  {[
                    { key: 'recommended', label: 'Recommended' },
                    { key: 'price-low', label: 'Price: Low to High' },
                    { key: 'price-high', label: 'Price: High to Low' },
                    { key: 'rating', label: 'Customer Rating' },
                    { key: 'newest', label: 'New Arrivals' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setSortBy(item.key as any);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer ${
                        sortBy === item.key ? 'text-indigo-900 font-bold bg-slate-50' : 'text-slate-700'
                      }`}
                    >
                      <span>{item.label}</span>
                      {sortBy === item.key && <Check className="w-3.5 h-3.5 text-indigo-900" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Filters > */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-1 text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-indigo-900 transition">
                <span>Filters</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {activeFiltersCount === 0 ? 'NONE APPLIED' : `${activeFiltersCount} APPLIED`}
              </div>
            </button>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 animate-in fade-in">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Active Filters:
            </span>
            {selectedGender !== 'All' && (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5">
                <span>Gender: {selectedGender}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedGender('All')} />
              </span>
            )}
            {selectedShape !== 'All' && (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5">
                <span>Shape: {selectedShape}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedShape('All')} />
              </span>
            )}
            {selectedBrand !== 'All' && (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5">
                <span>Brand: {selectedBrand}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedBrand('All')} />
              </span>
            )}
            {selectedMaterial !== 'All' && (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5">
                <span>Material: {selectedMaterial}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedMaterial('All')} />
              </span>
            )}
            {maxPrice < 10000 && (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5">
                <span>Max: ₹{maxPrice.toLocaleString()}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setMaxPrice(10000)} />
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 underline ml-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* 4-Columns Product Grid matching user screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              {liveEyeglassesCount === 0 ? 'No Eyeglasses Listed Yet' : 'No eyeglasses match current filters'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {liveEyeglassesCount === 0
                ? 'Demo products have been cleared. Add your custom optical frames from the Admin Portal.'
                : 'Try adjusting your filter options or search term to discover other frames.'}
            </p>
            {liveEyeglassesCount === 0 ? (
              <button
                onClick={() => setActiveView('admin-portal')}
                className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Open Admin Portal
              </button>
            ) : (
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
            {sortedProducts.map((p) => {
              const isWishlisted = wishlist.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200/90 rounded-none sm:rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-200 group relative select-none"
                >
                  {/* Image Container with 1px light border */}
                  <div
                    onClick={() => openPDP(p)}
                    className="aspect-square bg-white flex items-center justify-center p-2 sm:p-3 relative cursor-pointer overflow-hidden"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    {/* Wishlist Heart on top right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-1 sm:p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 transition shadow-xs cursor-pointer z-10"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>

                    {/* Subtle 3D Try-On Quick Hover Pill */}
                    <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsTryOnModalOpen(true);
                        }}
                        className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shadow-md cursor-pointer backdrop-blur-xs"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>3D Try On</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Bottom Details matching user screenshot */}
                  <div className="p-2 sm:p-3.5 border-t border-slate-100 flex items-end justify-between gap-1 sm:gap-2 bg-white">
                    {/* Left: Product Name & Pricing */}
                    <div className="min-w-0 flex-1">
                      <h4
                        onClick={() => openPDP(p)}
                        className="text-[11px] sm:text-[13px] font-medium text-slate-900 truncate hover:text-indigo-900 cursor-pointer"
                        title={p.name}
                      >
                        {p.name}
                      </h4>

                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-bold text-slate-950 text-xs sm:text-sm">
                          ₹{p.sellingPrice.toLocaleString()}
                        </span>
                        {p.originalPrice > p.sellingPrice && (
                          <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">
                            ₹{p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Color Swatch Circles + extra variant count matching user screenshot */}
                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                      {p.variants && p.variants.length > 0 ? (
                        p.variants.slice(0, 3).map((v) => (
                          <span
                            key={v.id}
                            title={v.colorName}
                            style={{ backgroundColor: v.colorHex || '#0f172a' }}
                            className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-slate-300 shadow-2xs inline-block"
                          />
                        ))
                      ) : (
                        <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-slate-300 bg-slate-900" />
                      )}

                      {/* Extra variant label e.g. +28 or +2 */}
                      {p.tags?.some((t) => t.startsWith('+')) ? (
                        <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 ml-0.5">
                          {p.tags.find((t) => t.startsWith('+'))}
                        </span>
                      ) : (
                        p.variants && p.variants.length > 3 && (
                          <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 ml-0.5">
                            +{p.variants.length - 3}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Live Admin Connection Banner */}
        <div className="mt-12 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                Live Admin Catalog Sync Active
              </h5>
            </div>
            <p className="text-xs text-slate-500">
              Any products added, edited, or re-priced in the Admin Portal under <strong>Eyeglasses</strong> show up here in real time.
            </p>
          </div>

          <button
            onClick={() => setActiveView('admin-portal')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add Products in Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Slide-over Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-sm text-slate-900">Filter Eyeglasses</h3>
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Options Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
              {/* Gender Filter */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Men', 'Women', 'Unisex'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`py-2 px-3 rounded-xl border text-center font-semibold transition cursor-pointer ${
                        selectedGender === g
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Shape Filter */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  Frame Shape
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Square', 'Rectangle', 'Round', 'Aviator', 'Geometric', 'Wayfarer'].map((sh) => (
                    <button
                      key={sh}
                      onClick={() => setSelectedShape(sh)}
                      className={`py-2 px-3 rounded-xl border text-center font-semibold transition cursor-pointer ${
                        selectedShape === sh
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {sh}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  Brand
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {['All', 'AR-Vision Eyecare Hustlr', 'AR-Vision Eyecare Air', 'John Jacobs', 'Vincent Chase', 'AR Vision Elite'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`py-2 px-3 rounded-xl border text-left font-semibold transition cursor-pointer flex items-center justify-between ${
                        selectedBrand === b
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>{b}</span>
                      {selectedBrand === b && <Check className="w-3.5 h-3.5 text-indigo-900" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  Material
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Acetate', 'Titanium', 'TR90', 'Ultem TR90'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMaterial(m)}
                      className={`py-2 px-3 rounded-xl border text-center font-semibold transition cursor-pointer ${
                        selectedMaterial === m
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Max Price
                  </label>
                  <span className="font-bold text-slate-900 text-xs">
                    ₹{maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-950 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Apply Filters ({sortedProducts.length} Items)
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

