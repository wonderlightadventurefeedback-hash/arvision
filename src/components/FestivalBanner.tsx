import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Flame, Clock, Tag, CheckCircle2, ArrowRight } from 'lucide-react';

export const FestivalBanner: React.FC = () => {
  const { activeCampaign, setActiveCategory } = useStore();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 45, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!activeCampaign || !activeCampaign.isActive) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCampaign.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white relative overflow-hidden festive-glow">
      {/* Decorative festive sparkles background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
          {/* Festival Headline & Details */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-200 border border-white/30 shrink-0">
              <Flame className="w-7 h-7 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="bg-white text-orange-950 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
                  {activeCampaign.badgeText}
                </span>
                <span className="text-amber-200 text-xs font-semibold">
                  {activeCampaign.name}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-heading">
                {activeCampaign.title}
              </h3>
              <p className="text-xs text-orange-100 hidden sm:block">
                {activeCampaign.subtitle}
              </p>
            </div>
          </div>

          {/* Countdown & Coupon CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Live Countdown Clock */}
            <div className="flex items-center gap-1.5 text-xs font-mono bg-black/25 px-3 py-1.5 rounded-xl border border-white/15">
              <Clock className="w-3.5 h-3.5 text-amber-300 mr-1" />
              <div className="text-center">
                <span className="font-bold text-amber-200">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[10px] text-orange-200 ml-0.5">d</span>
              </div>
              <span>:</span>
              <div className="text-center">
                <span className="font-bold text-amber-200">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[10px] text-orange-200 ml-0.5">h</span>
              </div>
              <span>:</span>
              <div className="text-center">
                <span className="font-bold text-amber-200">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[10px] text-orange-200 ml-0.5">m</span>
              </div>
              <span>:</span>
              <div className="text-center">
                <span className="font-bold text-amber-200">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[10px] text-orange-200 ml-0.5">s</span>
              </div>
            </div>

            {/* Coupon Code Pill */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-orange-950 hover:bg-orange-50 font-mono font-bold text-xs shadow-md transition"
              title="Click to copy coupon code"
            >
              <Tag className="w-3.5 h-3.5 text-orange-600" />
              <span>{activeCampaign.couponCode}</span>
              {copied ? (
                <span className="text-emerald-700 flex items-center gap-1 font-sans text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                </span>
              ) : (
                <span className="text-slate-500 font-sans text-[10px]">(Tap to Copy)</span>
              )}
            </button>

            {/* Shop Festive Sale Button */}
            <button
              onClick={() => setActiveCategory('BOGO')}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-slate-950 hover:bg-black text-amber-300 font-bold text-xs transition"
            >
              <span>Shop Sale</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
