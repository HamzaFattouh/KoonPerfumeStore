import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Flame, Star, Copy, Check, Sparkles, Tag, Gift } from 'lucide-react';
import { getProducts } from '../services/productService';
import { getSiteSettings } from '../services/adminService';
import { TESTIMONIALS } from '../data/products';
import ProductCard from '../components/products/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import CosmicLogoHero from '../components/home/CosmicLogoHero';

const Home = () => {
  const { language } = useLanguage();

  // Active Category Filter for Showcase
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [siteSettings, setSiteSettings] = useState({});
  const [copiedCoupon, setCopiedCoupon] = useState(false);

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

  return (
    <div className="space-y-20 pb-24 text-slate-100">
      
      {/* 1. Masterpiece Cosmic Emblem & Brand Hero Section (Text & Buttons controlled from Admin) */}
      <CosmicLogoHero heroSettings={siteSettings?.hero_section} />

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

      {/* 4. Customer Feedback & Testimonials (Controlled from Admin) */}
      {showTestimonials && (
        <section id="testimonials-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              {language === 'ar' ? 'شهادات نعتز بها' : 'חוות דעת לקוחות'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {language === 'ar' ? 'ماذا يقول عشاق كون بيرفيوم؟' : 'מה הלקוחות שלנו אומרים?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </section>
      )}

    </div>
  );
};

export default Home;
