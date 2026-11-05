import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Sparkles,
  Scale,
  X,
  Filter,
} from 'lucide-react';
import { FrameShape, FrameMaterial, Gender, FrameSize } from '../types';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    comparisonList,
    setIsCompareModalOpen,
    clearCompare,
  } = useStore();

  // Filters state
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<FrameShape[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<FrameMaterial[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(4500);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating'>('popularity');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available unique brands, shapes, materials
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products]);
  const shapes: FrameShape[] = ['Aviator', 'Round', 'Rectangle', 'Square', 'Cat Eye', 'Wayfarer'];
  const materials: FrameMaterial[] = ['Titanium', 'Acetate', 'Ultem TR90', 'Stainless Steel'];

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) => (prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]));
  };

  const toggleShape = (s: FrameShape) => {
    setSelectedShapes((prev) => (prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]));
  };

  const toggleMaterial = (m: FrameMaterial) => {
    setSelectedMaterials((prev) => (prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]));
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedShapes([]);
    setSelectedMaterials([]);
    setSelectedGender('All');
    setSelectedSize('All');
    setMaxPrice(4500);
    setSearchQuery('');
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.isPublished) return false;

        // Category filter
        if (activeCategory === 'BOGO') {
          if (!p.isBogoEligible) return false;
        } else if (activeCategory !== 'All') {
          if (p.category !== activeCategory) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.shape.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;

        // Shape filter
        if (selectedShapes.length > 0 && !selectedShapes.includes(p.shape)) return false;

        // Material filter
        if (selectedMaterials.length > 0 && !selectedMaterials.includes(p.material)) return false;

        // Gender filter
        if (selectedGender !== 'All' && p.gender !== selectedGender && p.gender !== 'Unisex') return false;

        // Size filter
        if (selectedSize !== 'All' && p.size !== selectedSize) return false;

        // Price filter
        if (p.sellingPrice > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
        if (sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      });
  }, [
    products,
    activeCategory,
    searchQuery,
    selectedBrands,
    selectedShapes,
    selectedMaterials,
    selectedGender,
    selectedSize,
    maxPrice,
    sortBy,
  ]);

  return (
    <div id="product-catalog" className="max-w-7xl mx-auto px-4 py-8 scroll-mt-20">
      {/* Top Banner & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              {activeCategory === 'All' ? 'Complete Collection' : activeCategory}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredProducts.length} frames
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {activeCategory === 'BOGO'
              ? 'Buy 1 Get 1 Free Eyewear Collection'
              : activeCategory === 'Computer Glasses'
              ? 'Computer Screen Glasses & Blue Cut Optics'
              : activeCategory === 'Sunglasses'
              ? 'Polarized Sunglasses & Luxury Tint Wear'
              : 'Precision Crafted Eyewear & Optics'}
          </h2>
        </div>

        {/* Sorting & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700"
          >
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated (4.8+)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6">
        {/* Left Sidebar Filters */}
        <aside
          className={`space-y-6 md:block text-xs ${
            isMobileFilterOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-extrabold text-sm text-slate-900 font-heading">
              Filter Catalog
            </span>
            <button
              onClick={clearAllFilters}
              className="text-[11px] text-indigo-600 hover:underline font-bold"
            >
              Reset All
            </button>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Max Price</span>
              <span className="text-indigo-700 font-mono">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="999"
              max="4500"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹999</span>
              <span>₹4,500</span>
            </div>
          </div>

          {/* Frame Shape Filters */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 block">Frame Shape</span>
            <div className="grid grid-cols-2 gap-1.5">
              {shapes.map((s) => {
                const isSelected = selectedShapes.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleShape(s)}
                    className={`py-1.5 px-2 rounded-lg border text-left transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frame Material */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 block">Frame Material</span>
            <div className="space-y-1">
              {materials.map((m) => {
                const isSelected = selectedMaterials.includes(m);
                return (
                  <label
                    key={m}
                    className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMaterial(m)}
                      className="rounded accent-indigo-600"
                    />
                    <span>{m}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 block">Brand</span>
            <div className="space-y-1">
              {brands.map((b) => {
                const isSelected = selectedBrands.includes(b);
                return (
                  <label
                    key={b}
                    className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleBrand(b)}
                      className="rounded accent-indigo-600"
                    />
                    <span>{b}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 block">Gender</span>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Men', 'Women', 'Kids'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1 rounded-full border text-[11px] font-medium transition ${
                    selectedGender === g
                      ? 'border-slate-900 bg-slate-900 text-white font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 block">Frame Size</span>
            <div className="flex gap-1.5">
              {['All', 'Narrow', 'Medium', 'Wide'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`flex-1 py-1 rounded-lg border text-[11px] font-medium transition text-center ${
                    selectedSize === sz
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="md:col-span-3">
          {searchQuery && (
            <div className="flex items-center gap-2 mb-4 bg-neutral-100 border border-neutral-200 px-3.5 py-2 rounded-xl text-xs text-neutral-800">
              <span className="font-medium text-neutral-500">Active Filter:</span>
              <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-neutral-200 shadow-xs">
                {searchQuery}
              </span>
              <span className="text-[11px] text-neutral-400">({filteredProducts.length} results)</span>
              <button
                onClick={() => setSearchQuery('')}
                className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-neutral-200 text-neutral-600 hover:text-black transition cursor-pointer text-[11px] font-medium"
                title="Clear filter"
              >
                <span>Clear</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8">
              <Search className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">
                No matching optical frames found
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or resetting price range to see our full inventory.
              </p>
              <button
                onClick={clearAllFilters}
                className="py-2 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Comparison Bar if frames are selected */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-slide-up">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold">
              Comparing {comparisonList.length} of 4 frames
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="py-1.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition"
            >
              View Comparison Table
            </button>
            <button
              onClick={clearCompare}
              className="p-1.5 text-slate-400 hover:text-white"
              title="Clear Comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
