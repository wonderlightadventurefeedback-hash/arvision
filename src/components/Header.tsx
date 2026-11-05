import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  X,
  Menu,
  ChevronDown,
  Calendar,
  Truck,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Camera,
  Glasses,
  ArrowLeft,
} from 'lucide-react';
import { ContactLensMegaMenu } from './ContactLensMegaMenu';
import { SunglassesMegaMenu } from './SunglassesMegaMenu';
import { EyeglassesMegaMenu } from './EyeglassesMegaMenu';
import { TryAtHomeMegaMenu } from './TryAtHomeMegaMenu';
import { AccountDropdownMenu } from './account/AccountDropdownMenu';

// Official Brand Glasses Logo matching user-provided logo image
export const InfinityGlassesLogo: React.FC<{ className?: string }> = ({
  className = 'h-6 sm:h-7.5 aspect-3/1',
}) => (
  <span
    className={`inline-block ${className}`}
    style={{
      maskImage: 'url(/images/brand-logo-white.png)',
      WebkitMaskImage: 'url(/images/brand-logo-white.png)',
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
      backgroundColor: 'currentColor',
    }}
    role="img"
    aria-label="AR Vision Eyewear"
  />
);

export const BrandGlassesLogo = InfinityGlassesLogo;

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    products,
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsStoreLocatorOpen,
    setIsBookAppointmentOpen,
    setIsOrderTrackingOpen,
    setIsPrescriptionVaultOpen,
    setIsTryOnModalOpen,
    isContactLensMenuOpen,
    setIsContactLensMenuOpen,
    isSunglassesMenuOpen,
    setIsSunglassesMenuOpen,
    isEyeglassesMenuOpen,
    setIsEyeglassesMenuOpen,
    isTryAtHomeMenuOpen,
    setIsTryAtHomeMenuOpen,
    userProfile,
    isLoggedIn,
    setIsAuthModalOpen,
    openPDP,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Detect window scroll to transition navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for autocomplete dropdown
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.shape.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleNavClick = (category: string) => {
    setActiveCategory(category);
    if (activeView !== 'storefront') setActiveView('storefront');
    setIsMobileMenuOpen(false);
    const catalogEl = document.getElementById('product-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    setActiveCategory('All');
    if (activeView !== 'storefront') setActiveView('storefront');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isEyeglassesPage = activeCategory === 'Eyeglasses';
  const isTransparentHeroHeader = !isScrolled && activeCategory === 'All';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isEyeglassesPage
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200 py-2.5 sm:py-3 text-slate-900'
          : isTransparentHeroHeader
          ? 'bg-gradient-to-b from-black/85 via-black/40 to-transparent py-4 sm:py-5'
          : 'bg-slate-950/95 backdrop-blur-md shadow-xl border-b border-white/10 py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo & Navigation Items */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
            {/* Infinity Eyeglasses Logo */}
            <div
              onClick={handleLogoClick}
              className={`flex items-center gap-2 cursor-pointer transition-colors group shrink-0 ${
                isEyeglassesPage
                  ? 'text-slate-900 hover:text-indigo-600'
                  : 'text-white hover:text-amber-400'
              }`}
              title="AR Vision Eyewear - Home"
            >
              <InfinityGlassesLogo className="h-6 sm:h-7.5 aspect-3/1 group-hover:scale-105 transition-transform" />
            </div>

            {/* When on Eyeglasses PLP page: do NOT show the navbar from the image, ONLY show Back to Home */}
            {isEyeglassesPage ? (
              <button
                onClick={handleLogoClick}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white text-xs sm:text-sm font-semibold transition-all duration-200 border border-slate-200 shadow-xs group cursor-pointer"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </button>
            ) : (
              /* Desktop Navigation Links (Layout matching the screenshot) */
              <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                <button
                  onMouseEnter={() => {
                    setIsEyeglassesMenuOpen(true);
                    setIsSunglassesMenuOpen(false);
                    setIsContactLensMenuOpen(false);
                    setIsTryAtHomeMenuOpen(false);
                  }}
                  onClick={() => {
                    setIsEyeglassesMenuOpen(false);
                    setIsSunglassesMenuOpen(false);
                    setIsContactLensMenuOpen(false);
                    setIsTryAtHomeMenuOpen(false);
                    setActiveCategory('Eyeglasses');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-sm lg:text-base font-normal tracking-wide transition cursor-pointer relative py-1 flex items-center gap-1 ${
                    isEyeglassesMenuOpen || activeCategory === 'Eyeglasses'
                      ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>Eyeglasses</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isEyeglassesMenuOpen ? 'rotate-180 text-amber-400' : 'text-white/60'
                    }`}
                  />
                </button>

                <button
                  onMouseEnter={() => {
                    setIsSunglassesMenuOpen(true);
                    setIsEyeglassesMenuOpen(false);
                    setIsContactLensMenuOpen(false);
                    setIsTryAtHomeMenuOpen(false);
                  }}
                  onClick={() => {
                    setIsSunglassesMenuOpen(!isSunglassesMenuOpen);
                    setIsEyeglassesMenuOpen(false);
                    setIsContactLensMenuOpen(false);
                    setIsTryAtHomeMenuOpen(false);
                  }}
                  className={`text-sm lg:text-base font-normal tracking-wide transition cursor-pointer relative py-1 flex items-center gap-1 ${
                    isSunglassesMenuOpen || activeCategory === 'Sunglasses'
                      ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>Sunglasses</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isSunglassesMenuOpen ? 'rotate-180 text-amber-400' : 'text-white/60'
                    }`}
                  />
                </button>

                <button
                  onMouseEnter={() => {
                    setIsContactLensMenuOpen(true);
                    setIsEyeglassesMenuOpen(false);
                    setIsSunglassesMenuOpen(false);
                    setIsTryAtHomeMenuOpen(false);
                  }}
                  onClick={() => {
                    setIsContactLensMenuOpen(!isContactLensMenuOpen);
                    setIsEyeglassesMenuOpen(false);
                    setIsSunglassesMenuOpen(false);
                    setIsTryAtHomeMenuOpen(false);
                  }}
                  className={`text-sm lg:text-base font-normal tracking-wide transition cursor-pointer relative py-1 flex items-center gap-1 ${
                    isContactLensMenuOpen || activeCategory === 'Contact Lenses'
                      ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>Contact Lenses</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isContactLensMenuOpen ? 'rotate-180 text-amber-400' : 'text-white/60'
                    }`}
                  />
                </button>

                <button
                  onMouseEnter={() => {
                    setIsEyeglassesMenuOpen(false);
                    setIsSunglassesMenuOpen(false);
                    setIsContactLensMenuOpen(false);
                    setIsTryAtHomeMenuOpen(false);
                  }}
                  onClick={() => setIsStoreLocatorOpen(true)}
                  className="text-sm lg:text-base font-normal tracking-wide text-white/90 hover:text-white transition cursor-pointer py-1"
                >
                  Stores
                </button>

                <button
                  onMouseEnter={() => {
                    setIsTryAtHomeMenuOpen(true);
                    setIsEyeglassesMenuOpen(false);
                    setIsSunglassesMenuOpen(false);
                    setIsContactLensMenuOpen(false);
                  }}
                  onClick={() => {
                    setIsTryAtHomeMenuOpen(!isTryAtHomeMenuOpen);
                    setIsEyeglassesMenuOpen(false);
                    setIsSunglassesMenuOpen(false);
                    setIsContactLensMenuOpen(false);
                  }}
                  className={`text-sm lg:text-base font-normal tracking-wide transition cursor-pointer relative py-1 flex items-center gap-1 ${
                    isTryAtHomeMenuOpen
                      ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>Try @ Home</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isTryAtHomeMenuOpen ? 'rotate-180 text-amber-400' : 'text-white/60'
                    }`}
                  />
                </button>
              </nav>
            )}
          </div>

          {/* Right: Search, Wishlist, Cart & Profile Actions */}
          <div className={`flex items-center gap-2.5 sm:gap-6 ${isEyeglassesPage ? 'text-slate-800' : 'text-white'}`}>
            {/* Search Input Bar (matching screenshot layout) */}
            <div className="relative flex items-center">
              <div
                className={`flex items-center gap-1.5 sm:gap-2 border-b transition-all duration-300 pb-0.5 ${
                  isEyeglassesPage
                    ? isSearchFocused || searchQuery
                      ? 'border-slate-800 w-28 sm:w-60 bg-slate-100 px-1.5 sm:px-2 rounded-t'
                      : 'border-slate-300 hover:border-slate-600 w-16 sm:w-32'
                    : isSearchFocused || searchQuery
                    ? 'border-white w-28 sm:w-60 bg-black/20 px-1.5 sm:px-2 rounded-t'
                    : 'border-white/40 hover:border-white/80 w-16 sm:w-32'
                }`}
              >
                <Search
                  className={`w-4 h-4 shrink-0 cursor-pointer ${
                    isEyeglassesPage ? 'text-slate-600' : 'text-white/80'
                  }`}
                  onClick={() => searchInputRef.current?.focus()}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    setIsSearchOpen(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setIsSearchFocused(false), 250);
                  }}
                  className={`bg-transparent text-xs sm:text-sm outline-none w-full ${
                    isEyeglassesPage
                      ? 'text-slate-900 placeholder-slate-400'
                      : 'text-white placeholder-white/60'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`p-0.5 ${
                      isEyeglassesPage ? 'text-slate-500 hover:text-slate-800' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-3 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/15 py-2 z-50 animate-fade-in text-slate-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                    Product Matches ({searchResults.length})
                  </div>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        openPDP(product);
                        setIsSearchFocused(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 cursor-pointer transition border-b border-white/5 last:border-0"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg bg-black/40 border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          {product.brand} • ₹{product.sellingPrice}
                        </div>
                      </div>
                      <span className="text-[11px] text-amber-400 font-semibold">View</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Heart Icon (with badge '2' as shown in the screenshot) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className={`relative p-1 transition cursor-pointer group ${
                isEyeglassesPage ? 'text-slate-700 hover:text-indigo-600' : 'text-white hover:text-amber-300'
              }`}
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {wishlist.length > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-md ${
                    isEyeglassesPage ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'
                  }`}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon (with cart item badge) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-1 transition cursor-pointer group ${
                isEyeglassesPage ? 'text-slate-700 hover:text-indigo-600' : 'text-white hover:text-amber-300'
              }`}
              title="Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar Icon with Exact AR-Vision Eyecare Dropdown Menu matching Image 1 */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                  }
                }}
                className={`p-1 transition cursor-pointer flex items-center gap-1.5 group ${
                  isEyeglassesPage ? 'text-slate-700 hover:text-indigo-600' : 'text-white hover:text-amber-300'
                }`}
                title="Account & Settings"
                aria-label="Account Menu"
              >
                {isLoggedIn && userProfile?.avatar ? (
                  <div
                    className={`w-6 h-6 rounded-full overflow-hidden border transition shadow-xs flex items-center justify-center ${
                      isEyeglassesPage
                        ? 'border-slate-300 group-hover:border-indigo-600'
                        : 'border-white/60 group-hover:border-amber-300 bg-slate-800'
                    }`}
                  >
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
              </button>

              {/* Exact AR-Vision Eyecare Account Flyout Menu matching Image 1 */}
              <AccountDropdownMenu
                isOpen={isProfileMenuOpen && isLoggedIn}
                onClose={() => setIsProfileMenuOpen(false)}
                triggerRef={profileMenuRef}
              />
            </div>

            {/* Mobile Hamburger Menu Toggle - Only shown on main pages */}
            {!isEyeglassesPage && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1 text-white hover:text-amber-300 transition cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu - Only on main storefront */}
      {!isEyeglassesPage && isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10 px-6 py-5 mt-2 animate-fade-in text-white space-y-3">
          <button
            onClick={() => {
              setIsEyeglassesMenuOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-200 hover:text-white text-sm border-b border-white/10 flex items-center justify-between"
          >
            <span>Eyeglasses</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
              Explore
            </span>
          </button>
          <button
            onClick={() => {
              setIsSunglassesMenuOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-200 hover:text-white text-sm border-b border-white/10 flex items-center justify-between"
          >
            <span>Sunglasses</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
              Explore
            </span>
          </button>
          <button
            onClick={() => {
              setIsContactLensMenuOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-200 hover:text-white text-sm border-b border-white/10 flex items-center justify-between"
          >
            <span>Contact Lenses</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
              Explore
            </span>
          </button>
          <button
            onClick={() => {
              setIsStoreLocatorOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-200 hover:text-white text-sm border-b border-white/10"
          >
            Stores
          </button>
          <button
            onClick={() => {
              setIsTryAtHomeMenuOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-amber-300 hover:text-amber-200 text-sm flex items-center justify-between"
          >
            <span>Try @ Home</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">Free</span>
          </button>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                setActiveView('design-board');
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-semibold rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-center"
            >
              45 Slides
            </button>
            <button
              onClick={() => {
                setActiveView('admin-portal');
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-center"
            >
              Admin
            </button>
          </div>
        </div>
      )}

      {/* Interactive Mega Menu Dropdowns - Only on main storefront */}
      {!isEyeglassesPage && (
        <>
          <ContactLensMegaMenu
            isOpen={isContactLensMenuOpen}
            onClose={() => setIsContactLensMenuOpen(false)}
          />
          <SunglassesMegaMenu
            isOpen={isSunglassesMenuOpen}
            onClose={() => setIsSunglassesMenuOpen(false)}
          />
          <EyeglassesMegaMenu
            isOpen={isEyeglassesMenuOpen}
            onClose={() => setIsEyeglassesMenuOpen(false)}
          />
          <TryAtHomeMegaMenu
            isOpen={isTryAtHomeMenuOpen}
            onClose={() => setIsTryAtHomeMenuOpen(false)}
          />
        </>
      )}
    </header>
  );
};
