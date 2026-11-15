import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  Pause
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getCachedSiteSettings } from '../../services/adminService';

// 7 Hyper-Realistic 8K 3D Studio Renders on Dark Stone Pedestal
const LUXURY_3D_PERFUMES = [
  {
    id: 'naxos',
    brand: 'XERJOFF',
    model: 'XJ 1861 Naxos',
    image: '/perfumes/naxos.jpg',
    glow: 'rgba(234, 179, 8, 0.45)',
    descriptionAr: 'توليفة إيطالية فاخرة تجمع بين دفء العسل والتبغ مع نفحات اللافندر والبرغموت الإيطالي، في زجاجة ذهبية متجمدة تعكس الفخامة الملكية.',
    descriptionHe: 'ניחוח איטלקי יוקרתי המשלב דבש חם וטבק עם לבנדר וברגמוט, בבקבוק זהוב מרהיב.'
  },
  {
    id: 'symphony',
    brand: 'LOUIS VUITTON',
    model: 'Symphony',
    image: '/perfumes/symphony.jpg',
    glow: 'rgba(192, 132, 252, 0.45)',
    descriptionAr: 'سيمفونية عطرية ناعمة من الجريب فروت والبرغموت والزنجبيل، تتوجها زجاجة بنفسجية منحوتة بغطاء فضي فني من لويس فويتون.',
    descriptionHe: 'סימפוניה עדינה של אשכולית, ברגמוט וג׳ינג׳ר בבקבוק זכוכית סגול עם פקק כסף פיסולי.'
  },
  {
    id: 'chanel-no5',
    brand: 'CHANEL',
    model: "N°5 L'Eau",
    image: '/perfumes/chanel_no5.jpg',
    glow: 'rgba(251, 191, 36, 0.45)',
    descriptionAr: 'الأيقونة الباريسية الخالدة بلمسة عصرية مشرقة من الحمضيات والياسمين وخشب الأرز، داخل زجاجة شانيل الكريستالية الكلاسيكية.',
    descriptionHe: 'האייקון הפריזאי הנצחי עם נגיעה רעננה של הדרים, יסמין ועץ ארז בבקבוק הקריסטל הקלאסי.'
  },
  {
    id: 'guidance46',
    brand: 'AMOUAGE',
    model: 'Guidance 46',
    image: '/perfumes/guidance46.jpg',
    glow: 'rgba(244, 63, 94, 0.45)',
    descriptionAr: 'تركيز استثنائي يفيض بنفحات الكمثرى والبندق واللبان والورد الدمشقي، بتدرج مرجاني دافئ وشعار أمواج الذهبي الفاخر.',
    descriptionHe: 'תמצית עוצמתית של אגס, אגוזי לוז, לבונה וורד דמשקאי בבקבוק קורל עם סמל זהב מלכותי.'
  },
  {
    id: 'sauvage',
    brand: 'DIOR',
    model: 'Sauvage Eau de Parfum',
    image: '/perfumes/sauvage.jpg',
    glow: 'rgba(56, 189, 248, 0.45)',
    descriptionAr: 'حضور قوي وجذاب يمزج انتعاش البرغموت مع الفلفل الحار والفانيليا الداكنة، في زجاجة ديور الزرقاء الليلية المصقولة.',
    descriptionHe: 'נוכחות עוצמתית המשלבת ברגמוט רענן, פלפל ווניל כהה בבקבוק הכחול-לילי המפורסם של דיור.'
  },
  {
    id: 'oud-wood',
    brand: 'TOM FORD',
    model: 'Oud Wood',
    image: '/perfumes/oud_wood.jpg',
    glow: 'rgba(168, 162, 158, 0.42)',
    descriptionAr: 'أيقونة العود النادر وخشب الورد والعنبر الدافئ، بتوازن مخملي داكن داخل زجاجة توم فورد الهندسية الفخمة.',
    descriptionHe: 'יצירת מופת של עוד נדיר, עץ ורוד וענבר חם בבקבוק האדריכלי הכהה של טום פורד.'
  },
  {
    id: 'valaya',
    brand: 'PARFUMS de MARLY',
    model: 'Valaya',
    image: '/perfumes/valaya.jpg',
    glow: 'rgba(226, 232, 240, 0.42)',
    descriptionAr: 'عبير نقي وأثيري من الخوخ الأبيض وزهر البرتقال والمسك الحريري، في زجاجة عاجية منحوتة مستوحاة من القصور الفرنسية.',
    descriptionHe: 'ניחוח טהור ואוורירי של אפרסק לבן, פריחת תפוז ומושק משיי בבקבוק שנהב מפוסל.'
  }
];

const PerfumeShelfHero = ({ products = [], heroSettings }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const activeHero = (heroSettings && Object.keys(heroSettings).length > 0)
    ? heroSettings
    : (getCachedSiteSettings()?.hero_section || {});

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slotSpacing, setSlotSpacing] = useState(270);

  // Responsive horizontal spacing for 16:9 3D renders on the shelf
  useEffect(() => {
    const updateSpacing = () => {
      if (window.innerWidth < 640) {
        setSlotSpacing(175);
      } else if (window.innerWidth < 1024) {
        setSlotSpacing(230);
      } else {
        setSlotSpacing(290);
      }
    };
    updateSpacing();
    window.addEventListener('resize', updateSpacing);
    return () => window.removeEventListener('resize', updateSpacing);
  }, []);

  const totalItems = LUXURY_3D_PERFUMES.length;

  const nextPerfume = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevPerfume = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  // Auto-advance spotlight from perfume to perfume along the shelf
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextPerfume();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextPerfume]);

  // Shortest-path circular offset so selected bottle shifts smoothly into center
  const getOffset = (index) => {
    let diff = (index - activeIndex + totalItems) % totalItems;
    if (diff > Math.floor(totalItems / 2)) {
      diff -= totalItems;
    }
    return diff;
  };

  const activePerfume = LUXURY_3D_PERFUMES[activeIndex];
  const linkedProduct = products[activeIndex % (products.length || 1)] || null;

  return (
    <section
      className="relative w-full min-h-[92dvh] flex flex-col justify-center pt-28 sm:pt-32 pb-14 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Colored Ambient Glow matching active center bottle */}
      <div className="absolute inset-0 pointer-events-none flex items-start justify-center overflow-hidden">
        <motion.div
          animate={{ backgroundColor: activePerfume.glow }}
          transition={{ duration: 0.8 }}
          className="w-[360px] sm:w-[620px] h-[440px] opacity-25 blur-[120px] rounded-full mt-10"
        />
      </div>

      {/* Top Compact Brand Header */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-bold backdrop-blur-md mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {language === 'ar'
              ? (activeHero.tagline_ar || 'رف العطور العالمية الفاخرة')
              : (activeHero.tagline_he || 'מדף הבשמים היוקרתיים בעולם')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {language === 'ar'
            ? (activeHero.title_ar || 'مجموعة العطور العالمية الحصرية')
            : (activeHero.title_he || 'קולקציית בשמי היוקרה הבלעדית')}
        </h1>
      </div>

      {/* ========================================================================= */}
      {/* 3D LUXURY PERFUME SHELF STAGE (رف الرندرات ثلاثية الأبعاد)             */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-2 sm:px-6 my-2">
        <div className="relative">
          {/* Left / Right Navigation Arrows */}
          <button
            type="button"
            onClick={language === 'ar' ? nextPerfume : prevPerfume}
            aria-label="العطر السابق"
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/80 hover:bg-amber-500 text-slate-200 hover:text-slate-950 border border-slate-700/80 hover:border-amber-400 flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={language === 'ar' ? prevPerfume : nextPerfume}
            aria-label="العطر التالي"
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/80 hover:bg-amber-500 text-slate-200 hover:text-slate-950 border border-slate-700/80 hover:border-amber-400 flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* 3D Perspective Coordinate Stage */}
          <motion.div
            dir="ltr"
            className="relative h-[270px] sm:h-[340px] lg:h-[370px] w-full flex items-end justify-center overflow-visible"
            style={{ perspective: 1200 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(e, info) => {
              if (info.offset.x < -45) nextPerfume();
              else if (info.offset.x > 45) prevPerfume();
            }}
          >
            {/* Center Spotlight Glow on Shelf */}
            <motion.div
              animate={{ backgroundColor: activePerfume.glow }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-12 opacity-40 blur-2xl rounded-full pointer-events-none z-10"
            />

            {/* 3D Rendered Perfumes Shifting Along the Shelf */}
            {LUXURY_3D_PERFUMES.map((item, idx) => {
              const diff = getOffset(idx);
              const absDiff = Math.abs(diff);
              const isCenter = diff === 0;
              const isVisible = absDiff <= 2;

              const scale = isCenter ? 1.18 : absDiff === 1 ? 0.78 : absDiff === 2 ? 0.56 : 0.4;
              const opacity = isCenter ? 1 : absDiff === 1 ? 0.72 : absDiff === 2 ? 0.35 : 0;
              const yOffset = isCenter ? -14 : absDiff === 1 ? 0 : 12;
              const rotateY = diff * -16;
              const zIndex = isCenter ? 30 : absDiff === 1 ? 20 : absDiff === 2 ? 10 : 0;
              const filterStyle = isCenter
                ? 'brightness(1.08) saturate(1.18) contrast(1.04)'
                : absDiff === 1
                ? 'brightness(0.45) saturate(0.45)'
                : 'brightness(0.25) saturate(0.3)';

              return (
                <motion.div
                  key={item.id}
                  onClick={() => {
                    if (isCenter && linkedProduct) {
                      navigate(`/product/${linkedProduct.id}`);
                    } else {
                      setActiveIndex(idx);
                    }
                  }}
                  initial={false}
                  animate={{
                    x: diff * slotSpacing,
                    y: yOffset,
                    scale,
                    rotateY,
                    opacity,
                    zIndex
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                    mass: 0.9
                  }}
                  style={{
                    filter: filterStyle,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    transformStyle: 'preserve-3d'
                  }}
                  className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group origin-bottom"
                  title={`${item.brand} — ${item.model}`}
                >
                  {/* 16:9 Hyper-Realistic 3D Studio Render Card */}
                  <div
                    className={`relative w-[240px] sm:w-[330px] lg:w-[390px] aspect-video rounded-2xl overflow-hidden transition-shadow duration-500 ${
                      isCenter
                        ? 'ring-2 ring-amber-400/70 shadow-[0_25px_60px_rgba(0,0,0,0.95)]'
                        : 'ring-1 ring-slate-700/50 shadow-2xl'
                    }`}
                    style={{
                      boxShadow: isCenter
                        ? `0 24px 60px -12px ${item.glow}, 0 20px 45px rgba(0,0,0,0.9)`
                        : undefined
                    }}
                  >
                    <img
                      src={item.image}
                      alt={`${item.brand} ${item.model}`}
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Contact Shadow on Shelf */}
                  <div
                    className={`mt-2 h-2.5 rounded-full blur-sm transition-all duration-300 ${
                      isCenter ? 'w-56 sm:w-72 bg-amber-400/40' : 'w-36 bg-black/85'
                    }`}
                  />
                </motion.div>
              );
            })}

            {/* 3D Luxury Dark Stone & Gold Shelf Plank */}
            <div className="absolute bottom-0 inset-x-4 sm:inset-x-10 h-9 pointer-events-none z-20">
              <div className="h-3 w-full rounded-t-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-amber-400/60 shadow-[0_-4px_25px_rgba(245,158,11,0.18)] relative overflow-hidden">
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-72 bg-gradient-to-r from-transparent via-amber-400/35 to-transparent" />
              </div>
              <div className="h-4 w-full bg-gradient-to-b from-slate-950 via-slate-900 to-black border-t border-amber-500/30 border-b border-slate-800/80 rounded-b-lg shadow-[0_18px_40px_rgba(0,0,0,0.95)]" />
            </div>
          </motion.div>

          {/* Shelf Pagination Dots & Auto-Play Control */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsPaused(p => !p)}
              className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 transition cursor-pointer"
              title={isPaused ? 'تشغيل التنقل التلقائي' : 'إيقاف التنقل التلقائي'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center gap-1.5">
              {LUXURY_3D_PERFUMES.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={p.model}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? 'w-7 bg-amber-400 shadow-sm shadow-amber-400/50'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PERFUME DESCRIPTION ONLY UNDER THE CENTER 3D BOTTLE (وصف العطر فقط)      */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-2xl w-full mx-auto px-4 mt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePerfume.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-center space-y-2.5 px-5 py-5 rounded-3xl bg-slate-950/55 border border-amber-500/20 backdrop-blur-md shadow-xl"
          >
            <span className="text-[11px] font-serif tracking-[0.25em] text-amber-400 uppercase block">
              {activePerfume.brand}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {activePerfume.model}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
              {language === 'ar' ? activePerfume.descriptionAr : activePerfume.descriptionHe}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PerfumeShelfHero;
