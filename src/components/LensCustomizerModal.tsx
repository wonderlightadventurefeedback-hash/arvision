import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { LensSelection } from '../types';
import {
  X,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Upload,
  FileText,
  Sparkles,
  HelpCircle,
  Play,
  RotateCw,
  Glasses,
  Check,
} from 'lucide-react';

interface LensPackage {
  id: string;
  name: string;
  badge?: {
    text: string;
    variant: 'blue' | 'red';
  };
  image: string;
  warranty: string;
  features: string[];
  coupon: string;
  price: number;
  originalPrice: number;
  category: 'bestsellers' | 'work_friendly' | 'high_power' | 'colored';
  description?: string;
}

export const LensCustomizerModal: React.FC = () => {
  const {
    isLensCustomizerOpen,
    setIsLensCustomizerOpen,
    productForLensCustomizer,
    addToCart,
    setIsCartOpen,
    userProfile,
  } = useStore();

  // Navigation steps: 1 = Power Type, 2 = Choose Package, 3 = Add Power
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Selected Power Type: 'with_power' | 'zero_power' | 'progressive' | 'frame_only'
  const [powerType, setPowerType] = useState<
    'with_power' | 'zero_power' | 'progressive' | 'frame_only'
  >('with_power');

  // Filter pills in Step 2: 'bestsellers' | 'work_friendly' | 'high_power' | 'colored' | 'all'
  const [activeFilter, setActiveFilter] = useState<
    'bestsellers' | 'work_friendly' | 'high_power' | 'colored' | 'all'
  >('bestsellers');

  // Selected Lens Package
  const [selectedPackage, setSelectedPackage] = useState<LensPackage | null>(null);

  // Modal states for details & power inputs
  const [viewDetailsPackage, setViewDetailsPackage] = useState<LensPackage | null>(null);
  const [isManualPowerOpen, setIsManualPowerOpen] = useState(false);
  const [isUploadRxOpen, setIsUploadRxOpen] = useState(false);

  // Manual prescription form inputs
  const [odSph, setOdSph] = useState('+0.75');
  const [odCyl, setOdCyl] = useState('0.00');
  const [odAxis, setOdAxis] = useState('0');
  const [odAdd, setOdAdd] = useState('+1.50');
  const [osSph, setOsSph] = useState('+0.75');
  const [osCyl, setOsCyl] = useState('0.00');
  const [osAxis, setOsAxis] = useState('0');
  const [osAdd, setOsAdd] = useState('+1.50');
  const [pd, setPd] = useState('63');
  const [uploadedFileName, setUploadedFileName] = useState('');

  if (!isLensCustomizerOpen || !productForLensCustomizer) return null;

  const product = productForLensCustomizer;

  // =========================================================================
  // DATA PACKAGES: With Power (Images 2 & 3)
  // =========================================================================
  const WITH_POWER_PACKAGES: LensPackage[] = [
    {
      id: 'pkg-antiglare-premium',
      name: 'Anti-Glare Premium',
      badge: { text: 'Free Lenses', variant: 'blue' },
      image: '/images/lenses/lens-antiglare.jpg',
      warranty: '6 Months Warranty',
      features: ['⚡ Double Side Anti-Glare Lens', '🛡️ Scratch Resistant'],
      coupon: 'Coupon : FESTIVE',
      price: product.sellingPrice,
      originalPrice: product.originalPrice,
      category: 'bestsellers',
      description:
        'Advanced optical clarity with dual-sided anti-reflective coating. Eliminates reflections for everyday comfort.',
    },
    {
      id: 'pkg-blu-screen',
      name: 'AR-Vision Eyecare BLU Screen',
      badge: { text: 'Free Lenses', variant: 'blue' },
      image: '/images/lenses/lens-blu.jpg',
      warranty: '1 Year Warranty',
      features: [
        '💻 Screen Protection',
        '😣 Minimizes Eyestrain',
        '🛡️ Scratch & Smudge Resistant',
      ],
      coupon: 'Coupon : FESTIVE',
      price: 1550,
      originalPrice: 2600,
      category: 'work_friendly',
      description:
        'Blocks 98% harmful high-energy blue-violet rays emitted by digital devices. Recommended for 6+ hours of screen usage.',
    },
    {
      id: 'pkg-owndays-japan-blu',
      name: 'Owndays Japan BLU+',
      badge: { text: 'Designed in Japan', variant: 'red' },
      image: '/images/lenses/lens-japan-blu.jpg',
      warranty: '1 Year Warranty',
      features: [
        '💻 Advanced Screen Protection',
        '😣 Minimizes Eyestrain',
        '🛡️ Crack, Scratch & Smudge Resistant',
        '⚡ Double Side Anti-Glare Lens',
      ],
      coupon: 'Coupon : FESTIVE',
      price: 2150,
      originalPrice: 3600,
      category: 'bestsellers',
      description:
        'Engineered in Tokyo with premium high-density polymer. Features ultra-resilient Oleophobic and Super Hydrophobic nano-coatings.',
    },
    {
      id: 'pkg-owndays-japan-thin',
      name: 'Owndays Japan BLU+ Thin',
      badge: { text: 'Designed in Japan', variant: 'red' },
      image: '/images/lenses/lens-japan-thin.jpg',
      warranty: '1 Year Warranty',
      features: [
        '👐 Thin Lenses',
        '💻 Advanced Screen Protection',
        '😣 Minimizes Eyestrain',
        '🛡️ Crack, Scratch & Smudge Resistant',
        '⚡ Double Side Anti-Glare Lens',
      ],
      coupon: 'Coupon : FESTIVE',
      price: 2750,
      originalPrice: 4600,
      category: 'high_power',
      description:
        '1.60 / 1.67 Aspheric high-index compression for high power prescriptions (-3.00 to -8.00). 35% thinner and lighter.',
    },
    {
      id: 'pkg-owndays-japan-ishield',
      name: 'Owndays Japan BLU+ iShield',
      badge: { text: 'Designed in Japan', variant: 'red' },
      image: '/images/lenses/lens-japan-ishield.jpg',
      warranty: '1 Year Warranty',
      features: [
        '🛣️ Night Drive & Selfie Coating',
        '💡 Improves visibility in low-light and rains',
        '💻 Advanced Screen Protection',
      ],
      coupon: 'Coupon : FESTIVE',
      price: 3350,
      originalPrice: 5600,
      category: 'colored',
      description:
        'Night-driving optic filters that suppress oncoming high-beam glare while preserving crisp peripheral vision in dark and rainy conditions.',
    },
  ];

  // =========================================================================
  // DATA PACKAGES: Zero Power (Image 5)
  // =========================================================================
  const ZERO_POWER_PACKAGES: LensPackage[] = [
    {
      id: 'pkg-zero-blu',
      name: 'BLU Screen Lenses',
      image: '/images/lenses/lens-blu.jpg',
      warranty: '1 Year Warranty',
      features: [
        '💻 Screen Protection',
        '😣 Minimizes Eyestrain',
        '🛡️ Scratch & Smudge Resistant',
      ],
      coupon: 'Coupon : FESTIVE',
      price: 1200,
      originalPrice: 2000,
      category: 'bestsellers',
      description:
        'Zero-power lenses specifically calibrated for gaming, digital work, and laptop protection. 100% UV400 blocking.',
    },
    {
      id: 'pkg-zero-ishield',
      name: 'Owndays Japan BLU+ iShield',
      badge: { text: 'Designed in Japan', variant: 'red' },
      image: '/images/lenses/lens-japan-ishield.jpg',
      warranty: '1 Year Warranty',
      features: [
        '🇯🇵 Designed in Japan',
        '🚗 Ideal For Night Driving',
        '💡 Improves visibility in low-light and rains',
        '💻 Screen Protection',
      ],
      coupon: 'Coupon : FESTIVE',
      price: 1900,
      originalPrice: 3200,
      category: 'bestsellers',
      description:
        'Specialized optical anti-glare for safe night driving and zero reflection screen protection.',
    },
    {
      id: 'pkg-zero-brown',
      name: 'Brown Tinted Color Lenses',
      image: '/images/lenses/lens-brown-tint.jpg',
      warranty: '1 Year Warranty',
      features: [
        '🟤 Brown Color lenses',
        '🌅 Protects from Harmful UV Rays',
        '🏞️ Great for Outdoor Activities',
      ],
      coupon: 'Coupon : FESTIVE',
      price: 1200,
      originalPrice: 2000,
      category: 'colored',
      description:
        'Fashion-forward warm brown gradient tint providing high-contrast vision in bright sunlight.',
    },
    {
      id: 'pkg-zero-pink',
      name: 'Pink Tinted Color Lenses',
      image: '/images/lenses/lens-pink-tint.jpg',
      warranty: '1 Year Warranty',
      features: [
        '🌸 Pink Color lenses',
        '🌅 Protects from Harmful UV Rays',
        '👁️ Better Visual Clarity, Enhances Depth',
      ],
      coupon: 'Coupon : FESTIVE',
      price: 1200,
      originalPrice: 2000,
      category: 'colored',
      description:
        'Soft rose tint that enhances depth perception and contrast while filtering harmful UV rays.',
    },
    {
      id: 'pkg-zero-yellow',
      name: 'Yellow Tinted Color Lenses',
      image: '/images/lenses/lens-yellow-tint.jpg',
      warranty: '1 Year Warranty',
      features: [
        '🟡 Yellow Color lenses',
        '🚗 Ideal for Day or Night Driving',
        '🌅 Protects from Harmful UV Rays',
      ],
      coupon: 'Coupon : FESTIVE',
      price: 1200,
      originalPrice: 2000,
      category: 'colored',
      description:
        'High-contrast amber-yellow tint that blocks blue haze and enhances clarity for driving and low-light sports.',
    },
    {
      id: 'pkg-zero-blue',
      name: 'Blue Tinted Color Lenses',
      image: '/images/lenses/lens-blue-tint.jpg',
      warranty: '1 Year Warranty',
      features: [
        '🔵 Blue Color lenses',
        '🌅 Protects from Harmful UV Rays',
        '🏖️ Ideal for Beaches and Sports',
      ],
      coupon: 'Coupon : FESTIVE',
      price: 1200,
      originalPrice: 2000,
      category: 'colored',
      description:
        'Ocean-inspired cool blue tint reducing glare from water and snow, perfect for coastal lifestyle and sports.',
    },
    {
      id: 'pkg-zero-green',
      name: 'Green Tinted Color Lenses',
      image: '/images/lenses/lens-green-tint.jpg',
      warranty: '1 Year Warranty',
      features: [
        '🟢 Green Color lenses',
        '🌅 Protects from Harmful UV Rays',
        '⚡ Effective at Reducing Glare',
      ],
      coupon: 'Coupon : FESTIVE',
      price: 1200,
      originalPrice: 2000,
      category: 'colored',
      description:
        'Classic aviator G-15 green tint that transmits all colors evenly, providing true color perception with superior glare reduction.',
    },
  ];

  // Current list of packages based on power type
  const activePackages =
    powerType === 'zero_power' ? ZERO_POWER_PACKAGES : WITH_POWER_PACKAGES;

  // Filtered packages
  const filteredPackages =
    powerType === 'zero_power'
      ? ZERO_POWER_PACKAGES
      : activePackages.filter((pkg) => {
          if (activeFilter === 'all') return true;
          if (activeFilter === 'bestsellers')
            return pkg.category === 'bestsellers' || pkg.id.includes('blu');
          return pkg.category === activeFilter;
        });

  // Finish checkout / Add to cart with lens selection
  const handleFinalizeSelection = (
    method: 'manual' | 'upload' | 'later' | 'saved',
    pkgToUse?: LensPackage | null,
    powerDetails?: { odSph?: string; osSph?: string; odCyl?: string; osCyl?: string }
  ) => {
    const pkg = pkgToUse || selectedPackage;
    const lensPrice = pkg ? (pkg.price > product.sellingPrice ? pkg.price - product.sellingPrice : 0) : 0;

    const lensSelection: LensSelection = {
      visionType:
        powerType === 'zero_power'
          ? 'zero_power'
          : powerType === 'progressive'
          ? 'progressive'
          : 'single_vision',
      visionTypeName:
        powerType === 'zero_power'
          ? 'Zero Power (BLU Screen)'
          : powerType === 'progressive'
          ? 'Progressive / Bifocals'
          : 'With Power (Single Vision)',
      lensType: pkg?.id.includes('blu')
        ? 'blue_shield'
        : pkg?.id.includes('ishield')
        ? 'photochromic'
        : 'anti_reflective',
      lensTypeName: pkg?.name || 'Anti-Glare Premium',
      lensIndex: '1.60_thin',
      lensIndexName: '1.60 High-Index Precision Glazing',
      price: lensPrice,
      prescriptionDetails: {
        method: method === 'saved' ? 'manual' : method,
        odSph: powerDetails?.odSph || odSph,
        odCyl: powerDetails?.odCyl || odCyl,
        odAxis,
        odAdd,
        osSph: powerDetails?.osSph || osSph,
        osCyl: powerDetails?.osCyl || osCyl,
        osAxis,
        osAdd,
        pd,
        fileName: uploadedFileName || undefined,
      },
    };

    addToCart(product, product.variants[0], lensSelection);
    setIsLensCustomizerOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[92vh]">
        {/* =================================================================== */}
        {/* HEADER: Title & Stepper matching Images 1, 2, 4, 5                 */}
        {/* =================================================================== */}
        <div className="border-b border-slate-100 bg-white">
          <div className="px-3.5 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={() => {
                if (step === 3) setStep(2);
                else if (step === 2) setStep(1);
                else setIsLensCustomizerOpen(false);
              }}
              className="p-1 -ml-1 text-slate-700 hover:text-black transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight">
              {step === 1
                ? 'Select Lens Type'
                : step === 2
                ? 'Choose Lens Package'
                : 'Add Power'}
            </h2>

            {/* Close button */}
            <button
              onClick={() => setIsLensCustomizerOpen(false)}
              className="p-1 -mr-1 text-slate-500 hover:text-black transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Tabs Bar (3 Steps) */}
          <div className="flex items-center justify-around border-t border-slate-100">
            {/* Step 1: Power Type */}
            <div className="flex flex-col items-center py-2 relative flex-1 text-center">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {step > 1 ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                )}
                <span
                  className={`text-[11px] sm:text-xs font-semibold ${
                    step === 1 ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Power Type
                </span>
              </div>
              {step === 1 && (
                <span className="absolute bottom-0 inset-x-2 sm:inset-x-4 h-0.5 bg-emerald-500" />
              )}
            </div>

            {/* Step 2: Lenses */}
            <div className="flex flex-col items-center py-2 relative flex-1 text-center">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {step > 2 ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                ) : step === 2 ? (
                  <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    2
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-300 text-white flex items-center justify-center text-[10px] font-bold">
                    2
                  </span>
                )}
                <span
                  className={`text-[11px] sm:text-xs font-semibold ${
                    step === 2 ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  Lenses
                </span>
              </div>
              {step === 2 && (
                <span className="absolute bottom-0 inset-x-2 sm:inset-x-4 h-0.5 bg-emerald-500" />
              )}
            </div>

            {/* Step 3: Add Power (Only for With Power) */}
            <div className="flex flex-col items-center py-2 relative flex-1 text-center">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span
                  className={`w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px] font-bold ${
                    step === 3 ? 'bg-black' : 'bg-slate-300'
                  }`}
                >
                  3
                </span>
                <span
                  className={`text-[11px] sm:text-xs font-semibold ${
                    step === 3 ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  Add Power
                </span>
              </div>
              {step === 3 && (
                <span className="absolute bottom-0 inset-x-2 sm:inset-x-4 h-0.5 bg-emerald-500" />
              )}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* STEP 1: Select Lens Type (Matching Image 1)                         */}
        {/* =================================================================== */}
        {step === 1 && (
          <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
              Select your Power Type:
            </h3>

            <div className="space-y-2.5 sm:space-y-3">
              {/* Option 1: With Power (Most common) */}
              <div
                onClick={() => {
                  setPowerType('with_power');
                  setStep(2);
                }}
                className="p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-slate-50 p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/images/lenses/icon-with-power.jpg"
                      alt="With Power"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs sm:text-base">
                        With Power
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Most common
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      Positive, Negative or Cylindrical
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>

              {/* Option 2: Zero Power (BLU Screen lenses) */}
              <div
                onClick={() => {
                  setPowerType('zero_power');
                  setStep(2);
                }}
                className="p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-slate-50 p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/images/lenses/icon-zero-power.jpg"
                      alt="Zero Power"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs sm:text-base">
                        Zero Power
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                        BLU Screen lenses
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      Blue light block for screen protection
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>

              {/* Option 3: Progressive/Bifocals */}
              <div
                onClick={() => {
                  setPowerType('progressive');
                  setStep(2);
                }}
                className="p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-slate-50 p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/images/lenses/icon-bifocal.jpg"
                      alt="Progressive/Bifocals"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs sm:text-base">
                      Progressive/Bifocals
                    </span>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Two powers in one eye</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>

              {/* Option 4: Frame Only */}
              <div
                onClick={() => {
                  // Direct add to cart for frame only
                  addToCart(product, product.variants[0]);
                  setIsLensCustomizerOpen(false);
                  setIsCartOpen(true);
                }}
                className="p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-slate-50 p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/images/lenses/icon-frame-only.jpg"
                      alt="Frame Only"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs sm:text-base">
                      Frame Only
                    </span>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">With no lenses</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: Choose Lens Package (Matching Images 2, 3, 5)                */}
        {/* =================================================================== */}
        {step === 2 && (
          <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-3 sm:space-y-4">
            {/* Filter Pills Bar (matching Image 2) */}
            {powerType === 'with_power' && (
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setActiveFilter('bestsellers')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeFilter === 'bestsellers'
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ⭐ Bestsellers
                </button>
                <button
                  onClick={() => setActiveFilter('work_friendly')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeFilter === 'work_friendly'
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🖥️ Work Friendly
                </button>
                <button
                  onClick={() => setActiveFilter('high_power')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeFilter === 'high_power'
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  👓 High Power
                </button>
                <button
                  onClick={() => setActiveFilter('colored')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeFilter === 'colored'
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  👓 Colored
                </button>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
              </div>
            )}

            {/* Lens Packages Cards List (Images 2, 3, 5) */}
            <div className="space-y-3 sm:space-y-4">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition overflow-hidden shadow-2xs relative flex flex-col justify-between"
                >
                  {/* Top ribbon badge if applicable */}
                  {pkg.badge && (
                    <div className="absolute top-0 left-0 z-10">
                      <span
                        className={`text-[9px] sm:text-[10px] font-bold text-white px-2.5 sm:px-3 py-0.5 rounded-br-lg shadow-xs ${
                          pkg.badge.variant === 'blue' ? 'bg-[#0057b8]' : 'bg-[#c52233]'
                        }`}
                      >
                        {pkg.badge.text}
                      </span>
                    </div>
                  )}

                  <div className="p-3.5 sm:p-5 flex gap-3 sm:gap-4">
                    {/* Left: Lens Graphic with Play Icon & Warranty */}
                    <div className="w-22 sm:w-32 flex flex-col items-center justify-between shrink-0 pt-2">
                      <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-full h-full object-contain"
                        />
                        {/* Play Video Simulation Icon */}
                        <button
                          onClick={() => setViewDetailsPackage(pkg)}
                          className="absolute inset-0 m-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition shadow-md cursor-pointer"
                          title="Watch Lens Demo"
                        >
                          <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white ml-0.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-slate-600 mt-2 text-center">
                        <ShieldCheck className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{pkg.warranty}</span>
                      </div>
                    </div>

                    {/* Right: Package Details & Bullet Points */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Title & Arrow Button */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm sm:text-lg font-bold text-slate-900 leading-snug">
                            {pkg.name}
                          </h4>

                          {/* Round Select Button */}
                          <button
                            onClick={() => {
                              setSelectedPackage(pkg);
                              if (powerType === 'zero_power') {
                                // Zero power doesn't require power input, finish directly with chosen package!
                                handleFinalizeSelection('later', pkg);
                              } else {
                                // With Power moves to Step 3: Add Power (Image 4)
                                setStep(3);
                              }
                            }}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#001738] hover:bg-black text-white flex items-center justify-center shrink-0 transition cursor-pointer shadow-sm group"
                            title="Select Lens Package"
                          >
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        {/* Bullet Points */}
                        <ul className="mt-2 space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs text-slate-600 font-medium">
                          {pkg.features.map((feat, fIdx) => (
                            <li key={fIdx} className="truncate">
                              {feat}
                            </li>
                          ))}
                        </ul>

                        {/* View Details Link */}
                        <button
                          onClick={() => setViewDetailsPackage(pkg)}
                          className="text-[11px] sm:text-xs font-semibold text-emerald-600 hover:text-emerald-700 mt-1.5 sm:mt-2 inline-flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>View Details</span>
                          <span>&gt;</span>
                        </button>
                      </div>

                      {/* Bottom Pricing Row */}
                      <div className="mt-3 sm:mt-4 pt-2 border-t border-slate-100 flex items-end justify-between">
                        <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate max-w-[120px] sm:max-w-none">
                          {pkg.coupon}
                        </span>

                        <div className="text-right">
                          <div className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase">
                            Frame + Lens
                          </div>
                          <div className="flex items-baseline gap-1 sm:gap-1.5 justify-end">
                            <span className="text-sm sm:text-lg font-extrabold text-[#0057b8]">
                              ₹{pkg.price}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                              {pkg.originalPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: Add Power (Matching Image 4)                                */}
        {/* =================================================================== */}
        {step === 3 && (
          <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-5 sm:space-y-6">
            {/* Section 1: Saved Powers (Image 4 Top) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Saved Powers</h3>
                <button
                  onClick={() =>
                    handleFinalizeSelection('saved', { odSph: '+0.75', osSph: '+0.75' })
                  }
                  className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {/* Saved Power Card for Hitakankshi Behera (Matching Image 4) */}
              <div
                onClick={() =>
                  handleFinalizeSelection('saved', { odSph: '+0.75', osSph: '+0.75' })
                }
                className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition p-3.5 sm:p-4 cursor-pointer shadow-2xs group"
              >
                {/* User Pill Header */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4ff] text-slate-800 text-xs font-bold mb-3">
                  <span className="w-5 h-5 rounded-full bg-white text-slate-700 flex items-center justify-center text-[10px] font-black border border-slate-200">
                    H
                  </span>
                  <span>{userProfile?.name || 'Hitakankshi Behera'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </div>

                {/* Card Body */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  {/* Left: Frame icon & Bought date */}
                  <div className="flex sm:flex-col items-center gap-2 sm:gap-1.5 sm:pr-6 sm:border-r border-slate-100 pb-2 sm:pb-0 border-b sm:border-b-0">
                    <Glasses className="w-8 h-5 sm:w-9 sm:h-6 text-slate-700" />
                    <span className="text-[10px] text-slate-400 font-medium">
                      Bought on: 13 Jul 2026
                    </span>
                  </div>

                  {/* Right: Right & Left SPH power */}
                  <div className="flex-1 sm:pl-6">
                    <div className="grid grid-cols-2 text-center text-xs text-slate-500 font-bold mb-1">
                      <span>RIGHT</span>
                      <span>LEFT</span>
                    </div>
                    <div className="grid grid-cols-2 text-center items-center">
                      <div className="flex items-center justify-around font-mono text-sm font-extrabold text-slate-900">
                        <span className="text-[10px] text-slate-400">SPH</span>
                        <span>+0.75</span>
                      </div>
                      <div className="font-mono text-sm font-extrabold text-slate-900">
                        +0.75
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: I don't know my power (Image 4 Middle) */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                I don't know my power
              </h3>

              <div
                onClick={() => handleFinalizeSelection('later')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/images/lenses/thumb-submit-later.jpg"
                      alt="Submit Power Later"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Submit Power Later within 15 days
                    </h4>
                    <p className="text-[11px] text-slate-500">After placing the order</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Section 3: I know my power (Image 4 Bottom) */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">I know my power</h3>

              <div className="space-y-2.5">
                {/* Enter Power Manually */}
                <div
                  onClick={() => setIsManualPowerOpen(true)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 p-1 flex items-center justify-center shrink-0">
                      <img
                        src="/images/lenses/thumb-enter-manually.jpg"
                        alt="Enter Power Manually"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Enter Power Manually
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Input your latest eye prescription
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Upload Prescription */}
                <div
                  onClick={() => setIsUploadRxOpen(true)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 p-1 flex items-center justify-center shrink-0">
                      <img
                        src="/images/lenses/thumb-upload-rx.jpg"
                        alt="Upload Prescription"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Upload Prescription
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Just upload your power prescription
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SUB-MODAL: View Details for Lens Package                           */}
        {/* =================================================================== */}
        {viewDetailsPackage && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  {viewDetailsPackage.name} Specifications
                </h3>
                <button
                  onClick={() => setViewDetailsPackage(null)}
                  className="p-1 text-slate-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="w-full aspect-video bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden relative">
                  <img
                    src={viewDetailsPackage.image}
                    alt={viewDetailsPackage.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Nano Glaze Technology
                    </span>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  {viewDetailsPackage.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  {viewDetailsPackage.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-800">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPackage(viewDetailsPackage);
                  setViewDetailsPackage(null);
                  if (powerType === 'zero_power') {
                    handleFinalizeSelection('later');
                  } else {
                    setStep(3);
                  }
                }}
                className="w-full py-3 bg-[#001738] hover:bg-black text-white font-bold text-xs rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                Choose This Package (₹{viewDetailsPackage.price})
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SUB-MODAL: Manual Prescription Entry Grid                          */}
        {/* =================================================================== */}
        {isManualPowerOpen && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Enter Eyewear Prescription
                </h3>
                <button
                  onClick={() => setIsManualPowerOpen(false)}
                  className="p-1 text-slate-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Right Eye (OD) */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Right Eye (OD)</h4>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    <div>
                      <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                        SPH
                      </label>
                      <input
                        type="text"
                        value={odSph}
                        onChange={(e) => setOdSph(e.target.value)}
                        className="w-full p-1.5 sm:p-2 rounded border border-slate-300 text-center font-bold text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                        CYL
                      </label>
                      <input
                        type="text"
                        value={odCyl}
                        onChange={(e) => setOdCyl(e.target.value)}
                        className="w-full p-1.5 sm:p-2 rounded border border-slate-300 text-center font-bold text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                        AXIS
                      </label>
                      <input
                        type="text"
                        value={odAxis}
                        onChange={(e) => setOdAxis(e.target.value)}
                        className="w-full p-1.5 sm:p-2 rounded border border-slate-300 text-center font-bold text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                        ADD
                      </label>
                      <input
                        type="text"
                        value={odAdd}
                        onChange={(e) => setOdAdd(e.target.value)}
                        className="w-full p-1.5 sm:p-2 rounded border border-slate-300 text-center font-bold text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Left Eye (OS) */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Left Eye (OS)</h4>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    <div>
                      <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                        SPH
                      </label>
                      <input
                        type="text"
                        value={osSph}
                        onChange={(e) => setOsSph(e.target.value)}
                        className="w-full p-1.5 sm:p-2 rounded border border-slate-300 text-center font-bold text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                        CYL
                      </label>
                      <input
                        type="text"
                        value={osCyl}
                        onChange={(e) => setOsCyl(e.target.value)}
                        className="w-full p-1.5 sm:p-2 rounded border border-slate-300 text-center font-bold text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                        AXIS
                      </label>
                      <input
                        type="text"
                        value={osAxis}
                        onChange={(e) => setOsAxis(e.target.value)}
                        className="w-full p-1.5 sm:p-2 rounded border border-slate-300 text-center font-bold text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                        ADD
                      </label>
                      <input
                        type="text"
                        value={osAdd}
                        onChange={(e) => setOsAdd(e.target.value)}
                        className="w-full p-1.5 sm:p-2 rounded border border-slate-300 text-center font-bold text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Pupillary Distance */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Pupillary Distance (PD in mm):
                  </label>
                  <input
                    type="text"
                    value={pd}
                    onChange={(e) => setPd(e.target.value)}
                    placeholder="e.g. 63"
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-xs"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setIsManualPowerOpen(false);
                  handleFinalizeSelection('manual', { odSph, osSph, odCyl, osCyl });
                }}
                className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                Save Prescription & Add to Cart
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SUB-MODAL: Upload Prescription File                                */}
        {/* =================================================================== */}
        {isUploadRxOpen && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Upload Eye Prescription
                </h3>
                <button
                  onClick={() => setIsUploadRxOpen(false)}
                  className="p-1 text-slate-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition">
                  <Upload className="w-8 h-8 text-slate-400" />
                  <span className="font-semibold text-slate-700">
                    Click to browse prescription (JPG, PNG, PDF)
                  </span>
                  <span className="text-[10px] text-slate-400">Max size: 10MB</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>

                {uploadedFileName && (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-emerald-800 font-semibold">
                    <span className="truncate">{uploadedFileName}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setIsUploadRxOpen(false);
                  handleFinalizeSelection('upload');
                }}
                disabled={!uploadedFileName}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                  uploadedFileName
                    ? 'bg-black hover:bg-neutral-800 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Attach & Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
