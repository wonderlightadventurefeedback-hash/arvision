import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeft,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Gift,
} from 'lucide-react';
import { VALID_GIFT_CARDS } from '../../data/mockData';

export const ClaimGiftCardModal: React.FC = () => {
  const {
    activeAccountModal,
    setActiveAccountModal,
    claimGiftCard,
    userProfile,
  } = useStore();

  const [giftCardCode, setGiftCardCode] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    amount: number;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  if (activeAccountModal !== 'claim-gift-card') return null;

  const handleClose = () => {
    setActiveAccountModal(null);
    setGiftCardCode('');
    setPin('');
    setErrorMsg(null);
    setSuccessResult(null);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept alphanumeric / digits, max 16 chars
    const raw = e.target.value.replace(/[^0-9a-zA-Z]/g, '').slice(0, 16);
    setGiftCardCode(raw);
    setErrorMsg(null);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Digits only, max 4 chars
    const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(raw);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (giftCardCode.length < 16) {
      setErrorMsg('Gift card code must be exactly 16 digits.');
      return;
    }
    if (pin.length < 4) {
      setErrorMsg('PIN must be 4 digits.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = claimGiftCard(giftCardCode, pin);
      setIsSubmitting(false);

      if (result.success && result.amount) {
        setSuccessResult({
          amount: result.amount,
          message: result.message,
        });
        setGiftCardCode('');
        setPin('');
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  const handleAutofillDemo = (card: (typeof VALID_GIFT_CARDS)[0]) => {
    setGiftCardCode(card.code);
    setPin(card.pin);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 font-sans"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header matching Image 2 */}
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
              Claim Gift Card
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {successResult ? (
            /* Success State */
            <div className="py-8 px-4 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  Balance Credited
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  +₹{successResult.amount.toLocaleString()} Added!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  {successResult.message}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Current Store Credit</span>
                  <span className="font-bold text-slate-900">
                    ₹{userProfile.storeCredit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Issued By</span>
                  <span className="text-slate-700 font-medium">Razorpay Optical Wallet</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSuccessResult(null);
                    setActiveAccountModal('store-credit');
                  }}
                  className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-md"
                >
                  View My Store Credit
                </button>
                <button
                  onClick={() => setSuccessResult(null)}
                  className="w-full py-2.5 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  Claim Another Card
                </button>
              </div>
            </div>
          ) : (
            /* Form matching Image 2 */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Instructions */}
              <div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Enter the 16 digit Gift card code and 4 digit PIN to claim gift card
                </p>
              </div>

              {/* Form Input 1: Gift Card Code */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="text"
                    value={giftCardCode}
                    onChange={handleCodeChange}
                    placeholder="Gift Card Code"
                    maxLength={16}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm font-medium tracking-wider transition bg-white"
                  />
                  <span className="absolute right-3.5 bottom-2.5 text-[10px] font-semibold text-slate-400">
                    {giftCardCode.length}/16
                  </span>
                </div>
              </div>

              {/* Form Input 2: PIN */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="password"
                    value={pin}
                    onChange={handlePinChange}
                    placeholder="PIN"
                    maxLength={4}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm font-medium tracking-widest transition bg-white"
                  />
                  <span className="absolute right-3.5 bottom-2.5 text-[10px] font-semibold text-slate-400">
                    {pin.length}/4
                  </span>
                </div>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Quick Demo Autofill Helper */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Quick Test Gift Cards
                  </span>
                  <span className="text-[10px] text-indigo-600">Click to autofill</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {VALID_GIFT_CARDS.map((card) => (
                    <button
                      key={card.code}
                      type="button"
                      onClick={() => handleAutofillDemo(card)}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-indigo-200 hover:border-indigo-500 text-left text-[11px] text-slate-800 transition cursor-pointer flex items-center justify-between shadow-xs"
                    >
                      <span className="font-semibold truncate">{card.title}</span>
                      <span className="font-bold text-emerald-600 ml-1">₹{card.amount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION: How it Works matching Image 2 */}
              <div className="space-y-3 pt-2">
                <div className="text-center">
                  <h4 className="text-sm font-bold text-slate-950">
                    How it Works
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Gift Card Purchase & Redeem
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* Step 1: Enter Gift Card Code */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-slate-900 text-xs sm:text-[13px]">
                        Enter Gift Card Code
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Enter the 16 digit gift card code from the gift card you received
                      </p>
                    </div>
                    <div className="w-16 h-14 shrink-0 rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src="/images/user/giftbox_icon.jpg"
                        alt="Gift Card Box"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Step 2: Enter the PIN */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-slate-900 text-xs sm:text-[13px]">
                        Enter the PIN
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Enter the 4 digit security pin on the same gift card
                      </p>
                    </div>
                    <div className="w-16 h-14 shrink-0 rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src="/images/user/lock_icon.jpg"
                        alt="Security Lock"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Step 3: Valid online & at stores */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-slate-900 text-xs sm:text-[13px]">
                        Valid online & at stores
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Enjoy shopping at AR-Vision Eyecare app and offline stores
                      </p>
                    </div>
                    <div className="w-16 h-14 shrink-0 rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src="/images/user/pouch_icon.jpg"
                        alt="Shopping Pouch"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Fine Print Note */}
                <p className="text-[10px] text-slate-500 text-center pt-2 leading-relaxed">
                  All gift cards are issued by Razorpay and have an expiry of 1 year.{' '}
                  <button
                    type="button"
                    onClick={() => setIsTermsOpen(true)}
                    className="font-bold text-slate-800 underline hover:text-slate-950 cursor-pointer"
                  >
                    Read T&Cs
                  </button>
                </p>
              </div>

              {/* Action Button matching Image 2 */}
              <div className="pt-2 sticky bottom-0 bg-white pb-1">
                <button
                  type="submit"
                  disabled={isSubmitting || giftCardCode.length !== 16 || pin.length !== 4}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide transition cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                    giftCardCode.length === 16 && pin.length === 4
                      ? 'bg-black text-white hover:bg-slate-900 active:scale-[0.99]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Claim Gift Card</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">
              Gift Card Terms & Conditions
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Gift cards are redeemable for optical frames, lenses, and sunglasses.</li>
              <li>Valid for 365 days from the date of issuance.</li>
              <li>Can be combined with ongoing promotional discount codes.</li>
              <li>Unused balance remains in your Store Credit wallet for future purchases.</li>
            </ul>
            <button
              onClick={() => setIsTermsOpen(false)}
              className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs mt-3 cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

