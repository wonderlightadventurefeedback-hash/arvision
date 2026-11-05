import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Heart,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Truck,
  Share2,
  ArrowLeft,
  RotateCw,
  Ruler,
  Check,
  ShieldCheck,
  Star,
  Eye,
} from 'lucide-react';
import { InfinityGlassesLogo } from './Header';
import { MOCK_REVIEWS } from '../data/mockData';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForPDP,
    setSelectedProductForPDP,
    openLensCustomizer,
    wishlist,
    toggleWishlist,
    setIsTryOnModalOpen,
    setSelectedProductForTryOn,
    activeCategory,
  } = useStore();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [is360Active, setIs360Active] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);

  // Reset state whenever a new product is opened
  useEffect(() => {
    setSelectedVariantIndex(0);
    setSelectedSize('M');
    setActiveImageIndex(0);
    setIs360Active(false);
    setRotationDegree(0);
  }, [selectedProductForPDP?.id]);

  if (!selectedProductForPDP) return null;

  const product = selectedProductForPDP;
  const isWishlisted = wishlist.includes(product.id);

  // Active color variant (defaults to 1st variant or fallback)
  const currentVariant =
    product.variants && product.variants.length > 0
      ? product.variants[selectedVariantIndex] || product.variants[0]
      : null;

  const activeColorName = currentVariant?.colorName || product.frameColor || 'Classic';

  // Subtitle format matching user screenshot: "BLUE SKY FULL RIM SQUARE"
  const subtitleText = `${activeColorName.toUpperCase()} ${
    product.subCategory?.toUpperCase() || 'FULL RIM'
  } ${product.shape.toUpperCase()}`;

  // Main showcase image
  const displayImage =
    activeImageIndex === 0 && currentVariant?.image
      ? currentVariant.image
      : product.images[activeImageIndex] || product.images[0];

  // Verified reviews
  const productReviews = MOCK_REVIEWS.filter((r) => r.productId === product.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} - AR VISION Eyewear`,
        text: `Check out ${product.name} in ${activeColorName}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const handleLaunchTryOn = () => {
    setSelectedProductForTryOn(product);
    setIsTryOnModalOpen(true);
  };

  const handleSelectLenses = () => {
    setSelectedProductForPDP(null);
    openLensCustomizer(product);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto selection:bg-black selection:text-white animate-fade-in font-sans">
      {/* 1. Minimal Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Left: Back Navigation Button */}
          <button
            onClick={() => setSelectedProductForPDP(null)}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-black transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-black group-hover:-translate-x-1 transition-transform" />
            <span>
              {activeCategory === 'Eyeglasses' ? (
                <>
                  <span className="hidden sm:inline">Back to Eyeglasses</span>
                  <span className="sm:hidden">Back</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Back to Catalog</span>
                  <span className="sm:hidden">Back</span>
                </>
              )}
            </span>
          </button>

          {/* Center: AR VISION Brand Infinity Logo */}
          <div
            onClick={() => setSelectedProductForPDP(null)}
            className="flex items-center gap-2 cursor-pointer text-slate-900 hover:text-indigo-600 transition-colors"
            title="AR Vision Eyewear"
          >
            <InfinityGlassesLogo className="h-6 sm:h-7 aspect-3/1" />
          </div>

          {/* Right: Quick Actions (Share & Close) */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
              title="Share Frame"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedProductForPDP(null)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Page Content: 2-Column Responsive Layout Matching Image 1 & Image 2 Combined */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10 pb-28 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Large Frame Showcase & Angles (Image 1 Left) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            {/* Primary Visual Display Box */}
            <div className="relative aspect-4/3 sm:aspect-16/11 bg-[#f9fafb] border border-slate-100 rounded-2xl flex items-center justify-center p-4 sm:p-12 overflow-hidden group">
              {/* Top Left Badges */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1 items-start">
                {product.isBogoEligible && (
                  <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-xs">
                    BUY 1 GET 1 FREE
                  </span>
                )}
                <span className="bg-slate-900/90 text-white font-medium text-[10px] px-2 py-0.5 rounded">
                  {product.material} ({product.weight}g)
                </span>
              </div>

              {/* Main Frame Image with 360 rotation support */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-300"
                style={{
                  transform: is360Active ? `rotate(${rotationDegree}deg)` : 'none',
                }}
              >
                <img
                  src={displayImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain drop-shadow-sm select-none transition-all duration-300 group-hover:scale-105"
                />
              </div>

              {/* Bottom Actions Floating Over Image */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between pointer-events-none">
                {/* 3D Virtual Try-On Button */}
                <button
                  onClick={handleLaunchTryOn}
                  className="pointer-events-auto inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/90 hover:bg-black text-white text-[11px] sm:text-xs font-bold tracking-wide shadow-lg transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>3D Virtual Try-On</span>
                </button>

                {/* 360 Degree Viewer Toggle */}
                <button
                  onClick={() => setIs360Active(!is360Active)}
                  className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 text-[10px] sm:text-[11px] font-semibold shadow-md border border-slate-200 transition cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>{is360Active ? 'Exit 360°' : '360° Angle'}</span>
                </button>
              </div>

              {/* 360 Degree Range Slider (when active) */}
              {is360Active && (
                <div className="absolute bottom-14 sm:bottom-16 inset-x-4 sm:inset-x-8 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-md flex items-center gap-3">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-600">Drag to rotate:</span>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={rotationDegree}
                    onChange={(e) => setRotationDegree(Number(e.target.value))}
                    className="flex-1 accent-black cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-500">{rotationDegree}°</span>
                </div>
              )}
            </div>

            {/* Thumbnail Viewing Angles Strip */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setIs360Active(false);
                  }}
                  className={`w-16 sm:w-20 h-14 sm:h-16 rounded-xl border p-1 bg-[#f9fafb] flex items-center justify-center transition cursor-pointer shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-2 border-black bg-white ring-1 ring-black'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Optical Certification Guarantee Banner */}
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="leading-tight">German CNC Precision Glazing • 0.01D Tolerance</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0 ml-2">
                Certified
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Details, Swatches, Trust & CTA (Images 1 & 2)*/}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-1 lg:pt-0">
            <div>
              {/* Product Title & Wishlist Heart (Image 1 Top) */}
              <div className="flex items-start justify-between gap-4">
                <h1
                  className="text-3xl sm:text-4xl text-slate-900 font-normal tracking-tight select-none"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {product.name}
                </h1>

                {/* Wishlist Heart Icon */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-1.5 text-slate-700 hover:text-black transition cursor-pointer group shrink-0"
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      isWishlisted
                        ? 'fill-rose-500 text-rose-500 scale-110'
                        : 'text-slate-800 group-hover:scale-110'
                    }`}
                  />
                </button>
              </div>

              {/* Subtitle: "BLUE SKY FULL RIM SQUARE" (Image 1 Subtitle) */}
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1 mb-5">
                {subtitleText}
              </p>

              {/* Pricing Block (Image 1 & 2) */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    ₹{product.sellingPrice.toLocaleString()}
                  </span>
                  <span className="text-sm sm:text-base text-slate-400 line-through font-normal">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 ml-1">
                    {product.discountPercentage}% OFF
                  </span>
                </div>
                {/* Free anti-glare lenses tag matching screenshot */}
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1.5">
                  WITH FREE ANTI-GLARE LENSES
                </p>
              </div>

              {/* Color Selection Block with Thumbnails (Image 1 & 2) */}
              <div className="mb-5 sm:mb-6">
                <div className="text-xs sm:text-sm text-slate-800 font-normal mb-2.5">
                  Color <span className="font-bold text-slate-950 capitalize">{activeColorName}</span>
                </div>

                {/* Horizontal row of rectangular color swatches with black border around selected */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {product.variants && product.variants.length > 0 ? (
                    product.variants.map((variant, idx) => {
                      const isSelected = selectedVariantIndex === idx;
                      return (
                        <button
                          key={variant.id || idx}
                          onClick={() => {
                            setSelectedVariantIndex(idx);
                            setActiveImageIndex(0);
                            setIs360Active(false);
                          }}
                          className={`w-14 sm:w-16 h-11 sm:h-12 rounded-sm border bg-[#fbfbfb] p-1 flex items-center justify-center transition-all cursor-pointer relative shrink-0 ${
                            isSelected
                              ? 'border-2 border-black ring-1 ring-black bg-white shadow-xs'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                          title={variant.colorName}
                        >
                          <img
                            src={variant.swatchImage || variant.image}
                            alt={variant.colorName}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-xs text-slate-400">Standard Color</div>
                  )}
                </div>
              </div>

              {/* Frame Size Selection Block with SIZE GUIDE (Image 1 & 2) */}
              <div className="mb-5 sm:mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs sm:text-sm font-normal text-slate-800">Frame Size</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[11px] sm:text-xs font-semibold text-slate-500 hover:text-slate-900 tracking-wider transition cursor-pointer flex items-center gap-1 group"
                  >
                    <span>SIZE GUIDE</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>

                {/* Size Box Selectors with Black Outline on Active Size */}
                <div className="grid grid-cols-4 sm:flex sm:items-center gap-2">
                  {['S', 'M', 'L', 'XL'].map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-full sm:w-16 h-10 sm:h-11 flex items-center justify-center text-xs sm:text-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'border-2 border-black bg-white font-bold text-slate-950 shadow-xs'
                            : 'border border-slate-200 bg-[#fbfbfb] hover:bg-slate-100 text-slate-700 font-medium'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trust Badges Row (Image 2) */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-4 sm:py-6 my-4 sm:my-6 border-t border-b border-slate-100 text-center">
                {/* 1. 14 days exchange */}
                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 stroke-[1.5]" />
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                    14 days exchange
                  </span>
                </div>

                {/* 2. Easy returns */}
                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 stroke-[1.5]" />
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                    Easy returns
                  </span>
                </div>

                {/* 3. 365 days warranty */}
                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 stroke-[1.5]" />
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                    365 days warranty
                  </span>
                </div>
              </div>

              {/* Desktop Big Solid Black CTA Button: SELECT LENSES (Image 2) */}
              <div className="pt-2">
                <button
                  onClick={handleSelectLenses}
                  className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2 rounded-none sm:rounded-xs"
                >
                  SELECT LENSES
                </button>
              </div>

              {/* Optical Millimeter Dimensions Breakdown */}
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-slate-500" />
                    Exact Frame Dimensions
                  </span>
                  <span className="text-slate-500 text-[11px]">Size {selectedSize}</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
                  <div className="p-2 sm:p-2.5 rounded-lg border border-slate-200 bg-[#fbfbfb]">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase">Lens Width</span>
                    <strong className="text-slate-900 font-bold text-[11px] sm:text-xs">{product.dimensions.lensWidth} mm</strong>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-lg border border-slate-200 bg-[#fbfbfb]">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase">Bridge Width</span>
                    <strong className="text-slate-900 font-bold text-[11px] sm:text-xs">{product.dimensions.bridgeWidth} mm</strong>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-lg border border-slate-200 bg-[#fbfbfb]">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase">Temple Length</span>
                    <strong className="text-slate-900 font-bold text-[11px] sm:text-xs">{product.dimensions.templeLength} mm</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Action Bar with Price & SELECT LENSES CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 sm:hidden z-40 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-950">
              ₹{product.sellingPrice.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            Free Anti-Glare Lenses
          </span>
        </div>

        <button
          onClick={handleSelectLenses}
          className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md cursor-pointer flex items-center gap-1.5 rounded-xs active:scale-95"
        >
          <span>SELECT LENSES</span>
          <span className="text-amber-400">→</span>
        </button>
      </div>

      {/* 3. Interactive Frame Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Eyewear Frame Size Guide</h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Find your perfect eyewear fit based on lens width and total frame width:
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-2.5">Size</th>
                      <th className="p-2.5">Lens Width</th>
                      <th className="p-2.5">Total Width</th>
                      <th className="p-2.5">Face Fit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className={selectedSize === 'S' ? 'bg-amber-50/60 font-semibold' : ''}>
                      <td className="p-2.5">Small (S)</td>
                      <td className="p-2.5">48 - 50 mm</td>
                      <td className="p-2.5">125 - 129 mm</td>
                      <td className="p-2.5">Narrow faces</td>
                    </tr>
                    <tr className={selectedSize === 'M' ? 'bg-amber-50/60 font-semibold' : ''}>
                      <td className="p-2.5">Medium (M)</td>
                      <td className="p-2.5">51 - 53 mm</td>
                      <td className="p-2.5">130 - 138 mm</td>
                      <td className="p-2.5">Standard (Most Popular)</td>
                    </tr>
                    <tr className={selectedSize === 'L' ? 'bg-amber-50/60 font-semibold' : ''}>
                      <td className="p-2.5">Large (L)</td>
                      <td className="p-2.5">54 - 56 mm</td>
                      <td className="p-2.5">139 - 145 mm</td>
                      <td className="p-2.5">Wide faces</td>
                    </tr>
                    <tr className={selectedSize === 'XL' ? 'bg-amber-50/60 font-semibold' : ''}>
                      <td className="p-2.5">Extra Large (XL)</td>
                      <td className="p-2.5">57+ mm</td>
                      <td className="p-2.5">146+ mm</td>
                      <td className="p-2.5">Extra broad / athletic</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <strong className="text-slate-800 block">💳 Quick Credit Card Fit Test:</strong>
                <p className="text-[11px] text-slate-500">
                  Hold a standard credit card vertically against the bridge of your nose. If the card edge extends past the corner of your eye, select <strong>Small (S)</strong>. If it touches the corner, select <strong>Medium (M)</strong>. If it ends before the corner, select <strong>Large (L)</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
