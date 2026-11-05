import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  CheckCircle2,
} from 'lucide-react';

export const ManageNotificationsModal: React.FC = () => {
  const {
    activeAccountModal,
    setActiveAccountModal,
    userProfile,
    updateUserProfile,
  } = useStore();

  const [whatsappEnabled, setWhatsappEnabled] = useState(
    userProfile?.notificationPreferences?.whatsappOrderUpdates ?? true
  );
  const [smsEnabled, setSmsEnabled] = useState(
    userProfile?.notificationPreferences?.smsAlerts ?? true
  );
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(
    userProfile?.notificationPreferences?.emailNewsletters ?? true
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (activeAccountModal !== 'notifications') return null;

  const handleClose = () => {
    setActiveAccountModal(null);
  };

  const handleSave = () => {
    updateUserProfile({
      notificationPreferences: {
        whatsappOrderUpdates: whatsappEnabled,
        whatsappPromotions: whatsappEnabled,
        smsAlerts: smsEnabled,
        emailNewsletters: emailEnabled,
      },
    });
    setToastMessage('Notification preferences saved successfully!');
    setTimeout(() => {
      setToastMessage(null);
      handleClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 font-sans"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header matching Image 3 */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Manage Notifications
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {toastMessage && (
          <div className="mx-6 mb-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 4 Notification Rows matching Image 3 */}
        <div className="px-6 py-2 divide-y divide-slate-100">
          {/* Row 1: Whatsapp Notification */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <img
                  src="/images/notifications/whatsapp.png"
                  alt="WhatsApp"
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    // Fallback SVG if image not found
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-sm font-medium text-slate-800">
                Whatsapp Notification
              </span>
            </div>

            {/* Custom Green iOS/AR-Vision Eyecare Style Toggle */}
            <button
              type="button"
              onClick={() => setWhatsappEnabled(!whatsappEnabled)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer p-0.5 relative shrink-0 ${
                whatsappEnabled ? 'bg-[#34C759]' : 'bg-slate-300'
              }`}
              aria-label="Toggle WhatsApp"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  whatsappEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Row 2: SMS Notification */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <img
                  src="/images/notifications/sms.png"
                  alt="SMS"
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-sm font-medium text-slate-800">
                SMS Notification
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSmsEnabled(!smsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer p-0.5 relative shrink-0 ${
                smsEnabled ? 'bg-[#34C759]' : 'bg-slate-300'
              }`}
              aria-label="Toggle SMS"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  smsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Row 3: Push Notification */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <img
                  src="/images/notifications/push.png"
                  alt="Push Notification"
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-sm font-medium text-slate-800">
                Push Notification
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer p-0.5 relative shrink-0 ${
                pushEnabled ? 'bg-[#34C759]' : 'bg-slate-300'
              }`}
              aria-label="Toggle Push Notification"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  pushEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Row 4: Email Notification */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <img
                  src="/images/notifications/email.png"
                  alt="Email Notification"
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-sm font-medium text-slate-800">
                Email Notification
              </span>
            </div>

            <button
              type="button"
              onClick={() => setEmailEnabled(!emailEnabled)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer p-0.5 relative shrink-0 ${
                emailEnabled ? 'bg-[#34C759]' : 'bg-slate-300'
              }`}
              aria-label="Toggle Email Notification"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  emailEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom Right Save Button matching Image 3 */}
        <div className="px-6 py-5 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-8 py-2.5 rounded-lg bg-black hover:bg-slate-800 text-white font-bold text-sm transition cursor-pointer shadow-md active:scale-[0.98]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
