import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { FindYourShapeSection } from './FindYourShapeSection';
import {
  Glasses,
  Camera,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Flame,
  CheckCircle2,
  Calendar,
  Gift,
  Eye,
  Tv,
  Sun,
  Smile,
  BookOpen,
  Filter,
  Store,
  MapPin,
  Clock,
  Phone,
  Maximize2,
  X,
} from 'lucide-react';
import { MOCK_REVIEWS } from '../data/mockData';

export const HomepagePromotions: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    setIsBookAppointmentOpen,
    setIsStoreLocatorOpen,
    openPDP,
    products,
  } = useStore();

  const [enlargedImage, setEnlargedImage] = useState<{ src: string; title: string; subtitle: string } | null>(null);

  return (
    <div className="space-y-16 py-4">
      {/* 1. Shapes Trending Now / Find Your Shape (Eyeglasses & Sunglasses) */}
      <FindYourShapeSection />

      {/* 2. Buy 1 Get 1 Free Spotlight Mid-Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-10 text-white overflow-hidden shadow-xl">
          {/* Subtle background graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-center">
            <Gift className="w-96 h-96" />
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-950 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              DOUBLE THE CLARITY • BUY 1 GET 1 FREE
            </span>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-heading leading-tight">
              Buy 1 Eyeglass, Get 2nd Pair Absolutely Free!
            </h3>

            <p className="text-orange-50 text-xs sm:text-sm leading-relaxed">
              Mix and match any frames across sunglasses, titanium eyeglasses, and computer glasses. Get free anti-glare lenses on both pairs. Use code <strong>BOGOVISION</strong> during checkout.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveCategory('BOGO')}
                className="py-3 px-6 rounded-xl bg-slate-950 hover:bg-black text-amber-300 font-extrabold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <span>Shop BOGO Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsBookAppointmentOpen(true)}
                className="py-3 px-5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition cursor-pointer"
              >
                Book Free Eye Exam
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Real Optical Store & In-House Doctor Chamber Experience Showcase */}
      <section className="max-w-7xl mx-auto px-4" id="experience-stores">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
              <Store className="w-3.5 h-3.5 text-indigo-600" />
              <span>WALK-IN FLAGSHIP STUDIOS • OPEN 7 DAYS</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Step Inside Our Real Optical Stores & Doctor Chambers
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Experience touch-and-feel frame trials across 500+ designer styles with computerized 12-step eye testing by certified optometrists.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsBookAppointmentOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Book In-Store Eye Test</span>
            </button>
            <button
              onClick={() => setIsStoreLocatorOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-indigo-400 hover:bg-white text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Find Nearest Studio</span>
            </button>
          </div>
        </div>

        {/* Dual Interactive Store Showcases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Store Photo 1: SpecsMaker LED Display & Doctor Chamber */}
          <div className="group rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-indigo-400 hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div
              className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() =>
                setEnlargedImage({
                  src: '/images/store/store-clinic-chambers.jpg',
                  title: 'SpecsMaker LED Display Pavilion & In-House Doctor Chamber',
                  subtitle: 'Dual-temperature illuminated eyewear towers and computerized autorefractor eye testing clinic.',
                })
              }
            >
              <img
                src="/images/store/store-clinic-chambers.jpg"
                alt="SpecsMaker Optical Display and Doctor Chamber"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-indigo-600/90 text-white text-[10px] font-extrabold backdrop-blur-md shadow-sm flex items-center gap-1">
                  <Eye className="w-3 h-3 text-cyan-300" />
                  DOCTOR CHAMBER
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-300 text-[10px] font-extrabold backdrop-blur-md shadow-sm">
                  SPECSMAKER LED DISPLAY
                </span>
              </div>

              {/* Expand click prompt */}
              <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
                <Maximize2 className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">
                  Diagnostic Center & Eyewear Pavilion
                </span>
                <h4 className="text-lg font-bold font-heading">
                  SpecsMaker LED Display & In-House Doctor Chamber
                </h4>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed">
                Step into our fully equipped diagnostic suite featuring computerized autorefractor vision testing machines, trial lens kits, and custom contact lens fitting. Dual illuminated blue and amber showcases house our bestselling sunglass and optical collections.
              </p>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Computerized Autorefractor</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Precise 0.01D measurement in under 60 seconds
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>LED Display Towers</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Cool blue & warm amber lighted frame racks
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  10:00 AM – 09:30 PM (Daily)
                </span>
                <button
                  onClick={() => setIsBookAppointmentOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Book Free Eye Exam</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Store Photo 2: Eyewear Wall Gallery & Live Fitting Mirrors */}
          <div className="group rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-indigo-400 hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div
              className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() =>
                setEnlargedImage({
                  src: '/images/store/store-eyewear-gallery.jpg',
                  title: 'Curated Eyewear Gallery & Live Mirror Fitting Studio',
                  subtitle: 'Multi-column illuminated wall displays with personal styling mirrors and brand collections.',
                })
              }
            >
              <img
                src="/images/store/store-eyewear-gallery.jpg"
                alt="Eyewear Frame Wall Display and Styling Mirror"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-extrabold backdrop-blur-md shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-200" />
                  500+ FRAMES LIVE
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-cyan-300 text-[10px] font-extrabold backdrop-blur-md shadow-sm">
                  STYLING MIRROR WALL
                </span>
              </div>

              {/* Expand click prompt */}
              <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
                <Maximize2 className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">
                  Touch & Feel Experience Gallery
                </span>
                <h4 className="text-lg font-bold font-heading">
                  Curated Eyewear Gallery & Live Fitting Studio
                </h4>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore hundreds of titanium, acetate, and flexible TR90 frames organized by size and style on precision wall racks. Test lightweight nose-bridge comfort in our full-length illuminated mirrors with personalized styling guidance.
              </p>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hands-On Trial</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Compare weights, nose fit, and temple curvature
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant Frame Adjustments</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Custom nose-pad alignment and ultrasonic cleaning
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  1-Year Comprehensive Coating Guarantee
                </span>
                <button
                  onClick={() => setIsStoreLocatorOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Studios</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 In-Store Guarantees Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs">Free Doctor Exam</h5>
              <p className="text-[10px] text-slate-400">12-Step clinical checkup</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Glasses className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs">500+ Live Frames</h5>
              <p className="text-[10px] text-slate-400">Titanium, TR90 & Acetate</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs">1-Hour Glazing</h5>
              <p className="text-[10px] text-slate-400">Same-day lens delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-300 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs">Lifetime Fitting</h5>
              <p className="text-[10px] text-slate-400">Free adjustments & care</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. German CNC Optical Precision & Glazing Lab Showcase */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 text-white grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Certified Optical Precision Lab
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-heading leading-tight">
              German CNC Robotic Glazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                0.01 Diopter Precision Tolerances
              </span>
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Every prescription lens is precision-edged using state-of-the-art five-axis computerized edgers. Audited with laser lensometers to guarantee zero optical distortion and perfect pupillary distance alignment.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <strong className="text-cyan-300 block mb-0.5">Laser PD Centration</strong>
                <span className="text-slate-400 text-[11px]">Calibrated to exact optical center of your eyes</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <strong className="text-cyan-300 block mb-0.5">Doctor Verified</strong>
                <span className="text-slate-400 text-[11px]">Senior optometrist verification on every order</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveCategory('Computer Glasses')}
                className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center gap-2 cursor-pointer"
              >
                <Glasses className="w-4 h-4" />
                <span>Explore Computer Lenses</span>
              </button>
              <button
                onClick={() => setIsBookAppointmentOpen(true)}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer"
              >
                Book Free In-Store Exam
              </button>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center group">
            <img
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
              alt="Optical Precision Glazing Lab"
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ISO 9001 Certified Optical Glazing
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">100% Quality Checked</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Verified Customer Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Real Optical Experiences
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
            Trusted by 50,000+ Eyewear Wearers
          </h3>
          <p className="text-xs text-slate-500">
            Read verified reviews from customers across Mumbai, Delhi, Bengaluru, and Hyderabad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between space-y-4 text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Verified Buyer
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">
                  "{rev.headline}"
                </h4>

                <p className="text-slate-600 leading-relaxed text-xs">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <strong className="text-slate-800 font-semibold">{rev.customerName}</strong>
                <span>Fit: <strong className="text-indigo-600">{rev.fitRating}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. In-Store Certified 12-Step Eye Test CTA Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-indigo-900 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 text-center lg:text-left z-10 flex-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-[10px] uppercase">
              100% FREE CLINICAL EXAM • VISIT DOCTOR CHAMBER
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
              Book a Certified 12-Step Vision Checkup at Our Metro Studios
            </h3>
            <p className="text-indigo-200 text-xs max-w-xl">
              Equipped with autorefractors, slit lamps, and digital pupil analyzers in our dedicated Doctor Chamber. Zero purchase obligation.
            </p>
          </div>

          <div className="flex items-center gap-4 z-10">
            <div
              onClick={() =>
                setEnlargedImage({
                  src: '/images/store/store-clinic-chambers.jpg',
                  title: 'In-House Doctor Chamber Diagnostics',
                  subtitle: 'Computerized Autorefractor and Clinical Slit Lamp Optometry Clinic.',
                })
              }
              className="hidden sm:flex items-center gap-2.5 p-2 pr-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition cursor-pointer"
            >
              <img
                src="/images/store/store-clinic-chambers.jpg"
                alt="Doctor Chamber Eye Test Machine"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="text-left text-xs">
                <span className="font-bold text-white block">Doctor Chamber</span>
                <span className="text-[10px] text-cyan-300">Tap to view 🔍</span>
              </div>
            </div>

            <button
              onClick={() => setIsBookAppointmentOpen(true)}
              className="py-3 px-6 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Calendar className="w-4 h-4 text-indigo-700" />
              <span>Book In-Store Eye Test</span>
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox for Store Images */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setEnlargedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={enlargedImage.src}
                alt={enlargedImage.title}
                className="w-full h-full object-contain max-h-[75vh]"
              />
            </div>
            <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base text-white">{enlargedImage.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{enlargedImage.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEnlargedImage(null);
                    setIsBookAppointmentOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Book In-Store Eye Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
