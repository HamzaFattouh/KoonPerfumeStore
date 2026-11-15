import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ChevronDown, 
  ArrowLeft, 
  Compass, 
  Sparkles, 
  FastForward,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const CosmicLogoHero = () => {
  const { t, language } = useLanguage();
  
  // Animation state: 'drawing' | 'revealed'
  const [animStage, setAnimStage] = useState('drawing');
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);
  const containerRef = useRef(null);

  // 3D Mouse Parallax Tilt using Framer Motion springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], ['0%', '100%']);

  // Handle Mouse movement for 3D tilt
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Timer for drawing completion -> revealed stage
  useEffect(() => {
    if (animStage === 'drawing') {
      const timer = setTimeout(() => {
        setAnimStage('revealed');
      }, 3400); // 3.4s drawing sequence then full emblem
      return () => clearTimeout(timer);
    }
  }, [animStage]);

  // Audio Playback
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  const handleReplay = () => {
    setAnimStage('drawing');
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleSkip = () => {
    setAnimStage('revealed');
  };

  const scrollToContent = () => {
    const target = document.getElementById('brand-pillars');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight - 60, behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[92dvh] lg:min-h-[96dvh] flex flex-col items-center justify-between overflow-hidden bg-transparent select-none pt-24 pb-8"
      style={{ perspective: 1200 }}
    >
      {/* Hidden Audio Player for Cosmic Ambience */}
      <audio ref={audioRef} src="/cosmic_sound.mp3" loop preload="auto" />

      {/* 1. Deep Cosmic Nebula Background Glow (GPU-composited CSS) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-indigo-600/20 blur-[130px] animate-pulse-slow will-change-transform" />
        <div className="w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] rounded-full bg-indigo-500/15 blur-[100px] animate-pulse will-change-transform" />
      </div>

      {/* 2. Top Luxury Controls Floating Bar (صوت / إعادة رسم / تخطي) */}
      <div className="absolute top-6 left-6 z-30 flex items-center gap-2">
        {/* Sound Toggle Button */}
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 backdrop-blur-md transition shadow-lg cursor-pointer flex items-center gap-1.5"
          title={isMuted ? (language === 'ar' ? 'تشغيل الصوت الكوني' : 'הפעל צליל') : (language === 'ar' ? 'كتم الصوت' : 'השתק')}
          aria-label="Sound Toggle"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-[10px] text-amber-400 font-mono hidden sm:inline">LIVE</span>
            </>
          )}
        </button>

        {/* Replay Drawing Sequence Button */}
        <button
          onClick={handleReplay}
          className="p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 backdrop-blur-md transition shadow-lg cursor-pointer"
          title={language === 'ar' ? 'إعادة رسم الشعار الكوني' : 'הפעל מחדש אנימציית ציור'}
          aria-label="Replay Logo Drawing Animation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Skip Button during active drawing */}
        {animStage === 'drawing' && (
          <button
            onClick={handleSkip}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-medium backdrop-blur-md transition shadow-lg cursor-pointer"
            title={language === 'ar' ? 'تخطي للوغو المكتمل' : 'דלג לסמל מלא'}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تخطي' : 'דלג'}</span>
          </button>
        )}
      </div>

      {/* 3. Centerpiece: The Cosmic Logo Canvas with 3D Parallax Tilt */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center px-4 my-auto">
        <motion.div
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: 'preserve-3d'
          }}
          className="relative flex items-center justify-center w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] cursor-pointer group"
          onClick={handleReplay}
          title={language === 'ar' ? 'اضغط لإعادة رسم الشعار' : 'לחץ להפעלת אנימציה מחדש'}
        >
          {/* Ambient Outer Halo Ring */}
          <div className="absolute inset-0 rounded-full border border-amber-500/10 pointer-events-none scale-110 animate-pulse-slow" />
          
          {/* Constant 3D Revolving Planetary Orbit Ring (Always active for cosmic luxury feel) */}
          <div 
            className="absolute inset-[-15%] pointer-events-none rounded-full border border-amber-400/20 shadow-[0_0_20px_rgba(245,158,11,0.15)] opacity-60"
            style={{
              transform: 'rotateX(72deg) rotateY(15deg) rotateZ(0deg)',
              animation: 'spin 22s linear infinite'
            }}
          />
          <div 
            className="absolute inset-[-8%] pointer-events-none rounded-full border border-cyan-400/15 shadow-[0_0_15px_rgba(56,189,248,0.12)] opacity-50"
            style={{
              transform: 'rotateX(68deg) rotateY(-18deg) rotateZ(180deg)',
              animation: 'spin 18s linear infinite reverse'
            }}
          />

          {/* SVG Creation / Drawing Canvas */}
          <div 
            className={`absolute inset-0 transition-opacity duration-1000 ${
              animStage === 'drawing' ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <svg
              viewBox="0 0 1000 1000"
              className="w-full h-full drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            >
              <defs>
                {/* Golden Gradient */}
                <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="35%" stopColor="#F59E0B" />
                  <stop offset="70%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#FCD34D" />
                </linearGradient>

                {/* Platinum / Starlight Gradient */}
                <linearGradient id="starlightStroke" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#FCD34D" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>

                {/* Glowing Filter */}
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. Outer Celestial Circle Drawing (مسار الدائرة الفلكية) */}
              <motion.circle
                cx="500"
                cy="500"
                r="410"
                fill="none"
                stroke="url(#goldStroke)"
                strokeWidth="7"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: animStage === 'drawing' ? [0, 1] : 1,
                  opacity: 1
                }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />

              {/* Decorative Concentric Thin Circle */}
              <motion.circle
                cx="500"
                cy="500"
                r="426"
                fill="none"
                stroke="rgba(245, 158, 11, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="8 12"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 0.8, rotate: 360 }}
                transition={{ opacity: { duration: 1 }, rotate: { duration: 30, repeat: Infinity, ease: "linear" } }}
              />

              {/* 2. Saturn Planetary Ellipse Orbit Drawing (حلقات الكوكب الفلكية) */}
              <motion.ellipse
                cx="500"
                cy="500"
                rx="355"
                ry="110"
                transform="rotate(-23 500 500)"
                fill="none"
                stroke="url(#starlightStroke)"
                strokeWidth="5"
                filter="url(#neonGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: animStage === 'drawing' ? [0, 1] : 1,
                  opacity: 1 
                }}
                transition={{ duration: 1.8, delay: 0.5, ease: "easeInOut" }}
              />

              {/* Secondary delicate inner ring orbit */}
              <motion.ellipse
                cx="500"
                cy="500"
                rx="315"
                ry="95"
                transform="rotate(-23 500 500)"
                fill="none"
                stroke="rgba(253, 230, 138, 0.6)"
                strokeWidth="2.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: animStage === 'drawing' ? [0, 1] : 1,
                  opacity: 0.9 
                }}
                transition={{ duration: 1.6, delay: 0.8, ease: "easeInOut" }}
              />

              {/* 3. Center Planet Sphere / "و" body (جرم الكوكب المركزي) */}
              <motion.circle
                cx="500"
                cy="500"
                r="90"
                fill="rgba(15, 23, 42, 0.35)"
                stroke="url(#goldStroke)"
                strokeWidth="8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.7, ease: "backOut" }}
              />

              {/* 4. Arabic Calligraphy Letter "كـ" (الكاف المنسابة) */}
              <motion.path
                d="M 680, 330 C 675, 410 635, 530 555, 535 L 505, 535"
                fill="none"
                stroke="url(#goldStroke)"
                strokeWidth="14"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animStage === 'drawing' ? [0, 1] : 1 }}
                transition={{ duration: 1.2, delay: 1.1, ease: "easeInOut" }}
              />
              <motion.path
                d="M 640, 360 C 670, 345 710, 335 735, 340"
                fill="none"
                stroke="url(#starlightStroke)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animStage === 'drawing' ? [0, 1] : 1 }}
                transition={{ duration: 0.8, delay: 1.4, ease: "easeInOut" }}
              />

              {/* 5. Arabic Calligraphy Letter "و" (الواو الكوكبية) */}
              <motion.path
                d="M 500, 420 C 545, 420 575, 455 575, 495 C 575, 545 535, 580 490, 580 C 455, 580 440, 555 440, 530 C 440, 495 470, 460 520, 425"
                fill="none"
                stroke="url(#goldStroke)"
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animStage === 'drawing' ? [0, 1] : 1 }}
                transition={{ duration: 1.3, delay: 1.2, ease: "easeInOut" }}
              />

              {/* 6. Arabic Calligraphy Letter "ن" (النون الهلالية) */}
              <motion.path
                d="M 430, 495 C 425, 565 375, 615 315, 615 C 250, 615 205, 565 215, 495"
                fill="none"
                stroke="url(#goldStroke)"
                strokeWidth="14"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animStage === 'drawing' ? [0, 1] : 1 }}
                transition={{ duration: 1.2, delay: 1.5, ease: "easeInOut" }}
              />

              {/* Nuqta (Diamond Dot of Noon) with Starburst */}
              <motion.polygon
                points="275,395 292,412 275,429 258,412"
                fill="url(#starlightStroke)"
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ scale: [0, 1.3, 1], opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 2.2, ease: "backOut" }}
              />

              {/* 7. "PERFUME" Luxury Typography */}
              <motion.text
                x="500"
                y="705"
                textAnchor="middle"
                fill="url(#starlightStroke)"
                fontSize="40"
                fontWeight="700"
                letterSpacing="0.45em"
                fontFamily="'Montserrat', 'Cormorant Garamond', sans-serif"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 2.3 }}
              >
                PERFUME
              </motion.text>
            </svg>
          </div>

          {/* Fully Revealed Crystal Emblem Image (Appears only after calligraphy finishes) */}
          <div 
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
              animStage === 'revealed' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
            }`}
          >
            {/* The Pristine 1024x1024 Transparent RGBA Emblem (WebP prioritized with PNG fallback) */}
            <picture className="w-full h-full flex items-center justify-center">
              <source srcSet="/koon_emblem_hq.webp" type="image/webp" />
              <img
                src="/koon_emblem_hq.webp"
                alt="Koon Perfume Astronomical Emblem"
                width="1024"
                height="1024"
                loading="eager"
                fetchpriority="high"
                className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(245,158,11,0.25)] select-none pointer-events-none"
              />
            </picture>

            {/* Specular Liquid Light Shimmer Sweep across the emblem */}
            <div 
              className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-40 mix-blend-overlay"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)',
                backgroundSize: '250% 100%',
                animation: 'shimmerSweep 6s infinite ease-in-out'
              }}
            />
          </div>

          {/* Mouse Tilt Specular Glare (Glassmorphic Sheen) */}
          <motion.div
            style={{
              x: glareX,
              y: glareY,
              opacity: animStage === 'revealed' ? 0.2 : 0
            }}
            className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-radial-gradient from-white/40 to-transparent pointer-events-none blur-xl transition-opacity duration-500"
          />
        </motion.div>

        {/* Brand Title and Slogan below emblem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mt-6 space-y-2 max-w-xl px-4 z-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'he' 
                ? 'בית הבישום הקוסמי הראשון • תמציות נישה בריכוז עילאי' 
                : 'دار العطور الفلكية الأولى • توليفات نيش فائقة التركيز'}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {language === 'he' ? (
              <>בשמים שנארגו מ<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">ערפיליות היקום</span></>
            ) : (
              <>عطورٌ نُسجت من <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">سديم الكون</span></>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-lg mx-auto">
            {language === 'he'
              ? 'יוקרה בממדים קוסמיים. שמנים נדירים שנרקחו להעניק נוכחות בלתי נשכחת הנשארת לאורך ימים.'
              : 'نجمع بين نفائس الزيوت المعتقة في غراس الفرنسية وسحر الأجرام السماوية لنصنع بصمة عطرية لا تُمحى تدوم لأيام.'}
          </p>
        </motion.div>
      </div>

      {/* 4. Luxury Action CTAs & Floating Metrics */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center gap-4 px-4 pt-4">
        {/* Call-to-Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer border border-amber-400/40"
          >
            <span>{t.actions.exploreBtn}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <Link
            to="/quiz"
            className="px-6 py-3.5 bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-amber-300 border border-slate-700/80 hover:border-amber-400/50 font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 flex items-center gap-2 backdrop-blur-md cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{t.actions.quizBtn}</span>
          </Link>
        </div>

        {/* Luxury Micro-Pillars Ticker */}
        <div className="hidden md:flex items-center gap-6 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 max-w-3xl">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Extrait de Parfum (تركيز 35%)</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>تعتيق براميل 90 يوماً</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>عينة مجانية للتجربة قبل فتح الزجاجة</span>
          </div>
        </div>

        {/* Smooth Scroll Cue */}
        <button
          onClick={scrollToContent}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition pt-1 animate-bounce cursor-pointer group"
          aria-label="Scroll to content"
        >
          <span>{t.actions.scrollDown}</span>
          <ChevronDown className="w-4 h-4 text-amber-400 group-hover:translate-y-0.5 transition" />
        </button>
      </div>

      {/* Embedded Keyframes for Shimmer & Spin */}
      <style>{`
        @keyframes shimmerSweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
};

export default CosmicLogoHero;

