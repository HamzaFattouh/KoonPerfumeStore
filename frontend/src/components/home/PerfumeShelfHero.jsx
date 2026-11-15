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

// 7 Standalone 8K Transparent 3D Perfume Bottles with Signature Color Palettes & Monograms
const LUXURY_3D_PERFUMES = [
  {
    id: 'naxos',
    brand: 'XERJOFF',
    monogram: 'XJ',
    model: 'NAXOS',
    fullModel: 'XJ 1861 Naxos',
    image: '/perfumes/naxos.png',
    glow: 'rgba(234, 179, 8, 0.55)',
    secondaryGlow: 'rgba(217, 119, 6, 0.35)',
    accentHex: '#FBBF24',
    shelfHighlight: 'rgba(251, 191, 36, 0.55)',
    descriptionAr: 'توليفة إيطالية فاخرة تجمع بين دفء العسل والتبغ مع نفحات اللافندر والبرغموت الإيطالي، في زجاجة ذهبية متجمدة تعكس الفخامة الملكية.',
    descriptionHe: 'ניחוח איטלקי יוקרתי המשלב דבש חם וטבק עם לבנדר וברגמוט, בבקבוק זהוב מרהיב.'
  },
  {
    id: 'symphony',
    brand: 'LOUIS VUITTON',
    monogram: 'LV',
    model: 'SYMPHONY',
    fullModel: 'Symphony',
    image: '/perfumes/symphony.png',
    glow: 'rgba(192, 132, 252, 0.55)',
    secondaryGlow: 'rgba(232, 121, 249, 0.32)',
    accentHex: '#D8B4FE',
    shelfHighlight: 'rgba(192, 132, 252, 0.55)',
    descriptionAr: 'سيمفونية عطرية ناعمة من الجريب فروت والبرغموت والزنجبيل، تتوجها زجاجة بنفسجية منحوتة بغطاء فضي فني من لويس فويتون.',
    descriptionHe: 'סימפוניה עדינה של אשכולית, ברגמוט וג׳ינג׳ר בבקבוק זכוכית סגול עם פקק כסף פיסולי.'
  },
  {
    id: 'chanel-no5',
    brand: 'CHANEL',
    monogram: 'N°5',
    model: "N°5 L'EAU",
    fullModel: "N°5 L'Eau",
    image: '/perfumes/chanel_no5.png',
    glow: 'rgba(253, 224, 71, 0.48)',
    secondaryGlow: 'rgba(245, 158, 11, 0.28)',
    accentHex: '#FDE68A',
    shelfHighlight: 'rgba(253, 224, 71, 0.50)',
    descriptionAr: 'الأيقونة الباريسية الخالدة بلمسة عصرية مشرقة من الحمضيات والياسمين وخشب الأرز، داخل زجاجة شانيل الكريستالية الكلاسيكية.',
    descriptionHe: 'האייקון הפריזאי הנצחי עם נגיעה רעננה של הדרים, יסמין ועץ ארז בבקבוק הקריסטל הקלאסי.'
  },
  {
    id: 'guidance46',
    brand: 'AMOUAGE',
    monogram: '46',
    model: 'GUIDANCE 46',
    fullModel: 'Guidance 46',
    image: '/perfumes/guidance46.png',
    glow: 'rgba(244, 63, 94, 0.55)',
    secondaryGlow: 'rgba(251, 146, 60, 0.35)',
    accentHex: '#FDA4AF',
    shelfHighlight: 'rgba(251, 113, 133, 0.55)',
    descriptionAr: 'تركيز استثنائي يفيض بنفحات الكمثرى والبندق واللبان والورد الدمشقي، بتدرج مرجاني دافئ وشعار أمواج الذهبي الفاخر.',
    descriptionHe: 'תמצית עוצמתית של אגס, אגוזי לוז, לבונה וורד דמשקאי בבקבוק קורל עם סמל זהב מלכותי.'
  },
  {
    id: 'sauvage',
    brand: 'DIOR',
    monogram: 'CD',
    model: 'SAUVAGE',
    fullModel: 'Sauvage Eau de Parfum',
    image: '/perfumes/sauvage.png',
    glow: 'rgba(56, 189, 248, 0.55)',
    secondaryGlow: 'rgba(37, 99, 235, 0.38)',
    accentHex: '#7DD3FC',
    shelfHighlight: 'rgba(56, 189, 248, 0.55)',
    descriptionAr: 'حضور قوي وجذاب يمزج انتعاش البرغموت مع الفلفل الحار والفانيليا الداكنة، في زجاجة ديور الزرقاء الليلية المصقولة.',
    descriptionHe: 'נוכחות עוצמתית המשלבת ברגמוט רענן, פלפל ווניל כהה בבקבוק הכחול-לילי המפורסם של דיור.'
  },
  {
    id: 'oud-wood',
    brand: 'TOM FORD',
    monogram: 'TF',
    model: 'OUD WOOD',
    fullModel: 'Oud Wood',
    image: '/perfumes/oud_wood.png',
    glow: 'rgba(217, 119, 6, 0.50)',
    secondaryGlow: 'rgba(120, 113, 108, 0.35)',
    accentHex: '#FCD34D',
    shelfHighlight: 'rgba(217, 119, 6, 0.50)',
    descriptionAr: 'أيقونة العود النادر وخشب الورد والعنبر الدافئ، بتوازن مخملي داكن داخل زجاجة توم فورد الهندسية الفخمة.',
    descriptionHe: 'יצירת מופת של עוד נדיר, עץ ורוד וענבר חם בבקבוק האדריכלי הכהה של טום פורד.'
  },
  {
    id: 'valaya',
    brand: 'PARFUMS de MARLY',
    monogram: 'PdM',
    model: 'VALAYA',
    fullModel: 'Valaya',
    image: '/perfumes/valaya.png',
    glow: 'rgba(226, 232, 240, 0.50)',
    secondaryGlow: 'rgba(148, 163, 184, 0.30)',
    accentHex: '#F8FAFC',
    shelfHighlight: 'rgba(226, 232, 240, 0.50)',
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

  // Responsive horizontal spacing for standalone 3D bottles on the shelf
  useEffect(() => {
    const updateSpacing = () => {
      if (window.innerWidth < 640) {
        setSlotSpacing(120);
      } else if (window.innerWidth < 1024) {
        setSlotSpacing(165);
      } else {
        setSlotSpacing(205);
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
      {/* Dynamic Dual-Tone 8K Ambient Studio Lighting matching active bottle */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ backgroundColor: activePerfume.glow }}
          transition={{ duration: 0.9 }}
          className="w-[420px] sm:w-[740px] h-[480px] opacity-30 blur-[140px] rounded-full -mt-12"
        />
        <motion.div
          animate={{ backgroundColor: activePerfume.secondaryGlow }}
          transition={{ duration: 0.9 }}
          className="absolute w-[300px] sm:w-[520px] h-[320px] opacity-25 blur-[110px] rounded-full mt-20"
        />
      </div>

      {/* Top Compact Brand Header */}
      <div className="relative z-30 max-w-4xl mx-auto px-4 text-center mb-6 sm:mb-8">
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
            className="relative h-[300px] sm:h-[365px] lg:h-[405px] w-full flex items-end justify-center overflow-visible"
            style={{ perspective: 1300 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(e, info) => {
              if (info.offset.x < -45) nextPerfume();
              else if (info.offset.x > 45) prevPerfume();
            }}
          >
            {/* Background Editorial Brand Monogram, Logo & Perfume Name in Perfume Colors */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden pb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`bg-${activePerfume.id}`}
                  initial={{ opacity: 0, scale: 0.92, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.06, y: -10 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="flex flex-col items-center justify-center text-center select-none"
                >
                  {/* Luxury House Monogram Crest */}
                  <div
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-2 mb-2 sm:mb-3 backdrop-blur-sm"
                    style={{
                      borderColor: activePerfume.accentHex,
                      color: activePerfume.accentHex,
                      opacity: 0.28,
                      boxShadow: `0 0 40px ${activePerfume.glow}`
                    }}
                  >
                    <span className="font-serif font-black text-2xl sm:text-4xl tracking-widest">
                      {activePerfume.monogram}
                    </span>
                  </div>

                  {/* Giant Background Brand Wordmark */}
                  <span
                    className="font-serif uppercase tracking-[0.35em] text-xs sm:text-base font-bold mb-1"
                    style={{ color: activePerfume.accentHex, opacity: 0.45 }}
                  >
                    {activePerfume.brand}
                  </span>

                  {/* Giant Background Perfume Name */}
                  <span
                    className="font-serif font-black uppercase tracking-[0.14em] text-4xl sm:text-6xl lg:text-7xl leading-none whitespace-nowrap"
                    style={{
                      color: activePerfume.accentHex,
                      opacity: 0.16,
                      textShadow: `0 0 50px ${activePerfume.glow}`
                    }}
                  >
                    {activePerfume.model}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Volumetric Top-Down Studio Spotlight Beam */}
            <motion.div
              animate={{
                background: `radial-gradient(ellipse at 50% 0%, ${activePerfume.glow} 0%, transparent 70%)`
              }}
              transition={{ duration: 0.7 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[440px] h-full opacity-45 pointer-events-none z-10"
            />

            {/* Center Spotlight Reflection on Shelf */}
            <motion.div
              animate={{ backgroundColor: activePerfume.shelfHighlight }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 w-56 sm:w-80 h-6 opacity-50 blur-xl rounded-full pointer-events-none z-10"
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
                ? 'brightness(1.06) saturate(1.16) contrast(1.08)'
                : absDiff === 1
                ? 'brightness(0.42) saturate(0.45) contrast(1.02)'
                : 'brightness(0.24) saturate(0.28)';

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
                  {/* Standalone 3D Perfume Bottle (No Background Box / Card) */}
                  <motion.div
                    whileHover={isCenter ? { rotateY: 8, rotateX: -4, y: -6, scale: 1.04 } : { y: -4 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="relative flex items-end justify-center"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Subtle Rim Aura behind center bottle only */}
                    {isCenter && (
                      <div
                        className="absolute inset-x-4 top-6 bottom-2 rounded-full blur-2xl opacity-55 pointer-events-none transition-colors duration-700"
                        style={{ backgroundColor: item.glow }}
                      />
                    )}
                    <img
                      src={item.image}
                      alt={`${item.brand} ${item.model}`}
                      draggable={false}
                      className="relative z-10 h-[200px] sm:h-[260px] lg:h-[295px] w-auto object-contain select-none transition-all duration-500"
                      style={{
                        filter: isCenter
                          ? 'drop-shadow(0 24px 26px rgba(0,0,0,0.92)) drop-shadow(0 0 18px rgba(251,191,36,0.22))'
                          : 'drop-shadow(0 16px 18px rgba(0,0,0,0.85))'
                      }}
                    />
                  </motion.div>

                  {/* Contact Shadow on Shelf */}
                  <div
                    className={`mt-0.5 h-2.5 rounded-full blur-sm transition-all duration-300 ${
                      isCenter ? 'w-32 sm:w-44 bg-black/90' : 'w-20 bg-black/85'
                    }`}
                    style={
                      isCenter
                        ? { boxShadow: `0 0 24px 4px ${item.shelfHighlight}` }
                        : undefined
                    }
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
            <span
              className="text-[11px] font-serif tracking-[0.25em] uppercase block transition-colors duration-500"
              style={{ color: activePerfume.accentHex }}
            >
              {activePerfume.brand}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {activePerfume.fullModel}
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
