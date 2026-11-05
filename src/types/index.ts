export type FrameShape = 'Aviator' | 'Round' | 'Rectangle' | 'Square' | 'Cat Eye' | 'Wayfarer' | 'Geometric' | 'Clubmaster' | 'Oval';
export type FrameMaterial = 'Titanium' | 'Acetate' | 'Ultem TR90' | 'Stainless Steel' | 'Polycarbonate' | 'Wood Finish';
export type Gender = 'Men' | 'Women' | 'Unisex' | 'Kids';
export type FrameSize = 'Narrow' | 'Medium' | 'Wide';
export type ProductCategory = 'Eyeglasses' | 'Sunglasses' | 'Computer Glasses' | 'Reading Glasses' | 'Kids Glasses' | 'Contact Lenses';

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  image: string;
  swatchImage?: string;
  modelImage?: string;
  stock: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory?: string;
  shape: FrameShape;
  material: FrameMaterial;
  gender: Gender;
  size: FrameSize;
  dimensions: {
    lensWidth: number; // in mm, e.g. 52
    bridgeWidth: number; // in mm, e.g. 18
    templeLength: number; // in mm, e.g. 142
  };
  weight: number; // grams, e.g. 16g
  originalPrice: number;
  sellingPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  isBogoEligible: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isPublished: boolean;
  description: string;
  features: string[];
  images: string[];
  variants: ProductVariant[];
  selectedVariantId?: string;
  frameColor: string;
  tags: string[];
}

export interface LensSelection {
  visionType: 'single_vision' | 'bifocal' | 'progressive' | 'zero_power';
  visionTypeName: string;
  lensType: 'blue_shield' | 'anti_reflective' | 'photochromic' | 'polarized';
  lensTypeName: string;
  lensIndex: '1.56_standard' | '1.60_thin' | '1.67_ultrathin';
  lensIndexName: string;
  price: number;
  prescriptionDetails?: {
    method: 'manual' | 'upload' | 'later';
    odSph?: string;
    odCyl?: string;
    odAxis?: string;
    odAdd?: string;
    osSph?: string;
    osCyl?: string;
    osAxis?: string;
    osAdd?: string;
    pd?: string;
    fileName?: string;
  };
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariant: ProductVariant;
  lensSelection?: LensSelection;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isBogoFreeItem?: boolean;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Confirmed'
  | 'Prescription Review'
  | 'Processing'
  | 'Lens Preparation'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  orderStatus: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  trackingNumber?: string;
  prescriptionStatus: 'Not Required' | 'Uploaded - Pending Review' | 'Verified' | 'Clarification Needed';
}

export interface FestivalCampaign {
  id: string;
  name: string;
  festival: 'Diwali' | 'Holi' | 'Dussehra' | 'Christmas' | 'New Year' | 'Valentine' | 'Summer Sale' | 'Independence Day' | 'Monsoon Flash';
  badgeText: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  mobileBannerImage: string;
  couponCode: string;
  discountPercent: number;
  bogoActive: boolean;
  startDate: string;
  endDate: string;
  isActive: boolean;
  themeColor: string;
  accentColor: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
  desktopImage: string;
  mobileImage: string;
  badge: string;
  bgColor: string;
  textColor: string;
  isActive: boolean;
  order: number;
}

export interface HomepageSection {
  id: string;
  name: string;
  type: 'announcement' | 'hero' | 'festival' | 'categories' | 'bogo_spotlight' | 'trending' | 'try_on_banner' | 'new_arrivals' | 'stores' | 'reviews' | 'bottom_promo';
  isEnabled: boolean;
  order: number;
}

export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  timing: string;
  services: string[];
  rating: number;
  mapCoordinates: { lat: number; lng: number };
}

export interface EyeTestAppointment {
  id: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  optometrist: string;
  testType: 'Comprehensive 12-Step Vision Test' | 'Contact Lens Fitting' | 'Computer Vision Screening' | 'Kids Eye Checkup';
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

// ==========================================
// AR-Vision Eyecare Home Try-On & Eye Test System
// ==========================================

export type HtoServiceType =
  | 'Home Eye Test'
  | 'Home Frame Trial'
  | 'Both – Eye Test + Frame Trial';

export type HtoAppointmentStatus =
  | 'New'
  | 'Pending'
  | 'Confirmed'
  | 'Executive Assigned'
  | 'Out for Visit'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected';

export type HtoTimeSlot =
  | '10 AM – 12 PM'
  | '12 PM – 2 PM'
  | '2 PM – 4 PM'
  | '4 PM – 6 PM'
  | '10 AM - 12 PM'
  | '12 PM - 2 PM'
  | '2 PM - 4 PM'
  | '4 PM - 6 PM';

export interface FieldExecutive {
  id: string;
  name: string;
  phone: string;
  role: 'Senior Optometrist' | 'Optometric Officer' | 'Home Trial Stylist' | 'Senior Optical Consultant';
  rating: number;
  completedVisits: number;
  avatar: string;
  vehicleNo?: string;
  city: string;
}

export interface HtoTimelineItem {
  id: string;
  status: HtoAppointmentStatus;
  timestamp: string;
  title: string;
  description: string;
  actor?: string;
}

export interface HtoNotification {
  id: string;
  channel: 'SMS' | 'WhatsApp' | 'Email';
  timestamp: string;
  recipient: string;
  message: string;
  status: 'Sent' | 'Delivered' | 'Read';
}

export interface HomeTryOnAppointment {
  id: string; // e.g. 'HTO-2026-89412'
  appointmentId: string; // Display Reference ID
  customerName: string;
  mobileNumber: string;
  email: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  age?: number;

  serviceType: HtoServiceType;

  // Location Details
  houseFlat: string;
  streetArea: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  completeAddress: string;

  // Schedule
  appointmentDate: string;
  timeSlot: HtoTimeSlot;
  alternativeDate?: string;
  numberOfPeople: number;

  // Frame Preferences
  framePreferences: string[];

  // Additional Information
  existingPower?: {
    rightEye?: { sph?: string; cyl?: string; axis?: string; add?: string };
    leftEye?: { sph?: string; cyl?: string; axis?: string; add?: string };
  };
  hasPrescriptionUpload?: boolean;
  prescriptionFile?: {
    name: string;
    url: string;
    size?: string;
    uploadDate?: string;
  };
  additionalRequirements?: string;
  specialInstructions?: string;

  // Status & Assignment
  status: HtoAppointmentStatus;
  assignedExecutive?: FieldExecutive;

  // Audit & Communication Log
  timeline: HtoTimelineItem[];
  notificationsSent: HtoNotification[];

  createdAt: string;
  updatedAt: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  date: string;
  headline: string;
  comment: string;
  verifiedPurchase: boolean;
  fitRating: 'Tight' | 'True to Size' | 'Loose';
}

export interface DesignSlide {
  slideNumber: number;
  id: string;
  category: 'Storefront & Hero' | 'Catalog & Discovery' | 'PDP & 360 Showcase' | '360° Inspection & Fit Guide' | 'Lens Customization' | 'Prescriptions' | 'Cart & Checkout' | 'Customer Account' | 'Enterprise Admin';
  title: string;
  screenCode: string;
  uxGoal: string;
  keyFeatures: string[];
  techStack: string[];
  responsiveBreakpoints: string;
  previewImage?: string;
  liveScreenTarget: string; // Action / view to launch
}

export type BannerSectionTarget = 'hero' | 'festival' | 'bogo_spotlight' | 'trending' | 'try_on_banner' | 'bottom_promo';

export type BannerTheme = 'black-gold' | 'black-purple' | 'black-cyan' | 'minimal' | 'custom';
export type BannerBorderStyle = 'gold-filigree' | 'neon-glow' | 'cyber-bracket' | 'subtle-border' | 'none';
export type BannerHeight = 'compact' | 'medium' | 'large';
export type BannerDisplayPosition = 'homepage_top' | 'below_hero' | 'mid_homepage' | 'above_catalog' | 'bottom_promo';

export interface PromoBanner {
  id: string;
  name: string; // Internal advertisement title
  adLabel: string; // e.g., 'AD', 'SPONSORED', 'EXCLUSIVE'
  theme: BannerTheme;
  productId?: string; // Linked product ID
  syncWithProduct: boolean;
  productName: string;
  productImage: string;
  productDescription: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  promotionalHeading: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgImage?: string;
  bgColor?: string;
  textColor?: string;
  borderStyle: BannerBorderStyle;
  hasGlowingLights: boolean; // Warm gold/festive fairy light bulbs
  hasLightingEffects: boolean; // Atmospheric purple and cyan lighting beams
  textPosition: 'left' | 'center' | 'right';
  productImagePosition: 'right' | 'left' | 'center';
  bannerHeight: BannerHeight;
  displayPosition: BannerDisplayPosition;
  priority: number;
  startDate: string;
  endDate: string;
  status: 'published' | 'draft';
  deviceVisibility: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
}

export interface HomepageBanner {
  id: string;
  title: string;
  mainHeading: string;
  subtitle: string;
  description: string;
  desktopImage: string;
  tabletImage?: string;
  mobileImage: string;
  ctaText: string;
  ctaUrl: string;
  startDate: string;
  endDate: string;
  priority: number;
  isActive: boolean;
  targetSection: BannerSectionTarget;
  badge?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  sizeKb: number;
  dimensions: string;
  category: 'Frames' | 'Banners' | 'Models' | 'Lenses' | 'General';
  uploadedAt: string;
  inUseBy?: string[];
}

export type AdminRole = 'Super Admin' | 'Product Manager' | 'Marketing Manager' | 'Inventory Manager';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  status: 'success' | 'warning' | 'info';
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validTill: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  applicableCategories: string[];
}

export interface CategoryDetail {
  id: string;
  name: ProductCategory;
  slug: string;
  description: string;
  image: string;
  badgeText: string;
  displayOrder: number;
  isActive: boolean;
}

export interface WebsiteSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  currencySymbol: string;
  taxRatePercent: number;
  freeShippingThreshold: number;
  lowStockThreshold: number;
  heroAutoSlideDurationSeconds: number;
  maintenanceMode: boolean;
  instantSyncEnabled: boolean;
}

export interface UserAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other' | 'Office';
  firstName?: string;
  lastName?: string;
  gender?: 'Male' | 'Female' | 'Prefer not to say';
  name: string;
  phone: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault: boolean;
}

export interface GiftCardClaimRecord {
  id: string;
  code: string;
  pin: string;
  amount: number;
  claimedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  isPhoneVerified: boolean;
  email: string;
  isEmailVerified: boolean;
  birthday: string;
  gender: 'Male' | 'Female' | 'Other';
  avatar: string;
  storeCredit: number;
  giftCardsClaimed: GiftCardClaimRecord[];
  addresses: UserAddress[];
  saved3dModels: {
    id: string;
    name: string;
    date: string;
    faceShape: string;
    previewUrl: string;
  }[];
  notificationPreferences: {
    whatsappOrderUpdates: boolean;
    whatsappPromotions: boolean;
    smsAlerts: boolean;
    emailNewsletters: boolean;
  };
}

