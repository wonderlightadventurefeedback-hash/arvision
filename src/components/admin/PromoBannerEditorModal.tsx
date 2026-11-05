import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { PromoBanner, BannerTheme, BannerBorderStyle, BannerHeight, BannerDisplayPosition } from '../../types';
import {
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  X,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Tag,
  ArrowRight,
  ShieldCheck,
  Percent,
  Layers,
  Palette,
  Sliders,
  Calendar,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface PromoBannerEditorModalProps {
  isOpen: boolean;
  banner: PromoBanner | null;
  capturedImage?: string;
  onClose: () => void;
  onSave: (banner: PromoBanner, publishImmediately: boolean) => void;
  onOpenLiveCamera: () => void;
}

export const PromoBannerEditorModal: React.FC<PromoBannerEditorModalProps> = ({
  isOpen,
  banner,
  capturedImage,
  onClose,
  onSave,
  onOpenLiveCamera,
}) => {
  const { products } = useStore();

  // Active form state
  const [name, setName] = useState('');
  const [adLabel, setAdLabel] = useState('AD');
  const [theme, setTheme] = useState<BannerTheme>('black-gold');
  const [productId, setProductId] = useState<string>('prod-1');
  const [syncWithProduct, setSyncWithProduct] = useState(true);
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState(4999);
  const [discountedPrice, setDiscountedPrice] = useState(2499);
  const [promotionalHeading, setPromotionalHeading] = useState('EXCLUSIVE FESTIVE OFFER');
  const [subtitle, setSubtitle] = useState('LIFETIME HINGE WARRANTY • FREE BLUE CUT LENSES');
  const [ctaText, setCtaText] = useState('Claim Festive Offer');
  const [ctaLink, setCtaLink] = useState('PDP:prod-1');
  const [bgImage, setBgImage] = useState('');
  const [bgColor, setBgColor] = useState('#09080C');
  const [borderStyle, setBorderStyle] = useState<BannerBorderStyle>('gold-filigree');
  const [hasGlowingLights, setHasGlowingLights] = useState(true);
  const [hasLightingEffects, setHasLightingEffects] = useState(true);
  const [textPosition, setTextPosition] = useState<'left' | 'center' | 'right'>('left');
  const [productImagePosition, setProductImagePosition] = useState<'right' | 'left' | 'center'>('right');
  const [bannerHeight, setBannerHeight] = useState<BannerHeight>('large');
  const [displayPosition, setDisplayPosition] = useState<BannerDisplayPosition>('below_hero');
  const [priority, setPriority] = useState(1);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2027-12-31');
  const [visDesktop, setVisDesktop] = useState(true);
  const [visTablet, setVisTablet] = useState(true);
  const [visMobile, setVisMobile] = useState(true);

  // Editor UI State
  const [editorTab, setEditorTab] = useState<'template' | 'product' | 'content' | 'layout'>('template');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Load banner data on open
  useEffect(() => {
    if (banner) {
      setName(banner.name);
      setAdLabel(banner.adLabel || 'AD');
      setTheme(banner.theme || 'black-gold');
      setProductId(banner.productId || 'none');
      setSyncWithProduct(banner.syncWithProduct ?? true);
      setProductName(banner.productName);
      setProductImage(banner.productImage);
      setProductDescription(banner.productDescription);
      setOriginalPrice(banner.originalPrice);
      setDiscountedPrice(banner.discountedPrice);
      setPromotionalHeading(banner.promotionalHeading);
      setSubtitle(banner.subtitle);
      setCtaText(banner.ctaText);
      setCtaLink(banner.ctaLink);
      setBgImage(banner.bgImage || '');
      setBgColor(banner.bgColor || '#09080C');
      setBorderStyle(banner.borderStyle || 'gold-filigree');
      setHasGlowingLights(banner.hasGlowingLights ?? true);
      setHasLightingEffects(banner.hasLightingEffects ?? true);
      setTextPosition(banner.textPosition || 'left');
      setProductImagePosition(banner.productImagePosition || 'right');
      setBannerHeight(banner.bannerHeight || 'large');
      setDisplayPosition(banner.displayPosition || 'below_hero');
      setPriority(banner.priority || 1);
      setStartDate(banner.startDate || '2026-01-01');
      setEndDate(banner.endDate || '2027-12-31');
      setVisDesktop(banner.deviceVisibility?.desktop ?? true);
      setVisTablet(banner.deviceVisibility?.tablet ?? true);
      setVisMobile(banner.deviceVisibility?.mobile ?? true);
    } else {
      // Default to initial Black & Gold template
      setName('New Promotional Banner');
      setAdLabel('AD');
      setTheme('black-gold');
      setProductId(products[0]?.id || 'prod-1');
      setSyncWithProduct(true);
      if (products[0]) {
        setProductName(products[0].name);
        setProductImage(products[0].images[0]);
        setProductDescription(products[0].description);
        setOriginalPrice(products[0].originalPrice);
        setDiscountedPrice(products[0].sellingPrice);
        setCtaLink(`PDP:${products[0].id}`);
      }
      setPromotionalHeading('SPECIAL HOMEPAGE PROMOTION');
      setSubtitle('Precision Engineered Eyewear with 100% UV & Blue Light Protection');
      setCtaText('Claim Offer Now');
      setBorderStyle('gold-filigree');
      setHasGlowingLights(true);
      setHasLightingEffects(true);
      setTextPosition('left');
      setProductImagePosition('right');
      setBannerHeight('large');
      setDisplayPosition('below_hero');
      setPriority(1);
      setStartDate('2026-01-01');
      setEndDate('2027-12-31');
    }
  }, [banner, products, isOpen]);

  // Handle external camera image capture
  useEffect(() => {
    if (capturedImage) {
      setProductImage(capturedImage);
    }
  }, [capturedImage]);

  // When product selection changes, auto-fill if sync enabled
  const handleSelectProduct = (prodId: string) => {
    setProductId(prodId);
    if (prodId === 'none') return;
    const selected = products.find((p) => p.id === prodId);
    if (selected && syncWithProduct) {
      setProductName(selected.name);
      setProductImage(selected.images[0]);
      setProductDescription(selected.description);
      setOriginalPrice(selected.originalPrice);
      setDiscountedPrice(selected.sellingPrice);
      setCtaLink(`PDP:${selected.id}`);
    }
  };

  // Preset Template Switcher
  const handleApplyTemplate = (newTheme: BannerTheme) => {
    setTheme(newTheme);
    if (newTheme === 'black-gold') {
      setBorderStyle('gold-filigree');
      setHasGlowingLights(true);
      setHasLightingEffects(true);
      setBgColor('#09080C');
      setBgImage('');
      setPromotionalHeading('EXCLUSIVE FESTIVE OFFER');
      setCtaText('Claim Festive Offer');
    } else if (newTheme === 'black-purple') {
      setBorderStyle('neon-glow');
      setHasGlowingLights(false);
      setHasLightingEffects(true);
      setBgColor('#0A0717');
      setBgImage('');
      setPromotionalHeading('AI OPTICAL REVOLUTION');
      setCtaText('Explore Cyber Series');
    } else if (newTheme === 'black-cyan') {
      setBorderStyle('cyber-bracket');
      setHasGlowingLights(false);
      setHasLightingEffects(true);
      setBgColor('#050B14');
      setBgImage('');
      setPromotionalHeading('NEXT-GEN BLUE CUT SHIELD');
      setCtaText('Shop Cyber Blue');
    } else if (newTheme === 'minimal') {
      setBorderStyle('subtle-border');
      setHasGlowingLights(false);
      setHasLightingEffects(false);
      setBgColor('#0F172A');
      setBgImage('');
      setPromotionalHeading('SEASONAL CURATION');
      setCtaText('Discover Collection');
    } else if (newTheme === 'custom') {
      setBorderStyle('none');
      setHasGlowingLights(false);
    }
  };

  // Real-time automatic discount calculation
  const discountPercentage = useMemo(() => {
    if (originalPrice <= 0) return 0;
    return Math.max(0, Math.round(((originalPrice - discountedPrice) / originalPrice) * 100));
  }, [originalPrice, discountedPrice]);

  const handleSave = (publish: boolean) => {
    const bannerPayload: PromoBanner = {
      id: banner?.id || `promo-${Date.now()}`,
      name,
      adLabel,
      theme,
      productId: productId === 'none' ? undefined : productId,
      syncWithProduct,
      productName,
      productImage,
      productDescription,
      originalPrice,
      discountedPrice,
      discountPercentage,
      promotionalHeading,
      subtitle,
      ctaText,
      ctaLink,
      bgImage: bgImage || undefined,
      bgColor,
      borderStyle,
      hasGlowingLights,
      hasLightingEffects,
      textPosition,
      productImagePosition,
      bannerHeight,
      displayPosition,
      priority,
      startDate,
      endDate,
      status: publish ? 'published' : 'draft',
      deviceVisibility: {
        desktop: visDesktop,
        tablet: visTablet,
        mobile: visMobile,
      },
    };
    onSave(bannerPayload, publish);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) setProductImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#0A0A16] border border-purple-500/30 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col">
        {/* Top Navigation & Viewport Mode Bar */}
        <div className="h-16 px-6 bg-gradient-to-r from-purple-950/50 via-slate-900 to-cyan-950/40 border-b border-purple-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-heading">
                HOMEPAGE ADVERTISEMENT VISUAL STUDIO
              </h3>
              <p className="text-[11px] text-slate-400">
                WYSIWYG Real-Time Editor with Black & Gold, Cyber Neon & Minimal Templates
              </p>
            </div>
          </div>

          {/* Viewport Toggles for Live Preview */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-purple-500/20 text-xs">
            <button
              onClick={() => setPreviewViewport('desktop')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                previewViewport === 'desktop'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setPreviewViewport('tablet')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                previewViewport === 'tablet'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setPreviewViewport('mobile')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                previewViewport === 'mobile'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOP SECTION: REAL-TIME INTERACTIVE LIVE BANNER PREVIEW */}
        <div className="p-4 sm:p-6 bg-slate-950/70 border-b border-purple-500/20 overflow-x-auto flex justify-center shrink-0">
          <div
            className={`transition-all duration-300 ${
              previewViewport === 'desktop'
                ? 'w-full max-w-5xl'
                : previewViewport === 'tablet'
                ? 'w-[720px]'
                : 'w-[360px]'
            }`}
          >
            {/* The Live Rendered Banner Preview */}
            <div
              className={`relative w-full rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl ${
                theme === 'black-gold'
                  ? 'bg-[#09080C] text-amber-100 shadow-[0_0_40px_rgba(245,158,11,0.2)]'
                  : theme === 'black-purple'
                  ? 'bg-[#090714] text-purple-100 shadow-[0_0_40px_rgba(168,85,247,0.25)]'
                  : theme === 'black-cyan'
                  ? 'bg-[#050B14] text-cyan-100 shadow-[0_0_40px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900 text-white'
              }`}
              style={
                bgImage
                  ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }
                  : { backgroundColor: bgColor }
              }
            >
              {/* Atmospheric Purple & Cyan Lighting Flares */}
              {hasLightingEffects && (
                <>
                  <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-purple-600/20 blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-cyan-500/20 blur-[80px] pointer-events-none" />
                </>
              )}

              {/* Hanging Glowing Light Bulbs (Reference Feature) */}
              {hasGlowingLights && (
                <div className="absolute top-0 inset-x-0 h-5 flex justify-between px-6 pointer-events-none z-20">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-[1px] h-2 bg-amber-400/40" />
                      <div
                        className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b] animate-pulse"
                        style={{ animationDelay: `${(i % 4) * 0.2}s` }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Gold Filigree or Neon Border */}
              {borderStyle === 'gold-filigree' && (
                <>
                  <div className="absolute inset-0 border-2 border-amber-500/70 rounded-2xl pointer-events-none z-20" />
                  <div className="absolute inset-2 border border-amber-400/30 rounded-xl pointer-events-none z-20" />
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400 pointer-events-none z-20" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400 pointer-events-none z-20" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400 pointer-events-none z-20" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400 pointer-events-none z-20" />
                </>
              )}

              {borderStyle === 'neon-glow' && (
                <div className="absolute inset-0 border-2 border-purple-500/60 rounded-2xl pointer-events-none z-20 shadow-[inset_0_0_20px_rgba(168,85,247,0.3)]" />
              )}

              {borderStyle === 'cyber-bracket' && (
                <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-2xl pointer-events-none z-20 shadow-[inset_0_0_20px_rgba(6,182,212,0.3)]" />
              )}

              {/* AD Label */}
              <div className="absolute top-3 left-4 z-30">
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {adLabel || 'AD'}
                </span>
              </div>

              {/* Banner Content Layout */}
              <div
                className={`relative z-10 p-5 sm:p-7 flex ${
                  previewViewport === 'mobile'
                    ? 'flex-col-reverse items-center text-center'
                    : 'flex-row items-center justify-between text-left'
                } gap-5`}
              >
                {/* Left: Typography & Pricing */}
                <div className={`space-y-2.5 ${previewViewport === 'mobile' ? 'w-full' : 'w-3/5'}`}>
                  <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                    {promotionalHeading}
                  </div>
                  <h4 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading leading-tight bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                    {productName || 'Product Title'}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-1">{subtitle}</p>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xl sm:text-2xl font-black text-amber-300 font-heading">
                      ₹{discountedPrice.toLocaleString()}
                    </span>
                    {originalPrice > discountedPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                    )}
                    {discountPercentage > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black">
                        {discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black shadow-md">
                      {ctaText} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Right: Product Photo Showcase */}
                <div
                  className={`flex items-center justify-center relative ${
                    previewViewport === 'mobile' ? 'w-full h-36' : 'w-2/5 h-44'
                  }`}
                >
                  <div className="absolute w-40 h-40 rounded-full bg-amber-500/25 blur-3xl pointer-events-none" />
                  <img
                    src={productImage || 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80'}
                    alt={productName}
                    className="max-h-full w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: 4-TAB EDITING WORKBENCH */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-[#070710]">
          {/* Tab Selector */}
          <div className="flex items-center border-b border-purple-500/20 px-6 bg-slate-950 text-xs">
            {[
              { id: 'template', label: '1. Theme & Templates', icon: <Palette className="w-3.5 h-3.5" /> },
              { id: 'product', label: '2. Product & Pricing Sync', icon: <Tag className="w-3.5 h-3.5" /> },
              { id: 'content', label: '3. Headlines & Copy', icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: 'layout', label: '4. Layout & Schedule', icon: <Sliders className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEditorTab(tab.id as any)}
                className={`px-4 py-3 font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  editorTab === tab.id
                    ? 'border-amber-400 text-amber-300 bg-white/[0.03]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Theme & Templates */}
          {editorTab === 'template' && (
            <div className="p-6 space-y-5 text-xs">
              <div>
                <label className="text-white font-bold block mb-2">Select Visual Design Template:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'black-gold', title: '1. Black & Gold Premium', desc: 'Reference luxury design with gold borders & glowing bulbs', color: 'border-amber-500 bg-amber-500/10' },
                    { id: 'black-purple', title: '2. Black & Purple Cyber', desc: 'Futuristic violet glows & cyberpunk edge illumination', color: 'border-purple-500 bg-purple-500/10' },
                    { id: 'black-cyan', title: '3. Black & Cyan Tech', desc: 'Electric cyan matrix styling & neon corner brackets', color: 'border-cyan-500 bg-cyan-500/10' },
                    { id: 'minimal', title: '4. Minimal Dark Promo', desc: 'Clean slate-950 frosted glass aesthetic', color: 'border-slate-500 bg-slate-800/40' },
                    { id: 'custom', title: '5. Custom Upload Design', desc: 'Custom graphics, custom background, custom styles', color: 'border-indigo-400 bg-indigo-500/10' },
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleApplyTemplate(t.id as any)}
                      className={`p-3 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                        theme === t.id ? `${t.color} text-white shadow-lg` : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-white text-xs">{t.title}</div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{t.desc}</p>
                      </div>
                      {theme === t.id && (
                        <span className="text-[9px] font-bold text-amber-300 flex items-center gap-1 mt-2">
                          <CheckCircle2 className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Effects Toggles */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/20 space-y-3">
                <div className="font-bold text-white">Visual Lighting & Border Customization</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={hasGlowingLights}
                      onChange={(e) => setHasGlowingLights(e.target.checked)}
                      className="accent-amber-400 w-4 h-4"
                    />
                    <span>Hanging Festive Glowing Light Bulbs</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={hasLightingEffects}
                      onChange={(e) => setHasLightingEffects(e.target.checked)}
                      className="accent-cyan-400 w-4 h-4"
                    />
                    <span>Ambient Purple & Cyan Beams</span>
                  </label>
                  <div>
                    <label className="text-slate-400 block mb-1">Border Styling</label>
                    <select
                      value={borderStyle}
                      onChange={(e) => setBorderStyle(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    >
                      <option value="gold-filigree">Gold Ornate Filigree</option>
                      <option value="neon-glow">Purple Neon Glow</option>
                      <option value="cyber-bracket">Cyan Cyber Bracket</option>
                      <option value="subtle-border">Subtle Glass Inset</option>
                      <option value="none">No Border</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Product & Pricing Sync */}
          {editorTab === 'product' && (
            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Product Catalogue Linkage</span>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncWithProduct}
                      onChange={(e) => setSyncWithProduct(e.target.checked)}
                      className="accent-amber-400 w-4 h-4"
                    />
                    <span>Sync details with selected product</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Select Product from Storefront Catalogue</label>
                    <select
                      value={productId}
                      onChange={(e) => handleSelectProduct(e.target.value)}
                      className="w-full bg-slate-900 border border-purple-500/30 rounded-lg p-2.5 text-white font-bold"
                    >
                      <option value="none">None (Custom Standalone Advertisement)</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ₹{p.sellingPrice} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Product Display Name</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Automatic Discount Engine */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Pricing & Discount Calculations</span>
                  <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                    Auto-Calculated Discount: {discountPercentage}% OFF
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Original Price (Strikethrough) (₹)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Discounted Selling Price (₹)</label>
                    <input
                      type="number"
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-amber-500/50 rounded-lg p-2 text-amber-300 font-extrabold"
                    />
                  </div>
                </div>
              </div>

              {/* Product Image Option: Upload or Camera */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Product Photo Asset</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onOpenLiveCamera}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    >
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Capture From Camera</span>
                    </button>
                    <label className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-white/10 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-purple-400" />
                      <span>Upload Device File</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Product Image URL</label>
                  <input
                    type="text"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Headlines & Copy */}
          {editorTab === 'content' && (
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Advertisement Internal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Advertisement Corner Label</label>
                  <input
                    type="text"
                    value={adLabel}
                    onChange={(e) => setAdLabel(e.target.value)}
                    placeholder="AD, SPONSORED, EXCLUSIVE"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Promotional Super Heading</label>
                <input
                  type="text"
                  value={promotionalHeading}
                  onChange={(e) => setPromotionalHeading(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-amber-300 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Subtitle / Highlights</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">CTA Destination Link / Product Action</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="PDP:prod-1, Eyeglasses, BOGO"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Layout & Schedule */}
          {editorTab === 'layout' && (
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Homepage Display Section</label>
                  <select
                    value={displayPosition}
                    onChange={(e) => setDisplayPosition(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="below_hero">Below Hero (Primary Spotlight)</option>
                    <option value="homepage_top">Top of Homepage</option>
                    <option value="mid_homepage">Mid-Homepage Campaign</option>
                    <option value="above_catalog">Above Product Catalog</option>
                    <option value="bottom_promo">Bottom Promotional Strip</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Display Priority Order</label>
                  <input
                    type="number"
                    min={1}
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Banner Height</label>
                  <select
                    value={bannerHeight}
                    onChange={(e) => setBannerHeight(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="large">Large (High Impact)</option>
                    <option value="medium">Medium</option>
                    <option value="compact">Compact Strip</option>
                  </select>
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Device Visibility */}
              <div className="pt-2">
                <label className="text-white font-bold block mb-2">Device Visibility Controls:</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={visDesktop}
                      onChange={(e) => setVisDesktop(e.target.checked)}
                      className="accent-purple-500 w-4 h-4"
                    />
                    <span>Desktop Visible</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={visTablet}
                      onChange={(e) => setVisTablet(e.target.checked)}
                      className="accent-purple-500 w-4 h-4"
                    />
                    <span>Tablet Visible</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={visMobile}
                      onChange={(e) => setVisMobile(e.target.checked)}
                      className="accent-purple-500 w-4 h-4"
                    />
                    <span>Mobile Visible</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-purple-500/20 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black shadow-[0_0_25px_rgba(245,158,11,0.4)] transition flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Publish to Live Homepage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
