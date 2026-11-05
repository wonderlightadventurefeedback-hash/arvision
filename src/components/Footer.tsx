import React from 'react';
import { useStore } from '../context/StoreContext';
import { InfinityGlassesLogo } from './Header';
import {
  Glasses,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setActiveCategory,
    setIsStoreLocatorOpen,
    setIsBookAppointmentOpen,
    setIsOrderTrackingOpen,
    setActiveView,
    openPDP,
    products,
  } = useStore();

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 text-xs">
      {/* 4 Optical Guarantees / Trust Bar */}
      <div className="border-b border-slate-800 bg-slate-900/50 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">1-Year Warranty</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Comprehensive coverage on frame screws, hinges, and lens anti-reflective coatings.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">14-Day Free Exchange</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Zero questions asked exchange or optical power recheck if fit isn't 100% comfortable.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Certified Optometrists</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Every prescription audited with Japanese 0.01D autorefractors before custom edging.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">German CNC Glazing</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                0.01 Diopter precision tolerance. Zero distortion guarantee on all custom lenses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white px-1">
              <InfinityGlassesLogo className="h-4.5 aspect-3/1 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white font-heading">
                AR VISION EYE CARE
              </span>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Precision Optics • 3D Fit • Metro Stores
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            India's premier optical shopping ecosystem combining German precision CNC lens cutting, aerospace titanium frames, and neural webcam AR virtual try-on.
          </p>

          <div className="space-y-1.5 text-slate-300 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customer Helpline: +91 1800 209 8888 (Toll Free)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Doctor & Prescriptions: care@arvisioneyecare.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lab Hours: Mon - Sun, 09:00 AM - 10:00 PM IST</span>
            </div>
          </div>
        </div>

        {/* Optical Categories */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">
            Eyewear Collections
          </h5>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => setActiveCategory('Eyeglasses')} className="hover:text-white transition">
                Titanium Eyeglasses
              </button>
            </li>
            <li>
              <button onClick={() => setActiveCategory('Computer Glasses')} className="hover:text-white transition">
                Blue Light Screen Glasses
              </button>
            </li>
            <li>
              <button onClick={() => setActiveCategory('Sunglasses')} className="hover:text-white transition">
                Polarized Sunglasses
              </button>
            </li>
            <li>
              <button onClick={() => setActiveCategory('Kids Glasses')} className="hover:text-white transition">
                Kids Unbreakable Flex
              </button>
            </li>
            <li>
              <button onClick={() => setActiveCategory('Reading Glasses')} className="hover:text-white transition">
                Pocket Folding Readers
              </button>
            </li>
            <li>
              <button onClick={() => setActiveCategory('BOGO')} className="text-amber-400 hover:text-amber-300 font-bold transition">
                Buy 1 Get 1 Free Storewide
              </button>
            </li>
          </ul>
        </div>

        {/* Clinical Services */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">
            Clinical Services
          </h5>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => setIsBookAppointmentOpen(true)} className="hover:text-white transition">
                Book Free In-Store Eye Test
              </button>
            </li>
            <li>
              <button onClick={() => openPDP(products[0])} className="hover:text-white transition">
                Precision Optical Fit & Loupe
              </button>
            </li>
            <li>
              <button onClick={() => setIsStoreLocatorOpen(true)} className="hover:text-white transition">
                Find Nearest Store
              </button>
            </li>
            <li>
              <button onClick={() => setIsOrderTrackingOpen(true)} className="hover:text-white transition">
                Track 6-Stage Lens Preparation
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('design-board')} className="text-indigo-400 hover:text-indigo-300 font-bold transition">
                45-Screen Design Board
              </button>
            </li>
          </ul>
        </div>

        {/* Metro Hubs & Hours */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">
            Flagship Metro Studios
          </h5>
          <div className="space-y-2 text-slate-400 text-[11px]">
            <div>
              <strong className="text-slate-200 block">Mumbai</strong>
              Linking Road, Bandra West
            </div>
            <div>
              <strong className="text-slate-200 block">New Delhi</strong>
              Inner Circle, Connaught Place
            </div>
            <div>
              <strong className="text-slate-200 block">Bengaluru</strong>
              100 Feet Road, Indiranagar
            </div>
            <div>
              <strong className="text-slate-200 block">Hyderabad</strong>
              Road No. 12, Banjara Hills
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-900 py-6 px-4 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 AR VISION Eye Care Optical Ltd. All Rights Reserved. ISO 9001:2015 & CE Certified.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveView('admin-portal')} className="hover:text-slate-400 transition">
              Admin Portal
            </button>
            <span>•</span>
            <button onClick={() => setActiveView('design-board')} className="text-amber-400 font-bold hover:underline">
              45-Screen UX/UI Design Board
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
