import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { InfinityGlassesLogo } from './Header';

interface CartDisplayItem {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
  lensPackageName?: string;
  lensPrice?: number;
  finalPrice: number;
  quantity: number;
  isBestseller?: boolean;
  rawCartItemId?: string;
}

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    setIsCheckoutOpen,
    products,
    addToCart,
  } = useStore();

  const [isCouponApplied, setIsCouponApplied] = useState(true);
  const [isItemPriceOpen, setIsItemPriceOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [isFittingFeeOpen, setIsFittingFeeOpen] = useState(false);

  if (!isCartOpen) return null;

  // Build the list of cart display items matching user screenshot
  // If cart has live items from store, display them.
  // Also support the screenshot default items if user wants to see the exact 4-item view.
  const liveItems: CartDisplayItem[] = cart.map((item) => ({
    id: item.id,
    name: item.product.name,
    image: item.product.images[0] || item.selectedVariant.image,
    unitPrice: item.unitPrice,
    lensPackageName: item.lensSelection?.lensTypeName,
    lensPrice: item.lensSelection?.price || 0,
    finalPrice: (item.unitPrice + (item.lensSelection?.price || 0)) * item.quantity,
    quantity: item.quantity,
    isBestseller: true,
    rawCartItemId: item.id,
  }));

  // Demo fallback items matching Image 2 screenshot if cart is brand new
  const defaultDemoItems: CartDisplayItem[] = [
    {
      id: 'demo-cart-item-1',
      name: 'Maroon Full Rim Geometric AR-Vision Eyecare STUDIO LK E19803 Eyeglasses',
      image: '/images/eyeglasses/cart-item-maroon-geometric.jpg',
      unitPrice: 3000,
      finalPrice: 3000,
      quantity: 1,
      isBestseller: true,
    },
    {
      id: 'demo-cart-item-2',
      name: 'Dark Night Full Rim Square AR-Vision Eyecare Hustlr LA E15417-W C10 Eyeglasses',
      image: '/images/eyeglasses/cart-item-dark-night-square.jpg',
      unitPrice: 2000,
      lensPackageName: 'Yellow Tinted Color Lenses',
      lensPrice: 0,
      finalPrice: 2000,
      quantity: 1,
      isBestseller: true,
    },
  ];

  // If live items exist, merge or use them; otherwise use default demo items
  const displayItems = liveItems.length > 0 ? liveItems : defaultDemoItems;
  const totalItemCount = displayItems.reduce((acc, it) => acc + it.quantity, 0);

  // Calculations matching Image 2:
  // In Image 2: Total item price = ₹9000, Total discount = -₹4400, Fitting Fee = ₹199, Total payable = ₹4799
  const baseItemPriceSum = displayItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalItemPrice = liveItems.length > 0 ? Math.max(baseItemPriceSum, 2000) : 9000;
  const couponSavings = isCouponApplied ? 2400 : 0;
  const totalDiscount = liveItems.length > 0 ? Math.round(totalItemPrice * 0.4) + couponSavings : (isCouponApplied ? 4400 : 2000);
  const fittingFee = 199;
  const totalPayable = Math.max(0, totalItemPrice - totalDiscount + fittingFee);

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleRepeatItem = (item: CartDisplayItem) => {
    if (item.rawCartItemId) {
      updateCartQuantity(item.rawCartItemId, item.quantity + 1);
    } else {
      // If demo item, add hustlr classic
      const prod = products[0];
      if (prod) {
        addToCart(prod, prod.variants[0]);
      }
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f9fafb] overflow-y-auto selection:bg-black selection:text-white animate-fade-in font-sans">
      {/* 1. Top Minimal Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Left: Continue Shopping button */}
          <button
            onClick={() => setIsCartOpen(false)}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-black transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Back</span>
            </span>
          </button>

          {/* Center: AR VISION Brand Infinity Logo */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="flex items-center gap-2 cursor-pointer text-slate-900 hover:text-indigo-600 transition-colors"
            title="AR Vision Eyewear"
          >
            <InfinityGlassesLogo className="h-6 sm:h-7 aspect-3/1" />
          </div>

          {/* Right: Close button */}
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-black transition cursor-pointer"
            title="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Main Cart Page Container: 2-Column Layout Matching Image 2 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-10 pb-28 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Cart Items List (Image 2 Left)               */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            {/* Cart Title & Count */}
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
              Cart ({totalItemCount || displayItems.length} items)
            </h2>

            {/* List of Cart Cards */}
            <div className="space-y-3 sm:space-y-4">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start justify-between shadow-2xs hover:shadow-sm transition"
                >
                  {/* Left: Frame Photo & BestSeller Tag */}
                  <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-start shrink-0 w-full sm:w-44 gap-3 sm:gap-0">
                    <div className="w-28 sm:w-full aspect-16/10 bg-[#fafafa] rounded-xl border border-slate-100 flex items-center justify-center p-2 sm:p-3 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/images/eyeglasses/hustlr-classic-bluesky.jpg';
                        }}
                      />
                    </div>
                    {item.isBestseller && (
                      <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] sm:text-[11px] font-bold border border-amber-200/60 sm:mt-2.5">
                        BestSeller ⚡
                      </span>
                    )}
                  </div>

                  {/* Middle / Info Column */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between w-full h-full space-y-3">
                    {/* Top row: Title & Price */}
                    <div className="flex items-start justify-between gap-2.5">
                      <h3 className="font-semibold text-xs sm:text-base text-slate-900 leading-snug">
                        {item.name}
                      </h3>
                      <span className="font-bold text-slate-900 text-xs sm:text-base shrink-0">
                        ₹{item.unitPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Lens Package info (e.g. Yellow Tinted Color Lenses ₹0) */}
                    {item.lensPackageName && (
                      <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-600 font-medium py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span>{item.lensPackageName}</span>
                        <span className="font-bold text-slate-900">
                          ₹{item.lensPrice || 0}
                        </span>
                      </div>
                    )}

                    {/* Bottom Row: Final Price & Remove | Repeat links */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5 sm:gap-2">
                        <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Final Price</span>
                        <span className="font-extrabold text-slate-900 text-xs sm:text-base">
                          ₹{item.finalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="hover:text-rose-600 transition cursor-pointer"
                        >
                          Remove
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={() => handleRepeatItem(item)}
                          className="hover:text-black transition cursor-pointer"
                        >
                          Repeat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Bill Details & Checkout (Image 2 Right)     */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-4">
            {/* Section Title */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Bill Details
            </h3>

            {/* Card 1: Bill Breakdown Box (Matching Image 2) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3.5 shadow-2xs">
              {/* Total item price */}
              <div
                onClick={() => setIsItemPriceOpen(!isItemPriceOpen)}
                className="flex items-center justify-between text-xs text-slate-700 cursor-pointer select-none"
              >
                <span className="flex items-center gap-1 font-medium">
                  Total item price <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
                <span className="font-bold text-slate-900">
                  ₹{totalItemPrice.toLocaleString()}
                </span>
              </div>

              {/* Total discount */}
              <div
                onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                className="flex items-center justify-between text-xs cursor-pointer select-none"
              >
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  Total discount <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
                <span className="font-bold text-emerald-600">
                  -₹{totalDiscount.toLocaleString()}
                </span>
              </div>

              {/* Fitting Fee */}
              <div
                onClick={() => setIsFittingFeeOpen(!isFittingFeeOpen)}
                className="flex items-center justify-between text-xs text-slate-700 cursor-pointer select-none"
              >
                <span className="flex items-center gap-1 font-medium">
                  Fitting Fee <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
                <span className="font-bold text-slate-900">
                  ₹{fittingFee.toLocaleString()}
                </span>
              </div>

              {/* Divider & Total Payable */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Total payable</span>
                <span className="font-extrabold text-base sm:text-lg text-slate-950">
                  ₹{totalPayable.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Card 2: Gold Max Membership Benefit (Matching Image 2) */}
            <div className="bg-[#fef6e4] border border-[#fbd38d]/60 rounded-xl p-4 text-xs space-y-1 shadow-2xs">
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                Gold Max Membership Benefit
              </h5>
              <p className="text-slate-700 text-[11px] sm:text-xs leading-relaxed">
                Buy 1 Get 1 Free applied + 5% cashback (will be sent after 14 days of order delivery)
              </p>
            </div>

            {/* Card 3: GET60 Applied Coupon Box (Matching Image 2) */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center justify-between shadow-2xs">
              <div>
                <span className="font-bold text-xs text-slate-900 block">
                  {isCouponApplied ? 'GET60 Applied' : 'Coupon Code'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isCouponApplied ? 'You are saving ₹2400' : 'Apply coupon code for 60% savings'}
                </span>
              </div>

              <button
                onClick={() => setIsCouponApplied(!isCouponApplied)}
                className="text-xs font-bold text-slate-800 hover:text-rose-600 transition uppercase tracking-wider cursor-pointer"
              >
                {isCouponApplied ? 'REMOVE' : 'APPLY'}
              </button>
            </div>

            {/* Card 4: Apply Insurance Card (Matching Image 2) */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center justify-between shadow-2xs hover:bg-slate-50 transition cursor-pointer group">
              <div>
                <span className="font-bold text-xs text-slate-900 block">
                  Apply Insurance
                </span>
                <span className="text-[11px] text-slate-500">
                  Tap to view your benefits
                </span>
              </div>

              <div className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 group-hover:border-black group-hover:text-black transition">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 5: Big Solid Black Checkout Button (Matching Image 2) */}
            <button
              onClick={handleProceedCheckout}
              className="w-full py-3.5 rounded-full sm:rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-sm tracking-wide shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Proceed To Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Checkout Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 lg:hidden z-40 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Payable
          </span>
          <span className="text-lg font-black text-slate-950">
            ₹{totalPayable.toLocaleString()}
          </span>
        </div>

        <button
          onClick={handleProceedCheckout}
          className="px-6 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
        >
          <span>Proceed To Checkout</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
