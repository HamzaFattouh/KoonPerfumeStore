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

// Signature 3D liquid & glow palettes so each perfume bottle has distinct vivid colors
const BOTTLE_THEMES = [
  {
    name: 'amber-oud',
    liquid: 'from-amber-400/90 via-amber-600/85 to-amber-950/95',
    glow: 'rgba(245, 158, 11, 0.45)',
    cap: 'from-amber-900 via-amber-300 to-amber-800',
    accent: '#fbbf24'
  },
  {
    name: 'royal-rose',
    liquid: 'from-rose-400/90 via-rose-600/85 to-rose-950/95',
    glow: 'rgba(244, 63, 94, 0.42)',
    cap: 'from-rose-950 via-amber-200 to-rose-900',
    accent: '#fb7185'
  },
  {
    name: 'midnight-twilight',
    liquid: 'from-indigo-400/90 via-violet-700/85 to-slate-950/95',
    glow: 'rgba(129, 140, 248, 0.45)',
    cap: 'from-slate-800 via-slate-200 to-slate-900',
    accent: '#a5b4fc'
  },
  {
    name: 'emerald-nebula',
    liquid: 'from-emerald-400/90 via-teal-600/85 to-emerald-950/95',
    glow: 'rgba(52, 211, 153, 0.42)',
    cap: 'from-amber-900 via-amber-200 to-amber-800',
    accent: '#34d399'
  },
  {
    name: 'crimson-velvet',
    liquid: 'from-orange-400/90 via-red-700/85 to-red-950/95',
    glow: 'rgba(239, 68, 68, 0.42)',
    cap: 'from-amber-950 via-amber-300 to-amber-900',
    accent: '#f87171'
  }
];

const getBottleTheme = (product, idx) => {
  const family = (product?.scentFamily || product?.category || '').toLowerCase();
  if (family.includes('زهور') || family.includes('ورد') || family.includes('women')) {
    return BOTTLE_THEMES[1];
  }
  if (family.includes('جلد') || family.includes('ليلي') || family.includes('شفق')) {
    return BOTTLE_THEMES[2];
  }
  if (family.includes('حمضي') || family.includes('منعش')) {
    return BOTTLE_THEMES[3];
  }
  return BOTTLE_THEMES[idx % BOTTLE_THEMES.length];
};

/**
 * 3D Realistic Glass Perfume Bottle Component
 */
const PerfumeBottle3D = ({ product, theme, isCenter }) => {
  const productImg = product.images?.[0] || product.image_url;

  return (
    <div className="relative flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
      {/* 1. 3D Cylindrical Metallic Cap */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Cap Top Crown */}
        <div
          className={`w-10 sm:w-12 h-2 rounded-t-md bg-gradient-to-r ${theme.cap} opacity-90 border-t border-white/40`}
        />
        {/* Cap Body with 3D Cylindrical Specular Highlight */}
        <div
          className={`w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r ${theme.cap} relative shadow-lg border-x border-white/20`}
        >
          {/* Vertical 3D Specular Sheen */}
          <div className="absolute inset-y-0 left-[26%] w-[18%] bg-gradient-to-r from-transparent via-white/55 to-transparent" />
          <div className="absolute inset-y-0 right-[18%] w-[8%] bg-black/25" />
        </div>
        {/* Atomizer Neck Collar */}
        <div className="w-7 sm:w-8 h-2.5 bg-gradient-to-r from-amber-800 via-amber-300 to-amber-900 border-y border-amber-200/40 shadow-md" />
      </div>

      {/* 2. 3D Glass Bottle Body */}
      <div
        className={`relative w-32 h-44 sm:w-40 sm:h-52 rounded-t-2xl rounded-b-xl overflow-hidden transition-shadow duration-500 border border-white/25 backdrop-blur-md ${
          isCenter ? 'shadow-[0_22px_55px_rgba(0,0,0,0.9)]' : 'shadow-2xl'
        }`}
        style={{
          boxShadow: isCenter
            ? `0 20px 50px -10px ${theme.glow}, inset 0 1px 1px rgba(255,255,255,0.45)`
            : 'inset 0 1px 1px rgba(255,255,255,0.25)'
        }}
      >
        {/* Outer Thick Glass Rim (Left & Right 3D Depth Bevels) */}
        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-white/30 via-white/10 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-2.5 bg-gradient-to-l from-black/45 via-white/10 to-transparent z-20 pointer-events-none" />

        {/* Internal Spray Straw (Atomizer Tube) */}
        <div className="absolute top-0 bottom-3 left-1/2 -translate-x-1/2 w-[2px] bg-white/35 z-10 pointer-events-none" />

        {/* Subtle Product Image Texture inside the Glass */}
        {productImg && (
          <img
            src={productImg}
            alt={product.name}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity scale-110 pointer-events-none"
          />
        )}

        {/* Rich 3D Perfume Liquid Fill */}
        <div
          className={`absolute inset-x-1.5 top-3 bottom-3.5 rounded-t-xl rounded-b-lg bg-gradient-to-b ${theme.liquid} border-t border-white/40 shadow-inner`}
        >
          {/* Top Liquid Meniscus Highlight */}
          <div className="h-1.5 w-full rounded-t-xl bg-gradient-to-r from-white/10 via-white/45 to-white/10" />
        </div>

        {/* Thick Solid Glass Base at Bottom of Bottle */}
        <div className="absolute bottom-0 inset-x-0 h-3.5 bg-gradient-to-t from-white/30 via-white/15 to-transparent border-t border-white/25 z-20 pointer-events-none" />

        {/* Embossed Front Luxury Label */}
        <div className="absolute inset-x-4 sm:inset-x-5 top-1/2 -translate-y-1/2 z-20 py-3 px-2 rounded-lg bg-slate-950/85 border border-amber-400/50 shadow-xl text-center backdrop-blur-sm">
          <span className="text-[7px] sm:text-[8px] font-serif tracking-[0.25em] text-amber-400 uppercase block">
            KOON
          </span>
          <div className="w-6 h-[1px] bg-amber-400/50 mx-auto my-1" />
          <span className="text-[11px] sm:text-xs font-black text-white leading-tight line-clamp-2 block">
            {product.name}
          </span>
          {product.nameEn && (
            <span className="text-[7px] sm:text-[8px] font-serif text-slate-400 uppercase tracking-wider mt-0.5 block truncate">
              {product.nameEn}
            </span>
          )}
        </div>

        {/* Diagonal 3D Glass Reflection Streak */}
        <div className="absolute -inset-full top-0 w-1/2 h-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent -rotate-25 translate-x-1/2 z-30 pointer-events-none" />
      </div>
    </div>
  );
};

const PerfumeShelfHero = ({ products = [], isLoading = false, heroSettings }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const activeHero = (heroSettings && Object.keys(heroSettings).length > 0)
    ? heroSettings
    : (getCachedSiteSettings()?.hero_section || {});

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slotSpacing, setSlotSpacing] = useState(220);

  // Responsive horizontal spacing for the 3D shelf
  useEffect(() => {
    const updateSpacing = () => {
      if (window.innerWidth < 640) {
        setSlotSpacing(125);
      } else if (window.innerWidth < 1024) {
        setSlotSpacing(175);
      } else {
        setSlotSpacing(220);
      }
    };
    updateSpacing();
    window.addEventListener('resize', updateSpacing);
    return () => window.removeEventListener('resize', updateSpacing);
  }, []);

  useEffect(() => {
    if (products.length > 0 && activeIndex >= products.length) {
      setActiveIndex(0);
    }
  }, [products.length, activeIndex]);

  const nextPerfume = useCallback(() => {
    if (products.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prevPerfume = useCallback(() => {
    if (products.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  // Auto-advance spotlight from bottle to bottle on the shelf
  useEffect(() => {
    if (isPaused || products.length <= 1) return;
    const timer = setInterval(() => {
      nextPerfume();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, products.length, nextPerfume]);

  // Shortest-path circular offset so selected bottle shifts smoothly into center
  const getOffset = (index) => {
    const n = products.length;
    if (n === 0) return 0;
    if (n < 5) return index - activeIndex;
    let diff = (index - activeIndex + n) % n;
    if (diff > Math.floor(n / 2)) {
      diff -= n;
    }
    return diff;
  };

  const activeProduct = products[activeIndex] || null;
  const activeTheme = activeProduct ? getBottleTheme(activeProduct, activeIndex) : BOTTLE_THEMES[0];

  return (
    <section
      className="relative w-full min-h-[92dvh] flex flex-col justify-center pt-28 sm:pt-32 pb-14 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Colored Ambient Spotlight matching the active center bottle */}
      <div className="absolute inset-0 pointer-events-none flex items-start justify-center overflow-hidden">
        <motion.div
          animate={{ backgroundColor: activeTheme.glow }}
          transition={{ duration: 0.8 }}
          className="w-[340px] sm:w-[540px] h-[440px] opacity-30 blur-[110px] rounded-full mt-12"
        />
      </div>

      {/* Top Subtle Shelf Title */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-bold backdrop-blur-md mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {language === 'ar'
              ? (activeHero.tagline_ar || 'رف العطور الفلكية • إصدارات نيش حصرية')
              : (activeHero.tagline_he || 'מדף הבשמים הקוסמי • מהדורות נישה בלעדיות')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {language === 'ar'
            ? (activeHero.title_ar || 'مجموعة كون الفلكية الفاخرة')
            : (activeHero.title_he || 'קולקציית הנישה של KOON')}
        </h1>
      </div>

      {/* ========================================================================= */}
      {/* 3D PERFUME SHELF STAGE (رف العطور الثلاثي الأبعاد)                      */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-2 sm:px-6 my-2">
        {isLoading ? (
          <div className="h-[340px] sm:h-[380px] flex items-center justify-center">
            <div className="w-36 h-52 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          </div>
        ) : products.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">
            {language === 'ar' ? 'جاري تحضير رف العطور...' : 'טוען בשמים למדף...'}
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Arrows */}
            {products.length > 1 && (
              <>
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
              </>
            )}

            {/* 3D Perspective Coordinate Stage */}
            <motion.div
              dir="ltr"
              className="relative h-[320px] sm:h-[380px] w-full flex items-end justify-center overflow-visible"
              style={{ perspective: 1100 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, info) => {
                if (info.offset.x < -45) nextPerfume();
                else if (info.offset.x > 45) prevPerfume();
              }}
            >
              {/* Center Pedestal Glow */}
              <motion.div
                animate={{ backgroundColor: activeTheme.glow }}
                transition={{ duration: 0.6 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-52 sm:w-64 h-12 opacity-40 blur-2xl rounded-full pointer-events-none z-10"
              />

              {/* 3D Bottles Row */}
              {products.map((product, idx) => {
                const diff = getOffset(idx);
                const absDiff = Math.abs(diff);
                const isCenter = diff === 0;
                const isVisible = absDiff <= 2;
                const theme = getBottleTheme(product, idx);

                const scale = isCenter ? 1.25 : absDiff === 1 ? 0.8 : absDiff === 2 ? 0.6 : 0.4;
                const opacity = isCenter ? 1 : absDiff === 1 ? 0.78 : absDiff === 2 ? 0.42 : 0;
                const yOffset = isCenter ? -14 : absDiff === 1 ? 2 : 12;
                const rotateY = diff * -14; // Side bottles angle inward in 3D space
                const zIndex = isCenter ? 30 : absDiff === 1 ? 20 : absDiff === 2 ? 10 : 0;
                const filterStyle = isCenter
                  ? 'brightness(1.15) saturate(1.28) contrast(1.06)'
                  : absDiff === 1
                  ? 'brightness(0.48) saturate(0.4)'
                  : 'brightness(0.28) saturate(0.25)';

                return (
                  <motion.div
                    key={product.id}
                    onClick={() => {
                      if (isCenter) {
                        navigate(`/product/${product.id}`);
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
                      stiffness: 210,
                      damping: 25,
                      mass: 0.9
                    }}
                    style={{
                      filter: filterStyle,
                      pointerEvents: isVisible ? 'auto' : 'none',
                      transformStyle: 'preserve-3d'
                    }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group origin-bottom"
                    title={isCenter ? (language === 'ar' ? 'اضغط لعرض العطر' : 'לחץ לצפייה') : product.name}
                  >
                    {/* 3D Perfume Bottle */}
                    <PerfumeBottle3D product={product} theme={theme} isCenter={isCenter} />

                    {/* Shelf Contact Shadow & Bottle Reflection */}
                    <div
                      className={`mt-2 h-2.5 rounded-full blur-sm transition-all duration-300 ${
                        isCenter ? 'w-32 bg-amber-400/45' : 'w-20 bg-black/85'
                      }`}
                    />
                  </motion.div>
                );
              })}

              {/* 3D Luxury Shelf Plank */}
              <div className="absolute bottom-0 inset-x-4 sm:inset-x-10 h-9 pointer-events-none z-20">
                <div className="h-3 w-full rounded-t-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-amber-400/60 shadow-[0_-4px_25px_rgba(245,158,11,0.18)] relative overflow-hidden">
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-64 bg-gradient-to-r from-transparent via-amber-400/35 to-transparent" />
                </div>
                <div className="h-4 w-full bg-gradient-to-b from-slate-950 via-slate-900 to-black border-t border-amber-500/30 border-b border-slate-800/80 rounded-b-lg shadow-[0_18px_40px_rgba(0,0,0,0.95)]" />
              </div>
            </motion.div>

            {/* Shelf Indicator Dots & Auto-Play Control */}
            {products.length > 1 && (
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
                  {products.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={p.name}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeIndex
                          ? 'w-7 bg-amber-400 shadow-sm shadow-amber-400/50'
                          : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PERFUME DESCRIPTION ONLY UNDER THE CENTER 3D BOTTLE (وصف العطر فقط)      */}
      {/* ========================================================================= */}
      {activeProduct && (
        <div className="relative z-20 max-w-2xl w-full mx-auto px-4 mt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="text-center space-y-2.5 px-4 py-5 rounded-3xl bg-slate-950/55 border border-amber-500/20 backdrop-blur-md shadow-xl"
            >
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {activeProduct.name}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
                {activeProduct.description || activeProduct.tagline}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default PerfumeShelfHero;
