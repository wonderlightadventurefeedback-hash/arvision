import React, { createContext, useContext, useState, useEffect } from 'react';
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
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
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

  // 12. Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_orders') || localStorage.getItem('arvision_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed initial realistic order for demo tracking
    return [
      {
        id: 'ord-demo-1',
        orderNumber: 'WND-2026-8849',
        createdAt: '2026-10-30T14:32:00Z',
        customerName: 'Priya Sharma',
        customerEmail: 'priya.sharma@example.com',
        customerPhone: '+91 98765 43210',
        shippingAddress: {
          addressLine: 'Apt 402, Sea Green Heights, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
        },
        items: [
          {
            id: 'item-demo-1',
            product: INITIAL_PRODUCTS[0],
            selectedVariant: INITIAL_PRODUCTS[0].variants[0],
            quantity: 1,
            unitPrice: 2299,
            totalPrice: 2299,
            lensSelection: {
              visionType: 'single_vision',
              visionTypeName: 'Single Vision Distance',
              lensType: 'blue_shield',
              lensTypeName: 'AR Blue Shield Pro',
              lensIndex: '1.60_thin',
              lensIndexName: 'Thin 1.60 Hi-Index (+₹890)',
              price: 890,
              prescriptionDetails: {
                method: 'manual',
                odSph: '-1.50',
                odCyl: '-0.50',
                odAxis: '90',
                osSph: '-1.75',
                osCyl: '-0.25',
                osAxis: '85',
                pd: '63',
              },
            },
          },
        ],
        subtotal: 3189,
        discount: 400,
        tax: 502,
        shipping: 0,
        totalAmount: 3291,
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        orderStatus: 'Lens Preparation',
        statusHistory: [
          { status: 'Confirmed', timestamp: '30 Oct 2026, 02:32 PM', note: 'Payment verified via UPI' },
          { status: 'Prescription Review', timestamp: '30 Oct 2026, 04:15 PM', note: 'Prescription verified by Senior Optometrist' },
          { status: 'Processing', timestamp: '31 Oct 2026, 10:00 AM', note: 'Titanium frame picked from central inventory' },
          { status: 'Lens Preparation', timestamp: '01 Nov 2026, 09:30 AM', note: 'High-index 1.60 blue cut lenses precision edged on German CNC' },
        ],
        trackingNumber: 'BLUEDART-WND98234',
        prescriptionStatus: 'Verified',
      },
      {
        id: 'ord-demo-2',
        orderNumber: 'WND-2026-9214',
        createdAt: '2026-11-01T10:15:00Z',
        customerName: 'Rahul Kapoor',
        customerEmail: 'rahul.kapoor@example.com',
        customerPhone: '+91 98220 11223',
        shippingAddress: {
          addressLine: 'Villa 12, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
        },
        items: [
          {
            id: 'item-demo-2',
            product: INITIAL_PRODUCTS[1],
            selectedVariant: INITIAL_PRODUCTS[1].variants[0],
            quantity: 2,
            unitPrice: 1799,
            totalPrice: 3598,
          },
        ],
        subtotal: 3598,
        discount: 360,
        tax: 582,
        shipping: 0,
        totalAmount: 3820,
        paymentMethod: 'Card',
        paymentStatus: 'Paid',
        orderStatus: 'Dispatched',
        statusHistory: [
          { status: 'Confirmed', timestamp: '01 Nov 2026, 10:15 AM', note: 'Credit card payment confirmed' },
          { status: 'Processing', timestamp: '01 Nov 2026, 01:00 PM', note: 'Acetate frames packed in protective hardshell case' },
          { status: 'Dispatched', timestamp: '02 Nov 2026, 09:00 AM', note: 'Handed over to Express Courier (Delhivery AWB 892019)' },
        ],
        trackingNumber: 'DELHIVERY-WND34812',
        prescriptionStatus: 'Not Required',
      },
    ];
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
      const saved = localStorage.getItem('wonderlix_hto_appointments') || localStorage.getItem('arvision_hto_appointments');
      return saved ? JSON.parse(saved) : INITIAL_HTO_APPOINTMENTS;
    } catch {
      return INITIAL_HTO_APPOINTMENTS;
    }
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

  // View & UI Navigation States
  const [activeView, setActiveView] = useState<'storefront' | 'design-board' | 'admin-portal'>('storefront');
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

  // Customer User Profile & Auth (Images 1, 2, 3)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_user_profile') || localStorage.getItem('arvision_user_profile');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('wonderlix_is_logged_in');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState<boolean>(false);
  const [activeAccountModal, setActiveAccountModal] = useState<
    'claim-gift-card' | 'account-information' | 'orders' | 'prescription' | 'store-credit' | 'addresses' | '3d-models' | 'notifications' | null
  >(null);

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

  // Create Order with stock deduction & derived sales
  const createOrder = (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusHistory' | 'orderStatus' | 'prescriptionStatus'>): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderPayload,
      id: `ord-${Date.now()}`,
      orderNumber: `WND-2026-${randomNum}`,
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

    // Deduct stock from purchased product variants
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = orderPayload.items.find((i) => i.product.id === prod.id);
        if (!orderedItem) return prod;
        const updatedVariants = prod.variants.map((v) => {
          if (v.id === orderedItem.selectedVariant.id) {
            return { ...v, stock: Math.max(0, v.stock - orderedItem.quantity) };
          }
          return v;
        });
        return { ...prod, variants: updatedVariants };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    logActivity('Order Placed', 'Checkout', `Order #${newOrder.orderNumber} placed for ₹${newOrder.totalAmount}`);
    clearCart();
    setActiveTrackingOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
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
