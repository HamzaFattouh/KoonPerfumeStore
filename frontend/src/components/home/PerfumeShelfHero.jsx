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

// 7 Iconic French Luxury Perfume Bottle Designs (ماركات عالمية فرنسية)
const FRENCH_BOTTLE_DESIGNS = [
  {
    id: 'dior',
    brand: 'Dior',
    model: 'SAUVAGE',
    sub: 'PARFUM • PARIS',
    glow: 'rgba(59, 130, 246, 0.45)',
    renderBottle: (product, isCenter) => (
      <div className="relative flex flex-col items-center">
        {/* Ribbed Magnetic Black Cap */}
        <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-t-md bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-950 relative border-x border-t border-white/15 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.08)_2px,rgba(255,255,255,0.08)_4px)]" />
          <div className="absolute inset-y-0 left-[25%] w-[15%] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
        {/* Silver Neck Ring */}
        <div className="w-8 sm:w-9 h-1.5 bg-gradient-to-r from-slate-600 via-slate-200 to-slate-700" />
        {/* Cylindrical Midnight-to-Steel Glass Body */}
        <div
          className="relative w-28 h-44 sm:w-34 sm:h-52 rounded-t-[1.75rem] rounded-b-xl overflow-hidden border border-sky-300/25 bg-gradient-to-b from-slate-950 via-blue-950/90 to-sky-900/60"
          style={{
            boxShadow: isCenter
              ? '0 22px 55px -10px rgba(59,130,246,0.5), inset 0 1px 2px rgba(255,255,255,0.35)'
              : 'inset 0 1px 1px rgba(255,255,255,0.2)'
          }}
        >
          {/* 3D Cylindrical Side Highlights */}
          <div className="absolute inset-y-0 left-2 w-3 bg-gradient-to-r from-sky-200/25 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-1.5 w-2.5 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
          {/* Heavy Clear Glass Bottom */}
          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-sky-200/30 to-transparent border-t border-sky-300/20" />
          {/* Typography directly on glass */}
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 text-center space-y-1.5 z-10">
            <span className="text-[11px] sm:text-xs font-serif font-bold tracking-[0.22em] text-white block drop-shadow">
              SAUVAGE
            </span>
            <span className="text-[8px] tracking-[0.2em] text-sky-200/80 uppercase block">
              {product.name}
            </span>
            <div className="pt-3">
              <span className="text-[10px] font-serif font-semibold tracking-widest text-white/90">
                Dior
              </span>
            </div>
          </div>
          {/* Specular Reflection */}
          <div className="absolute -inset-full top-0 w-1/3 h-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent -rotate-12 translate-x-1/2 pointer-events-none" />
        </div>
      </div>
    )
  },
  {
    id: 'mfk',
    brand: 'Maison Francis Kurkdjian',
    model: 'Baccarat Rouge 540',
    sub: 'EXTRAIT DE PARFUM',
    glow: 'rgba(225, 29, 72, 0.5)',
    renderBottle: (product, isCenter) => (
      <div className="relative flex flex-col items-center">
        {/* Heavy Brushed Gold Architectural Cap */}
        <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-t-sm bg-gradient-to-r from-amber-800 via-amber-200 to-amber-700 relative border border-amber-200/50 shadow-lg">
          <div className="absolute inset-y-0 left-[22%] w-[20%] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-amber-950/40" />
        </div>
        {/* Gold Collar */}
        <div className="w-7 h-1.5 bg-gradient-to-r from-amber-700 via-amber-200 to-amber-800" />
        {/* Square-Cut Crimson Crystal Flacon */}
        <div
          className="relative w-32 h-44 sm:w-36 sm:h-50 rounded-md overflow-hidden border border-rose-300/35 bg-gradient-to-b from-red-700 via-rose-800 to-red-950"
          style={{
            boxShadow: isCenter
              ? '0 22px 55px -10px rgba(225,29,72,0.55), inset 0 2px 3px rgba(255,255,255,0.4)'
              : 'inset 0 1px 1px rgba(255,255,255,0.2)'
          }}
        >
          {/* Crystal Beveled Edges */}
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/30 to-transparent border-r border-white/10" />
          <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/45 to-transparent border-l border-white/10" />
          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-amber-200/25 via-rose-300/15 to-transparent border-t border-white/25" />
          {/* Ornate Gold & White Front Plaque */}
          <div className="absolute inset-x-3.5 top-1/2 -translate-y-1/2 py-3 px-2 bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-amber-400 rounded-sm shadow-xl text-center">
            <span className="text-[9px] sm:text-[10px] font-serif font-black text-red-900 leading-tight block">
              Baccarat Rouge 540
            </span>
            <div className="w-8 h-[1px] bg-amber-500 mx-auto my-1" />
            <span className="text-[7px] font-bold text-slate-800 block truncate">
              {product.name}
            </span>
            <span className="text-[6px] tracking-widest text-amber-800 uppercase block mt-0.5">
              Maison Francis Kurkdjian
            </span>
          </div>
          <div className="absolute -inset-full top-0 w-1/2 h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-25 translate-x-1/2 pointer-events-none" />
        </div>
      </div>
    )
  },
  {
    id: 'chanel',
    brand: 'CHANEL',
    model: 'N°5',
    sub: 'PARIS',
    glow: 'rgba(251, 191, 36, 0.48)',
    renderBottle: (product, isCenter) => (
      <div className="relative flex flex-col items-center">
        {/* Iconic Faceted Emerald-Cut Black/Crystal Stopper */}
        <div className="w-12 sm:w-14 h-9 sm:h-10 rounded-t-sm bg-gradient-to-r from-slate-950 via-slate-700 to-slate-950 border border-white/30 relative shadow-xl">
          <div className="absolute inset-1 border border-white/20" />
          <div className="absolute inset-y-0 left-[25%] w-[18%] bg-white/25" />
        </div>
        {/* Clear Crystal Neck */}
        <div className="w-6 h-2.5 bg-gradient-to-r from-amber-200/40 via-white/60 to-amber-200/40 border-x border-white/40" />
        {/* Architectural Rectangular Crystal Bottle with Golden Elixir */}
        <div
          className="relative w-32 h-44 sm:w-36 sm:h-50 rounded-sm overflow-hidden border-2 border-white/40 bg-gradient-to-b from-amber-200/85 via-amber-400/85 to-amber-600/90"
          style={{
            boxShadow: isCenter
              ? '0 22px 55px -10px rgba(251,191,36,0.5), inset 0 2px 4px rgba(255,255,255,0.6)'
              : 'inset 0 1px 2px rgba(255,255,255,0.3)'
          }}
        >
          {/* Thick Glass Frame */}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-white/50 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-2.5 bg-gradient-to-l from-white/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-4 bg-white/35 border-t border-white/40" />
          {/* Iconic Crisp White Chanel Label */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 py-3.5 px-2 bg-white border border-slate-900 shadow-lg text-center">
            <span className="text-[11px] sm:text-xs font-serif font-black text-slate-950 block">
              N°5
            </span>
            <span className="text-[9px] font-serif font-bold tracking-[0.2em] text-slate-950 block mt-0.5">
              CHANEL
            </span>
            <span className="text-[7px] text-slate-600 block mt-1 truncate">
              {product.name}
            </span>
          </div>
          <div className="absolute -inset-full top-0 w-1/2 h-[200%] bg-gradient-to-r from-transparent via-white/25 to-transparent -rotate-20 translate-x-1/2 pointer-events-none" />
        </div>
      </div>
    )
  },
  {
    id: 'ysl',
    brand: 'YVES SAINT LAURENT',
    model: 'LIBRE',
    sub: 'EAU DE PARFUM',
    glow: 'rgba(245, 158, 11, 0.45)',
    renderBottle: (product, isCenter) => (
      <div className="relative flex flex-col items-center">
        {/* Asymmetric Glossy Black Cap */}
        <div className="w-9 sm:w-10 h-11 sm:h-12 bg-gradient-to-r from-neutral-950 via-neutral-700 to-black border border-white/20 rounded-tl-md rounded-tr-sm shadow-lg relative">
          <div className="absolute inset-y-0 left-[25%] w-[18%] bg-white/20" />
        </div>
        {/* Wrapped Golden Neck Collar */}
        <div className="w-12 sm:w-14 h-3 bg-gradient-to-r from-amber-700 via-amber-200 to-amber-700 border-y border-amber-100/50 shadow-md" />
        {/* Tailored Tall Amber Glass Flacon with Gold YSL Emblem */}
        <div
          className="relative w-28 h-46 sm:w-32 sm:h-52 rounded-md overflow-hidden border border-amber-200/40 bg-gradient-to-b from-amber-300/85 via-amber-500/85 to-amber-700/90"
          style={{
            boxShadow: isCenter
              ? '0 22px 55px -10px rgba(245,158,11,0.5), inset 0 2px 3px rgba(255,255,255,0.5)'
              : 'inset 0 1px 1px rgba(255,255,255,0.25)'
          }}
        >
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-white/40 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-2.5 bg-gradient-to-l from-black/25 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-4 bg-white/30 border-t border-white/35" />
          {/* Metallic Gold Cassandre Monogram Badge */}
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 text-center space-y-1.5">
            <div className="inline-block px-3 py-2 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 border border-amber-100 shadow-lg">
              <span className="text-sm sm:text-base font-serif font-black tracking-tighter text-slate-950 block leading-none">
                YSL
              </span>
            </div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-slate-950 block">
              LIBRE
            </span>
            <span className="text-[8px] font-bold text-amber-950 bg-white/60 px-2 py-0.5 rounded-full inline-block truncate max-w-full">
              {product.name}
            </span>
          </div>
          <div className="absolute -inset-full top-0 w-1/2 h-[200%] bg-gradient-to-r from-transparent via-white/25 to-transparent -rotate-20 translate-x-1/2 pointer-events-none" />
        </div>
      </div>
    )
  },
  {
    id: 'pdm',
    brand: 'PARFUMS de MARLY',
    model: 'LAYTON',
    sub: 'ROYAL ESSENCE',
    glow: 'rgba(99, 102, 241, 0.48)',
    renderBottle: (product, isCenter) => (
      <div className="relative flex flex-col items-center">
        {/* Heavy Silver Spherical/Domed Royal Cap */}
        <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-t-full bg-gradient-to-r from-slate-600 via-slate-100 to-slate-700 border border-white/40 shadow-xl relative">
          <div className="absolute inset-y-2 left-[28%] w-[20%] bg-white/50 rounded-full blur-[1px]" />
        </div>
        {/* Silver Neck Band */}
        <div className="w-8 h-2 bg-gradient-to-r from-slate-500 via-white to-slate-600" />
        {/* Royal Sapphire-Navy Sculpted Flacon */}
        <div
          className="relative w-30 h-44 sm:w-36 sm:h-50 rounded-t-[2rem] rounded-b-2xl overflow-hidden border border-indigo-300/30 bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-950"
          style={{
            boxShadow: isCenter
              ? '0 22px 55px -10px rgba(99,102,241,0.55), inset 0 2px 3px rgba(255,255,255,0.25)'
              : 'inset 0 1px 1px rgba(255,255,255,0.15)'
          }}
        >
          <div className="absolute inset-y-0 left-2 w-3 bg-gradient-to-r from-indigo-300/20 to-transparent" />
          <div className="absolute inset-y-0 right-1.5 w-3 bg-gradient-to-l from-black/55 to-transparent" />
          {/* Embossed Silver Royal Crest */}
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 text-center space-y-1.5">
            <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-b from-slate-200 to-slate-500 border border-white/60 flex items-center justify-center shadow-lg">
              <span className="text-[10px] font-serif font-black text-slate-900">⚜</span>
            </div>
            <span className="text-[8px] font-serif font-bold tracking-[0.18em] text-slate-200 block">
              PARFUMS de MARLY
            </span>
            <span className="text-[9px] font-bold text-indigo-300 block truncate">
              {product.name}
            </span>
          </div>
          <div className="absolute -inset-full top-0 w-1/3 h-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent -rotate-15 translate-x-1/2 pointer-events-none" />
        </div>
      </div>
    )
  },
  {
    id: 'guerlain',
    brand: 'GUERLAIN',
    model: 'SANTAL ROYAL',
    sub: 'PARIS',
    glow: 'rgba(16, 185, 129, 0.45)',
    renderBottle: (product, isCenter) => (
      <div className="relative flex flex-col items-center">
        {/* Sculpted Jewel-Cut Black & Gold Cap */}
        <div className="w-12 sm:w-14 h-9 sm:h-10 rounded-t-full bg-gradient-to-r from-neutral-950 via-neutral-700 to-black border border-amber-400/50 shadow-lg relative">
          <div className="absolute inset-x-2 bottom-1 h-1 bg-amber-400/60 rounded-full" />
        </div>
        {/* Gold Ribbon Collar */}
        <div className="w-7 h-2.5 bg-gradient-to-r from-amber-700 via-amber-300 to-amber-800 border-y border-amber-200/40" />
        {/* Deep Emerald-Obsidian Flacon with Gold Plaque */}
        <div
          className="relative w-30 h-44 sm:w-36 sm:h-50 rounded-t-3xl rounded-b-xl overflow-hidden border border-emerald-300/30 bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950"
          style={{
            boxShadow: isCenter
              ? '0 22px 55px -10px rgba(16,185,129,0.5), inset 0 2px 3px rgba(255,255,255,0.28)'
              : 'inset 0 1px 1px rgba(255,255,255,0.15)'
          }}
        >
          <div className="absolute inset-y-0 left-1.5 w-2.5 bg-gradient-to-r from-emerald-200/20 to-transparent" />
          <div className="absolute inset-y-0 right-1.5 w-2.5 bg-gradient-to-l from-black/50 to-transparent" />
          {/* Golden Oval Heritage Label */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 py-3 px-2 rounded-2xl bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 border border-amber-100 shadow-xl text-center">
            <span className="text-[9px] font-serif font-black tracking-[0.2em] text-slate-950 block">
              GUERLAIN
            </span>
            <span className="text-[7px] font-bold text-amber-950 block mt-0.5">
              PARIS
            </span>
            <div className="w-6 h-[1px] bg-slate-900/40 mx-auto my-1" />
            <span className="text-[8px] font-black text-slate-950 block truncate">
              {product.name}
            </span>
          </div>
          <div className="absolute -inset-full top-0 w-1/3 h-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent -rotate-20 translate-x-1/2 pointer-events-none" />
        </div>
      </div>
    )
  },
  {
    id: 'givenchy',
    brand: 'GIVENCHY',
    model: 'GENTLEMAN',
    sub: 'RÉSERVE PRIVÉE',
    glow: 'rgba(234, 88, 12, 0.45)',
    renderBottle: (product, isCenter) => (
      <div className="relative flex flex-col items-center">
        {/* Matte Black Cylindrical Cap */}
        <div className="w-10 sm:w-11 h-9 sm:h-10 rounded-t-sm bg-gradient-to-r from-neutral-950 via-neutral-800 to-black border border-white/15 shadow-lg relative">
          <div className="absolute inset-y-0 left-[22%] w-[14%] bg-white/15" />
        </div>
        <div className="w-8 h-1.5 bg-gradient-to-r from-amber-700 via-amber-300 to-amber-800" />
        {/* Weighted Flask Whiskey-Amber to Espresso Flacon */}
        <div
          className="relative w-32 h-44 sm:w-36 sm:h-50 rounded-t-xl rounded-b-2xl overflow-hidden border border-orange-300/30 bg-gradient-to-b from-amber-600/80 via-orange-800/85 to-stone-950"
          style={{
            boxShadow: isCenter
              ? '0 22px 55px -10px rgba(234,88,12,0.5), inset 0 2px 3px rgba(255,255,255,0.35)'
              : 'inset 0 1px 1px rgba(255,255,255,0.2)'
          }}
        >
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/25 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/50 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-amber-500/20 to-transparent border-t border-white/15" />
          {/* Minimalist Black Band Label */}
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 py-3 px-2 bg-slate-950/90 border-y border-amber-400/50 text-center shadow-xl">
            <span className="text-[9px] sm:text-[10px] font-serif font-black tracking-[0.2em] text-white block">
              GENTLEMAN
            </span>
            <span className="text-[7px] tracking-[0.22em] text-amber-400 block mt-0.5">
              GIVENCHY
            </span>
            <span className="text-[8px] text-slate-300 block mt-1 truncate">
              {product.name}
            </span>
          </div>
          <div className="absolute -inset-full top-0 w-1/2 h-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent -rotate-20 translate-x-1/2 pointer-events-none" />
        </div>
      </div>
    )
  }
];

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
  const activeDesign = FRENCH_BOTTLE_DESIGNS[activeIndex % FRENCH_BOTTLE_DESIGNS.length];

  return (
    <section
      className="relative w-full min-h-[92dvh] flex flex-col justify-center pt-28 sm:pt-32 pb-14 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Colored Ambient Spotlight matching the active center French bottle */}
      <div className="absolute inset-0 pointer-events-none flex items-start justify-center overflow-hidden">
        <motion.div
          animate={{ backgroundColor: activeDesign.glow }}
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
              ? (activeHero.tagline_ar || 'رف العطور الفرنسية العالمية الفاخرة')
              : (activeHero.tagline_he || 'מדף הבשמים הצרפתיים היוקרתיים')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {language === 'ar'
            ? (activeHero.title_ar || 'أرقى دور العطور الفرنسية العالمية')
            : (activeHero.title_he || 'בתי הבישום הצרפתיים המובילים')}
        </h1>
      </div>

      {/* ========================================================================= */}
      {/* 3D PERFUME SHELF STAGE (رف العطور الفرنسية الثلاثي الأبعاد)             */}
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
                animate={{ backgroundColor: activeDesign.glow }}
                transition={{ duration: 0.6 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-52 sm:w-64 h-12 opacity-45 blur-2xl rounded-full pointer-events-none z-10"
              />

              {/* 3D Iconic French Perfume Bottles Row */}
              {products.map((product, idx) => {
                const diff = getOffset(idx);
                const absDiff = Math.abs(diff);
                const isCenter = diff === 0;
                const isVisible = absDiff <= 2;
                const design = FRENCH_BOTTLE_DESIGNS[idx % FRENCH_BOTTLE_DESIGNS.length];

                const scale = isCenter ? 1.25 : absDiff === 1 ? 0.8 : absDiff === 2 ? 0.6 : 0.4;
                const opacity = isCenter ? 1 : absDiff === 1 ? 0.78 : absDiff === 2 ? 0.42 : 0;
                const yOffset = isCenter ? -14 : absDiff === 1 ? 2 : 12;
                const rotateY = diff * -14;
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
                    title={isCenter ? `${design.brand} - ${design.model}` : product.name}
                  >
                    {/* Original French Brand 3D Bottle Silhouette */}
                    {design.renderBottle(product, isCenter)}

                    {/* Shelf Contact Shadow */}
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
              <span className="text-[11px] font-serif tracking-[0.25em] text-amber-400 uppercase block">
                {activeDesign.brand} — {activeDesign.model}
              </span>

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
