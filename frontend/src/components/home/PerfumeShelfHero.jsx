import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

// 7 Standalone 8K Transparent 3D Perfume Bottles with Signature Color Palettes & Monograms
const LUXURY_3D_PERFUMES = [
  {
    id: 'naxos',
    brand: 'XERJOFF',
    monogram: 'XJ',
    model: 'NAXOS',
    fullModel: 'XJ 1861 Naxos',
    image: '/perfumes/naxos.png',
    glow: 'rgba(197, 163, 106, 0.55)',
    secondaryGlow: 'rgba(217, 119, 6, 0.32)',
    accentHex: '#C5A36A',
    lightAccentHex: '#A98750',
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
    glow: 'rgba(192, 132, 252, 0.52)',
    secondaryGlow: 'rgba(232, 121, 249, 0.28)',
    accentHex: '#D8B4FE',
    lightAccentHex: '#7E22CE',
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
    glow: 'rgba(197, 163, 106, 0.50)',
    secondaryGlow: 'rgba(245, 158, 11, 0.28)',
    accentHex: '#E5CFA0',
    lightAccentHex: '#A98750',
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
    glow: 'rgba(244, 63, 94, 0.50)',
    secondaryGlow: 'rgba(251, 146, 60, 0.30)',
    accentHex: '#FDA4AF',
    lightAccentHex: '#BE123C',
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
    glow: 'rgba(56, 189, 248, 0.50)',
    secondaryGlow: 'rgba(37, 99, 235, 0.32)',
    accentHex: '#7DD3FC',
    lightAccentHex: '#0369A1',
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
    glow: 'rgba(197, 163, 106, 0.50)',
    secondaryGlow: 'rgba(120, 113, 108, 0.32)',
    accentHex: '#C5A36A',
    lightAccentHex: '#78350F',
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
    glow: 'rgba(226, 232, 240, 0.48)',
    secondaryGlow: 'rgba(197, 163, 106, 0.30)',
    accentHex: '#F5F0E8',
    lightAccentHex: '#A98750',
    descriptionAr: 'عبير نقي وأثيري من الخوخ الأبيض وزهر البرتقال والمسك الحريري، في زجاجة عاجية منحوتة مستوحاة من القصور الفرنسية.',
    descriptionHe: 'ניחוח טהור ואוורירי של אפרסק לבן, פריחת תפוז ומושק משיי בבקבוק שנהב מפוסל.'
  }
];

const PerfumeShelfHero = ({ products = [] }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDark } = useTheme();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slotSpacing, setSlotSpacing] = useState(285);

  // Responsive horizontal spacing for standalone 3D bottles on the shelf
  useEffect(() => {
    const updateSpacing = () => {
      if (window.innerWidth < 640) {
        setSlotSpacing(160);
      } else if (window.innerWidth < 1024) {
        setSlotSpacing(225);
      } else {
        setSlotSpacing(285);
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
  const activeAccent = isDark ? activePerfume.accentHex : activePerfume.lightAccentHex;
  const linkedProduct = products[activeIndex % (products.length || 1)] || null;

  return (
    <section
      className="relative w-full min-h-[88dvh] flex flex-col justify-center pt-28 sm:pt-32 pb-12 overflow-hidden select-none transition-colors duration-500"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Dual-Tone 8K Ambient Studio Lighting matching active bottle & theme */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ backgroundColor: activePerfume.glow }}
          transition={{ duration: 0.9 }}
          className={`w-[420px] sm:w-[740px] h-[480px] blur-[140px] rounded-full -mt-12 ${
            isDark ? 'opacity-30' : 'opacity-20'
          }`}
        />
        <motion.div
          animate={{ backgroundColor: activePerfume.secondaryGlow }}
          transition={{ duration: 0.9 }}
          className={`absolute w-[300px] sm:w-[520px] h-[320px] blur-[110px] rounded-full mt-20 ${
            isDark ? 'opacity-25' : 'opacity-15'
          }`}
        />
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
            className={`absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-90 ${
              isDark
                ? 'bg-[#1D1D1D]/90 hover:bg-[#C5A36A] text-[#F5F0E8] hover:text-[#111111] border-[#C5A36A]/35'
                : 'bg-[#FFFFFF]/90 hover:bg-[#A98750] text-[#29231D] hover:text-[#FFFFFF] border-[#A98750]/40'
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={language === 'ar' ? prevPerfume : nextPerfume}
            aria-label="العطر التالي"
            className={`absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-90 ${
              isDark
                ? 'bg-[#1D1D1D]/90 hover:bg-[#C5A36A] text-[#F5F0E8] hover:text-[#111111] border-[#C5A36A]/35'
                : 'bg-[#FFFFFF]/90 hover:bg-[#A98750] text-[#29231D] hover:text-[#FFFFFF] border-[#A98750]/40'
            }`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* 3D Perspective Coordinate Stage */}
          <motion.div
            dir="ltr"
            className="relative h-[235px] sm:h-[285px] lg:h-[315px] w-full flex items-end justify-center overflow-visible"
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
                  key={`bg-${activePerfume.id}-${isDark ? 'dark' : 'light'}`}
                  initial={{ opacity: 0, scale: 0.92, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.06, y: -10 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="flex flex-col items-center justify-center text-center select-none"
                >
                  {/* Luxury House Monogram Crest */}
                  <div
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 mb-2 backdrop-blur-sm"
                    style={{
                      borderColor: activeAccent,
                      color: activeAccent,
                      opacity: isDark ? 0.3 : 0.38,
                      boxShadow: `0 0 36px ${activePerfume.glow}`
                    }}
                  >
                    <span className="font-serif font-black text-xl sm:text-3xl tracking-widest">
                      {activePerfume.monogram}
                    </span>
                  </div>

                  {/* Giant Background Brand Wordmark */}
                  <span
                    className="font-serif uppercase tracking-[0.35em] text-xs sm:text-sm font-bold mb-1"
                    style={{ color: activeAccent, opacity: isDark ? 0.5 : 0.65 }}
                  >
                    {activePerfume.brand}
                  </span>

                  {/* Giant Background Perfume Name */}
                  <span
                    className="font-serif font-black uppercase tracking-[0.14em] text-4xl sm:text-6xl lg:text-7xl leading-none whitespace-nowrap"
                    style={{
                      color: activeAccent,
                      opacity: isDark ? 0.17 : 0.2,
                      textShadow: isDark ? `0 0 50px ${activePerfume.glow}` : 'none'
                    }}
                  >
                    {activePerfume.model}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Volumetric Soft Studio Spotlight (No Rectangular Edge) */}
            <motion.div
              animate={{
                background: `radial-gradient(closest-side, ${activePerfume.glow} 0%, transparent 100%)`
              }}
              transition={{ duration: 0.7 }}
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[740px] h-full pointer-events-none z-10 ${
                isDark ? 'opacity-40' : 'opacity-25'
              }`}
            />

            {/* 3D Rendered Perfumes Shifting Along the Shelf */}
            {LUXURY_3D_PERFUMES.map((item, idx) => {
              const diff = getOffset(idx);
              const absDiff = Math.abs(diff);
              const isCenter = diff === 0;
              const isVisible = absDiff <= 2;

              const scale = isCenter ? 1.1 : absDiff === 1 ? 0.72 : absDiff === 2 ? 0.5 : 0.35;
              const opacity = isCenter ? 1 : absDiff === 1 ? (isDark ? 0.7 : 0.78) : absDiff === 2 ? 0.35 : 0;
              const yOffset = isCenter ? -6 : absDiff === 1 ? 2 : 10;
              const rotateY = diff * -16;
              const zIndex = isCenter ? 30 : absDiff === 1 ? 20 : absDiff === 2 ? 10 : 0;

              // Theme-aware lighting filter so side bottles never look muddy on Warm Ivory (#F3EBDD)
              const filterStyle = isCenter
                ? 'brightness(1.05) saturate(1.14) contrast(1.06)'
                : isDark
                ? absDiff === 1
                  ? 'brightness(0.42) saturate(0.45) contrast(1.02)'
                  : 'brightness(0.24) saturate(0.28)'
                : absDiff === 1
                ? 'brightness(0.82) saturate(0.65) opacity(0.85)'
                : 'brightness(0.72) saturate(0.45) opacity(0.65)';

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
                  title={`${item.brand} — ${item.fullModel}`}
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
                        className={`absolute inset-x-4 top-6 bottom-2 rounded-full blur-2xl pointer-events-none transition-colors duration-700 ${
                          isDark ? 'opacity-55' : 'opacity-35'
                        }`}
                        style={{ backgroundColor: item.glow }}
                      />
                    )}
                    <img
                      src={item.image}
                      alt={`${item.brand} ${item.fullModel}`}
                      draggable={false}
                      className="relative z-10 h-[155px] sm:h-[195px] lg:h-[220px] w-auto object-contain select-none transition-all duration-500"
                      style={{
                        filter: isCenter
                          ? isDark
                            ? 'drop-shadow(0 18px 22px rgba(0,0,0,0.85)) drop-shadow(0 0 18px rgba(197,163,106,0.22))'
                            : 'drop-shadow(0 16px 20px rgba(41,35,29,0.28)) drop-shadow(0 0 14px rgba(169,135,80,0.2))'
                          : isDark
                          ? 'drop-shadow(0 12px 14px rgba(0,0,0,0.8))'
                          : 'drop-shadow(0 10px 12px rgba(41,35,29,0.18))'
                      }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}

            {/* 3D Luxury Shelf Plank (Adapts to Dark Charcoal #111111 & Light Warm Ivory #F3EBDD) */}
            <div className="absolute bottom-0 inset-x-4 sm:inset-x-10 h-9 pointer-events-none z-20">
              {isDark ? (
                <>
                  <div className="h-3 w-full rounded-t-xl bg-gradient-to-r from-[#111111] via-[#222222] to-[#111111] border-t border-[#C5A36A]/65 shadow-[0_-4px_25px_rgba(197,163,106,0.2)] relative overflow-hidden">
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-72 bg-gradient-to-r from-transparent via-[#C5A36A]/40 to-transparent" />
                  </div>
                  <div className="h-4 w-full bg-gradient-to-b from-[#1D1D1D] via-[#151515] to-[#0A0A0A] border-t border-[#C5A36A]/30 border-b border-[#2C2C2C] rounded-b-lg shadow-[0_18px_40px_rgba(0,0,0,0.95)]" />
                </>
              ) : (
                <>
                  <div className="h-3 w-full rounded-t-xl bg-gradient-to-r from-[#E9DECC] via-[#FFFFFF] to-[#E9DECC] border-t border-[#A98750]/70 shadow-[0_-4px_20px_rgba(169,135,80,0.18)] relative overflow-hidden">
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-72 bg-gradient-to-r from-transparent via-[#A98750]/35 to-transparent" />
                  </div>
                  <div className="h-4 w-full bg-gradient-to-b from-[#E9DECC] via-[#DFD1BA] to-[#CFC0A6] border-t border-[#A98750]/40 border-b border-[#A98750]/30 rounded-b-lg shadow-[0_14px_30px_rgba(41,35,29,0.16)]" />
                </>
              )}
            </div>
          </motion.div>

          {/* Shelf Pagination Dots & Auto-Play Control */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                isDark
                  ? 'bg-[#1D1D1D] border-[#2C2C2C] text-[#F5F0E8]/70 hover:text-[#C5A36A]'
                  : 'bg-[#FFFFFF] border-[#A98750]/30 text-[#29231D]/70 hover:text-[#A98750]'
              }`}
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
                  aria-label={p.fullModel}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? isDark
                        ? 'w-7 bg-[#C5A36A] shadow-sm shadow-[#C5A36A]/50'
                        : 'w-7 bg-[#A98750] shadow-sm shadow-[#A98750]/40'
                      : isDark
                      ? 'w-2 bg-[#2C2C2C] hover:bg-[#C5A36A]/50'
                      : 'w-2 bg-[#D5C7B2] hover:bg-[#A98750]/60'
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
            className={`text-center space-y-2.5 px-6 py-5 rounded-3xl border backdrop-blur-md shadow-xl transition-colors duration-500 ${
              isDark
                ? 'bg-[#222222]/85 border-[#C5A36A]/25 text-[#F5F0E8]'
                : 'bg-[#FFFFFF]/90 border-[#A98750]/30 text-[#29231D]'
            }`}
          >
            <span
              className="text-[11px] font-serif tracking-[0.25em] uppercase block font-bold transition-colors duration-500"
              style={{ color: activeAccent }}
            >
              {activePerfume.brand}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black">
              {activePerfume.fullModel}
            </h2>

            <p
              className={`text-sm sm:text-base leading-relaxed max-w-xl mx-auto ${
                isDark ? 'text-[#F5F0E8]/80' : 'text-[#29231D]/80'
              }`}
            >
              {language === 'ar' ? activePerfume.descriptionAr : activePerfume.descriptionHe}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PerfumeShelfHero;
