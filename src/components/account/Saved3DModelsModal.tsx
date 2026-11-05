import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeft,
  X,
  Sparkles,
  Camera,
  Layers,
  Bell,
  CheckCircle2,
  Scan,
  Zap,
  Glasses,
  Eye,
} from 'lucide-react';

export const Saved3DModelsModal: React.FC = () => {
  const {
    activeAccountModal,
    setActiveAccountModal,
    setIsTryOnModalOpen,
  } = useStore();

  const [isNotified, setIsNotified] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  if (activeAccountModal !== '3d-models') return null;

  const handleClose = () => {
    setActiveAccountModal(null);
  };

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNotified(true);
    setShowNotificationToast(true);
    setTimeout(() => {
      setShowNotificationToast(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300 font-sans">
      <style>{`
        @keyframes scan-sweep {
          0% { top: 5%; opacity: 0.3; }
          50% { opacity: 1; }
          100% { top: 92%; opacity: 0.3; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes float-hologram {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .anim-scan-line {
          animation: scan-sweep 2.8s ease-in-out infinite alternate;
        }
        .anim-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .anim-spin-reverse {
          animation: spin-reverse-slow 15s linear infinite;
        }
        .anim-float {
          animation: float-hologram 4s ease-in-out infinite;
        }
        .anim-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className="w-full max-w-lg bg-[#070A14] text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-cyan-500/30 relative"
        style={{
          boxShadow: '0 0 50px rgba(6, 182, 212, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Futuristic Top Bar */}
        <div className="px-5 py-4 border-b border-cyan-500/20 flex items-center justify-between sticky top-0 bg-[#070A14]/90 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-white/10 transition text-slate-300 hover:text-white cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <h2 className="text-sm sm:text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent uppercase">
                My Saved 3D Models
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Animation Showcase Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6 text-center">
          {/* Notification Toast */}
          {showNotificationToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>You're on the priority beta access list! We'll notify you first.</span>
            </div>
          )}

          {/* 3D Hologram Stage Animation */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center select-none">
            {/* Ambient Glowing Aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-600/20 to-indigo-500/30 blur-3xl anim-pulse-glow" />

            {/* Rotating Outer Gyroscope Ring */}
            <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/30 anim-spin-slow pointer-events-none" />

            {/* Rotating Middle Ring with Measurement Markers */}
            <div className="absolute inset-6 rounded-full border border-purple-500/40 anim-spin-reverse pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc]" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            </div>

            {/* Inner Rotating Dashed Ring */}
            <div className="absolute inset-12 rounded-full border border-cyan-400/20 anim-spin-slow pointer-events-none" />

            {/* Floating 3D Holographic Cylinder / Grid */}
            <div className="relative z-10 anim-float flex flex-col items-center justify-center">
              {/* Central Holographic Icon: 3D Face Wireframe & Glasses */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-[#0F172A] via-[#1E1B4B] to-[#0A192F] border-2 border-cyan-400/60 shadow-[0_0_35px_rgba(34,211,238,0.45)] flex flex-col items-center justify-center relative overflow-hidden group">
                {/* Horizontal Laser Sweep Line */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] anim-scan-line z-20 pointer-events-none" />

                {/* Grid Overlay */}
                <div
                  className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:12px_12px]"
                  style={{ maskImage: 'radial-gradient(circle, white, transparent 80%)' }}
                />

                {/* 3D Eyewear Wireframe Hologram */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
                  <Glasses className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                  <div className="flex items-center gap-1 text-[9px] font-mono tracking-widest text-cyan-400/90 font-bold uppercase">
                    <Scan className="w-3 h-3 text-cyan-400" />
                    <span>PD: 63.5mm</span>
                  </div>
                </div>

                {/* Corner Target Brackets */}
                <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
              </div>

              {/* Hologram Pedestal Base */}
              <div className="w-36 h-4 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent rounded-full blur-sm mt-3" />
            </div>

            {/* Live Telemetry Floating Badges */}
            <div className="absolute top-4 left-0 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow-md backdrop-blur-md">
              BIOMETRIC MESH: 4K
            </div>
            <div className="absolute bottom-4 right-0 px-2.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-[10px] font-mono text-purple-300 shadow-md backdrop-blur-md">
              NEURAL RIG: V3.2
            </div>
          </div>

          {/* Heading & Coming Soon Tag */}
          <div className="space-y-2 pt-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Coming Soon • In Active Development</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
              Personalized 3D Avatar & Model Vault
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
              We are training cutting-edge neural radiance fields (NeRF) to let you save your 
              photorealistic 3D face scan, millimeter-accurate pupil measurements, and custom virtual try-on collections.
            </p>
          </div>

          {/* 3 Interactive Feature Preview Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left pt-2">
            <div className="p-3 rounded-2xl bg-[#0D1224] border border-cyan-500/20 hover:border-cyan-500/40 transition">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
                <Scan className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-xs text-white">0.1mm Precision</h5>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Sub-millimeter face scanning & instant bridge fit.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#0D1224] border border-purple-500/20 hover:border-purple-500/40 transition">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2">
                <Glasses className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-xs text-white">Physics Lighting</h5>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Acetate gloss & titanium reflection in 360°.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#0D1224] border border-indigo-500/20 hover:border-indigo-500/40 transition">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-xs text-white">AR Export</h5>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Apple Vision Pro & WebXR ready 3D models.
              </p>
            </div>
          </div>

          {/* Notify Me Subscription Box */}
          <div className="p-4 rounded-2xl bg-[#0B0F1F] border border-cyan-500/30 shadow-inner text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
                Get Notified on Launch Day
              </span>
              <span className="text-[10px] text-cyan-400 font-bold uppercase">
                Early Access
              </span>
            </div>

            {isNotified ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You're enrolled! We'll alert you the moment 3D Scanning is live.</span>
              </div>
            ) : (
              <form onSubmit={handleNotifyMe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email for priority beta..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#060914] border border-cyan-500/30 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer shrink-0"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                handleClose();
                setIsTryOnModalOpen(true);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs tracking-wider uppercase transition cursor-pointer shadow-[0_0_25px_rgba(168,85,247,0.35)] flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-cyan-300" />
              <span>Launch Live AR Virtual Try-On Camera</span>
            </button>

            <button
              onClick={handleClose}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              Back to Account & Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
