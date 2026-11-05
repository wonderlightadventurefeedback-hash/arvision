import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Monitor,
  Tablet,
  Smartphone,
  X,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  Star,
  Tag,
} from 'lucide-react';

interface WebsitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebsitePreviewModal: React.FC<WebsitePreviewModalProps> = ({ isOpen, onClose }) => {
  const {
    products,
    heroSlides,
    festivalCampaigns,
    banners,
    categories,
    setActiveView,
    logActivity,
  } = useStore();

  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [publishedToast, setPublishedToast] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'home' | 'catalog' | 'banners'>('home');

  if (!isOpen) return null;

  const activeSlides = heroSlides.filter((s) => s.isActive);
  const activeFestival = festivalCampaigns.find((c) => c.isActive);
  const activeBanners = banners.filter((b) => b.isActive);
  const publishedProducts = products.filter((p) => p.isPublished);

  const handlePublishAll = () => {
    logActivity('Catalog & Content Published', 'Production Deployment', 'Admin published all pending changes to live customer website.');
    setPublishedToast(true);
    setTimeout(() => setPublishedToast(false), 3000);
  };

  const containerWidths = {
    desktop: 'w-full max-w-6xl',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Top Preview Control Bar */}
      <header className="h-16 bg-[#080811] border-b border-purple-500/20 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-heading">
                WONDERLIX LIVE PREVIEW STUDIO
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                REAL-TIME SYNC
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Simulate customer experience across desktop, tablet & mobile viewports
            </p>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-900 border border-purple-500/20 p-1 rounded-xl">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop (1200px)</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              deviceMode === 'tablet'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet (768px)</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile (375px)</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePublishAll}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Changes</span>
          </button>

          <button
            onClick={() => {
              onClose();
              setActiveView('storefront');
            }}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition border border-white/10 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Store</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Published Toast Notice */}
      {publishedToast && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 text-center animate-in slide-in-from-top-2 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>All pending products, prices, banners & promotions are published to the live store!</span>
        </div>
      )}

      {/* Device Viewport Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-900/60">
        <div
          className={`${containerWidths[deviceMode]} bg-white text-slate-900 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 border border-slate-700/50 flex flex-col`}
        >
          {/* Simulated Browser URL bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-3 select-none">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded-md py-1 px-3 text-[11px] text-slate-500 font-mono flex items-center justify-between">
              <span>https://wonderlix.ai/optics</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Secure SSL
              </span>
            </div>
          </div>

          {/* Simulated Storefront Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-slate-50">
            {/* 1. Hero Slide Preview */}
            {activeSlides.length > 0 && (
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-slate-950 text-white min-h-[260px] sm:min-h-[340px] flex items-center">
                <img
                  src={
                    deviceMode === 'mobile'
                      ? activeSlides[0].mobileImage
                      : activeSlides[0].desktopImage
                  }
                  alt={activeSlides[0].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
                <div className="relative p-6 sm:p-8 max-w-md space-y-2.5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/40 text-indigo-200 border border-indigo-400/30 text-[10px] font-bold uppercase tracking-wider">
                    {activeSlides[0].badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
                    {activeSlides[0].title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {activeSlides[0].subtitle}
                  </p>
                  <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shadow-md">
                    {activeSlides[0].ctaText} →
                  </button>
                </div>
              </div>
            )}

            {/* 2. Active Festival Strip */}
            {activeFestival && (
              <div className="rounded-xl p-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded">
                    {activeFestival.badgeText}
                  </span>
                  <h4 className="text-sm font-bold">{activeFestival.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-white/90 px-2 py-1 rounded">
                    {activeFestival.couponCode}
                  </span>
                  <span className="text-xs font-extrabold text-amber-950">
                    {activeFestival.discountPercent}% OFF
                  </span>
                </div>
              </div>
            )}

            {/* 3. Optical Categories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 font-heading">
                  Shop by Category
                </h4>
                <span className="text-xs text-indigo-600 font-semibold cursor-pointer">
                  View All ({categories.length})
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white rounded-xl p-3 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-center space-y-1.5 cursor-pointer group"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-12 h-12 rounded-lg object-cover mx-auto group-hover:scale-105 transition"
                    />
                    <div className="text-xs font-bold text-slate-900 truncate">{cat.name}</div>
                    <span className="text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {cat.badgeText}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Active Catalog Products */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-heading">
                    Live Catalog ({publishedProducts.length} Published)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Synchronized with Wonderlix Admin pricing and stock rules
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {publishedProducts.slice(0, 6).map((product) => {
                  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
                  const isOutOfStock = totalStock === 0;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition flex flex-col group"
                    >
                      <div className="relative aspect-square bg-slate-100 overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {product.discountPercentage > 0 && (
                          <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                            {product.discountPercentage}% OFF
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white text-xs font-bold">
                            OUT OF STOCK
                          </span>
                        )}
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            {product.brand} • {product.shape}
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {product.name}
                          </h5>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <div>
                            <span className="text-xs font-extrabold text-slate-900">
                              ₹{product.sellingPrice.toLocaleString()}
                            </span>
                            {product.originalPrice > product.sellingPrice && (
                              <span className="text-[10px] text-slate-400 line-through ml-1.5">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <button
                            disabled={isOutOfStock}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                              isOutOfStock
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-900 text-white hover:bg-indigo-600'
                            }`}
                          >
                            {isOutOfStock ? 'Sold Out' : 'Buy Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Custom Banners List */}
            {activeBanners.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 font-heading">
                  Active Homepage Promotional Posters ({activeBanners.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeBanners.map((banner) => (
                    <div
                      key={banner.id}
                      className="relative rounded-xl overflow-hidden shadow-md min-h-[140px] flex items-center text-white p-4"
                    >
                      <img
                        src={banner.desktopImage}
                        alt={banner.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
                      <div className="relative space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                          {banner.targetSection.toUpperCase()} BANNER
                        </span>
                        <h5 className="text-sm font-bold font-heading">{banner.mainHeading}</h5>
                        <p className="text-[11px] text-slate-300 line-clamp-1">{banner.subtitle}</p>
                        <span className="inline-block text-[11px] font-bold text-indigo-300 underline pt-1">
                          {banner.ctaText} →
                        </span>
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
