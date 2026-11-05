import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Phone,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { INITIAL_USER_PROFILE } from '../../data/mockData';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, signup } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'contact' | 'otp'>('contact');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setStep('contact');
    setErrorMsg(null);
    setOtp('');
  };

  const handleQuickLoginHitakankshi = () => {
    login(INITIAL_USER_PROFILE);
    handleClose();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setErrorMsg('Please enter your mobile number or email.');
      return;
    }
    setErrorMsg(null);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setErrorMsg('Please enter the 4-digit OTP.');
      return;
    }

    if (mode === 'signup') {
      signup({
        name: name || 'Valued Customer',
        phone: phoneOrEmail.includes('@') ? '9876543210' : phoneOrEmail,
        email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail}@example.com`,
      });
    } else {
      login({
        phone: phoneOrEmail.includes('@') ? '7735909354' : phoneOrEmail,
        email: phoneOrEmail.includes('@') ? phoneOrEmail : 'hitakankshib@gmail.com',
      });
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 font-sans"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
              ∞
            </span>
            <span className="font-extrabold text-slate-900 text-base">
              AR-Vision Eyecare
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1.5 mx-6 mt-4 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setStep('contact');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setStep('contact');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-5">
          {step === 'contact' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {mode === 'signin' ? 'Welcome Back!' : 'Join AR Vision'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {mode === 'signin'
                    ? 'Sign in to access your orders, 3D scans, and gift card wallet.'
                    : 'Create an account to enjoy personalized eyewear recommendations.'}
                </p>
              </div>

              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Mobile Number or Email
                </label>
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="e.g. 7735909354 or user@gmail.com"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Instant Login shortcut for Hitakankshi Behera */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Or Instant Sign In
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickLoginHitakankshi}
                  className="w-full p-2.5 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white text-slate-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <img
                    src="/images/user/avatar.jpg"
                    alt="Hitakankshi Behera"
                    className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span>Sign In as Hitakankshi Behera</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Enter 4-Digit OTP
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We sent a 4-digit verification code to{' '}
                  <span className="font-bold text-slate-800">{phoneOrEmail}</span>.
                </p>
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  maxLength={4}
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="1234"
                  className="w-full py-4 text-center text-2xl tracking-[0.5em] font-black rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 bg-slate-50"
                />
                <p className="text-[11px] text-slate-400 text-center">
                  Demo code: <strong className="text-slate-700">1234</strong>
                </p>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Verify & Sign In</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('contact')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  ← Edit Phone / Email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

