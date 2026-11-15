import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getAdminToken, 
  getAdminUser, 
  logoutAdmin, 
  verifyAdminSession,
  getAdminOverview,
  createProduct,
  updateProduct,
  deleteProduct,
  getSiteSettings,
  updateSiteSetting
} from '../services/adminService';
import { getProducts } from '../services/productService';
import { DEFAULT_SOCIAL_CHATS } from '../data/products';
import { getAdminOrders, updateOrderStatus, getOrderStats } from '../services/orderService';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Home, 
  Settings, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  Phone, 
  MapPin, 
  AlertCircle, 
  Globe, 
  Save, 
  Check, 
  X,
  MessageSquare,
  Tag,
  ShieldCheck,
  ChevronDown,
  Layers,
  Banknote,
  SlidersHorizontal
} from 'lucide-react';
import ImageUpload from '../components/common/ImageUpload';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const at = t.admin || {};
  const currency = t.currency || 'ر.س';

  // Active Tab: 'overview' | 'products' | 'orders' | 'homepage' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Loading and Notification States
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState({ show: false, text: '', type: 'success' });

  // Data States
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    newOrdersCount: 0,
    totalRevenue: 0,
    pendingCash: 0,
    collectedCash: 0
  });
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});

  // Filter & Search States
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all');

  // Modal States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = new product
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Product Form State
  const initialProductForm = {
    id: '',
    name: '',
    name_en: '',
    brand: 'KOON PERFUME',
    tagline: '',
    description: '',
    gender: 'unisex',
    season: 'all_seasons',
    scent_family: 'شرقي خشبي فاخر',
    price: 450,
    original_price: 550,
    discount: '15%',
    concentration: 'Extrait de Parfum (35%)',
    longevity: 'ثبات يتجاوز 24 ساعة',
    projection: 'فوحان فلكي قوي',
    image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
    video_url: '/intro_transparent.webm',
    notes_top: 'زعفران، برغموت',
    notes_heart: 'عنبر، خشب الأرز',
    notes_base: 'عود كمبودي، مسك',
    is_bestseller: false,
    is_featured: true,
    is_active: true,
  };
  const [productForm, setProductForm] = useState(initialProductForm);

  // Homepage CMS Form State
  const [homeForm, setHomeForm] = useState({
    announcement_enabled: true,
    announcement_ar: '',
    announcement_he: '',
    hero_tagline_ar: '',
    hero_tagline_he: '',
    hero_title_ar: '',
    hero_title_en: '',
    hero_subtitle_ar: '',
    hero_subtitle_he: '',
    show_hero_explore_btn: true,
    show_hero_quiz_btn: true,
    show_bestsellers: true,
    show_promo_banner: true,
    show_testimonials: true,
    promo_tag_ar: '',
    promo_tag_he: '',
    promo_title_ar: '',
    promo_title_he: '',
    promo_subtitle_ar: '',
    promo_subtitle_he: '',
    promo_coupon_code: 'KOON10',
    promo_banner_image: ''
  });

  // Social Media Feedback Chats Manager State
  const [feedbackChatsList, setFeedbackChatsList] = useState([]);
  const [newFeedbackChat, setNewFeedbackChat] = useState({
    platform: 'whatsapp',
    customer_name: '',
    perfume: '',
    image_url: '',
    caption: ''
  });

  // Coupons Manager State
  const [couponsList, setCouponsList] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_percent: 15 });

  const showToast = (text, type = 'success') => {
    setToastMsg({ show: true, text, type });
    setTimeout(() => setToastMsg({ show: false, text: '', type: 'success' }), 3500);
  };

  // 1. Verify Authentication on Mount
  useEffect(() => {
    verifyAdminSession().then(isValid => {
      if (!isValid) {
        logoutAdmin();
        navigate('/admin/login');
      } else {
        fetchDashboardData();
      }
    });
  }, [navigate]);

  // 2. Fetch All Unified Data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [ovData, prods, ords, settings] = await Promise.all([
        getAdminOverview(),
        getProducts(),
        getAdminOrders(),
        getSiteSettings()
      ]);

      setStats(ovData);
      setProductsList(prods || []);
      setOrdersList(ords || []);
      setSiteSettings(settings || {});

      // Initialize Homepage CMS Form
      const hero = settings?.hero_section || {};
      const ann = settings?.announcement_bar || {};
      const coups = settings?.coupons || [];
      const secs = settings?.homepage_sections || {};
      const promo = settings?.promo_banner || {};

      setHomeForm({
        announcement_enabled: ann.enabled ?? true,
        announcement_ar: ann.text_ar || '',
        announcement_he: ann.text_he || '',
        hero_tagline_ar: hero.tagline_ar || '',
        hero_tagline_he: hero.tagline_he || '',
        hero_title_ar: hero.title_ar || '',
        hero_title_en: hero.title_en || '',
        hero_subtitle_ar: hero.subtitle_ar || '',
        hero_subtitle_he: hero.subtitle_he || '',
        show_hero_explore_btn: hero.show_explore_btn ?? true,
        show_hero_quiz_btn: hero.show_quiz_btn ?? true,
        show_bestsellers: secs.show_bestsellers ?? true,
        show_promo_banner: secs.show_promo_banner ?? true,
        show_testimonials: secs.show_testimonials ?? true,
        promo_tag_ar: promo.tag_ar || '',
        promo_tag_he: promo.tag_he || '',
        promo_title_ar: promo.title_ar || '',
        promo_title_he: promo.title_he || '',
        promo_subtitle_ar: promo.subtitle_ar || '',
        promo_subtitle_he: promo.subtitle_he || '',
        promo_coupon_code: promo.coupon_code || 'KOON10',
        promo_banner_image: promo.banner_image_url || ''
      });

      setCouponsList(Array.isArray(coups) ? coups : []);

      const fb = settings?.customer_feedback || {};
      setFeedbackChatsList(Array.isArray(fb.chats) && fb.chats.length > 0 ? fb.chats : DEFAULT_SOCIAL_CHATS);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('حدث خطأ في تحميل البيانات.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  // --- PRODUCTS CRUD HANDLERS ---
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      ...initialProductForm,
      id: `koon-${Date.now().toString(36)}`
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      id: prod.id,
      name: prod.name,
      name_en: prod.name_en || prod.nameEn || '',
      brand: prod.brand || 'KOON PERFUME',
      tagline: prod.tagline || '',
      description: prod.description || '',
      gender: prod.gender || 'unisex',
      season: prod.season || 'all_seasons',
      scent_family: prod.scent_family || prod.scentFamily || 'شرقي خشبي فاخر',
      price: prod.price || 450,
      original_price: prod.original_price || prod.originalPrice || 550,
      discount: prod.discount || '15%',
      concentration: prod.concentration || 'Extrait de Parfum (35%)',
      longevity: prod.longevity || 'ثبات يتجاوز 24 ساعة',
      projection: prod.projection || 'فوحان فلكي قوي',
      image_url: prod.images?.[0] || prod.image_url || '',
      video_url: prod.video_url || '/intro_transparent.webm',
      notes_top: (prod.notes?.top || []).join('، '),
      notes_heart: (prod.notes?.heart || []).join('، '),
      notes_base: (prod.notes?.base || []).join('، '),
      is_bestseller: Boolean(prod.is_bestseller ?? prod.isBestseller),
      is_featured: Boolean(prod.is_featured ?? prod.isFeatured),
      is_active: prod.is_active !== false,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const topArr = productForm.notes_top.split(/[،,]/).map(s => s.trim()).filter(Boolean);
      const heartArr = productForm.notes_heart.split(/[،,]/).map(s => s.trim()).filter(Boolean);
      const baseArr = productForm.notes_base.split(/[،,]/).map(s => s.trim()).filter(Boolean);

      const payload = {
        id: productForm.id,
        name: productForm.name,
        name_en: productForm.name_en,
        brand: productForm.brand,
        tagline: productForm.tagline,
        description: productForm.description,
        gender: productForm.gender,
        season: productForm.season,
        scent_family: productForm.scent_family,
        price: Number(productForm.price),
        original_price: Number(productForm.original_price),
        discount: productForm.discount,
        concentration: productForm.concentration,
        longevity: productForm.longevity,
        projection: productForm.projection,
        image_url: productForm.image_url,
        images: [productForm.image_url],
        video_url: productForm.video_url,
        notes: { top: topArr, heart: heartArr, base: baseArr },
        sizes: [
          { size: '50ml', price: Math.round(Number(productForm.price) * 0.75), stock: 15 },
          { size: '100ml', price: Number(productForm.price), stock: 25, isDefault: true },
          { size: '200ml', price: Math.round(Number(productForm.price) * 1.65), stock: 8 }
        ],
        is_bestseller: productForm.is_bestseller,
        is_featured: productForm.is_featured,
        is_active: productForm.is_active,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast('تم تحديث العطر بنجاح في قاعدة البيانات ✨');
      } else {
        await createProduct(payload);
        showToast('تمت إضافة العطر الجديد إلى المتجر بنجاح 🪐');
      }

      setProductModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ العطر.', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      showToast('تم حذف العطر من قاعدة البيانات.');
      setDeleteConfirmId(null);
      fetchDashboardData();
    } catch (err) {
      showToast('تعذر حذف العطر.', 'error');
    }
  };

  const handleToggleProductStatus = async (prod, field) => {
    try {
      const updates = { [field]: !prod[field] };
      await updateProduct(prod.id, updates);
      showToast('تم تحديث الحالة فورياً.');
      fetchDashboardData();
    } catch (err) {
      showToast('فشل تحديث الحالة.', 'error');
    }
  };

  // --- ORDERS HANDLERS ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { order_status: newStatus });
      showToast(`تم تغيير حالة الطلب إلى: ${newStatus}`);
      fetchDashboardData();
      if (selectedOrderDetails?.id === orderId) {
        setSelectedOrderDetails(prev => ({ ...prev, order_status: newStatus }));
      }
    } catch (err) {
      showToast('فشل تحديث حالة الطلب.', 'error');
    }
  };

  const handleMarkPaymentCollected = async (orderId) => {
    try {
      await updateOrderStatus(orderId, { payment_status: 'collected' });
      showToast('تم تسجيل تحصيل المبلغ نقداً بنجاح! 💵');
      fetchDashboardData();
      if (selectedOrderDetails?.id === orderId) {
        setSelectedOrderDetails(prev => ({ ...prev, payment_status: 'collected' }));
      }
    } catch (err) {
      showToast('فشل تحديث حالة التحصيل.', 'error');
    }
  };

  // --- HOMEPAGE CMS HANDLERS ---
  const handleSaveHomepageCMS = async (e) => {
    e.preventDefault();
    try {
      await Promise.all([
        updateSiteSetting('announcement_bar', {
          enabled: homeForm.announcement_enabled,
          text_ar: homeForm.announcement_ar,
          text_he: homeForm.announcement_he
        }),
        updateSiteSetting('hero_section', {
          tagline_ar: homeForm.hero_tagline_ar,
          tagline_he: homeForm.hero_tagline_he,
          title_ar: homeForm.hero_title_ar,
          title_en: homeForm.hero_title_en,
          subtitle_ar: homeForm.hero_subtitle_ar,
          subtitle_he: homeForm.hero_subtitle_he,
          show_explore_btn: homeForm.show_hero_explore_btn,
          show_quiz_btn: homeForm.show_hero_quiz_btn
        }),
        updateSiteSetting('homepage_sections', {
          show_bestsellers: homeForm.show_bestsellers,
          show_promo_banner: homeForm.show_promo_banner,
          show_testimonials: homeForm.show_testimonials
        }),
        updateSiteSetting('promo_banner', {
          tag_ar: homeForm.promo_tag_ar,
          tag_he: homeForm.promo_tag_he,
          title_ar: homeForm.promo_title_ar,
          title_he: homeForm.promo_title_he,
          subtitle_ar: homeForm.promo_subtitle_ar,
          subtitle_he: homeForm.promo_subtitle_he,
          coupon_code: homeForm.promo_coupon_code,
          banner_image_url: homeForm.promo_banner_image
        }),
        updateSiteSetting('customer_feedback', {
          show_testimonials: homeForm.show_testimonials,
          chats: feedbackChatsList
        })
      ]);

      showToast('تم حفظ ونشر إعدادات وأقسام الصفحة الرئيسية مباشرة! 🚀');
    } catch (err) {
      console.error('Error saving settings:', err);
      showToast('حدث خطأ في حفظ الإعدادات.', 'error');
    }
  };

  // --- SOCIAL FEEDBACK CHATS HANDLERS ---
  const handleAddFeedbackChat = async (e) => {
    e.preventDefault();
    if (!newFeedbackChat.image_url.trim()) {
      showToast('يرجى وضع رابط صورة المحادثة.', 'error');
      return;
    }
    const item = {
      id: `chat-${Date.now()}`,
      platform: newFeedbackChat.platform || 'whatsapp',
      platform_name: newFeedbackChat.platform === 'whatsapp' ? 'واتساب WhatsApp' : newFeedbackChat.platform === 'instagram' ? 'إنستغرام Instagram' : newFeedbackChat.platform === 'twitter' ? 'تويتر X' : 'سناب شات',
      customer_name: newFeedbackChat.customer_name || 'عميل دار كون',
      perfume: newFeedbackChat.perfume || 'عطر نيش فاخر',
      image_url: newFeedbackChat.image_url.trim(),
      caption: newFeedbackChat.caption || 'تجربة عطرية رائعة وفخمة جداً.',
      date: 'مؤخراً'
    };
    const updated = [item, ...feedbackChatsList];
    setFeedbackChatsList(updated);
    setNewFeedbackChat({
      platform: 'whatsapp',
      customer_name: '',
      perfume: '',
      image_url: '',
      caption: ''
    });
    try {
      await updateSiteSetting('customer_feedback', {
        show_testimonials: homeForm.show_testimonials,
        chats: updated
      });
      showToast('تمت إضافة صورة محادثة العميل ونشرها فوراً! 💬');
    } catch {
      showToast('تعذر حفظ المحادثة.', 'error');
    }
  };

  const handleDeleteFeedbackChat = async (idToDelete) => {
    const updated = feedbackChatsList.filter(c => c.id !== idToDelete);
    setFeedbackChatsList(updated);
    try {
      await updateSiteSetting('customer_feedback', {
        show_testimonials: homeForm.show_testimonials,
        chats: updated
      });
      showToast('تم حذف صورة المحادثة.');
    } catch {
      showToast('تعذر الحذف.', 'error');
    }
  };

  // --- COUPONS HANDLERS ---
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    try {
      const updated = [
        ...couponsList,
        {
          code: newCoupon.code.trim().toUpperCase(),
          discount_percent: Number(newCoupon.discount_percent) || 10,
          is_active: true
        }
      ];
      await updateSiteSetting('coupons', updated);
      setCouponsList(updated);
      setNewCoupon({ code: '', discount_percent: 15 });
      showToast('تم إنشاء كود الخصم الجديد بنجاح!');
    } catch (err) {
      showToast('تعذر إضافة الكوبون.', 'error');
    }
  };

  const handleDeleteCoupon = async (codeToDelete) => {
    try {
      const updated = couponsList.filter(c => c.code !== codeToDelete);
      await updateSiteSetting('coupons', updated);
      setCouponsList(updated);
      showToast('تم حذف الكوبون.');
    } catch (err) {
      showToast('تعذر حذف الكوبون.', 'error');
    }
  };

  // Filtered Products
  const filteredProducts = productsList.filter(p => {
    const q = productSearch.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.name_en && p.name_en.toLowerCase().includes(q)) ||
      (p.scent_family && p.scent_family.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    );
  });

  // Filtered Orders
  const filteredOrders = ordersList.filter(o => {
    if (orderStatusFilter !== 'all' && o.order_status !== orderStatusFilter) return false;
    if (orderPaymentFilter !== 'all' && o.payment_status !== orderPaymentFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = o.id && o.id.toLowerCase().includes(q);
      const matchName = o.customer_name && o.customer_name.toLowerCase().includes(q);
      const matchPhone = o.customer_phone && o.customer_phone.includes(q);
      const matchCity = o.shipping_city && o.shipping_city.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  const adminUser = getAdminUser() || { name: 'مدير دار كون', email: 'admin@koonperfume.com' };

  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Toast Notification */}
      {toastMsg.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs font-bold transition-all border ${
          toastMsg.type === 'error'
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
        }`}>
          {toastMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* TOP ADMIN HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-indigo-600/20 border border-amber-500/30 flex items-center justify-center p-1.5 shadow-md shadow-amber-500/10">
            <img src="/koon_emblem_hq.webp" alt="Logo" className="w-full h-full object-contain filter drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-white">{at.dashboard || 'لوحة التحكم الفلكية'}</h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-300">
                PRO ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400">دار كون للعطور • {adminUser.email}</p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Refresh Button */}
          <button
            onClick={fetchDashboardData}
            title="تحديث البيانات"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-amber-400 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'he' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-300 hover:text-amber-300 transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{language === 'ar' ? 'עברית' : 'العربية'}</span>
          </button>

          {/* Visit Live Store */}
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-300 hover:text-amber-300 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>عرض المتجر</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={at.logout || 'تسجيل الخروج'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{at.logout || 'خروج'}</span>
          </button>
        </div>
      </header>

      {/* TABS NAVIGATION BAR */}
      <nav className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 overflow-x-auto flex gap-1 py-1">
        {[
          { id: 'overview', label: at.tabs?.overview || 'نظرة عامة والإحصائيات', icon: LayoutDashboard },
          { id: 'products', label: at.tabs?.products || 'إدارة العطور', icon: Package, badge: productsList.length },
          { id: 'orders', label: at.tabs?.orders || 'طلبيات الدفع عند الاستلام', icon: ShoppingBag, badge: stats.newOrdersCount, badgeColor: 'bg-amber-500' },
          { id: 'homepage', label: at.tabs?.homepage || 'محتوى الصفحة الرئيسية', icon: Home },
          { id: 'settings', label: at.tabs?.settings || 'إعدادات وأقسام الموقع', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-950 font-black ${tab.badgeColor || 'bg-slate-800 text-slate-200'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* MAIN TAB CONTENT */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & STATS */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Sales */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/30 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{at.stats?.totalRevenue || 'إجمالي المبيعات'}</span>
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mt-3">
                  {Number(stats.totalRevenue || 0).toFixed(2)} <span className="text-sm font-normal text-amber-400">{currency}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  شامل كافة طلبيات الدفع عند الاستلام المؤكدة
                </div>
              </div>

              {/* Card 2: Cash Pending Collection */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-amber-500/20 backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300">{at.stats?.pendingCash || 'مستحق للتحصيل عند التسليم'}</span>
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Banknote className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-300 mt-3">
                  {Number(stats.pendingCash || 0).toFixed(2)} <span className="text-sm font-normal text-amber-400">{currency}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  نقد مستحق من الزبائن مع مناديب الشحن
                </div>
              </div>

              {/* Card 3: Collected Cash */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/30 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">{at.stats?.collectedCash || 'تم تحصيله نقداً'}</span>
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-400 mt-3">
                  {Number(stats.collectedCash || 0).toFixed(2)} <span className="text-sm font-normal text-slate-300">{currency}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  أموال استلمها المناديب وتم إيداعها
                </div>
              </div>

              {/* Card 4: Orders & Products Count */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/30 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{at.stats?.totalOrders || 'إجمالي الطلبات'}</span>
                  <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mt-3 flex items-baseline gap-2">
                  <span>{stats.ordersCount || ordersList.length}</span>
                  {stats.newOrdersCount > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                      {stats.newOrdersCount} جديد
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  {productsList.length} عطور فاخرة مفعلة في المتجر
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent COD Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Orders List (2 Cols) */}
              <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <h2 className="text-base font-bold text-white">آخر طلبيات الدفع عند الاستلام</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-400 hover:underline cursor-pointer"
                  >
                    عرض الكل ({ordersList.length})
                  </button>
                </div>

                {ordersList.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-600" />
                    <p className="text-xs">لا توجد طلبيات مسجلة حتى الآن.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/60">
                    {ordersList.slice(0, 5).map(order => (
                      <div key={order.id} className="py-3.5 flex items-center justify-between hover:bg-slate-900/40 px-2 rounded-xl transition">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-400">{order.id}</span>
                            <span className="text-xs font-bold text-white">{order.customer_name}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {order.shipping_city} • {order.items?.length || 1} منتج • {new Date(order.created_at).toLocaleDateString(language === 'he' ? 'he-IL' : 'ar-SA')}
                          </p>
                        </div>
                        <div className="text-left flex items-center gap-3">
                          <span className="text-xs font-bold text-white">
                            {Number(order.total_amount).toFixed(2)} {currency}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.order_status === 'new' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            order.order_status === 'shipped' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                            order.order_status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {at.orders?.statuses?.[order.order_status] || order.order_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Admin Actions (1 Col) */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>إجراءات إدارية سريعة</span>
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={handleOpenNewProduct}
                    className="w-full p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>إضافة عطر فلكي جديد</span>
                    </div>
                    <span>←</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-indigo-400" />
                      <span>متابعة شحنات المندوب</span>
                    </div>
                    <span>←</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('homepage')}
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-amber-400" />
                      <span>تعديل البانر والواجهة</span>
                    </div>
                    <span>←</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span>إنشاء كود خصم جديد</span>
                    </div>
                    <span>←</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCTS CRUD MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            {/* Products Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم، الماركة، أو العائلة العطرية..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={handleOpenNewProduct}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{at.products?.addNew || 'إضافة عطر جديد ✨'}</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 text-[11px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">الصورة</th>
                      <th className="p-4">اسم العطر</th>
                      <th className="p-4">العائلة والتصنيف</th>
                      <th className="p-4">السعر الحالي</th>
                      <th className="p-4">الأكثر طلباً</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-500">
                          لم يتم العثور على أي عطور تطابق البحث.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-800/30 transition">
                          <td className="p-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 border border-slate-800 flex items-center justify-center">
                              <img 
                                src={prod.images?.[0] || prod.image_url} 
                                alt={prod.name} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{prod.name}</div>
                            <div className="text-[11px] text-slate-400 font-serif tracking-wider uppercase">
                              {prod.name_en || prod.nameEn}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-slate-300 font-medium">{prod.scent_family || prod.scentFamily}</div>
                            <div className="text-[10px] text-amber-400/90 mt-0.5">
                              {prod.gender === 'men' ? 'رجالي' : prod.gender === 'women' ? 'نسائي' : 'للجنسين'} • {prod.season}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-amber-400 text-sm">
                              {prod.price} {currency}
                            </div>
                            {prod.original_price && prod.original_price > prod.price && (
                              <div className="text-[10px] text-slate-500 line-through">
                                {prod.original_price} {currency}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleProductStatus(prod, 'is_bestseller')}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                (prod.is_bestseller || prod.isBestseller)
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {(prod.is_bestseller || prod.isBestseller) ? '⭐ الأكثر مبيعاً' : 'عادي'}
                            </button>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleProductStatus(prod, 'is_active')}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                prod.is_active !== false
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              {prod.is_active !== false ? 'متاح بالمتجر' : 'معطل'}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                title="تعديل العطر"
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setDeleteConfirmId(prod.id)}
                                title="حذف العطر"
                                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CASH ON DELIVERY (COD) ORDERS */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {/* Orders Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search Input */}
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute top-2.5 right-3" />
                  <input
                    type="text"
                    placeholder="ابحث برقم الطلب، اسم العميل، الهاتف، أو المدينة..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="all">كافة حالات الطلب</option>
                  <option value="new">طلب جديد 🟡</option>
                  <option value="processing">جاري التجهيز 🔵</option>
                  <option value="shipped">خرج مع المندوب 🟣</option>
                  <option value="delivered">تم التوصيل بنجاح 🟢</option>
                  <option value="cancelled">ملغي 🔴</option>
                </select>

                {/* Payment Status Filter */}
                <select
                  value={orderPaymentFilter}
                  onChange={(e) => setOrderPaymentFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="all">كافة حالات التحصيل</option>
                  <option value="pending_cash">قيد التحصيل نقداً 💵</option>
                  <option value="collected">تم الاستلام نقدياً ✅</option>
                </select>
              </div>

              <div className="text-xs text-slate-400 font-bold">
                عرض {filteredOrders.length} من أصل {ordersList.length} طلبية
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 text-[11px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">{at.orders?.orderId || 'رقم الطلب'}</th>
                      <th className="p-4">{at.orders?.customer || 'العميل'}</th>
                      <th className="p-4">{at.orders?.phone || 'الهاتف للتوصيل'}</th>
                      <th className="p-4">{at.orders?.city || 'المدينة والعنوان'}</th>
                      <th className="p-4">{at.orders?.amount || 'المبلغ المطلوب نقداً'}</th>
                      <th className="p-4">{at.orders?.orderStatus || 'حالة الطلب'}</th>
                      <th className="p-4">{at.orders?.paymentStatus || 'التحصيل النقدي'}</th>
                      <th className="p-4 text-center">{at.orders?.actions || 'الإجراءات'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-slate-500">
                          لا توجد طلبيات تطابق الفلاتر المحددة.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-800/30 transition">
                          <td className="p-4">
                            <span className="font-mono font-bold text-amber-400">{order.id}</span>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {new Date(order.created_at).toLocaleDateString(language === 'he' ? 'he-IL' : 'ar-SA')}
                            </div>
                          </td>
                          <td className="p-4 font-bold text-white">
                            {order.customer_name}
                          </td>
                          <td className="p-4">
                            <a 
                              href={`https://wa.me/${(order.customer_phone || '').replace(/[^0-9]/g, '')}`}
                              target="_blank" 
                              rel="noreferrer"
                              className="text-amber-300 font-mono hover:underline flex items-center gap-1"
                              title="محادثة واتساب سريعة مع العميل"
                            >
                              <span>{order.customer_phone}</span>
                            </a>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-300">{order.shipping_city}</div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{order.shipping_address}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-black text-amber-400 text-sm">
                              {Number(order.total_amount).toFixed(2)} {currency}
                            </div>
                            <div className="text-[10px] text-slate-400">الدفع عند الاستلام</div>
                          </td>
                          <td className="p-4">
                            <select
                              value={order.order_status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer font-bold"
                            >
                              <option value="new">طلب جديد 🟡</option>
                              <option value="processing">جاري التجهيز 🔵</option>
                              <option value="shipped">خرج مع المندوب 🟣</option>
                              <option value="delivered">تم التوصيل 🟢</option>
                              <option value="cancelled">ملغي 🔴</option>
                            </select>
                          </td>
                          <td className="p-4">
                            {order.payment_status === 'collected' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>تم الاستلام نقدياً</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleMarkPaymentCollected(order.id)}
                                className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 hover:bg-emerald-500/20 hover:text-emerald-300 border border-amber-500/30 text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                                title="اضغط عند استلام المبلغ نقداً من العميل/المندوب"
                              >
                                <Banknote className="w-3 h-3" />
                                <span>قيد التحصيل (اضغط لتأكيد الاستلام)</span>
                              </button>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition cursor-pointer"
                              title="عرض تفاصيل الطلب الكاملة"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: HOMEPAGE CMS & CONTENT */}
        {/* ========================================================================= */}
        {activeTab === 'homepage' && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">{at.homepage?.title || 'تخصيص محتوى وترتيب أقسام الصفحة الرئيسية'}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  تحكم بظهور واختفاء الأقسام، النصوص تحت الشعار، أزرار الواجهة، وبانر الخصومات باللغتين العربية والعبرية.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveHomepageCMS} className="space-y-6">
              
              {/* 1. SECTIONS VISIBILITY MANAGER (إدارة ظهور واختفاء أقسام الموقع) */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">إدارة ظهور واختفاء أقسام الصفحة الرئيسية</h3>
                </div>
                
                <p className="text-xs text-slate-400">
                  حدد الأقسام التي ترغب بعرضها أو إخفائها فوراً من الواجهة الرئيسية للمتجر:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={homeForm.show_bestsellers}
                      onChange={(e) => setHomeForm({ ...homeForm, show_bestsellers: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white">قسم العطور الأكثر شهرة</span>
                      <span className="text-[10px] text-slate-400">كتالوج المنتجات المختارة</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={homeForm.show_promo_banner}
                      onChange={(e) => setHomeForm({ ...homeForm, show_promo_banner: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white">قسم العروض والبانر</span>
                      <span className="text-[10px] text-slate-400">الخصومات وكود الكوبون</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={homeForm.show_testimonials}
                      onChange={(e) => setHomeForm({ ...homeForm, show_testimonials: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white">آراء العملاء (Feedback)</span>
                      <span className="text-[10px] text-slate-400">الشهادات والتقييمات المعتمدة</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 2. HERO SECTION & LOGO SUBTITLES / BUTTONS */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">الواجهة الرئيسية والنص والأزرار تحت الشعار</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      العبارة الترويجية العلوية فوق العنوان (عربي)
                    </label>
                    <input
                      type="text"
                      value={homeForm.hero_tagline_ar}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_tagline_ar: e.target.value })}
                      placeholder="دار العطور الفلكية الأولى • توليفات نيش فائقة التركيز"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      العبارة الترويجية العلوية (عبري עברית)
                    </label>
                    <input
                      type="text"
                      value={homeForm.hero_tagline_he}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_tagline_he: e.target.value })}
                      placeholder="בית הבישום הקוסמי הראשון • תמציות נישה בריכוז עילאי"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      عنوان المتجر الرئيسي (عربي)
                    </label>
                    <input
                      type="text"
                      value={homeForm.hero_title_ar}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_title_ar: e.target.value })}
                      placeholder="عطورٌ نُسجت من سديم الكون"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      عنوان المتجر (عبري עברית)
                    </label>
                    <input
                      type="text"
                      value={homeForm.hero_title_en}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_title_en: e.target.value })}
                      placeholder="בשמים שנארגו מערפיליות היקום"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Subtitle / Text under logo (مباشرة تحت الشعار) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-amber-400 mb-1">
                      النص تحت الشعار (عربي) 🇸🇦
                    </label>
                    <textarea
                      rows="2"
                      value={homeForm.hero_subtitle_ar}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_subtitle_ar: e.target.value })}
                      placeholder="نجمع بين نفائس الزيوت المعتقة في غراس الفرنسية وسحر الأجرام السماوية لنصنع بصمة عطرية لا تُمحى تدوم لأيام."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-amber-400 mb-1">
                      النص تحت الشعار (عبري עברית) 🇮🇱
                    </label>
                    <textarea
                      rows="2"
                      value={homeForm.hero_subtitle_he}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_subtitle_he: e.target.value })}
                      placeholder="יוקרה בממדים קוסמיים. שמנים נדירים שנרקחו להעניק נוכחות בלתי נשכחת הנשארת לאורך ימים."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Hero Buttons Controls (التحكم بالأزرار تحت الشعار) */}
                <div className="pt-3 border-t border-slate-800">
                  <span className="block text-xs font-bold text-white mb-2">التحكم في الأزرار التي تحت الشعار:</span>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={homeForm.show_hero_explore_btn}
                        onChange={(e) => setHomeForm({ ...homeForm, show_hero_explore_btn: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                      />
                      <span>إظهار زر "استكشف عطور كون الفلكية"</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={homeForm.show_hero_quiz_btn}
                        onChange={(e) => setHomeForm({ ...homeForm, show_hero_quiz_btn: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                      />
                      <span>إظهار زر "مستكشف العطور (Quiz)"</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 3. PROMO, DISCOUNTS & BANNER SECTION (قسم الإعلانات والخصومات مع مساحة للبانر) */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">قسم الإعلانات (الخصومات، كوبونات الخصم، ومساحة البانر)</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      عنوان العرض الترويجي (عربي)
                    </label>
                    <input
                      type="text"
                      value={homeForm.promo_title_ar}
                      onChange={(e) => setHomeForm({ ...homeForm, promo_title_ar: e.target.value })}
                      placeholder="باقة المجرة الفاخرة: خصم إضافي + عينة نيش وتغليف ملكي مجاني"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      عنوان العرض الترويجي (عبري עברית)
                    </label>
                    <input
                      type="text"
                      value={homeForm.promo_title_he}
                      onChange={(e) => setHomeForm({ ...homeForm, promo_title_he: e.target.value })}
                      placeholder="מארז הגלקסיה המלכותי: הנחה מיוחדת + דוגמית נישה ומשלוח חינם"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      تفاصيل العرض الترويجي (عربي)
                    </label>
                    <textarea
                      rows="2"
                      value={homeForm.promo_subtitle_ar}
                      onChange={(e) => setHomeForm({ ...homeForm, promo_subtitle_ar: e.target.value })}
                      placeholder="اقتنِ عطرك النيش المفضل مع شحن مبرد مجاني لكافة المناطق..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      كود كوبون الخصم المعروض
                    </label>
                    <input
                      type="text"
                      value={homeForm.promo_coupon_code}
                      onChange={(e) => setHomeForm({ ...homeForm, promo_coupon_code: e.target.value })}
                      placeholder="KOON10"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-amber-300 font-mono tracking-wider focus:outline-none focus:border-amber-400 uppercase"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <ImageUpload
                      value={homeForm.promo_banner_image}
                      onChange={(url) => setHomeForm({ ...homeForm, promo_banner_image: url })}
                      label="صورة البانر الإعلاني (رفع من الجهاز أو إدخال رابط)"
                      helperText="اختر صورة بانر عريضة لعرضها كخلفية لقسم العروض والخصومات في الصفحة الرئيسية"
                      aspectRatio="banner"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Announcement Bar Section */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">شريط الإعلانات الترويجي العلوي</h3>
                  </div>
                  <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={homeForm.announcement_enabled}
                      onChange={(e) => setHomeForm({ ...homeForm, announcement_enabled: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                    />
                    <span>تفعيل الشريط</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      النص بالعربية 🇸🇦
                    </label>
                    <input
                      type="text"
                      value={homeForm.announcement_ar}
                      onChange={(e) => setHomeForm({ ...homeForm, announcement_ar: e.target.value })}
                      placeholder="شحن كوني مجاني للطلبات فوق 350 ر.س..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      النص بالعبرية 🇮🇱 (עברית)
                    </label>
                    <input
                      type="text"
                      value={homeForm.announcement_he}
                      onChange={(e) => setHomeForm({ ...homeForm, announcement_he: e.target.value })}
                      placeholder="משלוח קוסמי חינם בהזמנות מעל 350 ₪..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Social Media Feedback Chats Manager (إدارة صور محادثات وسائل التواصل) */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">إدارة صور محادثات التواصل الاجتماعي (Customer Feedback)</h3>
                      <p className="text-[11px] text-slate-400">إضافة صور لقطات شاشة لمحادثات واتساب وإنستغرام لإظهار مصداقية المتجر</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                    {feedbackChatsList.length} محادثة معروضة
                  </span>
                </div>

                {/* Form to add a new chat screenshot */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-200 block">إضافة صورة محادثة جديدة 📸</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">المنصة</label>
                      <select
                        value={newFeedbackChat.platform}
                        onChange={(e) => setNewFeedbackChat({ ...newFeedbackChat, platform: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="whatsapp">واتساب (WhatsApp)</option>
                        <option value="instagram">إنستغرام (Instagram)</option>
                        <option value="twitter">تويتر (X)</option>
                        <option value="snapchat">سناب شات (Snapchat)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">اسم العميل والمدينة</label>
                      <input
                        type="text"
                        value={newFeedbackChat.customer_name}
                        onChange={(e) => setNewFeedbackChat({ ...newFeedbackChat, customer_name: e.target.value })}
                        placeholder="سارة العتيبي - الرياض"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">العطر المجرب</label>
                      <input
                        type="text"
                        value={newFeedbackChat.perfume}
                        onChange={(e) => setNewFeedbackChat({ ...newFeedbackChat, perfume: e.target.value })}
                        placeholder="سديم العود الملكي"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">اقتباس أو تعليق مختصر من المحادثة</label>
                    <input
                      type="text"
                      value={newFeedbackChat.caption}
                      onChange={(e) => setNewFeedbackChat({ ...newFeedbackChat, caption: e.target.value })}
                      placeholder="العطر ثباته فواح وخيالي، شكراً دار كون على التغليف الفخم!"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Image Upload for Feedback Chat Screenshot */}
                  <ImageUpload
                    value={newFeedbackChat.image_url}
                    onChange={(url) => setNewFeedbackChat({ ...newFeedbackChat, image_url: url })}
                    label="صورة لقطة شاشة المحادثة (رفع من الجهاز أو إدخال رابط)"
                    helperText="ارفع صورة لقطة شاشة لمحادثة واتساب أو إنستغرام لتوثيق تجربة العميل الحقيقية"
                    aspectRatio="auto"
                  />

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddFeedbackChat}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة المحادثة لقائمة العرض ✨</span>
                    </button>
                  </div>
                </div>

                {/* List of existing feedback chat screenshots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {feedbackChatsList.map((chat) => (
                    <div
                      key={chat.id}
                      className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-3 relative group"
                    >
                      <img
                        src={chat.image_url}
                        alt={chat.customer_name}
                        className="w-16 h-20 object-cover rounded-lg border border-slate-800 shrink-0 bg-slate-900"
                      />
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                            {chat.platform === 'whatsapp' ? 'واتساب' : chat.platform === 'instagram' ? 'إنستغرام' : 'تواصل'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteFeedbackChat(chat.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition cursor-pointer"
                            title="حذف المحادثة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate mt-1">{chat.customer_name}</h4>
                        <span className="text-[11px] text-amber-300/80 truncate block">{chat.perfume}</span>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 italic">
                          "{chat.caption}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-xl shadow-amber-500/20 hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التغييرات ونشرها فوراً على المتجر 🪐</span>
              </button>

            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SITE SETTINGS & COUPONS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">إدارة أكواد الخصم والإعدادات العامة</h2>
              <p className="text-xs text-slate-400 mt-1">تحكم في أكواد الخصم المتاحة لعملاء المتجر وتفاصيل الدعم والتواصل.</p>
            </div>

            {/* Coupons Management */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Tag className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">أكواد وكوبونات الخصم</h3>
              </div>

              {/* Add Coupon Form */}
              <form onSubmit={handleAddCoupon} className="flex flex-wrap items-end gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">كود الكوبون</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: VIP20"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono tracking-wider focus:outline-none focus:border-amber-400 uppercase"
                  />
                </div>

                <div className="w-32">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={newCoupon.discount_percent}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_percent: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition cursor-pointer"
                >
                  إضافة الكوبون
                </button>
              </form>

              {/* Coupons Table */}
              <div className="divide-y divide-slate-800">
                {couponsList.map((coup, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 font-mono font-bold text-amber-300 text-xs">
                        {coup.code}
                      </span>
                      <span className="text-xs text-slate-300">
                        خصم {coup.discount_percent}% على كافة المشتريات
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteCoupon(coup.code)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                      title="حذف الكوبون"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick System Summary */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-2">
              <h4 className="font-bold text-slate-200">حالة الربط والأمان</h4>
              <p>• قاعدة البيانات: Supabase PostgreSQL (متصلة ومؤمنة بنظام RLS)</p>
              <p>• الدفع: الدفع عند الاستلام حصراً (Cash on Delivery)</p>
              <p>• اللغات المدعومة: العربية 🇸🇦 والعبرية 🇮🇱 (RTL)</p>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {/* ========================================================================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {editingProduct ? at.products?.edit || 'تعديل العطر' : at.products?.addNew || 'إضافة عطر جديد ✨'}
                </h3>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">اسم العطر بالعربية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: كون أبسولوت"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">اسم العطر بالإنجليزية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: Koon Absolute"
                    value={productForm.name_en}
                    onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-serif"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">السعر الحالي ({currency}) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="480"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">السعر قبل الخصم ({currency})</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="600"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الفئة المستهدفة</label>
                  <select
                    value={productForm.gender}
                    onChange={(e) => setProductForm({ ...productForm, gender: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="unisex">رجالي وستاتي (للجنسين)</option>
                    <option value="men">عطور رجالية</option>
                    <option value="women">عطور نسائية (ستاتي)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الموسم المناسب</label>
                  <select
                    value={productForm.season}
                    onChange={(e) => setProductForm({ ...productForm, season: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all_seasons">جميع الفصول</option>
                    <option value="summer">صيفي منعش</option>
                    <option value="winter">شتوي دافئ</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">العائلة العطرية</label>
                  <input
                    type="text"
                    placeholder="شرقي خشبي فاخر / سويتي عنبري / جلدي / حمضي..."
                    value={productForm.scent_family}
                    onChange={(e) => setProductForm({ ...productForm, scent_family: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    value={productForm.image_url}
                    onChange={(url) => setProductForm({ ...productForm, image_url: url })}
                    label="صورة العطر الرئيسية (رفع من جهازك أو رابط)"
                    helperText="الصيغ المدعومة: JPG, PNG, WEBP حتى 15MB. تظهر كصورة أساسية في الكتالوج"
                    aspectRatio="square"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">النبذة التسويقية المختصرة</label>
                  <input
                    type="text"
                    placeholder="توقيع الدار الأيقوني - عبير العود الملكي ونفحات النجوم..."
                    value={productForm.tagline}
                    onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الوصف العطري التفصيلي</label>
                  <textarea
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Scent Notes Breakdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">القمة العطرية (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={productForm.notes_top}
                    onChange={(e) => setProductForm({ ...productForm, notes_top: e.target.value })}
                    placeholder="زعفران، برغموت..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">قلب العطر (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={productForm.notes_heart}
                    onChange={(e) => setProductForm({ ...productForm, notes_heart: e.target.value })}
                    placeholder="عنبر، خشب الأرز..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">قاعدة العطر (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={productForm.notes_base}
                    onChange={(e) => setProductForm({ ...productForm, notes_base: e.target.value })}
                    placeholder="عود كمبودي، مسك كوني، جلد..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.is_bestseller}
                      onChange={(e) => setProductForm({ ...productForm, is_bestseller: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                    />
                    <span>⭐ تمييز كـ "الأكثر مبيعاً"</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.is_featured}
                      onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                    />
                    <span>✨ إبراز في الواجهة الرئيسية</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.is_active}
                      onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                    />
                    <span>🟢 نشط ومتاح للشراء بالمتجر</span>
                  </label>
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  {at.products?.cancel || 'إلغاء'}
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  {at.products?.save || 'حفظ وتحديث العطر'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ORDER DETAILS VIEW (COD) */}
      {/* ========================================================================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="font-mono text-sm font-bold text-amber-400">{selectedOrderDetails.id}</span>
                <h3 className="text-base font-bold text-white mt-0.5">تفاصيل طلبية الدفع عند الاستلام</h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details & WhatsApp Action */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white text-sm">{selectedOrderDetails.customer_name}</span>
                <a
                  href={`https://wa.me/${(selectedOrderDetails.customer_phone || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>تواصل واتساب مع العميل</span>
                </a>
              </div>

              <div className="text-xs text-slate-300 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedOrderDetails.shipping_city} • {selectedOrderDetails.shipping_address}</span>
              </div>

              {selectedOrderDetails.notes && (
                <div className="text-[11px] text-amber-300/90 pt-1 border-t border-slate-800/80">
                  ملاحظة العميل: {selectedOrderDetails.notes}
                </div>
              )}
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300">العطور المطلوبة:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(selectedOrderDetails.items || []).map((it, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-xs font-bold text-white">{it.name}</div>
                      <div className="text-[10px] text-slate-400">{it.selectedSize || '100ml'} × {it.quantity || 1}</div>
                    </div>
                    <div className="text-xs font-bold text-amber-400">
                      {(it.price * (it.quantity || 1)).toFixed(2)} {currency}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount & Cash Collection Status */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">المبلغ المطلوب تحصيله نقداً:</span>
                <div className="text-xl font-black text-amber-400">
                  {Number(selectedOrderDetails.total_amount).toFixed(2)} {currency}
                </div>
              </div>

              {selectedOrderDetails.payment_status === 'collected' ? (
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  تم الاستلام نقدياً ✅
                </span>
              ) : (
                <button
                  onClick={() => handleMarkPaymentCollected(selectedOrderDetails.id)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition cursor-pointer"
                >
                  تأكيد استلام المبلغ نقداً 💵
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">هل أنت متأكد من حذف هذا العطر؟</h3>
            <p className="text-xs text-slate-400">سيتم مسح العطر نهائياً من قاعدة بيانات المتجر ولن يتمكن الزبائن من شرائه.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer hover:bg-rose-500"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

