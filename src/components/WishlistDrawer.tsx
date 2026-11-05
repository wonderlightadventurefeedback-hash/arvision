import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Heart,
  ShoppingBag,
  Trash2,
  Camera,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    products,
    addToCart,
    openPDP,
    openTryOn,
    setIsCartOpen,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = (product: typeof products[0]) => {
    const defaultVariant = product.variants[0];
    addToCart(product, defaultVariant);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading">My Wishlist</h2>
              <p className="text-[11px] text-slate-300">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'frame saved' : 'frames saved'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-slate-800 text-lg">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our precision eyeglasses and sunglasses collections, and save your favorite frames here.
              </p>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                <span>Browse Optical Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 transition group"
              >
                <div
                  onClick={() => {
                    openPDP(product);
                    setIsWishlistOpen(false);
                  }}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 cursor-pointer shrink-0"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        {product.brand}
                      </span>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-slate-400 hover:text-rose-500 transition cursor-pointer p-0.5"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4
                      onClick={() => {
                        openPDP(product);
                        setIsWishlistOpen(false);
                      }}
                      className="text-xs font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                    >
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {product.shape} • {product.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-200/60">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-900">₹{product.sellingPrice}</span>
                      {product.originalPrice > product.sellingPrice && (
                        <span className="text-[11px] text-slate-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          openTryOn(product);
                          setIsWishlistOpen(false);
                        }}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold transition cursor-pointer"
                        title="3D Virtual Try-On"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold transition cursor-pointer shadow-xs"
                      >
                        <ShoppingBag className="w-3 h-3 text-amber-300" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
            <button
              onClick={() => {
                wishlistedProducts.forEach((p) => {
                  addToCart(p, p.variants[0]);
                });
                setIsWishlistOpen(false);
                setIsCartOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Add All Saved Frames to Cart</span>
            </button>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-full py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold transition text-center cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
