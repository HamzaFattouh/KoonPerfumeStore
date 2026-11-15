import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Eye,
  Play,
  Pause,
  Star,
  ArrowLeft,
  Compass
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCachedSiteSettings } from '../../services/adminService';

const PerfumeShelfHero = ({ products = [], isLoading = false, heroSettings }) => {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const currency = t.currency || 'ر.س';

  const activeHero = (heroSettings && Object.keys(heroSettings).length > 0)
    ? heroSettings
    : (getCachedSiteSettings()?.hero_section || {});

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slotSpacing, setSlotSpacing] = useState(230);

  // Responsive slot spacing for the shelf
  useEffect(() => {
    const updateSpacing = () => {
      if (window.innerWidth < 640) {
        setSlotSpacing(135);
      } else if (window.innerWidth < 1024) {
        setSlotSpacing(185);
      } else {
        setSlotSpacing(235);
      }
    };
    updateSpacing();
    window.addEventListener('resize', updateSpacing);
    return () => window.removeEventListener('resize', updateSpacing);
  }, []);

  // Ensure activeIndex stays in bounds when products load
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

  // Auto-advance spotlight from perfume to perfume
  useEffect(() => {
    if (isPaused || products.length <= 1) return;
    const timer = setInterval(() => {
      nextPerfume();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, products.length, nextPerfume]);

  // Calculate circular shortest-path offset so the active perfume is always centered
  // and neighboring perfumes flank both left and right sides on the shelf
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
  const defaultSize = activeProduct?.sizes?.find(s => s.isDefault)?.size || activeProduct?.sizes?.[0]?.size || '100ml';
  const activePrice = activeProduct?.sizes?.find(s => s.size === defaultSize)?.price || activeProduct?.price || 0;

  return (
    <section
      className="relative w-full min-h-[92dvh] flex flex-col justify-between pt-24 sm:pt-28 pb-12 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient Cosmic Spotlight Backdrop */}
      <div className="absolute inset-0 pointer-events-none flex items-start justify-center overflow-hidden">
        {/* Top Warm Gold Spotlight Cone shining down onto center perfume */}
        <div className="w-[340px] sm:w-[560px] h-[520px] bg-gradient-to-b from-amber-400/20 via-amber-500/5 to-transparent blur-[70px] rounded-full -mt-20" />
        <div className="absolute top-1/3 w-[500px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Top Compact Brand Header */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center space-y-2 mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-bold backdrop-blur-md">
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
      {/* THE 3D LUXURY PERFUME SHELF STAGE (رف العطور التفاعلي)                 */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-2 sm:px-6 my-2">
        {isLoading ? (
          <div className="h-[340px] sm:h-[390px] flex items-center justify-center">
            <div className="w-48 h-64 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          </div>
        ) : products.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
            {language === 'ar' ? 'جاري تحضير رف العطور...' : 'טוען בשמים למדף...'}
          </div>
        ) : (
          <div className="relative">
            {/* Left / Right Shelf Navigation Arrows */}
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

            {/* LTR Coordinate Stage so horizontal shifting (إزاحة) is 100% symmetrical */}
            <motion.div
              dir="ltr"
              className="relative h-[300px] sm:h-[360px] w-full flex items-end justify-center overflow-visible"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, info) => {
                if (info.offset.x < -45) nextPerfume();
                else if (info.offset.x > 45) prevPerfume();
              }}
            >
              {/* Center Spotlight Pedestal Glow */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-56 sm:w-72 h-14 bg-amber-400/25 blur-2xl rounded-full pointer-events-none z-10" />

              {/* Perfume Bottles on the Shelf */}
              {products.map((product, idx) => {
                const diff = getOffset(idx);
                const absDiff = Math.abs(diff);
                const isCenter = diff === 0;
                const isVisible = absDiff <= 2;

                // Scale, brightness, saturation & opacity for spotlight hierarchy
                const scale = isCenter ? 1.24 : absDiff === 1 ? 0.82 : absDiff === 2 ? 0.64 : 0.45;
                const opacity = isCenter ? 1 : absDiff === 1 ? 0.78 : absDiff === 2 ? 0.42 : 0;
                const yOffset = isCenter ? -16 : absDiff === 1 ? 0 : 10;
                const zIndex = isCenter ? 30 : absDiff === 1 ? 20 : absDiff === 2 ? 10 : 0;
                const filterStyle = isCenter
                  ? 'brightness(1.12) saturate(1.2) contrast(1.05)'
                  : absDiff === 1
                  ? 'brightness(0.52) saturate(0.45)'
                  : 'brightness(0.32) saturate(0.28)';

                return (
                  <motion.div
                    key={product.id}
                    onClick={() => setActiveIndex(idx)}
                    initial={false}
                    animate={{
                      x: diff * slotSpacing,
                      y: yOffset,
                      scale,
                      opacity,
                      zIndex
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 230,
                      damping: 26,
                      mass: 0.9
                    }}
                    style={{
                      filter: filterStyle,
                      pointerEvents: isVisible ? 'auto' : 'none'
                    }}
                    className={`absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group origin-bottom`}
                  >
                    {/* Center Golden Aura Ring behind active bottle */}
                    {isCenter && (
                      <motion.div
                        layoutId="shelf-active-aura"
                        className="absolute -inset-4 rounded-3xl bg-gradient-to-t from-amber-500/25 via-amber-400/10 to-transparent blur-xl pointer-events-none"
                      />
                    )}

                    {/* Bottle Visual Frame */}
                    <div
                      className={`relative w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden transition-all duration-300 ${
                        isCenter
                          ? 'ring-2 ring-amber-400/80 shadow-[0_20px_50px_rgba(245,158,11,0.35)] bg-slate-950'
                          : 'ring-1 ring-slate-700/60 hover:ring-amber-400/40 shadow-xl bg-slate-950/90'
                      }`}
                    >
                      <img
                        src={product.images?.[0] || product.image_url}
                        alt={product.name}
                        draggable={false}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Subtle top badge only on center bottle */}
                      {isCenter && product.badge && (
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-lg">
                          {product.badge}
                        </span>
                      )}

                      {/* Subtle glass sheen */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 pointer-events-none" />
                    </div>

                    {/* Shelf Contact Shadow directly under bottle */}
                    <div
                      className={`mt-2 h-2.5 rounded-full blur-sm transition-all duration-300 ${
                        isCenter ? 'w-36 bg-amber-400/50' : 'w-24 bg-black/80'
                      }`}
                    />
                  </motion.div>
                );
              })}

              {/* =============================================================== */}
              {/* THE 3D LUXURY WOOD/OBSIDIAN & GOLD SHELF PLANK (الرف الفعلي)   */}
              {/* =============================================================== */}
              <div className="absolute bottom-0 inset-x-4 sm:inset-x-10 h-9 pointer-events-none z-20">
                {/* Top reflective surface of the shelf */}
                <div className="h-3 w-full rounded-t-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-amber-400/60 shadow-[0_-4px_25px_rgba(245,158,11,0.18)] relative overflow-hidden">
                  {/* Center warm spotlight reflection on shelf surface */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-64 bg-gradient-to-r from-transparent via-amber-400/35 to-transparent" />
                </div>
                {/* Front thick bevel edge of the shelf */}
                <div className="h-4 w-full bg-gradient-to-b from-slate-950 via-slate-900 to-black border-t border-amber-500/30 border-b border-slate-800/80 rounded-b-lg shadow-[0_18px_40px_rgba(0,0,0,0.95)]" />
              </div>
            </motion.div>

            {/* Shelf Pagination Dots & Auto-Play Toggle */}
            {products.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsPaused(p => !p)}
                  className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 transition cursor-pointer"
                  title={isPaused ? 'تشغيل العرض التلقائي' : 'إيقاف العرض التلقائي'}
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
      {/* ACTIVE PERFUME DYNAMIC DESCRIPTION PANEL (وصف العطر المعروض بالمنتصف)   */}
      {/* ========================================================================= */}
      {activeProduct && (
        <div className="relative z-20 max-w-3xl w-full mx-auto px-4 mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-slate-950/80 border border-amber-500/30 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl shadow-black/60 text-center space-y-4"
            >
              {/* Meta Tags: Category, Concentration & Rating */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                  {activeProduct.concentration || 'Extrait de Parfum'}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700 font-semibold">
                  {activeProduct.scentFamily || activeProduct.categoryName}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-amber-400 border border-slate-800 font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{activeProduct.rating || 4.9}</span>
                </span>
              </div>

              {/* Perfume Title */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {activeProduct.name}
                </h2>
                {activeProduct.nameEn && (
                  <span className="text-xs font-serif tracking-[0.22em] text-amber-400/90 uppercase block mt-1">
                    {activeProduct.nameEn}
                  </span>
                )}
              </div>

              {/* Dynamic Description of Selected Center Perfume */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
                {activeProduct.description || activeProduct.tagline}
              </p>

              {/* Scent Notes Pills */}
              {activeProduct.notes && (activeProduct.notes.top?.length > 0 || activeProduct.notes.heart?.length > 0 || activeProduct.notes.base?.length > 0) && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px]">
                  {activeProduct.notes.top?.slice(0, 2).map((note, i) => (
                    <span key={`t-${i}`} className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
                      ✨ {note}
                    </span>
                  ))}
                  {activeProduct.notes.heart?.slice(0, 2).map((note, i) => (
                    <span key={`h-${i}`} className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
                      🌸 {note}
                    </span>
                  ))}
                  {activeProduct.notes.base?.slice(0, 2).map((note, i) => (
                    <span key={`b-${i}`} className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-amber-300/90">
                      🪵 {note}
                    </span>
                  ))}
                </div>
              )}

              {/* Price & Quick Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">
                    {activePrice} <span className="text-xs font-bold">{currency}</span>
                  </span>
                  {activeProduct.originalPrice > activePrice && (
                    <span className="text-xs text-slate-500 line-through">
                      {activeProduct.originalPrice} {currency}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">({defaultSize})</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => addToCart(activeProduct, defaultSize, 1)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{language === 'ar' ? 'أضف للسلة الآن' : 'הוסף לסל'}</span>
                  </button>

                  <Link
                    to={`/product/${activeProduct.id}`}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-slate-200 hover:text-amber-300 font-bold text-xs sm:text-sm transition flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تفاصيل العطر' : 'פרטי הבושם'}</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Optional Admin-Controlled Secondary Store Buttons */}
          {(activeHero.show_explore_btn !== false || activeHero.show_quiz_btn !== false) && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              {activeHero.show_explore_btn !== false && (
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-bold transition"
                >
                  <span>{language === 'ar' ? 'تصفح كل العطور في المتجر' : 'לכל הבשמים בחנות'}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              )}
              {activeHero.show_quiz_btn !== false && (
                <Link
                  to="/quiz"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-bold transition"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ar' ? 'مستكشف العطور (Quiz)' : 'בוחן התאמת בושם'}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PerfumeShelfHero;
