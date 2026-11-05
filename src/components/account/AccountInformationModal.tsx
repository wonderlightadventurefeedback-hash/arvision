import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeft,
  X,
  Camera,
  CheckCircle2,
  Calendar,
  ChevronDown,
  Check,
  AlertCircle,
} from 'lucide-react';

export const AccountInformationModal: React.FC = () => {
  const {
    activeAccountModal,
    setActiveAccountModal,
    userProfile,
    updateUserProfile,
  } = useStore();

  const [name, setName] = useState(userProfile?.name || 'Hitakankshi Behera');
  const [phone, setPhone] = useState(userProfile?.phone || '7735909354');
  const [email, setEmail] = useState(userProfile?.email || 'hitakankshib@gmail.com');
  const [birthday, setBirthday] = useState(userProfile?.birthday || '11/03/2007');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(userProfile?.gender || 'Male');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar || '/images/user/avatar.jpg');
  const [isEmailVerified, setIsEmailVerified] = useState(userProfile?.isEmailVerified || false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (activeAccountModal !== 'account-information') return null;

  const handleClose = () => {
    setActiveAccountModal(null);
    setSavedNotification(false);
    setShowOtpInput(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyEmail = () => {
    setIsVerifyingEmail(true);
    setTimeout(() => {
      setIsVerifyingEmail(false);
      setShowOtpInput(true);
    }, 400);
  };

  const handleConfirmEmailOtp = () => {
    if (emailOtp.trim().length >= 4) {
      setIsEmailVerified(true);
      setShowOtpInput(false);
      updateUserProfile({ isEmailVerified: true });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      email,
      birthday,
      gender,
      avatar: avatarUrl,
      isEmailVerified,
    });
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 font-sans"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 transition text-slate-800 cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Account Information
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body matching Image 3 */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {savedNotification && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile updated successfully! Changes saved across your account.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Centered Circular Avatar with Camera Edit Pill */}
            <div className="flex flex-col items-center justify-center pt-2 pb-1">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center">
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                </div>
              </div>

              {/* Edit Pill Button matching Image 3 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2.5 px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-400 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer hover:bg-slate-50"
              >
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit</span>
              </button>
            </div>

            {/* Field 1: Name * matching Image 3 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
              />
            </div>

            {/* Field 2: Phone with India Flag and Green Verified Badge matching Image 3 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center gap-1.5 text-sm select-none">
                  <span className="text-base" role="img" aria-label="India Flag">
                    🇮🇳
                  </span>
                  <span className="text-slate-400 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="w-full pl-20 pr-11 py-3.5 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
                />
                <div className="absolute right-3.5 flex items-center">
                  <span
                    className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs"
                    title="Verified Phone Number"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                </div>
              </div>
            </div>

            {/* Field 3: Email with Verify Action matching Image 3 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsEmailVerified(false);
                  }}
                  placeholder="your.email@example.com"
                  className="w-full px-4 pr-20 py-3.5 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
                />
                <div className="absolute right-3 flex items-center">
                  {isEmailVerified ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={isVerifyingEmail}
                      className="px-2.5 py-1 text-xs font-bold text-[#007060] hover:text-[#005040] hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                    >
                      {isVerifyingEmail ? 'Sending...' : 'Verify'}
                    </button>
                  )}
                </div>
              </div>

              {/* Quick OTP Verification Box for Email */}
              {showOtpInput && !isEmailVerified && (
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 animate-in fade-in">
                  <p className="text-[11px] text-emerald-900 font-medium">
                    Demo OTP sent to {email}. Enter <strong>1234</strong> to verify:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="1234"
                      className="w-24 px-3 py-1.5 rounded-xl border border-emerald-300 text-center text-xs font-bold bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmEmailOtp}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer"
                    >
                      Confirm OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOtpInput(false)}
                      className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Field 4: Birthday with Calendar Icon matching Image 3 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Birthday
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-4 pr-11 py-3.5 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
                />
                <div className="absolute right-3.5 text-slate-400 pointer-events-none">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Field 5: Gender with Chevron Down matching Image 3 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Gender
              </label>
              <div className="relative flex items-center">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-4 pr-11 py-3.5 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white appearance-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-3.5 text-slate-400 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Bottom Button matching Image 3 */}
            <div className="pt-4 sticky bottom-0 bg-white pb-1">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#E2E4E9] hover:bg-slate-900 text-slate-700 hover:text-white font-bold text-sm tracking-wide transition cursor-pointer shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Update Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

