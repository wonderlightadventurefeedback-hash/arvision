import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Heart,
  Eye,
  Star,
  Sparkles,
  Layers,
  ArrowRight,
  Check,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    openPDP,
    openLensCustomizer,
    wishlist,
    toggleWishlist,
    comparisonList,
    toggleCompare,
  } = useStore();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = comparisonList.includes(product.id);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges Top Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.isBogoEligible && (
            <span className="pointer-events-auto inline-flex items-center gap-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5 text-slate-950" />
              BUY 1 GET 1
            </span>
          )}
          {product.isBestSeller && (
            <span className="pointer-events-auto bg-slate-900 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition backdrop-blur-md shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Eyewear Image Container */}
      <div
        onClick={() => openPDP(product)}
        className="relative pt-[65%] pb-4 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center cursor-pointer overflow-hidden"
      >
        <img
          src={currentVariant?.image || product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover Quick View Overlay Pill */}
        <div className="absolute bottom-3 inset-x-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openPDP(product);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-black text-white text-xs font-semibold shadow-md backdrop-blur-md transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick View & Specs</span>
          </button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Brand & Shape */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-indigo-700">
              {product.brand}
            </span>
            <span>{product.shape} • {product.size}</span>
          </div>

          <h4
            onClick={() => openPDP(product)}
            className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h4>

          {/* Rating & Dimensions */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[11px] font-bold">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-500 font-mono">
              {product.dimensions.lensWidth}-{product.dimensions.bridgeWidth}-{product.dimensions.templeLength}
            </span>
          </div>
        </div>

        {/* Color Variants Dots */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-medium">Colors:</span>
            {product.variants.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantIndex(i)}
                style={{ backgroundColor: v.colorHex }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedVariantIndex === i
                    ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110'
                    : 'border-slate-300 hover:scale-105'
                }`}
                title={v.colorName}
              />
            ))}
          </div>
        )}

        {/* Pricing Block */}
        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-slate-900 font-heading">
                ₹{product.sellingPrice}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice}
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {product.discountPercentage}% OFF
              </span>
            </div>
            <p className="text-[10px] text-slate-400">with Anti-Glare Lenses</p>
          </div>

          {/* Compare Checkbox */}
          <button
            onClick={() => toggleCompare(product.id)}
            className={`text-[10px] font-medium flex items-center gap-1 px-2 py-1 rounded transition ${
              isCompared
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                isCompared ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
              }`}
            >
              {isCompared && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span>Compare</span>
          </button>
        </div>

        {/* Action Button: Custom Lens & Buy */}
        <div className="pt-1">
          <button
            onClick={() => openLensCustomizer(product)}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Select Lens & Buy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
