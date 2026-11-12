import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Compass, 
  ShieldCheck, 
  Clock, 
  Star, 
  Gift, 
  Flame, 
  Award,
  Droplets,
  Truck,
  RotateCcw,
  Check,
  Copy,
  Layers,
  ChevronRight
} from 'lucide-react';
import { TESTIMONIALS } from '../data/products';
import { getProducts } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import CosmicLogoHero from '../components/home/CosmicLogoHero';

const Home = () => {
  const { t, language } = useLanguage();

  // Active Category Filter for Bestsellers
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch live products directly from Supabase / Backend API
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProducts(true);
    getProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data || []);
          setIsLoadingProducts(false);
        }
      })
      .catch((err) => {
        console.error('Error loading products for Home:', err);
        if (isMounted) setIsLoadingProducts(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Active Olfactory Pyramid Level ('top' | 'heart' | 'base')
  const [activePyramidLevel, setActivePyramidLevel] = useState('heart');

  // Coupon copy state
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Countdown timer for Cosmic Limited Offer
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
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

  // Olfactory Pyramid Data
  const pyramidData = {
    top: {
      titleAr: 'القمة العطرية (Top Notes)',
      titleHe: 'תווי ראש (Top Notes)',
      durationAr: 'أول 15 إلى 30 دقيقة',
      durationHe: '15-30 הדקות הראשונות',
      descAr: 'الوهج الكوني الأول الذي يستقبلك فور رش العطر. نفحات حيوية ومنعشة تمهد الطريق لعمق التوليفة.',
      descHe: 'הניצוץ הקוסמי הראשון שמקבל את פניך. תווים רעננים שסוללים את הדרך לעומק היצירה.',
      ingredients: [
        { nameAr: 'برغموت صقلي نقي', nameHe: 'ברגמוט סיציליאני טהור', originAr: 'إيطاليا', originHe: 'איטליה' },
        { nameAr: 'زعفران كشميري ملكي', nameHe: 'זעפרן קשמירי מלכותי', originAr: 'كشمير', originHe: 'קשמיר' },
        { nameAr: 'فلفل وردي بارد', nameHe: 'פלפל ורוד קריר', originAr: 'مدغشقر', originHe: 'מדגסקר' }
      ]
    },
    heart: {
      titleAr: 'قلب العطر (Heart Notes)',
      titleHe: 'תווי לב (Heart Notes)',
      durationAr: 'من ساعتين حتى 6 ساعات',
      durationHe: 'שעתיים עד 6 שעות',
      descAr: 'روح العطر وهويته الفلكية الثابتة. المزيج المتوازن الذي يفوح حولك ويترك أثراً جذاباً أينما حللت.',
      descHe: 'נשמת הבושם וזהותו הקוסמית היציבה. תערובת מאוזנת שמקרינה סביבך ניחוח מהפנט.',
      ingredients: [
        { nameAr: 'خشب الأرز الأطلسي المعتق', nameHe: 'עץ ארז אטלסי מיושן', originAr: 'المغرب', originHe: 'מרוקו' },
        { nameAr: 'ورد دي ماي المخملي', nameHe: 'ורד מאי קטיפתי', originAr: 'غراس، فرنسا', originHe: 'גראס, צרפת' },
        { nameAr: 'عنبر أبيض دافئ', nameHe: 'ענבר לבן חמים', originAr: 'المحيط الهندي', originHe: 'האוקיינוס ההודי' }
      ]
    },
    base: {
      titleAr: 'القاعدة العطرية (Base Notes)',
      titleHe: 'תווי בסיס (Base Notes)',
      durationAr: 'ثبات يدوم 18 إلى 36 ساعة',
      durationHe: 'עמידות הנמשכת 18-36 שעות',
      descAr: 'العمق الملكي الحقيقي والسر في الثبات الأسطوري لعطور كون. زيوت ثقيلة ونادرة تلتصق بالجلد والملابس لأيام.',
      descHe: 'העומק המלכותי האמיתי והסוד לעמידות האגדית של בשמי קון. שמנים נדירים שנשארים ימים שלמים.',
      ingredients: [
        { nameAr: 'دهن عود كمبودي عتيق', nameHe: 'שמן עוד קמבודי עתיק', originAr: 'كمبوديا', originHe: 'קמבודיה' },
        { nameAr: 'فانيليا بوربون سوداء', nameHe: 'וניל בורבון שחור', originAr: 'مدغشقر', originHe: 'מדגסקר' },
        { nameAr: 'مسك كوني نادر', nameHe: 'מאסק קוסמי נדיר', originAr: 'سويسرا', originHe: 'שוויץ' }
      ]
    }
  };

  return (
    <div className="space-y-24 pb-24 text-slate-100">
      
      {/* 1. Masterpiece Drawing & Living Cosmic Logo Hero Section */}
      <CosmicLogoHero />

      {/* 2. Brand Value Pillars (Built with UI/UX Pro Max Glassmorphism & Lucide Icons) */}
      <section id="brand-pillars" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            {language === 'ar' ? 'ركائز الفخامة الكونية' : 'עמודי התווך של היוקרה'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'ar' ? 'لماذا يختار عشاق النيش دار كون؟' : 'מדוע חובבי נישה בוחרים ב-KOON?'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="group relative bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 p-7 rounded-2xl backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {language === 'ar' ? 'استلهام كوني لا يتكرر' : 'השראה קוסמית ייחודית'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar' 
                ? 'كل عطر من عطورنا وُلد من فكرة فلكية تجسد ولادة الكواكب، حرارة النجوم، أو برودة السدم السماوية لتمنحك طابعاً منفرداً.'
                : 'כל בושם נוצר מתוך השראה אסטרונומית של לידת כוכבים וערפיליות שמימיות המעניקות נוכחות בלתי נשכחת.'}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="group relative bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 p-7 rounded-2xl backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {language === 'ar' ? 'تعتيق حرفي فائق التركيز' : 'יישון אומנותי בריכוז מקסימלי'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'تركيز Extrait de Parfum يصل إلى 35% وزيوت طبيعية تخضع للتعتيق البطيء 90 يوماً لضمان فوحان مهيب دون أي حدة كحولية.'
                : 'ריכוז Extrait de Parfum של עד 35% עם שמנים טבעיים המיושנים 90 יום לביצועים חסרי תקדים.'}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="group relative bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 p-7 rounded-2xl backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {language === 'ar' ? 'ميثاق الضمان والتجربة' : 'אחריות ודוגמית חינם'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'تصلك عينة مجانية مع كل زجاجة لتجربتها أولاً؛ فإن لم يناسبك العطر يمكنك استرجاعه واسترداد كامل المبلغ دون أي تعقيد.'
                : 'דוגמית חינם מצורפת לכל בקבוק להתנסות לפני הפתיחה, עם אחריות מלאה להחזרה ללא שאלות.'}
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="group relative bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 p-7 rounded-2xl backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {language === 'ar' ? 'تجربة إهداء ملكية' : 'חוויית פרימיום מלכותית'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'تصلك العطور في بوكس فاخر بلون الفضاء الحالك مع بطاقات إهداء مخصصة ومواد تعبئة تحافظ على برودة الزجاجة أثناء النقل.'
                : 'מארז שחור יוקרתי בגימור זהב עם כרטיס ברכה אישי ומשלוח מבוקר טמפרטורה.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Curated Bestsellers with Category Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/50 text-slate-200 hover:text-amber-300 text-xs sm:text-sm font-bold backdrop-blur-md transition-all shadow-lg"
          >
            <span>{language === 'ar' ? 'عرض الكتالوج الكامل والتشكيلة الفلكية' : 'צפה בכל הקטלוג והקולקציות'}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Interactive Olfactory Pyramid & Master Ingredients */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
          {/* Ambient Inner Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left Content / Explainer */}
            <div className="space-y-5 max-w-xl text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20">
                <Layers className="w-4 h-4" />
                <span>{language === 'ar' ? 'فلسفة التركيب الحرفي' : 'אומנות פירמידת הריח'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {language === 'ar' ? 'الهرم العطري ومكونات غراس النادرة' : 'פירמידת הריח ומרכיבי גראס הנדירים'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'ar'
                  ? 'لا نستخدم زيوتاً تجارية مصنعة؛ بل نستخلص نفائس العطور من حقول الورد في غراس الفرنسية، وغابات العود العتيقة في كمبوديا، لنتيح لكل طبقة عطرية أن تتكشف بسلاسة على مدار ساعات اليوم.'
                  : 'אנו משתמשים בשמנים טבעיים נדירים מחבלי גראס בצרפת ויערות קמבודיה, המאפשרים לכל שכבה להיפתח בהדרגה לאורך שעות רבות.'}
              </p>

              {/* Pyramid Level Selector Buttons */}
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-2">
                {[
                  { id: 'top', labelAr: 'القمة العطرية', labelHe: 'תווי ראש' },
                  { id: 'heart', labelAr: 'قلب العطر', labelHe: 'תווי לב' },
                  { id: 'base', labelAr: 'القاعدة العطرية', labelHe: 'תווי בסיס' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => setActivePyramidLevel(lvl.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                      activePyramidLevel === lvl.id
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-400'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {language === 'ar' ? lvl.labelAr : lvl.labelHe}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Card / Interactive Notes Showcase */}
            <div className="w-full lg:max-w-md bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-extrabold text-amber-400">
                  {language === 'ar' ? pyramidData[activePyramidLevel].titleAr : pyramidData[activePyramidLevel].titleHe}
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                  {language === 'ar' ? pyramidData[activePyramidLevel].durationAr : pyramidData[activePyramidLevel].durationHe}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'ar' ? pyramidData[activePyramidLevel].descAr : pyramidData[activePyramidLevel].descHe}
              </p>

              {/* Ingredients list */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {language === 'ar' ? 'أبرز المكونات المستخلصة:' : 'מרכיבים בולטים:'}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {pyramidData[activePyramidLevel].ingredients.map((ing, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/30 transition text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="font-semibold text-white">
                          {language === 'ar' ? ing.nameAr : ing.nameHe}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {language === 'ar' ? ing.originAr : ing.originHe}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Limited Cosmic Offer with Interactive Countdown & Copyable Coupon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 p-8 sm:p-12 shadow-2xl">
          {/* Cosmic Shimmer line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center lg:text-right max-w-xl">
              <span className="px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold inline-block">
                {language === 'ar' ? 'عرض المدار الاستثنائي • خصم 20% + هدايا مجانية' : 'מבצע מיוחד • 20% הנחה + מתנות'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                {language === 'ar' ? 'باقة المجرة الفاخرة: عطرين + عينة نيش + تغليف ملكي' : 'מארז הגלקסיה: 2 בשמים + דוגמית נישה + אריזה מלכותית'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'ar'
                  ? 'اقتنِ عطر "كون أبسولوت" الأيقوني مع "سديم الفانيليا" في صندوق إهداء أسود فاخر مع شحن مجاني مبرد لكافة المناطق. استخدم كود الخصم الحصري أدناه.'
                  : 'רכוש את בושם הדגל KOON Absolute יחד עם Nebula Vanilla במארז שחור יוקרתי עם משלוח מבוקר חינם.'}
              </p>

              {/* Coupon Code Copy Button */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <button
                  onClick={() => handleCopyCoupon('KOON10')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-950/90 border border-amber-500/50 hover:border-amber-400 rounded-xl text-amber-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-inner"
                  title="نسخ كود الخصم"
                >
                  {copiedCoupon ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-sans">{language === 'ar' ? 'تم نسخ الكود KOON10 !' : 'הקוד הועתק!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-400" />
                      <span>كود الخصم: <strong className="text-amber-400 font-black">KOON10</strong> (اضغط للنسخ)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Countdown Clocks */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 rounded-xl text-center min-w-[60px]">
                  <span className="text-2xl font-black text-amber-400 font-mono">{timeLeft.hours}</span>
                  <span className="block text-[10px] text-slate-400">{language === 'ar' ? 'ساعة' : 'שעות'}</span>
                </div>
                <span className="text-slate-600 font-bold text-xl">:</span>
                <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 rounded-xl text-center min-w-[60px]">
                  <span className="text-2xl font-black text-amber-400 font-mono">{timeLeft.minutes}</span>
                  <span className="block text-[10px] text-slate-400">{language === 'ar' ? 'دقيقة' : 'דקות'}</span>
                </div>
                <span className="text-slate-600 font-bold text-xl">:</span>
                <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 rounded-xl text-center min-w-[60px]">
                  <span className="text-2xl font-black text-amber-400 font-mono">{timeLeft.seconds}</span>
                  <span className="block text-[10px] text-slate-400">{language === 'ar' ? 'ثانية' : 'שניות'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 shrink-0">
              <Link
                to="/shop"
                className="px-9 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 text-center cursor-pointer border border-amber-400"
              >
                {language === 'ar' ? 'اطلب الباقة الفلكية الآن' : 'הזמן את המארז עכשיו'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive Fragrance Quiz Teaser Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900/80 via-slate-950 to-slate-900/80 border border-slate-800 hover:border-amber-500/30 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-md transition-all shadow-xl">
          <div className="space-y-4 max-w-xl text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20">
              <Compass className="w-4 h-4" />
              <span>{language === 'ar' ? 'مستكشف العطور الكوني الذكي' : 'בוחן התאמת בושם חכם'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'ar' ? 'محتار أي عطر يناسب شخصيتك أو مناسبتك؟' : 'מתלבט איזה בושם מתאים בדיוק עבורך?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'ar'
                ? 'أجب على 4 أسئلة فلكية بسيطة وسيقوم نظامنا الذكي باقتراح العطر النيش الأمثل لك بناءً على ذوقك في النوتات مع كود خصم فوري.'
                : 'ענה על 4 שאלות קצרות והמערכת החכמה תתאים עבורך את הבושם המושלם עם הנחה מיידית.'}
            </p>
          </div>

          <Link
            to="/quiz"
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/20 transition transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer border border-amber-400"
          >
            <span>{language === 'ar' ? 'ابدأ اختبار العطور (30 ثانية)' : 'התחל שאלון התאמה (30 שניות)'}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. Royal Guarantee Charter (ميثاق الضمان الملكي) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            {language === 'ar' ? 'ثقة لا تشوبها شائبة' : 'אמינות ללא פשרות'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'ar' ? 'ميثاق الضمان الملكي من كون' : 'אמנת האחריות המלכותית של KOON'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">{language === 'ar' ? 'عينة تجربة مجانية' : 'דוגמית חינם'}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar' ? 'جرب العينة المرفقة قبل فتح الصندوق الرئيسي.' : 'התנסה בדוגמית לפני פתיחת הבקבוק.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">{language === 'ar' ? 'شحن مبرد آمن' : 'משלוח מבוקר טמפרטורה'}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar' ? 'مركبات مبردة لحماية الزيوت من حرارة الصيف.' : 'רכבים ממוזגים לשמירה על איכות השמנים.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">{language === 'ar' ? 'أصالة مستوردة 100%' : '100% שמנים מקוריים'}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar' ? 'زيوت نقية مستوردة مباشرة من غراس الفرنسية.' : 'שמנים טהורים ישירות מצרפת ושוויץ.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">{language === 'ar' ? 'استرجاع فوري وسهل' : 'החזרה מהירה ופשוטה'}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar' ? 'استرجاع كامل المبلغ خلال 7 أيام دون أي تعقيد.' : 'החזר כספי מלא תוך 7 ימים ללא שאלות.'}
            </p>
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews / Wall of Prestige */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 backdrop-blur-sm"
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
                  <span className="text-[10px] text-amber-400">✓</span>
                </span>
                <span className="text-slate-400 text-[11px]">{item.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
