import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Flame, 
  Star, 
  Copy, 
  Check, 
  Sparkles, 
  Tag, 
  Gift,
  MessageSquare,
  ZoomIn,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getProducts } from '../services/productService';
import { getSiteSettings, getCachedSiteSettings } from '../services/adminService';
import { TESTIMONIALS, DEFAULT_SOCIAL_CHATS } from '../data/products';
import ProductCard from '../components/products/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import PerfumeShelfHero from '../components/home/PerfumeShelfHero';

const Home = () => {
  const { language } = useLanguage();

  // Active Category Filter for Showcase
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [siteSettings, setSiteSettings] = useState(() => getCachedSiteSettings() || {});
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Feedback display states: 'chats' (social screenshots) | 'reviews' (text reviews)
  const [feedbackTab, setFeedbackTab] = useState('chats');
  const [lightboxChat, setLightboxChat] = useState(null);
  const chatScrollRef = useRef(null);

  const scrollChats = (direction) => {
    if (chatScrollRef.current) {
      const scrollAmount = 380;
      chatScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Fetch live products & dynamic site settings
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProducts(true);

    Promise.all([
      getProducts().catch(() => []),
      getSiteSettings().catch(() => ({}))
    ]).then(([prods, settings]) => {
      if (isMounted) {
        setProducts(prods || []);
        setSiteSettings(settings || {});
        setIsLoadingProducts(false);
      }
    });

    return () => { isMounted = false; };
  }, []);

  const handleCopyCoupon = (code = 'KOON10') => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  // Filter products based on active tab
  const getFilteredProducts = () => {
    if (activeCategory === 'bestseller') {
      return products.filter(p => p.isBestseller).slice(0, 4);
    }
    if (activeCategory === 'oriental') {
      return products.filter(p => p.category === 'unisex' || p.category === 'men').slice(0, 4);
    }
    if (activeCategory === 'floral') {
      return products.filter(p => p.category === 'women').slice(0, 4);
    }
    if (activeCategory === 'niche') {
      return products.filter(p => p.badge?.includes('فاخر') || p.badge?.includes('كوني') || p.category === 'unisex').slice(0, 4);
    }
    // 'all' default: bestsellers + featured
    return products.slice(0, 4);
  };

  const filteredProducts = getFilteredProducts();

  // Section Visibility Flags (Controlled from Admin)
  const sections = siteSettings?.homepage_sections || {};
  const showBestsellers = sections.show_bestsellers !== false;
  const showPromoBanner = sections.show_promo_banner !== false;
  const showTestimonials = sections.show_testimonials !== false;

  const promoData = siteSettings?.promo_banner || {};
  const activeCoupon = promoData.coupon_code || 'KOON10';

  // Customer Feedback Social Media Chats
  const fbData = siteSettings?.customer_feedback || {};
  const socialChats = (Array.isArray(fbData.chats) && fbData.chats.length > 0)
    ? fbData.chats
    : DEFAULT_SOCIAL_CHATS;

  return (
    <div className="space-y-20 pb-24 text-slate-100">
      
      {/* 1. Interactive 3D Luxury Perfume Shelf (رف العطور التفاعلي) */}
      <PerfumeShelfHero
        products={products}
        isLoading={isLoadingProducts}
        heroSettings={siteSettings?.hero_section}
      />

      {/* 2. Curated Luxury Perfumes Showcase (Controlled from Admin) */}
      {showBestsellers && (
        <section id="products-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'مختارات لعشاق التميز والندرة' : 'נבחרת הניחוחות המובילים'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {language === 'ar' ? 'العطور الأكثر طلباً وشهرة' : 'הבשמים המבוקשים ביותר'}
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md">
              {[
                { id: 'all', labelAr: 'الكل', labelHe: 'הכל' },
                { id: 'bestseller', labelAr: 'الأكثر مبيعاً', labelHe: 'הנמכרים ביותר' },
                { id: 'oriental', labelAr: 'المدار الشرقي', labelHe: 'מזרחי ועוד' },
                { id: 'floral', labelAr: 'سديم الزهور', labelHe: 'וניל ופרחים' },
                { id: 'niche', labelAr: 'إصدارات نيش', labelHe: 'מהדורות נישה' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {language === 'ar' ? tab.labelAr : tab.labelHe}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-slate-900/40 border border-slate-800/60 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/50 text-slate-200 hover:text-amber-300 text-xs sm:text-sm font-bold backdrop-blur-md transition-all shadow-lg hover:shadow-amber-500/5 cursor-pointer"
            >
              <span>{language === 'ar' ? 'عرض الكتالوج الكامل والتشكيلة الفلكية' : 'צפה בכל הקטלוג והקולקציות'}</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 3. Promotional Offers, Discounts & Coupons Banner with dedicated graphic space (Controlled from Admin) */}
      {showPromoBanner && (
        <section id="promo-banner-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 p-8 sm:p-12 shadow-2xl">
            {/* Ambient Background Banner Space / Image */}
            {promoData.banner_image_url && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none mix-blend-luminosity"
                style={{ backgroundImage: `url(${promoData.banner_image_url})` }}
              />
            )}
            
            {/* Gold Horizon Line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center lg:text-right max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                  <Gift className="w-4 h-4" />
                  <span>
                    {language === 'ar' 
                      ? (promoData.tag_ar || 'عروض المدار الكونية الاستثنائية • خصومات حصرية') 
                      : (promoData.tag_he || 'מבצעים קוסמיים מיוחדים • הנחות בלעדיות')}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {language === 'ar'
                    ? (promoData.title_ar || 'باقة المجرة الفاخرة: خصم إضافي + عينة نيش وتغليف ملكي مجاني')
                    : (promoData.title_he || 'מארז הגלקסיה המלכותי: הנחה מיוחדת + דוגמית נישה ומשלוח חינם')}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? (promoData.subtitle_ar || 'اقتنِ عطرك النيش المفضل مع شحن مبرد مجاني لكافة المناطق. استخدم كود الخصم الحصري أدناه قبل إتمام طلبك والدفع عند الاستلام.')
                    : (promoData.subtitle_he || 'הזמן את הבושם האהוב עליך עם משלוח מבוקר חינם ותשלום במזומן בעת המסירה. השתמש בקוד הקופון להנחה מיידית.')}
                </p>

                {/* Copyable Coupon Code Widget */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    onClick={() => handleCopyCoupon(activeCoupon)}
                    className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-950/90 border border-amber-500/50 hover:border-amber-400 rounded-xl text-amber-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-inner hover:scale-105 active:scale-95"
                    title="اضغط لنسخ كود الخصم"
                  >
                    {copiedCoupon ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-sans font-bold">
                          {language === 'ar' ? `تم نسخ الكود ${activeCoupon} بنجاح!` : `הקוד ${activeCoupon} הועתק!`}
                        </span>
                      </>
                    ) : (
                      <>
                        <Tag className="w-4 h-4 text-amber-400" />
                        <span>كود الخصم: <strong className="text-amber-400 font-black tracking-wider text-sm">{activeCoupon}</strong></span>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Banner Graphic & CTA Button */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <Link
                  to="/shop"
                  className="px-9 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 text-center cursor-pointer border border-amber-400"
                >
                  {language === 'ar' ? 'استكشف العروض وتسوق الآن 🪐' : 'גלה את המבצעים והזמן עכשיו'}
                </Link>
                <span className="text-[11px] text-slate-400">
                  {language === 'ar' ? 'الدفع نقداً عند استلام طلبك وتفقده' : 'תשלום במזומן בעת מסירה ובדיקת המוצר'}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Customer Feedback & Social Media Chat Screenshots (Controlled from Admin) */}
      {showTestimonials && (
        <section id="testimonials-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              {language === 'ar' ? 'تجارب حقيقية موثقة 100%' : 'חוות דעת וצילומי שיחות מאומתים'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {language === 'ar' ? 'ماذا يقول عملاؤنا عبر وسائل التواصل؟' : 'מה הלקוחות שלנו אומרים?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              {language === 'ar' 
                ? 'محادثات واقعية وشهادات موثقة من زبائن دار كون عبر إنستغرام، فيسبوك، وواتساب بعد استلام وتجربة عطورنا.'
                : 'שיחות אמיתיות ומשוב מלקוחות דרך אינסטגרם, פייסבוק, ווואטסאפ לאחר קבלת הבשמים.'}
            </p>

            {/* Official Social Media Channels (إنستغرام، فيسبوك، واتساب) with Horizontal Scroll if no space */}
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 px-1 scrollbar-none">
                <a
                  href="https://instagram.com/koonperfume"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 via-rose-500/15 to-amber-500/15 hover:from-pink-500/25 hover:to-amber-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold transition whitespace-nowrap shrink-0 hover:scale-105 shadow-sm"
                >
                  <span>📸 إنستغرام (Instagram)</span>
                </a>
                <a
                  href="https://facebook.com/koonperfume"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold transition whitespace-nowrap shrink-0 hover:scale-105 shadow-sm"
                >
                  <span>🌐 فيسبوك (Facebook)</span>
                </a>
                <a
                  href="https://wa.me/966501234567"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition whitespace-nowrap shrink-0 hover:scale-105 shadow-sm"
                >
                  <span>💬 واتساب (WhatsApp)</span>
                </a>
              </div>
            </div>

            {/* Toggle between Chat Screenshots & Text Reviews */}
            <div className="inline-flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl mt-4 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setFeedbackTab('chats')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  feedbackTab === 'chats'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'صور محادثات التواصل (إنستغرام، فيسبوك، واتساب)' : 'צילומי שיחות ברשתות'}</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackTab('reviews')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  feedbackTab === 'reviews'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'التقييمات والشهادات المكتوبة' : 'חוות דעת כתובות'}</span>
              </button>
            </div>
          </div>

          {/* VIEW A: Social Media Chat Screenshots (Scroll بالعرض اذا كان لا يوجد مساحة) */}
          {feedbackTab === 'chats' && (
            <div className="relative group/scroll animate-fade-in">
              
              {/* Scroll Controls & Swipe Indicator */}
              <div className="flex items-center justify-between pb-3 px-1 text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>اسحب أفقياً لتصفح المحادثات ↔️</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollChats('right')}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-amber-400 transition cursor-pointer shadow-md"
                    title="المحادثة السابقة"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollChats('left')}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-amber-400 transition cursor-pointer shadow-md"
                    title="المحادثة التالية"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Track (Scroll بالعرض بسلاسة) */}
              <div 
                ref={chatScrollRef}
                className="flex items-stretch gap-5 overflow-x-auto pb-6 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-slate-900/60"
              >
                {socialChats.map((chat, idx) => (
                  <div 
                    key={chat.id || idx}
                    className="w-[86vw] sm:w-[350px] lg:w-[370px] shrink-0 snap-center group/card bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 backdrop-blur-sm flex flex-col justify-between shadow-xl hover:-translate-y-1.5"
                  >
                    {/* Top Header: Platform Badge (Instagram, Facebook, WhatsApp) & Date */}
                    <div className="p-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/60">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                          chat.platform === 'whatsapp'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : chat.platform === 'facebook'
                            ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30'
                            : 'bg-gradient-to-r from-pink-500/15 via-rose-500/15 to-amber-500/15 text-rose-300 border border-rose-500/30'
                        }`}>
                          <span>{chat.platform === 'whatsapp' ? '💬' : chat.platform === 'facebook' ? '🌐' : '📸'}</span>
                          <span>{chat.platform_name || (chat.platform === 'whatsapp' ? 'واتساب WhatsApp' : chat.platform === 'facebook' ? 'فيسبوك Facebook' : 'إنستغرام Instagram')}</span>
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-500 font-mono">{chat.date || 'مؤخراً'}</span>
                    </div>

                    {/* Screenshot Container with Click to Zoom */}
                    <div 
                      onClick={() => setLightboxChat(chat)}
                      className="relative cursor-pointer overflow-hidden bg-slate-950 h-64 sm:h-72 flex items-center justify-center group/img"
                    >
                      <img 
                        src={chat.image_url} 
                        alt={`محادثة ${chat.customer_name}`} 
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 filter brightness-95"
                      />

                      {/* Gradient Overlay & Zoom Icon */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity" />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-xl shadow-amber-500/30">
                          <ZoomIn className="w-4 h-4" />
                          <span>تكبير المحادثة وقراءتها</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Details & Quote */}
                    <div className="p-5 space-y-3 bg-slate-950/40">
                      <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800 line-clamp-3">
                        "{chat.caption}"
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                        <div>
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span>{chat.customer_name}</span>
                            <span className="text-[10px] text-amber-400 font-bold">✓</span>
                          </span>
                          <span className="text-[11px] text-amber-400/90 block mt-0.5">
                            {chat.perfume}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setLightboxChat(chat)}
                          className="text-[11px] text-slate-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>عرض الصورة</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW B: Classic Written Testimonials */}
          {feedbackTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              {TESTIMONIALS.map((item) => (
                <div 
                  key={item.id}
                  className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 backdrop-blur-sm hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                    </div>
                    <div className="text-xs font-semibold text-amber-300">
                      {language === 'ar' ? `اشترى: ${item.perfume}` : `נרכש: ${item.perfume}`}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{item.comment}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1">
                      <span>{item.name}</span>
                      <span className="text-[10px] text-amber-400 font-bold">✓</span>
                    </span>
                    <span className="text-slate-400 text-[11px]">{item.city}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>
      )}

      {/* 5. LIGHTBOX MODAL FOR CHAT SCREENSHOTS (عند النقر على صورة المحادثة) */}
      {lightboxChat && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setLightboxChat(null)}
        >
          <div 
            className="relative bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  lightboxChat.platform === 'whatsapp'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : lightboxChat.platform === 'facebook'
                    ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30'
                    : 'bg-gradient-to-r from-pink-500/15 via-rose-500/15 to-amber-500/15 text-rose-300 border border-rose-500/30'
                }`}>
                  <span>{lightboxChat.platform === 'whatsapp' ? '💬' : lightboxChat.platform === 'facebook' ? '🌐' : '📸'}</span>
                  <span>{lightboxChat.platform_name || 'محادثة موثقة'}</span>
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">{lightboxChat.customer_name}</h4>
                  <span className="text-[11px] text-amber-400">{lightboxChat.perfume}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLightboxChat(null)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Full Image Display */}
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-black/50">
              <img 
                src={lightboxChat.image_url} 
                alt={`محادثة ${lightboxChat.customer_name}`}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-lg border border-slate-800" 
              />
            </div>

            {/* Modal Footer Caption */}
            <div className="p-4 bg-slate-900/80 border-t border-slate-800 text-xs text-slate-300 text-center italic">
              "{lightboxChat.caption}"
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
