import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeft,
  X,
  CreditCard,
  Plus,
  Gift,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const MyStoreCreditModal: React.FC = () => {
  const { activeAccountModal, setActiveAccountModal, userProfile } = useStore();

  if (activeAccountModal !== 'store-credit') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 font-sans"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveAccountModal(null)}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 transition text-slate-800 cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              My Store Credit
            </h2>
          </div>
          <button
            onClick={() => setActiveAccountModal(null)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          {/* Balance Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-purple-500/20 blur-2xl" />
            <div className="relative z-10 space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-purple-300 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Available Wallet Balance
              </span>
              <div className="text-3xl font-black font-heading text-white">
                ₹{userProfile.storeCredit.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                Usable across all eyeglasses, sunglasses, contact lenses, and home eye tests.
              </p>
            </div>
          </div>

          {/* Quick CTA to Claim Gift Card */}
          <button
            onClick={() => setActiveAccountModal('claim-gift-card')}
            className="w-full p-4 rounded-2xl bg-indigo-50 border border-indigo-200 hover:border-indigo-400 transition cursor-pointer flex items-center justify-between text-indigo-950 group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  Have a Gift Card?
                </h4>
                <p className="text-[11px] text-slate-500">
                  Claim your 16-digit card and 4-digit PIN
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs">
              Claim Now →
            </span>
          </button>

          {/* Claimed Gift Cards History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Transaction History
              </h4>
              <span className="text-[11px] text-slate-400">
                {userProfile.giftCardsClaimed.length} entries
              </span>
            </div>

            <div className="space-y-2">
              {userProfile.giftCardsClaimed.map((gc) => (
                <div
                  key={gc.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        •••• •••• •••• {gc.code.slice(-4)}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        CLAIMED
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{gc.claimedAt}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-600">
                      +₹{gc.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

