import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroVideo } from './components/HeroVideo';
import { FestivalBanner } from './components/FestivalBanner';
import { HomepagePromotions } from './components/HomepagePromotions';
import { ProductCatalog } from './components/ProductCatalog';
import { Footer } from './components/Footer';

// Modals & Alternative Views
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LensCustomizerModal } from './components/LensCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { StoreLocatorModal } from './components/StoreLocatorModal';
import { PrescriptionVaultModal } from './components/PrescriptionVaultModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { BookAppointmentModal } from './components/BookAppointmentModal';
import { AdminPortal } from './components/AdminPortal';
import { DesignBoardModal } from './components/DesignBoardModal';
import { DynamicPromoBanner } from './components/DynamicPromoBanner';
import { EyeglassesPLP } from './components/EyeglassesPLP';
import { ErrorBoundary } from './components/ErrorBoundary';

// Account & Auth Modals (Images 1, 2, 3)
import { AuthModal } from './components/account/AuthModal';
import { ClaimGiftCardModal } from './components/account/ClaimGiftCardModal';
import { AccountInformationModal } from './components/account/AccountInformationModal';
import { MyStoreCreditModal } from './components/account/MyStoreCreditModal';
import { AddressBookModal } from './components/account/AddressBookModal';
import { Saved3DModelsModal } from './components/account/Saved3DModelsModal';
import { ManageNotificationsModal } from './components/account/ManageNotificationsModal';
import { MyOrdersModal } from './components/account/MyOrdersModal';

const MainAppContent: React.FC = () => {
  const {
    activeView,
    activeCategory,
    homepageSections,
    isContactLensMenuOpen,
    isSunglassesMenuOpen,
    isEyeglassesMenuOpen,
    isTryAtHomeMenuOpen,
    theme,
  } = useStore();

  const isAnyMegaMenuOpen =
    isContactLensMenuOpen ||
    isSunglassesMenuOpen ||
    isEyeglassesMenuOpen ||
    isTryAtHomeMenuOpen;

  if (activeView === 'design-board') {
    return <DesignBoardModal />;
  }

  if (activeView === 'admin-portal') {
    return (
      <ErrorBoundary fallbackTitle="Admin Portal Error">
        <AdminPortal />
      </ErrorBoundary>
    );
  }

  // Check section visibility from store context
  const isHeroEnabled = homepageSections.find((s) => s.type === 'hero')?.isEnabled ?? true;
  const isFestivalEnabled = homepageSections.find((s) => s.type === 'festival')?.isEnabled ?? true;
  const isEyeglassesCategoryPage = activeCategory === 'Eyeglasses';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#0B0F17] text-slate-100 selection:bg-amber-400 selection:text-slate-950'
          : 'bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white'
      }`}
    >
      {/* 1. Header with announcement bar & search */}
      <Header />

      {/* Main page content with deep background blur & dark tint when navbar mega menu is open */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-out ${
          isAnyMegaMenuOpen
            ? 'filter blur-[8px] brightness-75 contrast-95 pointer-events-none select-none'
            : 'filter blur-0 brightness-100 contrast-100'
        }`}
      >
        {isEyeglassesCategoryPage ? (
          /* Eyeglasses Dedicated Product Listing Page matching user image */
          <EyeglassesPLP />
        ) : (
          <>
            {/* 2. Hero Video Showcase (if enabled) */}
            {isHeroEnabled && <HeroVideo />}

            {/* 2b. Dynamic Customizable Promotional Advertisement Banner */}
            <DynamicPromoBanner position="below_hero" />

            {/* 3. Festival Campaign Banner (if enabled) */}
            {isFestivalEnabled && <FestivalBanner />}

            {/* 4. Category Grid, BOGO Spotlight, 3D AR Banner & Reviews */}
            <HomepagePromotions />

            {/* 5. Complete Product Catalog & Advanced Faceted Discovery */}
            <ProductCatalog />
          </>
        )}

        {/* 6. Footer & Trust Guarantees */}
        <Footer />
      </div>

      {/* Interactive Optical Modals */}
      <VirtualTryOnModal />
      <ProductDetailModal />
      <LensCustomizerModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <StoreLocatorModal />
      <PrescriptionVaultModal />
      <ProductCompareModal />
      <WishlistDrawer />
      <BookAppointmentModal />

      {/* Customer Account & Authentication Suite (Images 1, 2, 3) */}
      <AuthModal />
      <ClaimGiftCardModal />
      <AccountInformationModal />
      <MyStoreCreditModal />
      <AddressBookModal />
      <Saved3DModelsModal />
      <ManageNotificationsModal />
      <MyOrdersModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
