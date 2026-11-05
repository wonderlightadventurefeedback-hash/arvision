import React, { useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  User,
  ChevronRight,
  LogOut,
  ShoppingBag,
  FileText,
  CreditCard,
  Gift,
  MapPin,
  Camera,
  Bell,
  CheckCircle2,
} from 'lucide-react';

interface AccountDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const AccountDropdownMenu: React.FC<AccountDropdownMenuProps> = ({
  isOpen,
  onClose,
  triggerRef,
}) => {
  const {
    userProfile,
    isLoggedIn,
    logout,
    setIsAuthModalOpen,
    setActiveAccountModal,
    setIsPrescriptionVaultOpen,
    setIsOrderTrackingOpen,
    setActiveView,
  } = useStore();

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close when clicked outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef?.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const handleItemClick = (
    action:
      | 'orders'
      | 'prescription'
      | 'store-credit'
      | 'claim-gift-card'
      | 'account-information'
      | 'addresses'
      | '3d-models'
      | 'notifications'
  ) => {
    onClose();
    if (action === 'prescription') {
      setIsPrescriptionVaultOpen(true);
    } else if (action === 'orders') {
      setActiveAccountModal('orders');
    } else {
      setActiveAccountModal(action);
    }
  };

  const handleLogoutClick = () => {
    logout();
    onClose();
    setIsAuthModalOpen(true);
  };

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden font-sans select-none"
      style={{
        boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.15), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Top Header Row with User Avatar / Icon and Name */}
      <div
        onClick={() => handleItemClick('account-information')}
        className="px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition border-b border-slate-100"
      >
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
          {userProfile?.avatar ? (
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to User icon if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <User className="w-4 h-4 text-slate-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm truncate leading-snug">
            {userProfile?.name || 'Hitakankshi Behera'}
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            {userProfile?.phone ? `+91 ${userProfile.phone}` : 'View Profile'}
          </p>
        </div>
      </div>

      {/* Menu Options matching Image 1 */}
      <div className="py-1">
        {/* 1. My Orders */}
        <button
          onClick={() => handleItemClick('orders')}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-[13px] text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition cursor-pointer group"
        >
          <span className="group-hover:translate-x-0.5 transition-transform">My Orders</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
        </button>

        {/* 2. My Prescription */}
        <button
          onClick={() => handleItemClick('prescription')}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-[13px] text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition cursor-pointer group"
        >
          <span className="group-hover:translate-x-0.5 transition-transform">My Prescription</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
        </button>

        {/* 3. My Store Credit */}
        <button
          onClick={() => handleItemClick('store-credit')}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-[13px] text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition cursor-pointer group"
        >
          <div className="flex items-center gap-2 group-hover:translate-x-0.5 transition-transform">
            <span>My Store Credit</span>
            {userProfile?.storeCredit > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                ₹{userProfile.storeCredit.toLocaleString()}
              </span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
        </button>

        {/* 4. Claim Gift Card */}
        <button
          onClick={() => handleItemClick('claim-gift-card')}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-[13px] text-slate-700 hover:text-slate-950 hover:bg-purple-50/50 transition cursor-pointer group"
        >
          <div className="flex items-center gap-2 group-hover:translate-x-0.5 transition-transform">
            <span>Claim Gift Card</span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700">
              NEW
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
        </button>

        {/* 5. Account Information */}
        <button
          onClick={() => handleItemClick('account-information')}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-[13px] text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition cursor-pointer group"
        >
          <span className="group-hover:translate-x-0.5 transition-transform">Account Information</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
        </button>

        {/* 6. Address Book */}
        <button
          onClick={() => handleItemClick('addresses')}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-[13px] text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition cursor-pointer group"
        >
          <span className="group-hover:translate-x-0.5 transition-transform">Address Book</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
        </button>

        {/* 7. My saved 3D models */}
        <button
          onClick={() => handleItemClick('3d-models')}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-[13px] text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition cursor-pointer group"
        >
          <div className="flex items-center gap-2 group-hover:translate-x-0.5 transition-transform">
            <span>My saved 3D models</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800">
              COMING SOON
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition" />
        </button>

        {/* 8. Manage Notifications */}
        <button
          onClick={() => handleItemClick('notifications')}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-[13px] text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition cursor-pointer group"
        >
          <span className="group-hover:translate-x-0.5 transition-transform">Manage Notifications</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
        </button>
      </div>

      {/* Logout Row matching Image 1 */}
      <div className="pt-1 pb-1 border-t border-slate-100">
        <button
          onClick={handleLogoutClick}
          className="w-full px-4 py-2 text-left text-[13px] text-[#f87171] hover:text-rose-600 hover:bg-rose-50/50 transition cursor-pointer font-medium flex items-center gap-2"
        >
          <span>Logout</span>
        </button>

        <button
          onClick={() => {
            onClose();
            setActiveView('admin-portal');
          }}
          className="w-full px-4 py-1.5 text-left text-[11px] text-slate-400 hover:text-indigo-600 transition cursor-pointer flex items-center justify-between"
        >
          <span>Admin Portal</span>
          <span className="text-[10px] font-bold">⚙</span>
        </button>
      </div>
    </div>
  );
};
