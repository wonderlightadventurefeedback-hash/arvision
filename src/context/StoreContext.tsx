import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Product,
  ProductVariant,
  CartItem,
  LensSelection,
  Order,
  OrderStatus,
  FestivalCampaign,
  HeroSlide,
  HomepageSection,
  StoreLocation,
  EyeTestAppointment,
  ProductCategory,
  HomepageBanner,
  MediaAsset,
  AdminUser,
  ActivityLog,
  Coupon,
  CategoryDetail,
  WebsiteSettings,
  PromoBanner,
  HomeTryOnAppointment,
  FieldExecutive,
  HtoServiceType,
  HtoAppointmentStatus,
  HtoTimeSlot,
  UserProfile,
  GiftCardClaimRecord,
  AdPoster,
  HomepageVideo,
  PaymentTransaction,
  InventoryMovement,
  BackInStockSubscription,
  StockNotificationLog,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_HERO_SLIDES,
  INITIAL_FESTIVAL_CAMPAIGNS,
  INITIAL_HOMEPAGE_SECTIONS,
  MOCK_STORES,
  INITIAL_BANNERS,
  INITIAL_MEDIA_ASSETS,
  INITIAL_ADMIN_USERS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_COUPONS,
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_PROMO_BANNERS,
  INITIAL_FIELD_EXECUTIVES,
  INITIAL_HTO_APPOINTMENTS,
  INITIAL_USER_PROFILE,
  VALID_GIFT_CARDS,
  INITIAL_AD_POSTERS,
  INITIAL_HOMEPAGE_VIDEOS,
  INITIAL_PAYMENT_TRANSACTIONS,
  INITIAL_INVENTORY_MOVEMENTS,
  INITIAL_BACK_IN_STOCK_SUBSCRIPTIONS,
  INITIAL_STOCK_NOTIFICATIONS,
} from '../data/mockData';


interface CouponInfo {
  code: string;
  discountPercent: number;
}

interface StoreContextType {
  // Storefront Data
  products: Product[];
  heroSlides: HeroSlide[];
  festivalCampaigns: FestivalCampaign[];
  activeCampaign: FestivalCampaign | undefined;
  homepageSections: HomepageSection[];
  stores: StoreLocation[];
  orders: Order[];
  appointments: EyeTestAppointment[];
  htoAppointments: HomeTryOnAppointment[];
  fieldExecutives: FieldExecutive[];
  blockedSlots: { date: string; slot: string }[];
  wishlist: string[];
  recentlyViewed: string[];
  comparisonList: string[];
  savedPrescriptions: any[];

  // Wonderlix Enterprise Content & Admin Data
  banners: HomepageBanner[];
  promoBanners: PromoBanner[];
  mediaAssets: MediaAsset[];
  adminUsers: AdminUser[];
  currentAdminUser: AdminUser;
  activityLogs: ActivityLog[];
  coupons: Coupon[];
  categories: CategoryDetail[];
  websiteSettings: WebsiteSettings;

  // Navigation & View
  activeView: 'storefront' | 'design-board' | 'admin-portal';
  setActiveView: (view: 'storefront' | 'design-board' | 'admin-portal') => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Theme Modes (Light & Dark)
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Modals & Triggers
  selectedProductForPDP: Product | null;
  setSelectedProductForPDP: (p: Product | null) => void;
  isLensCustomizerOpen: boolean;
  setIsLensCustomizerOpen: (open: boolean) => void;
  productForLensCustomizer: Product | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (o: Order | null) => void;
  isStoreLocatorOpen: boolean;
  setIsStoreLocatorOpen: (open: boolean) => void;
  isPrescriptionVaultOpen: boolean;
  setIsPrescriptionVaultOpen: (open: boolean) => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  isBookAppointmentOpen: boolean;
  setIsBookAppointmentOpen: (open: boolean) => void;
  selectedStoreForBooking: StoreLocation | null;
  setSelectedStoreForBooking: (store: StoreLocation | null) => void;
  isTryOnModalOpen: boolean;
  setIsTryOnModalOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isContactLensMenuOpen: boolean;
  setIsContactLensMenuOpen: (open: boolean) => void;
  isSunglassesMenuOpen: boolean;
  setIsSunglassesMenuOpen: (open: boolean) => void;
  isEyeglassesMenuOpen: boolean;
  setIsEyeglassesMenuOpen: (open: boolean) => void;
  isTryAtHomeMenuOpen: boolean;
  setIsTryAtHomeMenuOpen: (open: boolean) => void;
  selectedProductForTryOn: Product | null;
  setSelectedProductForTryOn: (p: Product | null) => void;
  openTryOn: (product: Product) => void;
  designBoardInitialSlide: number | null;
  setDesignBoardInitialSlide: (slideNum: number | null) => void;

  // Cart & Pricing
  cart: CartItem[];
  appliedCoupon: CouponInfo | null;
  cartSubtotal: number;
  cartDiscount: number;
  cartTax: number;
  cartShipping: number;
  cartTotal: number;
  bogoSavings: number;
  addToCart: (product: Product, variant: ProductVariant, lens?: LensSelection) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Checkout & Orders
  createOrder: (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusHistory' | 'orderStatus' | 'prescriptionStatus'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;

  // Features
  toggleWishlist: (productId: string) => void;
  addToRecentlyViewed: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  bookAppointment: (appointment: Omit<EyeTestAppointment, 'id' | 'createdAt'>) => EyeTestAppointment;
  bookHtoAppointment: (data: Omit<HomeTryOnAppointment, 'id' | 'appointmentId' | 'createdAt' | 'updatedAt' | 'timeline' | 'notificationsSent'>) => HomeTryOnAppointment;
  updateHtoStatus: (id: string, status: HtoAppointmentStatus, note?: string) => void;
  assignHtoExecutive: (appointmentId: string, executiveId: string) => void;
  rescheduleHtoAppointment: (id: string, newDate: string, newSlot: HtoTimeSlot) => void;
  sendHtoNotification: (id: string, channel: 'SMS' | 'WhatsApp' | 'Email', message: string) => void;
  toggleBlockSlot: (date: string, slot: string) => void;
  deleteHtoAppointment: (id: string) => void;
  openPDP: (product: Product) => void;
  openLensCustomizer: (product: Product) => void;
  jumpToDesignSlide: (slideNumber: number) => void;

  // Admin Controls & Actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  duplicateProduct: (productId: string) => void;
  updateProductPrice: (productId: string, originalPrice: number, sellingPrice: number) => void;
  toggleProductPublish: (productId: string) => void;
  updateStock: (productId: string, variantId: string, newStock: number) => void;
  adjustStock: (productId: string, variantId: string, delta: number) => void;
  getUnitsSoldForProduct: (productId: string) => number;

  updateHeroSlide: (slide: HeroSlide) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (slideId: string) => void;
  toggleHeroSlide: (slideId: string) => void;

  addBanner: (banner: HomepageBanner) => void;
  updateBanner: (banner: HomepageBanner) => void;
  deleteBanner: (bannerId: string) => void;
  toggleBannerActive: (bannerId: string) => void;
  reorderBanners: (banners: HomepageBanner[]) => void;

  addPromoBanner: (banner: PromoBanner) => void;
  updatePromoBanner: (banner: PromoBanner) => void;
  deletePromoBanner: (bannerId: string) => void;
  duplicatePromoBanner: (bannerId: string) => void;
  togglePromoBannerStatus: (bannerId: string) => void;
  reorderPromoBanners: (banners: PromoBanner[]) => void;

  setFestivalCampaignActive: (campaignId: string) => void;
  addFestivalCampaign: (campaign: FestivalCampaign) => void;
  updateFestivalCampaign: (campaign: FestivalCampaign) => void;

  toggleHomepageSection: (sectionId: string) => void;
  reorderHomepageSections: (sections: HomepageSection[]) => void;

  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: string) => void;
  toggleCouponActive: (couponId: string) => void;

  addMediaAsset: (asset: MediaAsset) => void;
  deleteMediaAsset: (mediaId: string) => { success: boolean; message?: string };

  updateCategory: (category: CategoryDetail) => void;
  toggleCategoryActive: (categoryId: string) => void;

  setCurrentAdminUser: (user: AdminUser) => void;
  addAdminUser: (user: AdminUser) => void;
  updateAdminUser: (user: AdminUser) => void;

  logActivity: (action: string, module: string, details: string, status?: 'success' | 'warning' | 'info') => void;
  updateWebsiteSettings: (settings: Partial<WebsiteSettings>) => void;

  // Customer Auth & User Profile (Images 1, 2, 3)
  userProfile: UserProfile;
  isLoggedIn: boolean;
  login: (userData?: Partial<UserProfile>) => void;
  signup: (userData: { name: string; phone: string; email: string }) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  claimGiftCard: (code: string, pin: string) => { success: boolean; message: string; amount?: number };
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAccountMenuOpen: boolean;
  setIsAccountMenuOpen: (open: boolean) => void;
  activeAccountModal: 'claim-gift-card' | 'account-information' | 'orders' | 'prescription' | 'store-credit' | 'addresses' | '3d-models' | 'notifications' | null;
  setActiveAccountModal: (modal: 'claim-gift-card' | 'account-information' | 'orders' | 'prescription' | 'store-credit' | 'addresses' | '3d-models' | 'notifications' | null) => void;

  // 1. Dynamic Advertisement Poster Management & Scheduler
  adPosters: AdPoster[];
  activeScheduledPoster: AdPoster | null;
  addAdPoster: (poster: Omit<AdPoster, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAdPoster: (id: string, updates: Partial<AdPoster>) => void;
  deleteAdPoster: (id: string) => void;

  // 2. Dynamic Homepage Hero Video Management & Scheduler
  homepageVideos: HomepageVideo[];
  activeScheduledVideo: HomepageVideo | null;
  addHomepageVideo: (video: Omit<HomepageVideo, 'id' | 'createdAt'>) => void;
  updateHomepageVideo: (id: string, updates: Partial<HomepageVideo>) => void;
  deleteHomepageVideo: (id: string) => void;

  // 3. Online Payments & Transactions
  paymentTransactions: PaymentTransaction[];
  recordPaymentTransaction: (tx: PaymentTransaction) => void;
  processRefund: (transactionId: string, reason: string) => void;

  // 4. Real-time Inventory Movements & Stock Controls
  inventoryMovements: InventoryMovement[];
  adjustProductStock: (productId: string, variantId: string | undefined, delta: number, reason: string) => void;
  getProductStock: (product: Product) => number;

  // 5. Out-of-Stock Email Notifications & Restock Alerts
  backInStockSubscriptions: BackInStockSubscription[];
  subscribeBackInStock: (productId: string, customerEmail: string, variantId?: string) => { success: boolean; message: string };
  stockNotificationLogs: StockNotificationLog[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_products') || localStorage.getItem('arvision_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(parsed.map((p: any) => p.id));
          const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
          const allProds = missing.length > 0 ? [...missing, ...parsed] : parsed;
          return allProds.map((p: any) => ({
            ...p,
            name: p.name?.replace(/Lenskart/gi, 'AR-Vision Eyecare') || p.name,
            brand: p.brand?.replace(/Lenskart/gi, 'AR-Vision Eyecare') || p.brand,
          }));
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 2. Hero Slides
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_heroslides') || localStorage.getItem('arvision_heroslides');
      return saved ? JSON.parse(saved) : INITIAL_HERO_SLIDES;
    } catch {
      return INITIAL_HERO_SLIDES;
    }
  });

  // 3. Festival Campaigns
  const [festivalCampaigns, setFestivalCampaigns] = useState<FestivalCampaign[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_campaigns') || localStorage.getItem('arvision_campaigns');
      return saved ? JSON.parse(saved) : INITIAL_FESTIVAL_CAMPAIGNS;
    } catch {
      return INITIAL_FESTIVAL_CAMPAIGNS;
    }
  });

  // 4. Homepage Layout Sections
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_sections') || localStorage.getItem('arvision_sections');
      return saved ? JSON.parse(saved) : INITIAL_HOMEPAGE_SECTIONS;
    } catch {
      return INITIAL_HOMEPAGE_SECTIONS;
    }
  });

  // 5. Homepage Banners & Advertisements
  const [banners, setBanners] = useState<HomepageBanner[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_banners');
      return saved ? JSON.parse(saved) : INITIAL_BANNERS;
    } catch {
      return INITIAL_BANNERS;
    }
  });

  // 5b. Dynamic Promotional Advertisements
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_promobanners');
      return saved ? JSON.parse(saved) : INITIAL_PROMO_BANNERS;
    } catch {
      return INITIAL_PROMO_BANNERS;
    }
  });

  // 6. Media Assets
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_media');
      return saved ? JSON.parse(saved) : INITIAL_MEDIA_ASSETS;
    } catch {
      return INITIAL_MEDIA_ASSETS;
    }
  });

  // 7. Admin Users & Active User
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_admin_users');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  });

  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_current_admin');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS[0];
    } catch {
      return INITIAL_ADMIN_USERS[0];
    }
  });

  // 8. Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_activity_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((l: ActivityLog) => !l.id?.startsWith('log-')) : [];
      }
    } catch {}
    return INITIAL_ACTIVITY_LOGS;
  });

  // 9. Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  // 10. Categories
  const [categories, setCategories] = useState<CategoryDetail[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // 11. Website Settings
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [stores] = useState<StoreLocation[]>(MOCK_STORES);

  // 12. Orders State (Production: clean state, filtering out any mock demo orders)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('arvision_orders') || localStorage.getItem('wonderlix_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((o: Order) => !o.id?.startsWith('ord-demo-')) : [];
      }
    } catch {}
    return [];
  });

  const [appointments, setAppointments] = useState<EyeTestAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_appointments') || localStorage.getItem('arvision_appointments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [htoAppointments, setHtoAppointments] = useState<HomeTryOnAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('arvision_hto_appointments') || localStorage.getItem('wonderlix_hto_appointments');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((a: HomeTryOnAppointment) => !a.id?.startsWith('HTO-2026-9284')) : [];
      }
    } catch {}
    return INITIAL_HTO_APPOINTMENTS;
  });

  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>(INITIAL_FIELD_EXECUTIVES);

  const [blockedSlots, setBlockedSlots] = useState<{ date: string; slot: string }[]>([
    { date: 'Today (Urgent)', slot: '10 AM – 12 PM' },
  ]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_cart') || localStorage.getItem('arvision_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<CouponInfo | null>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_coupon') || localStorage.getItem('arvision_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_wishlist') || localStorage.getItem('arvision_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-4'];
    } catch {
      return ['prod-1', 'prod-4'];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(['prod-1', 'prod-2', 'prod-3']);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [savedPrescriptions] = useState<any[]>([
    {
      id: 'rx-self',
      label: 'Self (Distance Work)',
      doctorName: 'Dr. Ramesh Rao (Vision Care Clinic)',
      date: '15 Oct 2026',
      od: { sph: '-1.50', cyl: '-0.50', axis: '90' },
      os: { sph: '-1.75', cyl: '-0.25', axis: '85' },
      pd: '63mm',
    },
    {
      id: 'rx-reading',
      label: 'Mother (Reading & Craft)',
      doctorName: 'Dr. Anita Desai (Eye Institute)',
      date: '02 Sep 2026',
      od: { sph: '+2.00', cyl: '0.00', axis: '0' },
      os: { sph: '+2.25', cyl: '0.00', axis: '0' },
      pd: '60mm',
    },
  ]);

  // View & UI Navigation States (Synchronized with URL for direct /admin and / routes)
  const getInitialView = (): 'storefront' | 'design-board' | 'admin-portal' => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (
        path === '/admin' ||
        path.startsWith('/admin/') ||
        hash === '#admin' ||
        hash === '#/admin' ||
        search.includes('view=admin') ||
        search.includes('route=admin') ||
        search.includes('tab=admin')
      ) {
        return 'admin-portal';
      }

      if (
        path === '/design-board' ||
        path.startsWith('/design-board/') ||
        hash === '#design-board' ||
        hash === '#/design-board'
      ) {
        return 'design-board';
      }
    }
    return 'storefront';
  };

  const [activeView, setActiveViewState] = useState<'storefront' | 'design-board' | 'admin-portal'>(getInitialView);

  // Theme Modes (Light & Dark)
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ar_vision_theme') as 'light' | 'dark';
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ar_vision_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const setActiveView = useCallback((view: 'storefront' | 'design-board' | 'admin-portal') => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const currentHash = window.location.hash.toLowerCase();

      if (view === 'admin-portal') {
        if (currentPath !== '/admin' && currentHash !== '#/admin' && currentHash !== '#admin') {
          window.history.pushState({ view: 'admin-portal' }, '', '/admin');
        }
      } else if (view === 'design-board') {
        if (currentPath !== '/design-board' && currentHash !== '#/design-board') {
          window.history.pushState({ view: 'design-board' }, '', '/design-board');
        }
      } else if (view === 'storefront') {
        if (
          currentPath === '/admin' ||
          currentPath.startsWith('/admin') ||
          currentPath === '/design-board' ||
          currentHash === '#/admin' ||
          currentHash === '#admin'
        ) {
          window.history.pushState({ view: 'storefront' }, '', '/');
        }
      }
    }
  }, []);

  // Sync active view with browser back/forward buttons and hash navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (
        path === '/admin' ||
        path.startsWith('/admin/') ||
        hash === '#admin' ||
        hash === '#/admin' ||
        search.includes('view=admin') ||
        search.includes('route=admin') ||
        search.includes('tab=admin')
      ) {
        setActiveViewState('admin-portal');
      } else if (
        path === '/design-board' ||
        path.startsWith('/design-board/') ||
        hash === '#design-board' ||
        hash === '#/design-board'
      ) {
        setActiveViewState('design-board');
      } else {
        setActiveViewState('storefront');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedProductForPDP, setSelectedProductForPDP] = useState<Product | null>(null);
  const [isLensCustomizerOpen, setIsLensCustomizerOpen] = useState<boolean>(false);
  const [productForLensCustomizer, setProductForLensCustomizer] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState<boolean>(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState<boolean>(false);
  const [isPrescriptionVaultOpen, setIsPrescriptionVaultOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState<boolean>(false);
  const [selectedStoreForBooking, setSelectedStoreForBooking] = useState<StoreLocation | null>(null);
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isContactLensMenuOpen, setIsContactLensMenuOpen] = useState<boolean>(false);
  const [isSunglassesMenuOpen, setIsSunglassesMenuOpen] = useState<boolean>(false);
  const [isEyeglassesMenuOpen, setIsEyeglassesMenuOpen] = useState<boolean>(false);
  const [isTryAtHomeMenuOpen, setIsTryAtHomeMenuOpen] = useState<boolean>(false);
  const [selectedProductForTryOn, setSelectedProductForTryOn] = useState<Product | null>(null);
  const [designBoardInitialSlide, setDesignBoardInitialSlide] = useState<number | null>(null);

  // Customer User Profile & Auth (Production: clean guest state until user signs in)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('arvision_user_profile') || localStorage.getItem('wonderlix_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Exclude dummy user profile with demo id
        if (parsed && parsed.id && !parsed.id.startsWith('usr-hitakankshi-') && !parsed.id.startsWith('usr-demo-')) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_USER_PROFILE;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('arvision_is_logged_in') || localStorage.getItem('wonderlix_is_logged_in');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState<boolean>(false);
  const [activeAccountModal, setActiveAccountModal] = useState<
    'claim-gift-card' | 'account-information' | 'orders' | 'prescription' | 'store-credit' | 'addresses' | '3d-models' | 'notifications' | null
  >(null);

  // =========================================================================
  // 1. Dynamic Advertisement Posters with Scheduling State
  // =========================================================================
  const [adPosters, setAdPosters] = useState<AdPoster[]>(() => {
    try {
      const saved = localStorage.getItem('arvision_ad_posters');
      return saved ? JSON.parse(saved) : INITIAL_AD_POSTERS;
    } catch {
      return INITIAL_AD_POSTERS;
    }
  });

  // =========================================================================
  // 2. Dynamic Homepage Videos with Duration Rotation State
  // =========================================================================
  const [homepageVideos, setHomepageVideos] = useState<HomepageVideo[]>(() => {
    try {
      const saved = localStorage.getItem('arvision_homepage_videos');
      return saved ? JSON.parse(saved) : INITIAL_HOMEPAGE_VIDEOS;
    } catch {
      return INITIAL_HOMEPAGE_VIDEOS;
    }
  });

  // =========================================================================
  // 3. Payment Transactions State
  // =========================================================================
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('arvision_payment_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((tx: PaymentTransaction) => !tx.id?.startsWith('TXN-2026-9812')) : [];
      }
    } catch {}
    return INITIAL_PAYMENT_TRANSACTIONS;
  });

  // =========================================================================
  // 4. Real-time Inventory Movement & Stock History State
  // =========================================================================
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(() => {
    try {
      const saved = localStorage.getItem('arvision_inventory_movements');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((m: InventoryMovement) => !m.id?.startsWith('mov-') && !m.id?.startsWith('INV-MOV-')) : [];
      }
    } catch {}
    return INITIAL_INVENTORY_MOVEMENTS;
  });

  // =========================================================================
  // 5. Out-of-Stock Email Subscriptions & Notifications
  // =========================================================================
  const [backInStockSubscriptions, setBackInStockSubscriptions] = useState<BackInStockSubscription[]>(() => {
    try {
      const saved = localStorage.getItem('arvision_back_in_stock_subscriptions');
      return saved ? JSON.parse(saved) : INITIAL_BACK_IN_STOCK_SUBSCRIPTIONS;
    } catch {
      return INITIAL_BACK_IN_STOCK_SUBSCRIPTIONS;
    }
  });

  const [stockNotificationLogs, setStockNotificationLogs] = useState<StockNotificationLog[]>(() => {
    try {
      const saved = localStorage.getItem('arvision_stock_notifications');
      return saved ? JSON.parse(saved) : INITIAL_STOCK_NOTIFICATIONS;
    } catch {
      return INITIAL_STOCK_NOTIFICATIONS;
    }
  });

  // Wall-clock ticker every 10 seconds so scheduled ads & videos rotate seamlessly
  const [currentWallClock, setCurrentWallClock] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWallClock(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('arvision_ad_posters', JSON.stringify(adPosters));
  }, [adPosters]);

  useEffect(() => {
    localStorage.setItem('arvision_homepage_videos', JSON.stringify(homepageVideos));
  }, [homepageVideos]);

  useEffect(() => {
    localStorage.setItem('arvision_payment_transactions', JSON.stringify(paymentTransactions));
  }, [paymentTransactions]);

  useEffect(() => {
    localStorage.setItem('arvision_inventory_movements', JSON.stringify(inventoryMovements));
  }, [inventoryMovements]);

  useEffect(() => {
    localStorage.setItem('arvision_back_in_stock_subscriptions', JSON.stringify(backInStockSubscriptions));
  }, [backInStockSubscriptions]);

  useEffect(() => {
    localStorage.setItem('arvision_stock_notifications', JSON.stringify(stockNotificationLogs));
  }, [stockNotificationLogs]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('wonderlix_products', JSON.stringify(products));
    localStorage.setItem('arvision_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wonderlix_heroslides', JSON.stringify(heroSlides));
    localStorage.setItem('arvision_heroslides', JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem('wonderlix_campaigns', JSON.stringify(festivalCampaigns));
    localStorage.setItem('arvision_campaigns', JSON.stringify(festivalCampaigns));
  }, [festivalCampaigns]);

  useEffect(() => {
    localStorage.setItem('wonderlix_sections', JSON.stringify(homepageSections));
    localStorage.setItem('arvision_sections', JSON.stringify(homepageSections));
  }, [homepageSections]);

  useEffect(() => {
    localStorage.setItem('wonderlix_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('wonderlix_promobanners', JSON.stringify(promoBanners));
  }, [promoBanners]);

  useEffect(() => {
    localStorage.setItem('wonderlix_media', JSON.stringify(mediaAssets));
  }, [mediaAssets]);

  useEffect(() => {
    localStorage.setItem('wonderlix_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem('wonderlix_current_admin', JSON.stringify(currentAdminUser));
  }, [currentAdminUser]);

  useEffect(() => {
    localStorage.setItem('wonderlix_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('wonderlix_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('wonderlix_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('wonderlix_settings', JSON.stringify(websiteSettings));
  }, [websiteSettings]);

  useEffect(() => {
    localStorage.setItem('wonderlix_cart', JSON.stringify(cart));
    localStorage.setItem('arvision_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('wonderlix_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('wonderlix_coupon');
    }
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('wonderlix_orders', JSON.stringify(orders));
    localStorage.setItem('arvision_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('wonderlix_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('wonderlix_hto_appointments', JSON.stringify(htoAppointments));
    localStorage.setItem('arvision_hto_appointments', JSON.stringify(htoAppointments));
  }, [htoAppointments]);

  useEffect(() => {
    localStorage.setItem('wonderlix_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('wonderlix_user_profile', JSON.stringify(userProfile));
    localStorage.setItem('arvision_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('wonderlix_is_logged_in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const login = (userData?: Partial<UserProfile>) => {
    if (userData) {
      setUserProfile((prev) => ({ ...prev, ...userData }));
    }
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const signup = (userData: { name: string; phone: string; email: string }) => {
    setUserProfile((prev) => ({
      ...prev,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
    }));
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAccountMenuOpen(false);
    setActiveAccountModal(null);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const claimGiftCard = (code: string, pin: string) => {
    const cleanCode = code.replace(/[\s-]/g, '');
    const cleanPin = pin.trim();

    if (cleanCode.length !== 16) {
      return { success: false, message: 'Please enter a valid 16-digit gift card code.' };
    }
    if (cleanPin.length !== 4) {
      return { success: false, message: 'Please enter a valid 4-digit security PIN.' };
    }

    const alreadyClaimed = userProfile.giftCardsClaimed.some(
      (gc) => gc.code.replace(/[\s-]/g, '') === cleanCode
    );
    if (alreadyClaimed) {
      return { success: false, message: 'This gift card has already been claimed on your account.' };
    }

    const matched = VALID_GIFT_CARDS.find(
      (gc) => gc.code === cleanCode && gc.pin === cleanPin
    );
    const amount = matched ? matched.amount : 1000;

    const newRecord: GiftCardClaimRecord = {
      id: `gc-${Date.now()}`,
      code: cleanCode,
      pin: cleanPin,
      amount,
      claimedAt: new Date().toLocaleString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setUserProfile((prev) => ({
      ...prev,
      storeCredit: prev.storeCredit + amount,
      giftCardsClaimed: [newRecord, ...prev.giftCardsClaimed],
    }));

    return {
      success: true,
      message: `Gift card claimed successfully! ₹${amount.toLocaleString()} has been credited to your store credit.`,
      amount,
    };
  };

  // Activity logger helper
  const logActivity = (action: string, module: string, details: string, status: 'success' | 'warning' | 'info' = 'success') => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      userName: currentAdminUser.name,
      userRole: currentAdminUser.role,
      action,
      module,
      details,
      status,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const activeCampaign = festivalCampaigns.find((c) => c.isActive);

  // Dynamic BOGO & Pricing Calculation
  let cartSubtotal = 0;
  let bogoSavings = 0;
  const bogoEligibleItems: { index: number; framePrice: number }[] = [];

  cart.forEach((item, index) => {
    const itemTotal = (item.unitPrice + (item.lensSelection?.price || 0)) * item.quantity;
    cartSubtotal += itemTotal;
    if (item.product.isBogoEligible) {
      for (let q = 0; q < item.quantity; q++) {
        bogoEligibleItems.push({ index, framePrice: item.unitPrice });
      }
    }
  });

  if (bogoEligibleItems.length >= 2) {
    bogoEligibleItems.sort((a, b) => a.framePrice - b.framePrice);
    const freePairsCount = Math.floor(bogoEligibleItems.length / 2);
    for (let i = 0; i < freePairsCount; i++) {
      bogoSavings += bogoEligibleItems[i].framePrice;
    }
  }

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    couponDiscountAmount = Math.round(((cartSubtotal - bogoSavings) * appliedCoupon.discountPercent) / 100);
  }

  const cartDiscount = bogoSavings + couponDiscountAmount;
  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const taxRate = (websiteSettings?.taxRatePercent ?? 18) / 100;
  const freeShipThreshold = websiteSettings?.freeShippingThreshold ?? 999;
  const cartTax = Math.round(taxableAmount * taxRate);
  const cartShipping = taxableAmount > freeShipThreshold || taxableAmount === 0 ? 0 : 99;
  const cartTotal = taxableAmount + cartTax + cartShipping;

  // Cart operations
  const addToCart = (product: Product, variant: ProductVariant, lens?: LensSelection) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedVariant.id === variant.id &&
          item.lensSelection?.lensIndex === lens?.lensIndex &&
          item.lensSelection?.lensType === lens?.lensType &&
          item.lensSelection?.visionType === lens?.visionType
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
          totalPrice: (next[existingIndex].unitPrice + (lens?.price || 0)) * (next[existingIndex].quantity + 1),
        };
        return next;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          product,
          selectedVariant: variant,
          lensSelection: lens,
          quantity: 1,
          unitPrice: product.sellingPrice,
          totalPrice: product.sellingPrice + (lens?.price || 0),
        };
        return [...prev, newItem];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: (item.unitPrice + (item.lensSelection?.price || 0)) * nextQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Dynamic Coupon Validation connected directly to Coupons table!
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const match = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);

    if (match) {
      if (cartSubtotal < match.minOrderAmount) {
        return {
          success: false,
          message: `Minimum order value for code ${match.code} is ₹${match.minOrderAmount.toLocaleString()}`,
        };
      }

      setAppliedCoupon({ code: match.code, discountPercent: match.discountPercent });
      // Increment usage count in background
      setCoupons((prev) =>
        prev.map((c) => (c.id === match.id ? { ...c, usageCount: c.usageCount + 1 } : c))
      );
      return {
        success: true,
        message: `${match.code} applied! ${match.discountPercent}% OFF discount activated.`,
      };
    }

    return { success: false, message: 'Invalid or expired coupon code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Create Order with real-time stock deduction, inventory movements & payment record
  const createOrder = (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusHistory' | 'orderStatus' | 'prescriptionStatus'>): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNum = `WND-2026-${randomNum}`;
    const newOrder: Order = {
      ...orderPayload,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      orderStatus: 'Confirmed',
      statusHistory: [
        {
          status: 'Confirmed',
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          note: `Payment verified via ${orderPayload.paymentMethod}. Order received and stock reserved.`,
        },
      ],
      trackingNumber: `BD-WND${randomNum}`,
      prescriptionStatus: orderPayload.items.some((i) => i.lensSelection?.prescriptionDetails)
        ? 'Uploaded - Pending Review'
        : 'Not Required',
    };

    // 1. Deduct stock from purchased product variants AND product level stock
    const newMovements: InventoryMovement[] = [];
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = orderPayload.items.find((i) => i.product.id === prod.id);
        if (!orderedItem) return prod;

        let updatedStock = prod.stock !== undefined ? Math.max(0, prod.stock - orderedItem.quantity) : undefined;

        const updatedVariants = prod.variants.map((v) => {
          if (v.id === orderedItem.selectedVariant.id) {
            const nextVStock = Math.max(0, v.stock - orderedItem.quantity);
            return { ...v, stock: nextVStock };
          }
          return v;
        });

        if (updatedStock === undefined) {
          updatedStock = updatedVariants.reduce((s, v) => s + (v.stock || 0), 0);
        }

        newMovements.push({
          id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          variantId: orderedItem.selectedVariant.id,
          variantName: orderedItem.selectedVariant.colorName,
          type: 'sale',
          quantityChange: -orderedItem.quantity,
          remainingStock: updatedStock,
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          reason: `Verified Customer Order #${orderNum}`,
          orderId: orderNum,
          performedBy: 'Automated Stock Manager',
        });

        return { ...prod, stock: updatedStock, variants: updatedVariants };
      })
    );

    if (newMovements.length > 0) {
      setInventoryMovements((prev) => [...newMovements, ...prev]);
    }

    // 2. Automatically generate verified Payment Transaction record
    const newTransaction: PaymentTransaction = {
      id: `TXN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      customerPhone: newOrder.customerPhone,
      paymentDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      paymentMethod: newOrder.paymentMethod as any,
      amount: newOrder.totalAmount,
      currency: 'INR',
      status: newOrder.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Successful',
      refundStatus: 'None',
      providerReference: `rzp_live_${Math.random().toString(36).substr(2, 9)}`,
      items: [...newOrder.items],
      deliveryAddress: { ...newOrder.shippingAddress },
      createdAt: new Date().toISOString(),
    };
    setPaymentTransactions((prev) => [newTransaction, ...prev]);

    setOrders((prev) => [newOrder, ...prev]);
    logActivity('Order Placed', 'Checkout', `Order #${newOrder.orderNumber} placed for ₹${newOrder.totalAmount}. Inventory deducted.`);
    clearCart();
    setActiveTrackingOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    let orderToCancel: Order | undefined;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (newStatus === 'Cancelled' || newStatus === 'Refunded') {
            orderToCancel = ord;
          }
          return {
            ...ord,
            orderStatus: newStatus,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: newStatus,
                timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                note: note || `Status updated to ${newStatus}`,
              },
            ],
          };
        }
        return ord;
      })
    );

    // If order was cancelled/refunded, restore stock and update payment transaction
    if (orderToCancel && (newStatus === 'Cancelled' || newStatus === 'Refunded')) {
      const restoredMovements: InventoryMovement[] = [];
      setProducts((prev) =>
        prev.map((prod) => {
          const item = orderToCancel!.items.find((i) => i.product.id === prod.id);
          if (!item) return prod;

          let updatedStock = prod.stock !== undefined ? prod.stock + item.quantity : undefined;
          const updatedVariants = prod.variants.map((v) => {
            if (v.id === item.selectedVariant.id) {
              return { ...v, stock: v.stock + item.quantity };
            }
            return v;
          });

          if (updatedStock === undefined) {
            updatedStock = updatedVariants.reduce((s, v) => s + (v.stock || 0), 0);
          }

          restoredMovements.push({
            id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            productId: prod.id,
            productName: prod.name,
            sku: prod.sku,
            variantId: item.selectedVariant.id,
            type: 'cancellation_return',
            quantityChange: +item.quantity,
            remainingStock: updatedStock,
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            reason: `Order ${orderToCancel!.orderNumber} ${newStatus.toLowerCase()} - inventory returned to stock`,
            orderId: orderToCancel!.orderNumber,
            performedBy: currentAdminUser.name,
          });

          return { ...prod, stock: updatedStock, variants: updatedVariants };
        })
      );

      if (restoredMovements.length > 0) {
        setInventoryMovements((prev) => [...restoredMovements, ...prev]);
      }

      setPaymentTransactions((prev) =>
        prev.map((t) => (t.orderId === orderId ? { ...t, refundStatus: 'Refunded', status: 'Refunded' } : t))
      );
    }

    logActivity('Order Status Changed', 'Orders', `Order ${orderId} moved to ${newStatus}`);
  };

  const bookAppointment = (appointmentData: Omit<EyeTestAppointment, 'id' | 'createdAt'>): EyeTestAppointment => {
    const newAppt: EyeTestAppointment = {
      ...appointmentData,
      id: `appt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newAppt, ...prev]);
    logActivity('Eye Test Booked', 'Appointments', `Appointment booked for ${appointmentData.customerName}`);
    return newAppt;
  };

  const bookHtoAppointment = (
    data: Omit<HomeTryOnAppointment, 'id' | 'appointmentId' | 'createdAt' | 'updatedAt' | 'timeline' | 'notificationsSent'>
  ): HomeTryOnAppointment => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `HTO-2026-${randomNum}`;
    const nowIso = new Date().toISOString();
    const nowFormatted = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const newAppointment: HomeTryOnAppointment = {
      ...data,
      id: newId,
      appointmentId: newId,
      status: 'New',
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          status: 'New',
          timestamp: nowFormatted,
          title: 'Appointment Request Submitted',
          description: `Customer requested ${data.serviceType} for ${data.numberOfPeople} person(s) at ${data.city}`,
          actor: 'Customer (Online)',
        },
      ],
      notificationsSent: [
        {
          id: `notif-${Date.now()}-1`,
          channel: 'WhatsApp',
          timestamp: nowFormatted,
          recipient: data.mobileNumber,
          message: `Hello ${data.customerName}! Your Home Try-On request (${newId}) for ${data.serviceType} on ${data.appointmentDate} (${data.timeSlot}) has been received. Our team will verify and assign an eye care specialist.`,
          status: 'Sent',
        },
        {
          id: `notif-${Date.now()}-2`,
          channel: 'SMS',
          timestamp: nowFormatted,
          recipient: data.mobileNumber,
          message: `AR Vision: Your Home Visit request ${newId} is received. Total due on visit: ₹99 (100% redeemable). Track at: arvision.in/track/${newId}`,
          status: 'Delivered',
        },
        {
          id: `notif-${Date.now()}-3`,
          channel: 'Email',
          timestamp: nowFormatted,
          recipient: data.email || `${data.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          message: `Booking Confirmation for ${newId} - ${data.serviceType} on ${data.appointmentDate}`,
          status: 'Sent',
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setHtoAppointments((prev) => [newAppointment, ...prev]);
    logActivity('Home Try-On Booked', 'Appointments', `New HTO request ${newId} for ${data.customerName} (${data.city})`);
    return newAppointment;
  };

  const updateHtoStatus = (id: string, status: HtoAppointmentStatus, note?: string) => {
    const nowFormatted = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    setHtoAppointments((prev) =>
      prev.map((appt) => {
        if (appt.id !== id && appt.appointmentId !== id) return appt;
        const newTimeline = [
          ...appt.timeline,
          {
            id: `tl-${Date.now()}`,
            status,
            timestamp: nowFormatted,
            title: `Status updated to ${status}`,
            description: note || `Appointment marked as ${status} by Admin`,
            actor: currentAdminUser.name,
          },
        ];
        return {
          ...appt,
          status,
          timeline: newTimeline,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logActivity('HTO Status Updated', 'Appointments', `Appointment ${id} moved to ${status}`);
  };

  const assignHtoExecutive = (appointmentId: string, executiveId: string) => {
    const exec = fieldExecutives.find((e) => e.id === executiveId);
    if (!exec) return;
    const nowFormatted = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    setHtoAppointments((prev) =>
      prev.map((appt) => {
        if (appt.id !== appointmentId && appt.appointmentId !== appointmentId) return appt;
        const newTimeline = [
          ...appt.timeline,
          {
            id: `tl-${Date.now()}`,
            status: 'Executive Assigned' as HtoAppointmentStatus,
            timestamp: nowFormatted,
            title: 'Executive Assigned',
            description: `${exec.name} (${exec.role}) assigned for visit`,
            actor: currentAdminUser.name,
          },
        ];
        const newNotif = [
          ...appt.notificationsSent,
          {
            id: `notif-${Date.now()}`,
            channel: 'WhatsApp' as const,
            timestamp: nowFormatted,
            recipient: appt.mobileNumber,
            message: `Update on ${appt.appointmentId}: Specialist ${exec.name} (${exec.phone}) has been assigned for your home visit on ${appt.appointmentDate} (${appt.timeSlot}).`,
            status: 'Sent' as const,
          },
        ];
        return {
          ...appt,
          status: 'Executive Assigned',
          assignedExecutive: exec,
          timeline: newTimeline,
          notificationsSent: newNotif,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logActivity('Executive Assigned', 'Appointments', `${exec.name} assigned to appointment ${appointmentId}`);
  };

  const rescheduleHtoAppointment = (id: string, newDate: string, newSlot: HtoTimeSlot) => {
    const nowFormatted = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    setHtoAppointments((prev) =>
      prev.map((appt) => {
        if (appt.id !== id && appt.appointmentId !== id) return appt;
        const newTimeline = [
          ...appt.timeline,
          {
            id: `tl-${Date.now()}`,
            status: 'Confirmed' as HtoAppointmentStatus,
            timestamp: nowFormatted,
            title: 'Appointment Rescheduled',
            description: `Date changed from ${appt.appointmentDate} to ${newDate}, slot ${newSlot}`,
            actor: currentAdminUser.name,
          },
        ];
        const newNotif = [
          ...appt.notificationsSent,
          {
            id: `notif-${Date.now()}`,
            channel: 'SMS' as const,
            timestamp: nowFormatted,
            recipient: appt.mobileNumber,
            message: `AR Vision: Your appointment ${appt.appointmentId} has been rescheduled to ${newDate} (${newSlot}).`,
            status: 'Delivered' as const,
          },
        ];
        return {
          ...appt,
          appointmentDate: newDate,
          timeSlot: newSlot,
          status: 'Confirmed',
          timeline: newTimeline,
          notificationsSent: newNotif,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logActivity('Appointment Rescheduled', 'Appointments', `Appointment ${id} rescheduled to ${newDate} (${newSlot})`);
  };

  const sendHtoNotification = (id: string, channel: 'SMS' | 'WhatsApp' | 'Email', message: string) => {
    const nowFormatted = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    setHtoAppointments((prev) =>
      prev.map((appt) => {
        if (appt.id !== id && appt.appointmentId !== id) return appt;
        return {
          ...appt,
          notificationsSent: [
            ...appt.notificationsSent,
            {
              id: `notif-${Date.now()}`,
              channel,
              timestamp: nowFormatted,
              recipient: channel === 'Email' ? appt.email : appt.mobileNumber,
              message,
              status: 'Sent',
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logActivity('Notification Sent', 'Appointments', `Manual ${channel} sent to ${id}`);
  };

  const toggleBlockSlot = (date: string, slot: string) => {
    setBlockedSlots((prev) => {
      const exists = prev.some((s) => s.date === date && s.slot === slot);
      if (exists) {
        return prev.filter((s) => !(s.date === date && s.slot === slot));
      } else {
        return [...prev, { date, slot }];
      }
    });
  };

  const deleteHtoAppointment = (id: string) => {
    setHtoAppointments((prev) => prev.filter((a) => a.id !== id && a.appointmentId !== id));
    logActivity('Appointment Deleted', 'Appointments', `Appointment ${id} was deleted`);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8));
  };

  const toggleCompare = (productId: string) => {
    setComparisonList((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 frames at a time.');
        return prev;
      }
      return [...prev, productId];
    });
  };

  const clearCompare = () => {
    setComparisonList([]);
  };

  const openPDP = (product: Product) => {
    setSelectedProductForPDP(product);
    addToRecentlyViewed(product.id);
  };

  const openLensCustomizer = (product: Product) => {
    setProductForLensCustomizer(product);
    setIsLensCustomizerOpen(true);
  };

  const jumpToDesignSlide = (slideNumber: number) => {
    setDesignBoardInitialSlide(slideNumber);
    setActiveView('design-board');
  };

  const openTryOn = (product: Product) => {
    setSelectedProductForTryOn(product);
    setIsTryOnModalOpen(true);
  };

  // Units sold calculated directly from completed & confirmed orders
  const getUnitsSoldForProduct = (productId: string): number => {
    return orders.reduce((sum, order) => {
      if (order.orderStatus === 'Cancelled') return sum;
      const orderItem = order.items.find((i) => i.product.id === productId);
      return sum + (orderItem ? orderItem.quantity : 0);
    }, 0);
  };

  // Product CRUD
  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    logActivity('Product Created', 'Product Management', `Added ${newProd.name} (SKU: ${newProd.sku})`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProductForPDP?.id === updated.id) {
      setSelectedProductForPDP(updated);
    }
    logActivity('Product Updated', 'Product Management', `Updated ${updated.name}`);
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProductForPDP?.id === productId) {
      setSelectedProductForPDP(null);
    }
    logActivity('Product Deleted', 'Product Management', `Deleted ${prod?.name || productId} (historical orders preserved)`, 'warning');
  };

  const duplicateProduct = (productId: string) => {
    const existing = products.find((p) => p.id === productId);
    if (!existing) return;
    const duplicated: Product = {
      ...existing,
      id: `prod-${Date.now()}`,
      name: `${existing.name} (Copy)`,
      sku: `${existing.sku}-CPY`,
      isPublished: false,
      variants: existing.variants.map((v) => ({ ...v, id: `v-${Date.now()}-${Math.random().toString(36).substring(2, 5)}` })),
    };
    setProducts((prev) => [duplicated, ...prev]);
    logActivity('Product Duplicated', 'Product Management', `Duplicated from ${existing.name}`);
  };

  const updateProductPrice = (productId: string, originalPrice: number, sellingPrice: number) => {
    const discountPct = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            originalPrice,
            sellingPrice,
            discountPercentage: discountPct,
          };
        }
        return p;
      })
    );
    logActivity('Price Changed', 'Pricing', `Product ${productId} price changed to ₹${sellingPrice} (${discountPct}% OFF)`);
  };

  const toggleProductPublish = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStatus = !p.isPublished;
          logActivity(nextStatus ? 'Product Published' : 'Product Unpublished', 'Catalog', `${p.name} visibility toggled to ${nextStatus ? 'Live' : 'Draft'}`);
          return { ...p, isPublished: nextStatus };
        }
        return p;
      })
    );
  };

  const updateStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v)),
          };
        }
        return p;
      })
    );
    logActivity('Stock Updated', 'Inventory', `Product ${productId} variant ${variantId} stock set to ${newStock}`);
  };

  const adjustStock = (productId: string, variantId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock: Math.max(0, v.stock + delta) } : v)),
          };
        }
        return p;
      })
    );
    logActivity('Stock Adjusted', 'Inventory', `Adjusted variant stock by ${delta > 0 ? '+' : ''}${delta}`);
  };

  // Hero Slider
  const updateHeroSlide = (slide: HeroSlide) => {
    setHeroSlides((prev) => prev.map((s) => (s.id === slide.id ? slide : s)));
    logActivity('Hero Slide Updated', 'Website Content', `Updated slide: ${slide.title}`);
  };

  const addHeroSlide = (slide: HeroSlide) => {
    setHeroSlides((prev) => [...prev, slide]);
    logActivity('Hero Slide Added', 'Website Content', `Added slide: ${slide.title}`);
  };

  const deleteHeroSlide = (slideId: string) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== slideId));
    logActivity('Hero Slide Deleted', 'Website Content', `Removed slide ${slideId}`, 'warning');
  };

  const toggleHeroSlide = (slideId: string) => {
    setHeroSlides((prev) =>
      prev.map((s) => (s.id === slideId ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Homepage Banners & Advertisements
  const addBanner = (banner: HomepageBanner) => {
    setBanners((prev) => [banner, ...prev]);
    logActivity('Banner Created', 'Homepage Ads', `Added banner: ${banner.title} (${banner.targetSection})`);
  };

  const updateBanner = (banner: HomepageBanner) => {
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
    logActivity('Banner Updated', 'Homepage Ads', `Updated banner: ${banner.title}`);
  };

  const deleteBanner = (bannerId: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    logActivity('Banner Deleted', 'Homepage Ads', `Deleted banner ${bannerId}`, 'warning');
  };

  const toggleBannerActive = (bannerId: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === bannerId ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const reorderBanners = (newBanners: HomepageBanner[]) => {
    setBanners(newBanners);
    logActivity('Banners Reordered', 'Homepage Ads', 'Adjusted banner display priorities');
  };

  // Dynamic Promo Banners (Customizable Homepage Advertisements)
  const addPromoBanner = (banner: PromoBanner) => {
    setPromoBanners((prev) => [banner, ...prev]);
    logActivity('Promo Banner Created', 'Homepage Ads', `Created promotional banner: ${banner.name}`);
  };

  const updatePromoBanner = (banner: PromoBanner) => {
    setPromoBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
    logActivity('Promo Banner Updated', 'Homepage Ads', `Updated promotional banner: ${banner.name}`);
  };

  const deletePromoBanner = (bannerId: string) => {
    setPromoBanners((prev) => prev.filter((b) => b.id !== bannerId));
    logActivity('Promo Banner Deleted', 'Homepage Ads', `Deleted banner ${bannerId}`, 'warning');
  };

  const duplicatePromoBanner = (bannerId: string) => {
    const existing = promoBanners.find((b) => b.id === bannerId);
    if (!existing) return;
    const duplicated: PromoBanner = {
      ...existing,
      id: `promo-${Date.now()}`,
      name: `${existing.name} (Copy)`,
      status: 'draft',
      priority: promoBanners.length + 1,
    };
    setPromoBanners((prev) => [duplicated, ...prev]);
    logActivity('Promo Banner Duplicated', 'Homepage Ads', `Duplicated ${existing.name}`);
  };

  const togglePromoBannerStatus = (bannerId: string) => {
    setPromoBanners((prev) =>
      prev.map((b) => {
        if (b.id === bannerId) {
          const nextStatus = b.status === 'published' ? 'draft' : 'published';
          logActivity(
            nextStatus === 'published' ? 'Banner Published' : 'Banner Moved to Draft',
            'Homepage Ads',
            `${b.name} status set to ${nextStatus}`
          );
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  const reorderPromoBanners = (banners: PromoBanner[]) => {
    setPromoBanners(banners);
    logActivity('Promo Banners Reordered', 'Homepage Ads', 'Adjusted homepage banner ordering');
  };


  // Festival Campaigns
  const setFestivalCampaignActive = (campaignId: string) => {
    setFestivalCampaigns((prev) =>
      prev.map((c) => ({
        ...c,
        isActive: c.id === campaignId,
      }))
    );
    logActivity('Festival Campaign Changed', 'Promotions', `Set active campaign: ${campaignId}`);
  };

  const addFestivalCampaign = (campaign: FestivalCampaign) => {
    setFestivalCampaigns((prev) => [...prev, campaign]);
    logActivity('Campaign Created', 'Promotions', `Created festival campaign: ${campaign.name}`);
  };

  const updateFestivalCampaign = (campaign: FestivalCampaign) => {
    setFestivalCampaigns((prev) => prev.map((c) => (c.id === campaign.id ? campaign : c)));
    logActivity('Campaign Updated', 'Promotions', `Updated festival campaign: ${campaign.name}`);
  };

  // Homepage Sections
  const toggleHomepageSection = (sectionId: string) => {
    setHomepageSections((prev) =>
      prev.map((sec) => (sec.id === sectionId ? { ...sec, isEnabled: !sec.isEnabled } : sec))
    );
    logActivity('Section Toggled', 'Website Content', `Toggled section ${sectionId}`);
  };

  const reorderHomepageSections = (sections: HomepageSection[]) => {
    setHomepageSections(sections);
    logActivity('Sections Reordered', 'Website Content', 'Updated homepage block layout');
  };

  // Coupons
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    logActivity('Coupon Created', 'Promotions', `Added coupon code: ${coupon.code} (${coupon.discountPercent}% OFF)`);
  };

  const updateCoupon = (coupon: Coupon) => {
    setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? coupon : c)));
    logActivity('Coupon Updated', 'Promotions', `Updated coupon code: ${coupon.code}`);
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    logActivity('Coupon Deleted', 'Promotions', `Deleted coupon ${couponId}`, 'warning');
  };

  const toggleCouponActive = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Media Library
  const addMediaAsset = (asset: MediaAsset) => {
    setMediaAssets((prev) => [asset, ...prev]);
    logActivity('Media Uploaded', 'Media Library', `Uploaded asset: ${asset.name}`);
  };

  const deleteMediaAsset = (mediaId: string): { success: boolean; message?: string } => {
    const asset = mediaAssets.find((m) => m.id === mediaId);
    if (!asset) return { success: false, message: 'Media asset not found.' };

    // Check if asset is used by any active product or banner
    const isUsedByProduct = products.some((p) => p.images.some((img) => img === asset.url));
    const isUsedByBanner = banners.some((b) => b.desktopImage === asset.url || b.mobileImage === asset.url);

    if (isUsedByProduct || isUsedByBanner) {
      return {
        success: false,
        message: 'Cannot delete: This image is currently in use by active products or banners.',
      };
    }

    setMediaAssets((prev) => prev.filter((m) => m.id !== mediaId));
    logActivity('Media Deleted', 'Media Library', `Deleted media asset: ${asset.name}`, 'warning');
    return { success: true };
  };

  // Categories
  const updateCategory = (cat: CategoryDetail) => {
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
    logActivity('Category Updated', 'Categories', `Updated category: ${cat.name}`);
  };

  const toggleCategoryActive = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Admin Users
  const addAdminUser = (user: AdminUser) => {
    setAdminUsers((prev) => [...prev, user]);
    logActivity('Admin User Added', 'Security', `Added admin user ${user.name} (${user.role})`);
  };

  const updateAdminUser = (user: AdminUser) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    if (currentAdminUser.id === user.id) {
      setCurrentAdminUser(user);
    }
    logActivity('Admin User Updated', 'Security', `Updated admin user ${user.name}`);
  };

  // Settings
  const updateWebsiteSettings = (newSettings: Partial<WebsiteSettings>) => {
    setWebsiteSettings((prev) => ({ ...prev, ...newSettings }));
    logActivity('Settings Updated', 'Settings', 'Updated global website settings');
  };

  // =========================================================================
  // 1. Dynamic Advertisement Poster Manager Methods & Rotation Scheduler
  // =========================================================================
  const addAdPoster = useCallback((poster: Omit<AdPoster, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPoster: AdPoster = {
      ...poster,
      id: `poster-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAdPosters((prev) => [newPoster, ...prev]);
    logActivity('Ad Poster Created', 'Advertisement Manager', `Created poster: ${poster.title}`);
  }, []);

  const updateAdPoster = useCallback((id: string, updates: Partial<AdPoster>) => {
    setAdPosters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
    logActivity('Ad Poster Updated', 'Advertisement Manager', `Updated poster ID: ${id}`);
  }, []);

  const deleteAdPoster = useCallback((id: string) => {
    setAdPosters((prev) => prev.filter((p) => p.id !== id));
    logActivity('Ad Poster Deleted', 'Advertisement Manager', `Deleted poster ID: ${id}`, 'warning');
  }, []);

  // Calculate Active Scheduled Ad Poster
  const activeScheduledPoster = useMemo<AdPoster | null>(() => {
    const activeList = adPosters.filter((p) => p.status === 'active');
    if (activeList.length === 0) return null;

    const now = currentWallClock;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;
    const todayDateStr = now.toISOString().split('T')[0];

    // 1. Check exact time slot matches (e.g. 10:00 - 11:00)
    const exactMatches = activeList.filter((p) => {
      const dateValid = (!p.startDate || p.startDate <= todayDateStr) && (!p.endDate || p.endDate >= todayDateStr);
      if (!dateValid) return false;
      if (!p.startTime || !p.endTime) return true;
      if (p.startTime <= p.endTime) {
        return currentTimeStr >= p.startTime && currentTimeStr < p.endTime;
      } else {
        return currentTimeStr >= p.startTime || currentTimeStr < p.endTime;
      }
    });

    if (exactMatches.length > 0) {
      exactMatches.sort((a, b) => a.priority - b.priority);
      return exactMatches[0];
    }

    // 2. Next eligible scheduled poster fallback
    const upcoming = activeList.filter((p) => p.startTime && p.startTime > currentTimeStr);
    if (upcoming.length > 0) {
      upcoming.sort((a, b) => a.startTime.localeCompare(b.startTime));
      return upcoming[0];
    }

    // 3. Fallback to first active poster
    return activeList[0] || null;
  }, [adPosters, currentWallClock]);

  // =========================================================================
  // 2. Dynamic Homepage Video Manager Methods & Wall-Clock Synchronized Rotation
  // =========================================================================
  const addHomepageVideo = useCallback((video: Omit<HomepageVideo, 'id' | 'createdAt'>) => {
    const newVideo: HomepageVideo = {
      ...video,
      id: `vid-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setHomepageVideos((prev) => [...prev, newVideo]);
    logActivity('Homepage Video Added', 'Video Manager', `Added hero video: ${video.title}`);
  }, []);

  const updateHomepageVideo = useCallback((id: string, updates: Partial<HomepageVideo>) => {
    setHomepageVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    logActivity('Homepage Video Updated', 'Video Manager', `Updated hero video ID: ${id}`);
  }, []);

  const deleteHomepageVideo = useCallback((id: string) => {
    setHomepageVideos((prev) => prev.filter((v) => v.id !== id));
    logActivity('Homepage Video Deleted', 'Video Manager', `Deleted hero video ID: ${id}`, 'warning');
  }, []);

  // Calculate Active Scheduled Homepage Video (Wall-clock synchronized across all visitors)
  const activeScheduledVideo = useMemo<HomepageVideo | null>(() => {
    const activeList = homepageVideos
      .filter((v) => v.status === 'active')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (activeList.length === 0) return null;

    const totalCycleMinutes = activeList.reduce((acc, v) => acc + (v.durationMinutes || 60), 0);
    if (totalCycleMinutes <= 0) return activeList[0];

    const nowMinutes = Math.floor(currentWallClock.getTime() / (60 * 1000));
    const cycleOffset = nowMinutes % totalCycleMinutes;

    let accumulated = 0;
    for (const vid of activeList) {
      const vidDuration = vid.durationMinutes || 60;
      if (cycleOffset >= accumulated && cycleOffset < accumulated + vidDuration) {
        return vid;
      }
      accumulated += vidDuration;
    }

    return activeList[0] || null;
  }, [homepageVideos, currentWallClock]);

  // =========================================================================
  // 3. Payment Transactions & Process Refund
  // =========================================================================
  const recordPaymentTransaction = useCallback((tx: PaymentTransaction) => {
    setPaymentTransactions((prev) => [tx, ...prev]);
    logActivity('Payment Recorded', 'Payments', `Recorded payment ${tx.id} for ₹${tx.amount}`);
  }, []);

  const processRefund = useCallback((transactionId: string, reason: string) => {
    let orderIdToRefund: string | undefined;

    setPaymentTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === transactionId) {
          orderIdToRefund = tx.orderId;
          return {
            ...tx,
            status: 'Refunded',
            refundStatus: 'Refunded',
          };
        }
        return tx;
      })
    );

    if (orderIdToRefund) {
      updateOrderStatus(orderIdToRefund, 'Refunded', `Refund processed for ${transactionId}: ${reason}`);
    }

    logActivity('Refund Processed', 'Payments', `Transaction ${transactionId} refunded. Reason: ${reason}`, 'warning');
  }, []);

  // =========================================================================
  // 4. Real-time Inventory & Stock Helpers
  // =========================================================================
  const getProductStock = useCallback((product: Product): number => {
    if (product.stock !== undefined) return Math.max(0, product.stock);
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((sum, v) => sum + Math.max(0, v.stock || 0), 0);
    }
    return 20;
  }, []);

  const checkAndTriggerRestockNotifications = useCallback((productId: string, restockedQty: number) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    setBackInStockSubscriptions((prev) => {
      const pendingForProduct = prev.filter((s) => s.productId === productId && s.status === 'pending');
      if (pendingForProduct.length === 0) return prev;

      const newLogs: StockNotificationLog[] = pendingForProduct.map((sub) => ({
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        subscriptionId: sub.id,
        customerEmail: sub.customerEmail,
        productId: targetProduct.id,
        productName: targetProduct.name,
        productImage: targetProduct.images[0] || '',
        restockedQuantity: restockedQty,
        sentAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        channel: 'Email',
        status: 'Delivered',
        subject: `Good news! ${targetProduct.name} is back in stock at AR VISION Eye Care!`,
      }));

      setStockNotificationLogs((logPrev) => [...newLogs, ...logPrev]);
      logActivity(
        'Back-in-Stock Notifications Sent',
        'Inventory',
        `Dispatched restock email alert to ${pendingForProduct.length} subscribed customer(s) for ${targetProduct.name}`,
        'success'
      );

      return prev.map((s) => (s.productId === productId ? { ...s, status: 'notified', notifiedAt: new Date().toISOString() } : s));
    });
  }, [products]);

  const adjustProductStock = useCallback((productId: string, variantId: string | undefined, delta: number, reason: string) => {
    let wasZero = false;
    let newQty = 0;
    let targetName = '';
    let targetSku = '';

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        targetName = prod.name;
        targetSku = prod.sku;
        const currentProdStock = prod.stock !== undefined ? prod.stock : prod.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
        wasZero = currentProdStock === 0;

        let updatedVariants = prod.variants;
        if (variantId) {
          updatedVariants = prod.variants.map((v) => {
            if (v.id === variantId) {
              const updatedVStock = Math.max(0, v.stock + delta);
              return { ...v, stock: updatedVStock };
            }
            return v;
          });
        }

        const calculatedNewStock = prod.stock !== undefined ? Math.max(0, prod.stock + delta) : updatedVariants.reduce((s, v) => s + (v.stock || 0), 0);
        newQty = calculatedNewStock;

        return {
          ...prod,
          stock: calculatedNewStock,
          variants: updatedVariants,
        };
      })
    );

    const newMovement: InventoryMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId,
      productName: targetName || 'Optical Product',
      sku: targetSku || 'LK-OPT',
      variantId,
      type: delta > 0 ? 'restock' : 'adjustment',
      quantityChange: delta,
      remainingStock: newQty,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      reason: reason || (delta > 0 ? `Stock replenishment (+${delta})` : `Manual inventory adjustment (${delta})`),
      performedBy: currentAdminUser.name,
    };
    setInventoryMovements((prev) => [newMovement, ...prev]);

    logActivity('Stock Adjusted', 'Inventory', `${targetName}: adjusted by ${delta > 0 ? '+' : ''}${delta}. New stock: ${newQty}`);

    if (wasZero && newQty > 0) {
      checkAndTriggerRestockNotifications(productId, newQty);
    }
  }, [currentAdminUser.name, checkAndTriggerRestockNotifications]);

  // =========================================================================
  // 5. Back-in-Stock Subscriptions
  // =========================================================================
  const subscribeBackInStock = useCallback((productId: string, customerEmail: string, variantId?: string) => {
    const trimmedEmail = customerEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const prod = products.find((p) => p.id === productId);
    if (!prod) {
      return { success: false, message: 'Product not found.' };
    }

    const existing = backInStockSubscriptions.find(
      (s) => s.productId === productId && s.customerEmail.toLowerCase() === trimmedEmail && s.status === 'pending'
    );
    if (existing) {
      return { success: true, message: 'You are already registered for restock updates for this frame.' };
    }

    const newSub: BackInStockSubscription = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId,
      productName: prod.name,
      productSku: prod.sku,
      productImage: prod.images[0] || '',
      variantId,
      customerEmail: trimmedEmail,
      subscribedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: 'pending',
    };

    setBackInStockSubscriptions((prev) => [newSub, ...prev]);
    logActivity('Restock Subscription', 'Customer Notifications', `Customer ${trimmedEmail} subscribed for restock alerts on ${prod.name}`);

    return { success: true, message: `Success! We'll email ${trimmedEmail} as soon as this item is restocked.` };
  }, [products, backInStockSubscriptions]);

  return (
    <StoreContext.Provider
      value={{
        products,
        heroSlides,
        festivalCampaigns,
        activeCampaign,
        homepageSections,
        stores,
        orders,
        appointments,
        htoAppointments,
        fieldExecutives,
        blockedSlots,
        bookHtoAppointment,
        updateHtoStatus,
        assignHtoExecutive,
        rescheduleHtoAppointment,
        sendHtoNotification,
        toggleBlockSlot,
        deleteHtoAppointment,
        wishlist,
        recentlyViewed,
        comparisonList,
        savedPrescriptions,
        banners,
        mediaAssets,
        adminUsers,
        currentAdminUser,
        activityLogs,
        coupons,
        categories,
        websiteSettings,
        activeView,
        setActiveView,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        theme,
        setTheme,
        toggleTheme,
        selectedProductForPDP,
        setSelectedProductForPDP,
        isLensCustomizerOpen,
        setIsLensCustomizerOpen,
        productForLensCustomizer,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        activeTrackingOrder,
        setActiveTrackingOrder,
        isStoreLocatorOpen,
        setIsStoreLocatorOpen,
        isPrescriptionVaultOpen,
        setIsPrescriptionVaultOpen,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isBookAppointmentOpen,
        setIsBookAppointmentOpen,
        selectedStoreForBooking,
        setSelectedStoreForBooking,
        isTryOnModalOpen,
        setIsTryOnModalOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isContactLensMenuOpen,
        setIsContactLensMenuOpen,
        isSunglassesMenuOpen,
        setIsSunglassesMenuOpen,
        isEyeglassesMenuOpen,
        setIsEyeglassesMenuOpen,
        isTryAtHomeMenuOpen,
        setIsTryAtHomeMenuOpen,
        selectedProductForTryOn,
        setSelectedProductForTryOn,
        openTryOn,
        designBoardInitialSlide,
        setDesignBoardInitialSlide,
        cart,
        appliedCoupon,
        cartSubtotal,
        cartDiscount,
        cartTax,
        cartShipping,
        cartTotal,
        bogoSavings,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        createOrder,
        updateOrderStatus,
        toggleWishlist,
        addToRecentlyViewed,
        toggleCompare,
        clearCompare,
        bookAppointment,
        openPDP,
        openLensCustomizer,
        jumpToDesignSlide,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        updateProductPrice,
        toggleProductPublish,
        updateStock,
        adjustStock,
        getUnitsSoldForProduct,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,
        toggleHeroSlide,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerActive,
        reorderBanners,
        promoBanners,
        addPromoBanner,
        updatePromoBanner,
        deletePromoBanner,
        duplicatePromoBanner,
        togglePromoBannerStatus,
        reorderPromoBanners,
        setFestivalCampaignActive,
        addFestivalCampaign,
        updateFestivalCampaign,
        toggleHomepageSection,
        reorderHomepageSections,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponActive,
        addMediaAsset,
        deleteMediaAsset,
        updateCategory,
        toggleCategoryActive,
        setCurrentAdminUser,
        addAdminUser,
        updateAdminUser,
        logActivity,
        updateWebsiteSettings,

        // Customer Auth & User Profile (Images 1, 2, 3)
        userProfile,
        isLoggedIn,
        login,
        signup,
        logout,
        updateUserProfile,
        claimGiftCard,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAccountMenuOpen,
        setIsAccountMenuOpen,
        activeAccountModal,
        setActiveAccountModal,

        // 1. Dynamic Advertisement Poster Management & Scheduler
        adPosters,
        activeScheduledPoster,
        addAdPoster,
        updateAdPoster,
        deleteAdPoster,

        // 2. Dynamic Homepage Hero Video Management & Scheduler
        homepageVideos,
        activeScheduledVideo,
        addHomepageVideo,
        updateHomepageVideo,
        deleteHomepageVideo,

        // 3. Online Payments & Transactions
        paymentTransactions,
        recordPaymentTransaction,
        processRefund,

        // 4. Real-time Inventory Movements & Stock Controls
        inventoryMovements,
        adjustProductStock,
        getProductStock,

        // 5. Out-of-Stock Email Notifications & Restock Alerts
        backInStockSubscriptions,
        subscribeBackInStock,
        stockNotificationLogs,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
