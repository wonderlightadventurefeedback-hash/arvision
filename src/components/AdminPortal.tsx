import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Product,
  ProductVariant,
  HeroSlide,
  OrderStatus,
  FestivalCampaign,
  HomepageBanner,
  MediaAsset,
  Coupon,
  CategoryDetail,
  AdminRole,
  AdminUser,
  PromoBanner,
} from '../types';
import { AdminCameraCapture } from './admin/AdminCameraCapture';
import { WebsitePreviewModal } from './admin/WebsitePreviewModal';
import { PromoBannerEditorModal } from './admin/PromoBannerEditorModal';
import { AppointmentManagementDashboard } from './admin/AppointmentManagementDashboard';
import { AdPosterManager } from './admin/AdPosterManager';
import { HomepageVideoManager } from './admin/HomepageVideoManager';
import { PaymentsManager } from './admin/PaymentsManager';
import { InventoryDesk } from './admin/InventoryDesk';
import { OrdersManager } from './admin/OrdersManager';
import { ErrorBoundary } from './ErrorBoundary';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Flame,
  Tag,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Search,
  Camera,
  Upload,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  Sparkles,
  Calendar,
  Clock,
  ChevronRight,
  ChevronDown,
  Filter,
  RefreshCw,
  Sliders,
  Check,
  X,
  ExternalLink,
  ChevronLeft,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  Percent,
  FolderOpen,
  Info,
  Monitor,
  Tablet,
  Smartphone,
  Film,
  CreditCard,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    updateProductPrice,
    toggleProductPublish,
    updateStock,
    adjustStock,
    getUnitsSoldForProduct,
    heroSlides,
    updateHeroSlide,
    addHeroSlide,
    deleteHeroSlide,
    toggleHeroSlide,
    banners,
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
    festivalCampaigns,
    setFestivalCampaignActive,
    addFestivalCampaign,
    updateFestivalCampaign,
    homepageSections,
    toggleHomepageSection,
    reorderHomepageSections,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponActive,
    mediaAssets,
    addMediaAsset,
    deleteMediaAsset,
    categories,
    updateCategory,
    toggleCategoryActive,
    adminUsers,
    currentAdminUser,
    setCurrentAdminUser,
    addAdminUser,
    updateAdminUser,
    activityLogs,
    websiteSettings,
    updateWebsiteSettings,
    orders,
    updateOrderStatus,
    htoAppointments,
    setActiveView,
    openPDP,
  } = useStore();

  type AdminTabType =
    | 'dashboard'
    | 'products'
    | 'categories'
    | 'inventory'
    | 'orders'
    | 'payments'
    | 'posters'
    | 'videos'
    | 'appointments'
    | 'customers'
    | 'banners'
    | 'promotions'
    | 'content'
    | 'media'
    | 'analytics'
    | 'users'
    | 'settings';

  const getInitialAdminTab = (): AdminTabType => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab')?.toLowerCase() as AdminTabType;
      const validTabs: AdminTabType[] = [
        'dashboard',
        'products',
        'categories',
        'inventory',
        'orders',
        'payments',
        'posters',
        'videos',
        'appointments',
        'customers',
        'banners',
        'promotions',
        'content',
        'media',
        'analytics',
        'users',
        'settings',
      ];
      if (tabParam && validTabs.includes(tabParam)) {
        return tabParam;
      }
    }
    return 'dashboard';
  };

  // Navigation State - 14 distinct modules
  const [activeTab, setActiveTabState] = useState<AdminTabType>(getInitialAdminTab);

  const setActiveTab = (tab: AdminTabType) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const url = tab === 'dashboard' ? '/admin' : `/admin?tab=${tab}`;
      window.history.replaceState({ tab }, '', url);
    }
  };

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState('All');
  const [mediaSearch, setMediaSearch] = useState('');

  // Modals & Overlays
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCameraCaptureOpen, setIsCameraCaptureOpen] = useState(false);
  const [cameraCaptureTarget, setCameraCaptureTarget] = useState<'product' | 'banner' | 'media' | 'promobanner'>('product');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HomepageBanner | null>(null);
  const [isPromoEditorOpen, setIsPromoEditorOpen] = useState(false);
  const [editingPromoBanner, setEditingPromoBanner] = useState<PromoBanner | null>(null);
  const [capturedCameraPromoImage, setCapturedCameraPromoImage] = useState<string>('');
  const [bannerManagerTab, setBannerManagerTab] = useState<'promotional' | 'posters'>('promotional');
  const [promoFilterStatus, setPromoFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ type: 'product' | 'banner' | 'coupon' | 'media' | 'promobanner'; id: string; name: string } | null>(null);

  // Quick inline price editing state
  const [quickPriceId, setQuickPriceId] = useState<string | null>(null);
  const [tempOrigPrice, setTempOrigPrice] = useState<number>(0);
  const [tempSellPrice, setTempSellPrice] = useState<number>(0);

  // Product Form State
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormSku, setProdFormSku] = useState('');
  const [prodFormCategory, setProdFormCategory] = useState<any>('Eyeglasses');
  const [prodFormBrand, setProdFormBrand] = useState('Wonderlix AI Vision');
  const [prodFormDesc, setProdFormDesc] = useState('');
  const [prodFormOrigPrice, setProdFormOrigPrice] = useState(2999);
  const [prodFormSellPrice, setProdFormSellPrice] = useState(1999);
  const [prodFormStock, setProdFormStock] = useState(50);
  const [prodFormStatus, setProdFormStatus] = useState<boolean>(true);
  const [prodFormShape, setProdFormShape] = useState<any>('Rectangle');
  const [prodFormMaterial, setProdFormMaterial] = useState<any>('Titanium');
  const [prodFormGender, setProdFormGender] = useState<any>('Unisex');
  const [prodFormSize, setProdFormSize] = useState<any>('Medium');
  const [prodFormLensWidth, setProdFormLensWidth] = useState(52);
  const [prodFormBridge, setProdFormBridge] = useState(18);
  const [prodFormTemple, setProdFormTemple] = useState(142);
  const [prodFormWeight, setProdFormWeight] = useState(16);
  const [prodFormImages, setProdFormImages] = useState<string[]>([]);
  const [prodFormTags, setProdFormTags] = useState<string>('BOGO Eligible, Titanium, New Arrival');
  const [prodFormIsBogo, setProdFormIsBogo] = useState(true);
  const [prodFormIsFeatured, setProdFormIsFeatured] = useState(false);
  const [prodFormIsBestSeller, setProdFormIsBestSeller] = useState(false);
  const [prodFormIsNewArrival, setProdFormIsNewArrival] = useState(true);

  // Banner Form State
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerHeading, setBannerHeading] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerDesktopImg, setBannerDesktopImg] = useState('');
  const [bannerTabletImg, setBannerTabletImg] = useState('');
  const [bannerMobileImg, setBannerMobileImg] = useState('');
  const [bannerCtaText, setBannerCtaText] = useState('Explore Collection');
  const [bannerCtaUrl, setBannerCtaUrl] = useState('Eyeglasses');
  const [bannerStartDate, setBannerStartDate] = useState('2026-01-01');
  const [bannerEndDate, setBannerEndDate] = useState('2027-12-31');
  const [bannerPriority, setBannerPriority] = useState(1);
  const [bannerStatus, setBannerStatus] = useState(true);
  const [bannerTarget, setBannerTarget] = useState<any>('hero');
  const [bannerBadge, setBannerBadge] = useState('SPECIAL PROMO');

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponTitle, setCouponTitle] = useState('');
  const [couponPercent, setCouponPercent] = useState(20);
  const [couponMinOrder, setCouponMinOrder] = useState(999);
  const [couponValidTill, setCouponValidTill] = useState('2026-12-31');
  const [couponLimit, setCouponLimit] = useState(1000);

  // Admin User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminRole>('Product Manager');

  // KPI Calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => (o.orderStatus !== 'Cancelled' ? sum + o.totalAmount : sum), 0) + 148500;
  }, [orders]);

  const totalUnitsSold = useMemo(() => {
    return orders.reduce((sum, o) => {
      if (o.orderStatus === 'Cancelled') return sum;
      return sum + o.items.reduce((s, i) => s + i.quantity, 0);
    }, 0) + 215;
  }, [orders]);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isPublished).length;
  const outOfStockProducts = products.filter((p) => p.variants.reduce((s, v) => s + v.stock, 0) === 0).length;
  const lowStockCount = products.filter((p) => p.variants.some((v) => v.stock > 0 && v.stock < (websiteSettings?.lowStockThreshold ?? 15))).length;
  const activeBannersCount = banners.filter((b) => b.isActive).length;
  const activeDiscountsCount = coupons.filter((c) => c.isActive).length;

  // Auto calculated discount % for product form
  const formDiscountPct = useMemo(() => {
    if (prodFormOrigPrice <= 0) return 0;
    return Math.max(0, Math.round(((prodFormOrigPrice - prodFormSellPrice) / prodFormOrigPrice) * 100));
  }, [prodFormOrigPrice, prodFormSellPrice]);

  // Open Product Modal (Add / Edit)
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdFormName('');
    setProdFormSku(`WND-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    setProdFormCategory('Eyeglasses');
    setProdFormBrand('Wonderlix AI Vision');
    setProdFormDesc('Precision optical eyewear crafted with featherweight ergonomics and blue-cut clarity.');
    setProdFormOrigPrice(2999);
    setProdFormSellPrice(1999);
    setProdFormStock(45);
    setProdFormStatus(true);
    setProdFormShape('Rectangle');
    setProdFormMaterial('Titanium');
    setProdFormGender('Unisex');
    setProdFormSize('Medium');
    setProdFormLensWidth(52);
    setProdFormBridge(18);
    setProdFormTemple(142);
    setProdFormWeight(15);
    setProdFormImages([
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80',
    ]);
    setProdFormTags('BOGO Eligible, Titanium, New Arrival');
    setProdFormIsBogo(true);
    setProdFormIsFeatured(false);
    setProdFormIsBestSeller(false);
    setProdFormIsNewArrival(true);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdFormName(prod.name);
    setProdFormSku(prod.sku);
    setProdFormCategory(prod.category);
    setProdFormBrand(prod.brand);
    setProdFormDesc(prod.description);
    setProdFormOrigPrice(prod.originalPrice);
    setProdFormSellPrice(prod.sellingPrice);
    setProdFormStock(prod.variants.reduce((s, v) => s + v.stock, 0));
    setProdFormStatus(prod.isPublished);
    setProdFormShape(prod.shape);
    setProdFormMaterial(prod.material);
    setProdFormGender(prod.gender);
    setProdFormSize(prod.size);
    setProdFormLensWidth(prod.dimensions.lensWidth);
    setProdFormBridge(prod.dimensions.bridgeWidth);
    setProdFormTemple(prod.dimensions.templeLength);
    setProdFormWeight(prod.weight);
    setProdFormImages(prod.images);
    setProdFormTags(prod.tags.join(', '));
    setProdFormIsBogo(prod.isBogoEligible);
    setProdFormIsFeatured(prod.isFeatured ?? false);
    setProdFormIsBestSeller(prod.isBestSeller ?? false);
    setProdFormIsNewArrival(prod.isNewArrival ?? false);
    setIsProductModalOpen(true);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = prodFormTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: prodFormName,
        sku: prodFormSku,
        category: prodFormCategory,
        brand: prodFormBrand,
        description: prodFormDesc,
        originalPrice: prodFormOrigPrice,
        sellingPrice: prodFormSellPrice,
        discountPercentage: formDiscountPct,
        isPublished: prodFormStatus,
        shape: prodFormShape,
        material: prodFormMaterial,
        gender: prodFormGender,
        size: prodFormSize,
        dimensions: {
          lensWidth: prodFormLensWidth,
          bridgeWidth: prodFormBridge,
          templeLength: prodFormTemple,
        },
        weight: prodFormWeight,
        images: prodFormImages.length > 0 ? prodFormImages : editingProduct.images,
        tags: tagsArray,
        isBogoEligible: prodFormIsBogo,
        isFeatured: prodFormIsFeatured,
        isBestSeller: prodFormIsBestSeller,
        isNewArrival: prodFormIsNewArrival,
        variants: editingProduct.variants.map((v, i) =>
          i === 0 ? { ...v, stock: prodFormStock, image: prodFormImages[0] || v.image } : v
        ),
      };
      updateProduct(updated);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: prodFormName,
        sku: prodFormSku,
        category: prodFormCategory,
        brand: prodFormBrand,
        description: prodFormDesc,
        originalPrice: prodFormOrigPrice,
        sellingPrice: prodFormSellPrice,
        discountPercentage: formDiscountPct,
        rating: 5.0,
        reviewCount: 0,
        isPublished: prodFormStatus,
        shape: prodFormShape,
        material: prodFormMaterial,
        gender: prodFormGender,
        size: prodFormSize,
        dimensions: {
          lensWidth: prodFormLensWidth,
          bridgeWidth: prodFormBridge,
          templeLength: prodFormTemple,
        },
        weight: prodFormWeight,
        images:
          prodFormImages.length > 0
            ? prodFormImages
            : ['https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80'],
        features: ['Precision Frame', 'Zero Glare Optic', '1-Year Warranty'],
        tags: tagsArray,
        isBogoEligible: prodFormIsBogo,
        isFeatured: prodFormIsFeatured,
        isBestSeller: prodFormIsBestSeller,
        isNewArrival: prodFormIsNewArrival,
        frameColor: 'Matte Jet Black',
        variants: [
          {
            id: `v-${Date.now()}-1`,
            colorName: 'Matte Jet Black',
            colorHex: '#0f172a',
            image:
              prodFormImages[0] ||
              'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80',
            stock: prodFormStock,
          },
        ],
      };
      addProduct(newProd);
    }
    setIsProductModalOpen(false);
  };

  // Open Banner Modal
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerTitle('');
    setBannerHeading('');
    setBannerSubtitle('');
    setBannerDesc('');
    setBannerDesktopImg('https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=80');
    setBannerTabletImg('https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1024&q=80');
    setBannerMobileImg('https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80');
    setBannerCtaText('Explore Collection');
    setBannerCtaUrl('Eyeglasses');
    setBannerStartDate('2026-01-01');
    setBannerEndDate('2027-12-31');
    setBannerPriority(banners.length + 1);
    setBannerStatus(true);
    setBannerTarget('hero');
    setBannerBadge('SPECIAL PROMO');
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (ban: HomepageBanner) => {
    setEditingBanner(ban);
    setBannerTitle(ban.title);
    setBannerHeading(ban.mainHeading);
    setBannerSubtitle(ban.subtitle);
    setBannerDesc(ban.description);
    setBannerDesktopImg(ban.desktopImage);
    setBannerTabletImg(ban.tabletImage || ban.desktopImage);
    setBannerMobileImg(ban.mobileImage);
    setBannerCtaText(ban.ctaText);
    setBannerCtaUrl(ban.ctaUrl);
    setBannerStartDate(ban.startDate);
    setBannerEndDate(ban.endDate);
    setBannerPriority(ban.priority);
    setBannerStatus(ban.isActive);
    setBannerTarget(ban.targetSection);
    setBannerBadge(ban.badge || 'PROMO');
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      updateBanner({
        ...editingBanner,
        title: bannerTitle,
        mainHeading: bannerHeading,
        subtitle: bannerSubtitle,
        description: bannerDesc,
        desktopImage: bannerDesktopImg,
        tabletImage: bannerTabletImg,
        mobileImage: bannerMobileImg,
        ctaText: bannerCtaText,
        ctaUrl: bannerCtaUrl,
        startDate: bannerStartDate,
        endDate: bannerEndDate,
        priority: bannerPriority,
        isActive: bannerStatus,
        targetSection: bannerTarget,
        badge: bannerBadge,
      });
    } else {
      const newBan: HomepageBanner = {
        id: `ban-${Date.now()}`,
        title: bannerTitle,
        mainHeading: bannerHeading,
        subtitle: bannerSubtitle,
        description: bannerDesc,
        desktopImage: bannerDesktopImg,
        tabletImage: bannerTabletImg,
        mobileImage: bannerMobileImg,
        ctaText: bannerCtaText,
        ctaUrl: bannerCtaUrl,
        startDate: bannerStartDate,
        endDate: bannerEndDate,
        priority: bannerPriority,
        isActive: bannerStatus,
        targetSection: bannerTarget,
        badge: bannerBadge,
      };
      addBanner(newBan);
    }
    setIsBannerModalOpen(false);
  };

  // Open Coupon Modal
  const handleOpenAddCoupon = () => {
    setEditingCoupon(null);
    setCouponCode(`SAVE${Math.floor(10 + Math.random() * 80)}`);
    setCouponTitle('Special Optical Offer');
    setCouponPercent(25);
    setCouponMinOrder(1499);
    setCouponValidTill('2026-12-31');
    setCouponLimit(1000);
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoupon) {
      updateCoupon({
        ...editingCoupon,
        code: couponCode.toUpperCase().trim(),
        title: couponTitle,
        discountPercent: couponPercent,
        minOrderAmount: couponMinOrder,
        validTill: couponValidTill,
        usageLimit: couponLimit,
      });
    } else {
      const newC: Coupon = {
        id: `c-${Date.now()}`,
        code: couponCode.toUpperCase().trim(),
        title: couponTitle,
        discountPercent: couponPercent,
        minOrderAmount: couponMinOrder,
        validTill: couponValidTill,
        usageLimit: couponLimit,
        usageCount: 0,
        isActive: true,
        applicableCategories: ['All'],
      };
      addCoupon(newC);
    }
    setIsCouponModalOpen(false);
  };

  // Open Add Admin User Modal
  const handleSaveAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const newUser: AdminUser = {
      id: `adm-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: 'Active',
      lastActive: 'Just added',
    };
    addAdminUser(newUser);
    setNewUserName('');
    setNewUserEmail('');
    setIsAddUserModalOpen(false);
  };

  // Handle Photo capture callback from camera or file
  const handlePhotoCaptured = (imageDataUrl: string) => {
    if (cameraCaptureTarget === 'product') {
      setProdFormImages((prev) => [imageDataUrl, ...prev]);
    } else if (cameraCaptureTarget === 'banner') {
      setBannerDesktopImg(imageDataUrl);
      setBannerMobileImg(imageDataUrl);
    } else if (cameraCaptureTarget === 'promobanner') {
      setCapturedCameraPromoImage(imageDataUrl);
    } else if (cameraCaptureTarget === 'media') {
      const newMedia: MediaAsset = {
        id: `media-${Date.now()}`,
        name: `camera-capture-${Date.now()}.jpg`,
        url: imageDataUrl,
        sizeKb: Math.round(imageDataUrl.length / 1024),
        dimensions: '1280x720',
        category: 'Frames',
        uploadedAt: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        inUseBy: [],
      };
      addMediaAsset(newMedia);
    }
  };

  // Quick Price Edit Save
  const handleSaveQuickPrice = (productId: string) => {
    updateProductPrice(productId, tempOrigPrice, tempSellPrice);
    setQuickPriceId(null);
  };

  // Confirm delete handler
  const handleExecuteDelete = () => {
    if (!deleteConfirmTarget) return;
    const { type, id } = deleteConfirmTarget;

    if (type === 'product') {
      deleteProduct(id);
    } else if (type === 'banner') {
      deleteBanner(id);
    } else if (type === 'promobanner') {
      deletePromoBanner(id);
    } else if (type === 'coupon') {
      deleteCoupon(id);
    } else if (type === 'media') {
      const res = deleteMediaAsset(id);
      if (!res.success) {
        alert(res.message);
      }
    }
    setDeleteConfirmTarget(null);
  };

  // Reorder promo banners helper
  const handleMovePromoBanner = (id: string, direction: 'up' | 'down') => {
    const idx = promoBanners.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= promoBanners.length) return;
    const reordered = [...promoBanners];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, moved);
    const updated = reordered.map((b, i) => ({ ...b, priority: i + 1 }));
    reorderPromoBanners(updated);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Media
  const filteredMedia = useMemo(() => {
    return mediaAssets.filter((m) => {
      const matchesCat = mediaCategoryFilter === 'All' || m.category === mediaCategoryFilter;
      const matchesSearch = m.name.toLowerCase().includes(mediaSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [mediaAssets, mediaCategoryFilter, mediaSearch]);

  // Best Selling Products sorted by derived units sold
  const bestSellers = useMemo(() => {
    return [...products]
      .map((p) => ({
        ...p,
        calculatedUnitsSold: getUnitsSoldForProduct(p.id),
      }))
      .sort((a, b) => b.calculatedUnitsSold - a.calculatedUnitsSold)
      .slice(0, 5);
  }, [products, orders]);

  const pendingAppointmentsCount = useMemo(() => {
    return (htoAppointments || []).filter((a) => a.status === 'New' || a.status === 'Pending').length;
  }, [htoAppointments]);

  // Navigation Sidebar Items
  const navItems = [
    { id: 'dashboard', label: '1. Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: '2. Product Management', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: '3. Categories & Taxonomy', icon: <Layers className="w-4 h-4" /> },
    { id: 'inventory', label: '4. Stock & Inventory Desk', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'orders', label: '5. Order Fulfillment Hub', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'payments', label: '6. Payments & Transactions', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'posters', label: '7. Advertisement Poster Manager', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'videos', label: '8. Homepage Video Manager', icon: <Film className="w-4 h-4" /> },
    { id: 'appointments', label: '9. Home Try-On Appointments', icon: <Calendar className="w-4 h-4" />, badge: pendingAppointmentsCount },
    { id: 'customers', label: '10. Customer Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'banners', label: '11. Homepage Hero Banner Customizer', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'promotions', label: '12. Promotions & Coupons', icon: <Flame className="w-4 h-4" /> },
    { id: 'content', label: '13. Website Content & Layout', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'media', label: '14. Media Library & Camera', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'analytics', label: '15. Analytics & Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'users', label: '16. Admin Users & Security', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'settings', label: '17. Store Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070710] text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Top Futuristic Header */}
      <header className="h-16 bg-[#0B0B18]/90 border-b border-purple-500/20 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <div className="w-full h-full bg-[#070710] rounded-[10px] flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-wider font-heading bg-gradient-to-r from-white via-slate-200 to-purple-200 bg-clip-text text-transparent">
                WONDERLIX
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                AI OPERATIONS SUITE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Integrated Product Catalog, Pricing, Advertisements & Website Controller
            </p>
          </div>
        </div>

        {/* Top Actions & Role Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Preview Button */}
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.2)] cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Preview Website</span>
          </button>

          {/* Return to Customer Storefront */}
          <button
            onClick={() => setActiveView('storefront')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Customer Store</span>
          </button>

          {/* Active Admin User Switcher */}
          <div className="flex items-center gap-2 bg-[#0E0E22] border border-purple-500/20 px-2.5 py-1 rounded-xl">
            <img
              src={currentAdminUser.avatar}
              alt={currentAdminUser.name}
              className="w-7 h-7 rounded-lg object-cover border border-purple-500/40"
            />
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-white truncate max-w-[120px]">
                {currentAdminUser.name}
              </div>
              <div className="text-[10px] text-cyan-400 font-medium">
                {currentAdminUser.role}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left 14-Item Futuristic Sidebar */}
        <aside className="w-64 bg-[#090915] border-r border-purple-500/20 p-3 space-y-1 shrink-0 overflow-y-auto hidden md:block select-none">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>Control Modules</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className={isActive ? 'text-cyan-300' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Module 14: Logout / Exit */}
          <div className="pt-4 border-t border-purple-500/10">
            <button
              onClick={() => setActiveView('storefront')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>14. Exit to Storefront</span>
            </button>
          </div>
        </aside>

        {/* Center Main Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-b from-[#070710] via-[#0A0A17] to-[#070710]">
          <ErrorBoundary fallbackTitle="Admin Section Error">
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-cyan-950/40 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black font-heading text-white">
                      Executive Operations & Analytics
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Real-time synchronization active. Catalog updates, pricing rules and advertisements reflect immediately on the customer-facing website.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.35)] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                  <button
                    onClick={handleOpenAddBanner}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/30 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>New Banner</span>
                  </button>
                </div>
              </div>

              {/* 8 Primary KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#0D0D1F] border border-purple-500/20 hover:border-purple-500/40 transition shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-heading">
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                    <TrendingUp className="w-3 h-3" /> +18.4% vs last month
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0D0D1F] border border-purple-500/20 hover:border-purple-500/40 transition shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-heading">
                    {orders.length + 84}
                  </div>
                  <div className="text-[10px] text-cyan-300 mt-1 font-semibold">
                    {orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length} in active pipeline
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0D0D1F] border border-purple-500/20 hover:border-purple-500/40 transition shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Units Sold</span>
                    <Package className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-heading">
                    {totalUnitsSold.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Derived from qualifying orders
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0D0D1F] border border-purple-500/20 hover:border-purple-500/40 transition shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Active Products</span>
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-heading">
                    {activeProducts} <span className="text-xs text-slate-400 font-normal">/ {totalProducts}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">
                    {outOfStockProducts > 0 ? `${outOfStockProducts} Out of stock` : 'All items in stock'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0D0D1F] border border-purple-500/20 hover:border-purple-500/40 transition shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Low Stock Alert</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-heading">
                    {lowStockCount}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Below {websiteSettings?.lowStockThreshold ?? 15} units threshold
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0D0D1F] border border-purple-500/20 hover:border-purple-500/40 transition shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Homepage Banners</span>
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-heading">
                    {activeBannersCount}
                  </div>
                  <div className="text-[10px] text-cyan-300 mt-1">
                    Active across 6 storefront blocks
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0D0D1F] border border-purple-500/20 hover:border-purple-500/40 transition shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Active Coupons</span>
                    <Tag className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-heading">
                    {activeDiscountsCount}
                  </div>
                  <div className="text-[10px] text-pink-300 mt-1">
                    Up to 50% promotional codes
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('appointments')}
                  className="p-4 rounded-xl bg-[#0D0D1F] border border-purple-500/20 hover:border-cyan-500/50 transition shadow-lg cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span className="group-hover:text-cyan-300 transition">HTO & Eye Test</span>
                    <Calendar className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-heading">
                    {htoAppointments?.length || 6}
                  </div>
                  <div className="text-[10px] text-amber-300 mt-1 flex items-center justify-between font-semibold">
                    <span>{pendingAppointmentsCount} pending / new</span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition">Manage →</span>
                  </div>
                </div>
              </div>

              {/* Interactive Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend SVG Chart */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-cyan-400" />
                        Sales & Revenue Trajectory (7-Day Trend)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Daily GMV and volume recorded through checkout orders
                      </p>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
                      +24% Weekly Growth
                    </span>
                  </div>

                  {/* High fidelity SVG Bar/Line visualization */}
                  <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 px-2 select-none">
                    {[
                      { day: 'Mon', rev: '₹18,400', height: '45%', orders: 12 },
                      { day: 'Tue', rev: '₹24,900', height: '62%', orders: 18 },
                      { day: 'Wed', rev: '₹21,200', height: '54%', orders: 15 },
                      { day: 'Thu', rev: '₹31,800', height: '78%', orders: 22 },
                      { day: 'Fri', rev: '₹38,500', height: '92%', orders: 28 },
                      { day: 'Sat', rev: '₹42,100', height: '100%', orders: 34 },
                      { day: 'Sun', rev: '₹36,400', height: '88%', orders: 29 },
                    ].map((col, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="text-[10px] font-bold text-cyan-300 opacity-0 group-hover:opacity-100 transition">
                          {col.rev}
                        </div>
                        <div
                          style={{ height: col.height }}
                          className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 via-indigo-600 to-cyan-400 group-hover:from-purple-500 group-hover:to-cyan-300 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] relative"
                        >
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                        </div>
                        <div className="text-[11px] text-slate-400 font-semibold">{col.day}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Sales Distribution */}
                <div className="p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-4 shadow-xl">
                  <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Sales by Category Split
                  </h4>
                  <div className="space-y-3 pt-2">
                    {[
                      { name: 'Eyeglasses (Titanium/Acetate)', pct: 45, color: 'from-purple-600 to-indigo-600' },
                      { name: 'Computer Glasses (Blue Cut)', pct: 28, color: 'from-cyan-500 to-blue-500' },
                      { name: 'Sunglasses (Polarized HD)', pct: 18, color: 'from-amber-500 to-orange-500' },
                      { name: 'Reading & Contact Lenses', pct: 9, color: 'from-emerald-500 to-teal-500' },
                    ].map((cat, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-300 font-medium">
                          <span>{cat.name}</span>
                          <span className="font-bold text-white">{cat.pct}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            style={{ width: `${cat.pct}%` }}
                            className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
                    Calculated from all verified orders
                  </div>
                </div>
              </div>

              {/* Dual Table: Best Selling Products & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best Sellers */}
                <div className="p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      Top Performing Frames (Units Sold)
                    </h4>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs text-cyan-400 hover:underline font-semibold"
                    >
                      Manage Catalog →
                    </button>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {bestSellers.map((prod, index) => {
                      const totalStock = prod.variants.reduce((s, v) => s + v.stock, 0);
                      return (
                        <div
                          key={prod.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 text-center text-xs font-bold text-purple-400">
                              #{index + 1}
                            </span>
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover border border-white/10"
                            />
                            <div>
                              <div className="text-xs font-bold text-white line-clamp-1">
                                {prod.name}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {prod.category} • ₹{prod.sellingPrice}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-xs font-extrabold border border-purple-500/30">
                              {prod.calculatedUnitsSold} sold
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {totalStock} in stock
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Live Order Pipeline
                    </h4>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-cyan-400 hover:underline font-semibold"
                    >
                      All Orders ({orders.length}) →
                    </button>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {orders.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-cyan-300 font-mono">
                              #{order.orderNumber}
                            </span>
                            <span className="text-xs font-semibold text-white">
                              {order.customerName}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {order.items.length} item(s) • ₹{order.totalAmount.toLocaleString()} via {order.paymentMethod}
                          </div>
                        </div>

                        <div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audit Activity Logs */}
              <div className="p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Security & Activity Audit Logs (Last Actions)
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">Immutable Log</span>
                </div>
                <div className="space-y-2 pt-1">
                  {activityLogs.slice(0, 4).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-500">{log.timestamp}</span>
                        <div>
                          <span className="font-bold text-white">{log.action}</span>
                          <span className="text-slate-400 ml-2">by {log.userName} ({log.userRole})</span>
                          <div className="text-[11px] text-slate-400">{log.details}</div>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {log.module}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Header & Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Product Catalog CRUD & Pricing Controller
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add, edit, delete, publish, and manage images & inventory directly to the live customer storefront.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.35)] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Search & Category Filter Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0B18] p-3 rounded-xl border border-purple-500/20 text-xs">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by product name, SKU, or brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Category:</span>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Eyeglasses">Eyeglasses</option>
                    <option value="Sunglasses">Sunglasses</option>
                    <option value="Computer Glasses">Computer Glasses</option>
                    <option value="Reading Glasses">Reading Glasses</option>
                    <option value="Kids Glasses">Kids Glasses</option>
                    <option value="Contact Lenses">Contact Lenses</option>
                  </select>
                </div>
              </div>

              {/* Products Data Table */}
              <div className="rounded-2xl border border-purple-500/20 overflow-hidden bg-[#0B0B18] shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0E0E24] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-purple-500/20">
                      <tr>
                        <th className="px-4 py-3.5">Product</th>
                        <th className="px-4 py-3.5">Category & SKU</th>
                        <th className="px-4 py-3.5">Pricing & Discount</th>
                        <th className="px-4 py-3.5">Stock & Sold</th>
                        <th className="px-4 py-3.5">Website Status</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProducts.map((product) => {
                        const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
                        const unitsSold = getUnitsSoldForProduct(product.id);
                        const isEditingThisPrice = quickPriceId === product.id;

                        return (
                          <tr key={product.id} className="hover:bg-white/[0.02] transition">
                            {/* Product Info with Image */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-purple-500/30 bg-black shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-white text-xs line-clamp-1">
                                    {product.name}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    {product.brand} • {product.shape} • {product.material}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    {product.isFeatured && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        FEATURED
                                      </span>
                                    )}
                                    {product.isBogoEligible && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                        BOGO
                                      </span>
                                    )}
                                    {product.isBestSeller && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                        BESTSELLER
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category & SKU */}
                            <td className="px-4 py-3.5">
                              <div className="text-slate-200 font-semibold">{product.category}</div>
                              <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                                {product.sku}
                              </span>
                            </td>

                            {/* Pricing & Real-Time Discount */}
                            <td className="px-4 py-3.5">
                              {isEditingThisPrice ? (
                                <div className="space-y-1.5 p-2 rounded-lg bg-slate-900 border border-cyan-500/40">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-slate-400">Orig: ₹</span>
                                    <input
                                      type="number"
                                      value={tempOrigPrice}
                                      onChange={(e) => setTempOrigPrice(Number(e.target.value))}
                                      className="w-16 bg-slate-800 text-white px-1.5 py-0.5 rounded text-xs border border-slate-700"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-slate-400">Sell: ₹</span>
                                    <input
                                      type="number"
                                      value={tempSellPrice}
                                      onChange={(e) => setTempSellPrice(Number(e.target.value))}
                                      className="w-16 bg-slate-800 text-white px-1.5 py-0.5 rounded text-xs border border-slate-700"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1 pt-1">
                                    <button
                                      onClick={() => handleSaveQuickPrice(product.id)}
                                      className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setQuickPriceId(null)}
                                      className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[10px]"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-white text-xs">
                                      ₹{product.sellingPrice.toLocaleString()}
                                    </span>
                                    {product.originalPrice > product.sellingPrice && (
                                      <span className="line-through text-slate-500 text-[10px]">
                                        ₹{product.originalPrice.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-bold text-emerald-400">
                                      {product.discountPercentage}% OFF
                                    </span>
                                    <button
                                      onClick={() => {
                                        setQuickPriceId(product.id);
                                        setTempOrigPrice(product.originalPrice);
                                        setTempSellPrice(product.sellingPrice);
                                      }}
                                      className="text-[10px] text-cyan-400 hover:underline"
                                    >
                                      Edit Price
                                    </button>
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Stock & Units Sold */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-bold ${
                                    totalStock === 0
                                      ? 'text-red-400'
                                      : totalStock < (websiteSettings?.lowStockThreshold ?? 15)
                                      ? 'text-amber-400'
                                      : 'text-white'
                                  }`}
                                >
                                  {totalStock === 0 ? 'Out of Stock' : `${totalStock} units`}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {unitsSold} orders completed
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <button
                                  onClick={() => adjustStock(product.id, product.variants[0]?.id, 10)}
                                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[9px] text-cyan-300 border border-white/10"
                                  title="Add +10 stock units"
                                >
                                  +10 Stock
                                </button>
                              </div>
                            </td>

                            {/* Website Visibility Toggle */}
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => toggleProductPublish(product.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                                  product.isPublished
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    product.isPublished ? 'bg-emerald-400' : 'bg-slate-500'
                                  }`}
                                />
                                {product.isPublished ? 'Published Live' : 'Draft (Hidden)'}
                              </button>
                            </td>

                            {/* 6 Actions: View, Edit, Duplicate, Publish, Delete */}
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openPDP(product)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                                  title="View on Storefront"
                                >
                                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditProduct(product)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                                </button>
                                <button
                                  onClick={() => duplicateProduct(product.id)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                                  title="Duplicate Product"
                                >
                                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirmTarget({
                                      type: 'product',
                                      id: product.id,
                                      name: product.name,
                                    })
                                  }
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                                  title="Delete Product (Preserves Orders)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES & TAXONOMY */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Optical Categories & Display Taxonomy
                  </h3>
                  <p className="text-xs text-slate-400">
                    Control category banners, badges, descriptions and storefront arrangement.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-3 shadow-lg"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600/80 text-white backdrop-blur-md">
                        {cat.badgeText}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                        <span className="text-[10px] font-mono text-cyan-400">/{cat.slug}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs text-slate-400">
                        {products.filter((p) => p.category === cat.name).length} frames in catalog
                      </span>
                      <button
                        onClick={() => toggleCategoryActive(cat.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                          cat.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {cat.isActive ? 'Active on Store' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY & STOCK ALERTS */}
          {activeTab === 'inventory' && <InventoryDesk />}

          {/* TAB 5: ORDER FULFILLMENT HUB */}
          {activeTab === 'orders' && <OrdersManager />}

          {/* TAB: PAYMENTS & TRANSACTIONS */}
          {activeTab === 'payments' && <PaymentsManager onViewOrder={() => setActiveTab('orders')} />}

          {/* TAB: ADVERTISEMENT POSTER MANAGER */}
          {activeTab === 'posters' && <AdPosterManager />}

          {/* TAB: HOMEPAGE VIDEO MANAGER */}
          {activeTab === 'videos' && <HomepageVideoManager />}

          {/* TAB 6: HOME TRY-ON & EYE TEST APPOINTMENTS HUB */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <AppointmentManagementDashboard />
            </div>
          )}

          {/* TAB 7: CUSTOMER DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Customer Relationship & Account Records
                  </h3>
                  <p className="text-xs text-slate-400">
                    Aggregated customer profiles, order history, and saved optical prescriptions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">
                        {ord.customerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{ord.customerName}</h4>
                        <div className="text-xs text-slate-400">{ord.customerEmail}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
                      <div>
                        <span className="text-slate-400">Phone:</span>
                        <div className="text-white font-medium">{ord.customerPhone}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Total Spent:</span>
                        <div className="text-white font-bold">₹{ord.totalAmount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: HOMEPAGE ADVERTISEMENT MANAGER */}
          {activeTab === 'banners' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header Box */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0C0B1B] via-[#0E0C24] to-[#07131F] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Dynamic Advertising Engine
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      LIVE STORE SYNC
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white font-heading tracking-tight">
                    Homepage Advertisement Manager
                  </h3>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    Design and customize luxury promotional advertisement banners (Black & Gold, Cyber Neon, Cyan Tech) with product catalog synchronization, glowing effects, pricing discounts, device previews, and scheduled automatic publishing without touching code.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      setCameraCaptureTarget('promobanner');
                      setIsCameraCaptureOpen(true);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Capture Product Photo</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingPromoBanner(null);
                      setIsPromoEditorOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 hover:brightness-110 text-white text-xs font-black shadow-[0_0_25px_rgba(245,158,11,0.35)] transition flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>+ Visual Banner Studio</span>
                  </button>
                </div>
              </div>

              {/* Sub-Navigation Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
                <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-950 border border-purple-500/20">
                  <button
                    onClick={() => setBannerManagerTab('promotional')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                      bannerManagerTab === 'promotional'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Customizable Promotional Banners</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
                      {promoBanners.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setBannerManagerTab('posters')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                      bannerManagerTab === 'posters'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Section Posters & Banners</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
                      {banners.length}
                    </span>
                  </button>
                </div>

                {bannerManagerTab === 'promotional' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Filter:</span>
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
                      {(['all', 'published', 'draft'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setPromoFilterStatus(st)}
                          className={`px-3 py-1 rounded-lg font-semibold capitalize transition cursor-pointer ${
                            promoFilterStatus === st
                              ? 'bg-purple-600 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {st === 'all'
                            ? `All (${promoBanners.length})`
                            : st === 'published'
                            ? `Published (${promoBanners.filter((b) => b.status === 'published').length})`
                            : `Drafts (${promoBanners.filter((b) => b.status === 'draft').length})`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-Tab 1: Customizable Promotional Banners */}
              {bannerManagerTab === 'promotional' && (
                <div className="space-y-6">
                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-[#0B0B18] border border-purple-500/20">
                      <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                        Total Ads Configured
                      </div>
                      <div className="text-2xl font-black text-white font-heading mt-1">
                        {promoBanners.length}
                      </div>
                      <div className="text-[11px] text-purple-400 mt-1">
                        Independent priority slots
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0B0B18] border border-emerald-500/20">
                      <div className="text-[11px] text-emerald-400 font-medium uppercase tracking-wider">
                        Live On Storefront
                      </div>
                      <div className="text-2xl font-black text-emerald-300 font-heading mt-1">
                        {promoBanners.filter((b) => b.status === 'published').length}
                      </div>
                      <div className="text-[11px] text-emerald-500/80 mt-1">
                        Active autoplay slider (5.5s)
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0B0B18] border border-amber-500/20">
                      <div className="text-[11px] text-amber-400 font-medium uppercase tracking-wider">
                        Drafts In Review
                      </div>
                      <div className="text-2xl font-black text-amber-300 font-heading mt-1">
                        {promoBanners.filter((b) => b.status === 'draft').length}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Hidden from storefront
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0B0B18] border border-cyan-500/20">
                      <div className="text-[11px] text-cyan-400 font-medium uppercase tracking-wider">
                        Live Position
                      </div>
                      <div className="text-sm font-black text-cyan-300 font-heading mt-2 uppercase">
                        Homepage Prime Slot
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Below hero showcase
                      </div>
                    </div>
                  </div>

                  {/* List / Cards of Promotional Banners */}
                  <div className="space-y-4">
                    {promoBanners
                      .filter((b) => {
                        if (promoFilterStatus === 'published') return b.status === 'published';
                        if (promoFilterStatus === 'draft') return b.status === 'draft';
                        return true;
                      })
                      .map((b, index) => {
                        const isGold = b.theme === 'black-gold';
                        const isPurple = b.theme === 'black-purple';
                        const isCyan = b.theme === 'black-cyan';
                        const isMinimal = b.theme === 'minimal';

                        return (
                          <div
                            key={b.id}
                            className="p-5 sm:p-6 rounded-3xl bg-[#0B0B18] border border-purple-500/20 shadow-xl hover:border-purple-500/40 transition space-y-4"
                          >
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                              {/* Left: Banner Info & Badges */}
                              <div className="flex items-start gap-4 flex-1">
                                {/* Banner Thumbnail Preview Frame */}
                                <div
                                  className={`relative w-36 sm:w-48 aspect-video rounded-xl overflow-hidden shrink-0 border ${
                                    isGold
                                      ? 'bg-[#09080C] border-amber-500/50'
                                      : isPurple
                                      ? 'bg-[#0A0717] border-purple-500/50'
                                      : isCyan
                                      ? 'bg-[#050B14] border-cyan-500/50'
                                      : 'bg-slate-900 border-white/20'
                                  }`}
                                >
                                  {b.bgImage && (
                                    <img
                                      src={b.bgImage}
                                      alt="bg"
                                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                                    />
                                  )}
                                  <div className="absolute inset-0 p-2 flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                      <span
                                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                                          isGold
                                            ? 'bg-amber-500/30 text-amber-300'
                                            : isPurple
                                            ? 'bg-purple-500/30 text-purple-300'
                                            : 'bg-cyan-500/30 text-cyan-300'
                                        }`}
                                      >
                                        {b.adLabel || 'AD'}
                                      </span>
                                      {b.hasGlowingLights && (
                                        <span className="flex items-center gap-0.5 text-[8px] text-amber-300">
                                          <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                                          Lights
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-end justify-between">
                                      <div className="text-[9px] font-bold text-white line-clamp-1">
                                        ₹{b.discountedPrice}
                                      </div>
                                      <img
                                        src={b.productImage}
                                        alt={b.productName}
                                        className="w-10 h-10 object-contain drop-shadow"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Text & Configuration Specs */}
                                <div className="space-y-1.5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                      PRIORITY #{b.priority}
                                    </span>
                                    <span
                                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                        isGold
                                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                          : isPurple
                                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                          : isCyan
                                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                          : isMinimal
                                          ? 'bg-slate-700 text-slate-300 border-slate-600'
                                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      }`}
                                    >
                                      {isGold
                                        ? 'Black & Gold Luxury'
                                        : isPurple
                                        ? 'Black & Purple Futuristic'
                                        : isCyan
                                        ? 'Cyan Technology'
                                        : isMinimal
                                        ? 'Minimal Promotional'
                                        : 'Custom Design'}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                        b.status === 'published'
                                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          b.status === 'published' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                                        }`}
                                      />
                                      {b.status === 'published' ? 'LIVE ON STOREFRONT' : 'DRAFT (HIDDEN)'}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <h4 className="text-base font-bold text-white font-heading">
                                      {b.name}
                                    </h4>
                                    <span className="text-xs text-slate-400 font-mono">
                                      ({b.promotionalHeading})
                                    </span>
                                  </div>

                                  {/* Price, Discount & Product sync details */}
                                  <div className="flex flex-wrap items-center gap-3 text-xs">
                                    <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/5">
                                      <span className="text-slate-400">Offer:</span>
                                      <strong className="text-amber-300 font-heading text-sm">
                                        ₹{b.discountedPrice.toLocaleString()}
                                      </strong>
                                      {b.originalPrice > b.discountedPrice && (
                                        <span className="text-slate-500 line-through text-xs">
                                          ₹{b.originalPrice.toLocaleString()}
                                        </span>
                                      )}
                                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                                        {b.discountPercentage}% OFF
                                      </span>
                                    </div>

                                    <div className="text-slate-400 flex items-center gap-1">
                                      <Tag className="w-3.5 h-3.5 text-cyan-400" />
                                      <span>Product: </span>
                                      <strong className="text-white">{b.productName}</strong>
                                    </div>
                                  </div>

                                  {/* Scheduling & Device Visibility */}
                                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                                    <div className="flex items-center gap-1.5">
                                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                                      <span>Schedule: {b.startDate} to {b.endDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                      <span>Devices:</span>
                                      <div className="flex items-center gap-1.5">
                                        <span title="Desktop">
                                          <Monitor
                                            className={`w-3.5 h-3.5 ${
                                              b.deviceVisibility?.desktop !== false ? 'text-cyan-400' : 'text-slate-600'
                                            }`}
                                          />
                                        </span>
                                        <span title="Tablet">
                                          <Tablet
                                            className={`w-3.5 h-3.5 ${
                                              b.deviceVisibility?.tablet !== false ? 'text-cyan-400' : 'text-slate-600'
                                            }`}
                                          />
                                        </span>
                                        <span title="Mobile">
                                          <Smartphone
                                            className={`w-3.5 h-3.5 ${
                                              b.deviceVisibility?.mobile !== false ? 'text-cyan-400' : 'text-slate-600'
                                            }`}
                                          />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Actions & Ordering */}
                              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                                {/* Priority Reordering Up/Down */}
                                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10">
                                  <button
                                    onClick={() => handleMovePromoBanner(b.id, 'up')}
                                    disabled={index === 0}
                                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                    title="Move Priority Up"
                                  >
                                    <MoveUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleMovePromoBanner(b.id, 'down')}
                                    disabled={index === promoBanners.length - 1}
                                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                    title="Move Priority Down"
                                  >
                                    <MoveDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Status Switcher Button */}
                                <button
                                  onClick={() => togglePromoBannerStatus(b.id)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                    b.status === 'published'
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                                  }`}
                                >
                                  {b.status === 'published' ? 'Published' : 'Switch to Publish'}
                                </button>

                                {/* Action Buttons: Edit, Duplicate, Delete */}
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingPromoBanner(b);
                                      setIsPromoEditorOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold border border-purple-500/40 flex items-center gap-1.5 cursor-pointer transition shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-purple-300" />
                                    <span>Visual Studio</span>
                                  </button>

                                  <button
                                    onClick={() => duplicatePromoBanner(b.id)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition cursor-pointer"
                                    title="Duplicate Banner"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() =>
                                      setDeleteConfirmTarget({
                                        type: 'promobanner',
                                        id: b.id,
                                        name: b.name,
                                      })
                                    }
                                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition cursor-pointer"
                                    title="Delete Banner"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    {promoBanners.length === 0 && (
                      <div className="p-12 text-center rounded-3xl bg-[#0B0B18] border border-dashed border-purple-500/30 space-y-4">
                        <div className="w-14 h-14 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
                          <Sparkles className="w-7 h-7" />
                        </div>
                        <h4 className="text-lg font-bold text-white font-heading">
                          No Promotional Banners Configured
                        </h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          Launch your first high-converting Black & Gold, Cyber Neon, or Cyan Tech advertisement banner with product pricing and lighting effects.
                        </p>
                        <button
                          onClick={() => {
                            setEditingPromoBanner(null);
                            setIsPromoEditorOpen(true);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs"
                        >
                          Create First Promotional Banner
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Section Posters & Campaign Banners */}
              {bannerManagerTab === 'posters' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-white/10">
                    <div>
                      <h4 className="text-sm font-bold text-white">Section Posters & Marketing Strips</h4>
                      <p className="text-xs text-slate-400">Standard catalog posters, seasonal strips, and category banners.</p>
                    </div>
                    <button
                      onClick={handleOpenAddBanner}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Poster Banner</span>
                    </button>
                  </div>

                  {/* Existing Banners Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {banners.map((banner) => (
                      <div
                        key={banner.id}
                        className="p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-4 shadow-xl flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/10 group">
                            <img
                              src={banner.desktopImage}
                              alt={banner.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/80 text-black backdrop-blur-md">
                                PRIORITY #{banner.priority}
                              </span>
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-600/80 text-white backdrop-blur-md uppercase">
                                {banner.targetSection}
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                              <div className="text-[10px] font-bold text-amber-300 uppercase">
                                {banner.badge}
                              </div>
                              <h4 className="text-sm font-bold font-heading line-clamp-1">
                                {banner.mainHeading}
                              </h4>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-white">{banner.title}</h4>
                              <span className="text-xs text-slate-400">
                                CTA: <strong className="text-cyan-300">{banner.ctaText}</strong>
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {banner.description || banner.subtitle}
                            </p>
                            <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-purple-400" />
                              <span>Valid: {banner.startDate} to {banner.endDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                          <button
                            onClick={() => toggleBannerActive(banner.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                              banner.isActive
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                banner.isActive ? 'bg-emerald-400' : 'bg-slate-500'
                              }`}
                            />
                            {banner.isActive ? 'Active on Live Site' : 'Inactive'}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditBanner(banner)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center gap-1"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirmTarget({
                                  type: 'banner',
                                  id: banner.id,
                                  name: banner.title,
                                })
                              }
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                              title="Delete Banner"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: PROMOTIONS & COUPONS */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Promotional Campaign Engine & Coupon Codes
                  </h3>
                  <p className="text-xs text-slate-400">
                    Create discount campaigns, limited-time BOGO offers, and verified coupon codes for customer checkout.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddCoupon}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.35)] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Coupon</span>
                  </button>
                </div>
              </div>

              {/* Active Festival Campaigns */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Seasonal & Festival Campaigns
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {festivalCampaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className={`p-4 rounded-2xl border transition space-y-3 ${
                        camp.isActive
                          ? 'bg-gradient-to-b from-purple-900/30 to-[#0B0B18] border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                          : 'bg-[#0B0B18] border-purple-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {camp.badgeText}
                        </span>
                        <button
                          onClick={() => setFestivalCampaignActive(camp.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                            camp.isActive
                              ? 'bg-cyan-500 text-slate-950 font-extrabold'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {camp.isActive ? 'Active on Store' : 'Set as Active'}
                        </button>
                      </div>

                      <div>
                        <h5 className="font-bold text-white text-sm">{camp.name}</h5>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{camp.title}</p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="font-mono text-cyan-300 font-bold">{camp.couponCode}</span>
                        <span className="font-bold text-emerald-400">{camp.discountPercent}% OFF</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Codes Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                  <Tag className="w-4 h-4 text-pink-400" />
                  Active Promotional Discount Codes ({coupons.length})
                </h4>

                <div className="rounded-2xl border border-purple-500/20 overflow-hidden bg-[#0B0B18]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0E0E24] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-purple-500/20">
                      <tr>
                        <th className="px-4 py-3">Coupon Code</th>
                        <th className="px-4 py-3">Discount Details</th>
                        <th className="px-4 py-3">Min Order</th>
                        <th className="px-4 py-3">Usage Count</th>
                        <th className="px-4 py-3">Valid Until</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {coupons.map((c) => (
                        <tr key={c.id} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3 font-mono text-sm font-extrabold text-cyan-300">
                            {c.code}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-white">{c.title}</div>
                            <span className="text-xs text-emerald-400 font-extrabold">
                              {c.discountPercent}% OFF
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-300 font-semibold">
                            ₹{c.minOrderAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            <span className="font-bold text-white">{c.usageCount}</span> / {c.usageLimit}
                          </td>
                          <td className="px-4 py-3 text-slate-400">{c.validTill}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleCouponActive(c.id)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                                c.isActive
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {c.isActive ? 'Active' : 'Disabled'}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() =>
                                setDeleteConfirmTarget({
                                  type: 'coupon',
                                  id: c.id,
                                  name: c.code,
                                })
                              }
                              className="p-1 rounded hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: WEBSITE CONTENT & LAYOUT */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Homepage Slider & Layout Block Arrangement
                  </h3>
                  <p className="text-xs text-slate-400">
                    Control slide transitions, auto-slide durations, and toggle entire homepage blocks on or off.
                  </p>
                </div>
              </div>

              {/* Slider Settings */}
              <div className="p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-4">
                <h4 className="text-sm font-bold text-white font-heading">
                  Hero Slider Engine Controls
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">
                      Auto-Slide Interval: {websiteSettings?.heroAutoSlideDurationSeconds ?? 5} Seconds
                    </label>
                    <input
                      type="range"
                      min={2}
                      max={10}
                      value={websiteSettings?.heroAutoSlideDurationSeconds ?? 5}
                      onChange={(e) =>
                        updateWebsiteSettings({
                          heroAutoSlideDurationSeconds: Number(e.target.value),
                        })
                      }
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-white/5">
                    <span className="text-slate-300">Total Active Slides</span>
                    <span className="text-sm font-bold text-cyan-400">
                      {heroSlides.filter((s) => s.isActive).length} / {heroSlides.length}
                    </span>
                  </div>
                </div>

                {/* Hero Slides List */}
                <div className="space-y-3 pt-2">
                  {heroSlides.map((slide) => (
                    <div
                      key={slide.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={slide.desktopImage}
                          alt={slide.title}
                          className="w-16 h-10 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <div className="font-bold text-white">{slide.title}</div>
                          <div className="text-[11px] text-slate-400">{slide.subtitle}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleHeroSlide(slide.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            slide.isActive
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {slide.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Homepage Layout Blocks */}
              <div className="p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-4">
                <h4 className="text-sm font-bold text-white font-heading">
                  Homepage Section Visibility Blocks
                </h4>
                <div className="space-y-2">
                  {homepageSections.map((sec) => (
                    <div
                      key={sec.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                    >
                      <span className="font-semibold text-white">{sec.name}</span>
                      <button
                        onClick={() => toggleHomepageSection(sec.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          sec.isEnabled
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {sec.isEnabled ? 'Visible on Website' : 'Hidden'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: MEDIA LIBRARY & CAMERA */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Central Optical Media Library & Webcam Capture
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload product frames, banners, and model photography with automatic validation and reuse.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCameraCaptureTarget('media');
                      setIsCameraCaptureOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Capture From Camera</span>
                  </button>
                </div>
              </div>

              {/* Media Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0B18] p-3 rounded-xl border border-purple-500/20 text-xs">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search media files by name..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {['All', 'Frames', 'Banners', 'Models', 'Lenses'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setMediaCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        mediaCategoryFilter === cat
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredMedia.map((media) => {
                  const isInUse = (media.inUseBy && media.inUseBy.length > 0) || false;

                  return (
                    <div
                      key={media.id}
                      className="p-3 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-2 group shadow-lg flex flex-col justify-between"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                          {media.category}
                        </span>
                        {isInUse && (
                          <span className="absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/80 text-black">
                            IN USE
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="font-bold text-white text-xs truncate" title={media.name}>
                          {media.name}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>{media.dimensions}</span>
                          <span>{media.sizeKb} KB</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(media.url);
                            alert('Image URL copied to clipboard!');
                          }}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3 text-cyan-400" />
                          <span>Copy URL</span>
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirmTarget({
                              type: 'media',
                              id: media.id,
                              name: media.name,
                            })
                          }
                          className="p-1 rounded text-red-400 hover:bg-red-500/20 cursor-pointer"
                          title="Delete Unused Media"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 11: ANALYTICS & REPORTS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Executive Analytics & Commercial Intelligence
                  </h3>
                  <p className="text-xs text-slate-400">
                    Deep dive into optical conversion rates, average order values, and inventory turn.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#0D0D1F] border border-purple-500/20">
                  <div className="text-xs text-slate-400">Average Order Value (AOV)</div>
                  <div className="text-2xl font-bold text-white font-heading mt-1">
                    ₹3,420
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">+12% vs Q3</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0D0D1F] border border-purple-500/20">
                  <div className="text-xs text-slate-400">3D AR Try-On Conversion Rate</div>
                  <div className="text-2xl font-bold text-cyan-400 font-heading mt-1">
                    34.2%
                  </div>
                  <div className="text-[10px] text-cyan-300 mt-1">2.4x higher than static view</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0D0D1F] border border-purple-500/20">
                  <div className="text-xs text-slate-400">Return Rate (Prescription Match)</div>
                  <div className="text-2xl font-bold text-emerald-400 font-heading mt-1">
                    0.8%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Doctor double-verification</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: ADMIN USERS & PERMISSIONS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Role-Based Access Control (RBAC) & Team Management
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage Super Admin, Product Manager, Marketing Manager, and Inventory Manager access.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.35)] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Admin User</span>
                </button>
              </div>

              {/* Users List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminUsers.map((u) => {
                  const isCurrent = currentAdminUser.id === u.id;

                  return (
                    <div
                      key={u.id}
                      className={`p-5 rounded-2xl border transition space-y-4 ${
                        isCurrent
                          ? 'bg-gradient-to-b from-purple-900/30 to-[#0B0B18] border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                          : 'bg-[#0B0B18] border-purple-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-12 h-12 rounded-xl object-cover border border-purple-500/40"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-sm">{u.name}</h4>
                              {isCurrent && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-cyan-400 text-black">
                                  ACTIVE SESSION
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">{u.email}</div>
                          </div>
                        </div>

                        {!isCurrent && (
                          <button
                            onClick={() => setCurrentAdminUser(u)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-semibold border border-cyan-500/30 cursor-pointer"
                          >
                            Switch To User
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {u.role}
                        </span>
                        <span className="text-slate-400 text-[11px]">Last active: {u.lastActive}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 13: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#0B0B18] border border-purple-500/20 space-y-4">
                <h3 className="text-lg font-bold text-white font-heading">
                  Global Storefront & Enterprise Settings
                </h3>
                <p className="text-xs text-slate-400">
                  Configure store identity, currency symbol, low-stock threshold, and tax rates.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Store Name</label>
                    <input
                      type="text"
                      value={websiteSettings?.storeName ?? 'Wonderlix AI Vision'}
                      onChange={(e) => updateWebsiteSettings({ storeName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Tagline</label>
                    <input
                      type="text"
                      value={websiteSettings?.tagline ?? 'Precision Optics • Neural 3D Fit'}
                      onChange={(e) => updateWebsiteSettings({ tagline: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Currency Symbol</label>
                    <input
                      type="text"
                      value={websiteSettings?.currencySymbol ?? '₹'}
                      onChange={(e) => updateWebsiteSettings({ currencySymbol: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">GST / Tax Rate (%)</label>
                    <input
                      type="number"
                      value={websiteSettings?.taxRatePercent ?? 18}
                      onChange={(e) => updateWebsiteSettings({ taxRatePercent: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Free Shipping Threshold (₹)</label>
                    <input
                      type="number"
                      value={websiteSettings?.freeShippingThreshold ?? 999}
                      onChange={(e) => updateWebsiteSettings({ freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Low Stock Warning Threshold (units)</label>
                    <input
                      type="number"
                      value={websiteSettings?.lowStockThreshold ?? 15}
                      onChange={(e) => updateWebsiteSettings({ lowStockThreshold: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          </ErrorBoundary>
        </main>
      </div>

      {/* MODAL 1: ADD / EDIT PRODUCT FORM */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0B0B18] border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/40 to-slate-900">
              <h3 className="text-base font-bold text-white font-heading">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Optical Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={prodFormName}
                    onChange={(e) => setProdFormName(e.target.value)}
                    placeholder="e.g. Wonderlix Titanium Feather Round"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Product SKU *</label>
                  <input
                    type="text"
                    required
                    value={prodFormSku}
                    onChange={(e) => setProdFormSku(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-cyan-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Category</label>
                  <select
                    value={prodFormCategory}
                    onChange={(e) => setProdFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="Eyeglasses">Eyeglasses</option>
                    <option value="Sunglasses">Sunglasses</option>
                    <option value="Computer Glasses">Computer Glasses</option>
                    <option value="Reading Glasses">Reading Glasses</option>
                    <option value="Kids Glasses">Kids Glasses</option>
                    <option value="Contact Lenses">Contact Lenses</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Brand</label>
                  <input
                    type="text"
                    value={prodFormBrand}
                    onChange={(e) => setProdFormBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Frame Shape</label>
                  <select
                    value={prodFormShape}
                    onChange={(e) => setProdFormShape(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="Round">Round</option>
                    <option value="Rectangle">Rectangle</option>
                    <option value="Wayfarer">Wayfarer</option>
                    <option value="Aviator">Aviator</option>
                    <option value="Cat Eye">Cat Eye</option>
                    <option value="Geometric">Geometric</option>
                    <option value="Clubmaster">Clubmaster</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Real-Time Discount Section */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 space-y-3">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Pricing & Automatic Discount Engine</span>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    Calculated: {formDiscountPct}% OFF
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Regular Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={prodFormOrigPrice}
                      onChange={(e) => setProdFormOrigPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Current Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={prodFormSellPrice}
                      onChange={(e) => setProdFormSellPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-cyan-500/40 rounded-lg p-2 text-cyan-300 font-extrabold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Initial Stock Units</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={prodFormStock}
                      onChange={(e) => setProdFormStock(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Product Images + Camera Option */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold">Product Images ({prodFormImages.length})</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCameraCaptureTarget('product');
                        setIsCameraCaptureOpen(true);
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take Photo</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-900 rounded-xl border border-slate-700">
                  {prodFormImages.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 group border border-white/20">
                      <img src={img} alt="Product angle" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProdFormImages(prodFormImages.filter((_, idx) => idx !== i))}
                        className="absolute top-0.5 right-0.5 bg-red-600 text-white p-0.5 rounded-full opacity-80 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-purple-600 text-[8px] text-white text-center font-bold">
                          PRIMARY
                        </span>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Enter image URL:');
                      if (url) setProdFormImages((prev) => [...prev, url]);
                    }}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white flex flex-col items-center justify-center text-[10px] shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add URL</span>
                  </button>
                </div>
              </div>

              {/* Description & Tags */}
              <div className="space-y-2">
                <label className="text-slate-300 block font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={prodFormDesc}
                  onChange={(e) => setProdFormDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFormStatus}
                    onChange={(e) => setProdFormStatus(e.target.checked)}
                    className="accent-purple-600 w-4 h-4"
                  />
                  <span>Published Live</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFormIsBogo}
                    onChange={(e) => setProdFormIsBogo(e.target.checked)}
                    className="accent-cyan-500 w-4 h-4"
                  />
                  <span>BOGO Eligible</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFormIsBestSeller}
                    onChange={(e) => setProdFormIsBestSeller(e.target.checked)}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFormIsNewArrival}
                    onChange={(e) => setProdFormIsNewArrival(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="pt-4 border-t border-purple-500/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                >
                  Save & Publish to Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT BANNER */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0B0B18] border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/40 to-slate-900">
              <h3 className="text-base font-bold text-white font-heading">
                {editingBanner ? 'Edit Homepage Advertisement' : 'Add New Homepage Advertisement Banner'}
              </h3>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Banner Title *</label>
                  <input
                    type="text"
                    required
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="e.g. Wonderlix Titanium Hero"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Main Heading *</label>
                  <input
                    type="text"
                    required
                    value={bannerHeading}
                    onChange={(e) => setBannerHeading(e.target.value)}
                    placeholder="e.g. ZERO GRAVITY TITANIUM"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Target Section</label>
                  <select
                    value={bannerTarget}
                    onChange={(e) => setBannerTarget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="hero">Hero Slider</option>
                    <option value="festival">Festival Campaign Strip</option>
                    <option value="try_on_banner">3D AR Try-On Banner</option>
                    <option value="trending">Trending Spotlight</option>
                    <option value="bottom_promo">Bottom Promotional Strip</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Badge Text</label>
                  <input
                    type="text"
                    value={bannerBadge}
                    onChange={(e) => setBannerBadge(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              {/* Images with Camera Option */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-900/80 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Banner Media Assets</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCameraCaptureTarget('banner');
                      setIsCameraCaptureOpen(true);
                    }}
                    className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Capture Photo</span>
                  </button>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Desktop Image URL</label>
                  <input
                    type="text"
                    required
                    value={bannerDesktopImg}
                    onChange={(e) => setBannerDesktopImg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Mobile Image URL</label>
                  <input
                    type="text"
                    required
                    value={bannerMobileImg}
                    onChange={(e) => setBannerMobileImg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">CTA Button Text</label>
                  <input
                    type="text"
                    value={bannerCtaText}
                    onChange={(e) => setBannerCtaText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">CTA Category / URL</label>
                  <input
                    type="text"
                    value={bannerCtaUrl}
                    onChange={(e) => setBannerCtaUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-purple-500/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold"
                >
                  Save & Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT COUPON */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0B0B18] border border-purple-500/30 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-heading">
              Create Promotional Coupon Code
            </h3>
            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-cyan-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Title / Campaign Headline</label>
                <input
                  type="text"
                  required
                  value={couponTitle}
                  onChange={(e) => setCouponTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Discount %</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={couponPercent}
                    onChange={(e) => setCouponPercent(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD ADMIN USER */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0B0B18] border border-purple-500/30 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-heading">
              Add New Admin User
            </h3>
            <form onSubmit={handleSaveAdminUser} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Role & Permissions</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as AdminRole)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Super Admin">Super Admin (Full Access)</option>
                  <option value="Product Manager">Product Manager (Catalog & Prices)</option>
                  <option value="Marketing Manager">Marketing Manager (Ads & Coupons)</option>
                  <option value="Inventory Manager">Inventory Manager (Stock & Orders)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0D0D1F] border border-red-500/30 rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-white font-heading">Confirm Permanent Action</h4>
              <p className="text-slate-400 mt-1">
                Are you sure you want to delete <strong>{deleteConfirmTarget.name}</strong>?
              </p>
              {deleteConfirmTarget.type === 'product' && (
                <p className="text-[11px] text-cyan-300 mt-2 bg-slate-900 p-2 rounded-lg border border-cyan-500/20">
                  Historical customer order records containing this item will be safely preserved.
                </p>
              )}
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE WEBCAM CAMERA MODAL */}
      <AdminCameraCapture
        isOpen={isCameraCaptureOpen}
        onClose={() => setIsCameraCaptureOpen(false)}
        onCapture={handlePhotoCaptured}
        title={
          cameraCaptureTarget === 'product'
            ? 'Capture Optical Product Photo'
            : cameraCaptureTarget === 'banner'
            ? 'Capture Homepage Banner Photo'
            : cameraCaptureTarget === 'promobanner'
            ? 'Capture Promotional Product Photo'
            : 'Capture Media Asset Photo'
        }
      />

      {/* HOMEPAGE ADVERTISEMENT VISUAL STUDIO MODAL */}
      <PromoBannerEditorModal
        isOpen={isPromoEditorOpen}
        banner={editingPromoBanner}
        capturedImage={capturedCameraPromoImage}
        onClose={() => {
          setIsPromoEditorOpen(false);
          setCapturedCameraPromoImage('');
        }}
        onSave={(savedBanner, publishImmediately) => {
          const exists = promoBanners.some((b) => b.id === savedBanner.id);
          if (exists) {
            updatePromoBanner(savedBanner);
          } else {
            addPromoBanner(savedBanner);
          }
          setIsPromoEditorOpen(false);
          setCapturedCameraPromoImage('');
        }}
        onOpenLiveCamera={() => {
          setCameraCaptureTarget('promobanner');
          setIsCameraCaptureOpen(true);
        }}
      />

      {/* WEBSITE LIVE PREVIEW MODAL */}
      <WebsitePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      />
    </div>
  );
};
