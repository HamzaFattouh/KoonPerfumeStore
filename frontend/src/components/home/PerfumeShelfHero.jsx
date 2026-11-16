import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// 7 Exact-Cropped 8K Glossy Transparent Perfume Bottles (No Background)
const LUXURY_3D_PERFUMES = [
  {
    id: 'naxos',
    brand: 'XERJOFF',
    monogram: 'XJ',
    model: 'NAXOS',
    fullModel: 'XJ 1861 Naxos',
    image: '/perfumes/naxos.png',
    glow: 'rgba(217, 155, 38, 0.45)',
    secondaryGlow: 'rgba(180, 110, 20, 0.28)',
    smokeRgb: [234, 179, 8],
    accentHex: '#D8BD83',
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
    glow: 'rgba(168, 85, 247, 0.45)',
    secondaryGlow: 'rgba(192, 132, 252, 0.26)',
    smokeRgb: [192, 132, 252],
    accentHex: '#D8B4FE',
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
    glow: 'rgba(216, 189, 131, 0.44)',
    secondaryGlow: 'rgba(198, 161, 91, 0.26)',
    smokeRgb: [229, 201, 140],
    accentHex: '#E5CFA0',
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
    glow: 'rgba(225, 29, 72, 0.45)',
    secondaryGlow: 'rgba(251, 113, 133, 0.28)',
    smokeRgb: [244, 63, 94],
    accentHex: '#FDA4AF',
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
    glow: 'rgba(14, 165, 233, 0.45)',
    secondaryGlow: 'rgba(37, 99, 235, 0.28)',
    smokeRgb: [56, 189, 248],
    accentHex: '#7DD3FC',
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
    glow: 'rgba(198, 161, 91, 0.42)',
    secondaryGlow: 'rgba(120, 113, 108, 0.28)',
    smokeRgb: [198, 161, 91],
    accentHex: '#D8BD83',
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
    glow: 'rgba(203, 213, 225, 0.38)',
    secondaryGlow: 'rgba(148, 163, 184, 0.24)',
    smokeRgb: [203, 213, 225],
    accentHex: '#E2E8F0',
    descriptionAr: 'عبير نقي وأثيري من الخوخ الأبيض وزهر البرتقال والمسك الحريري، في زجاجة عاجية منحوتة مستوحاة من القصور الفرنسية.',
    descriptionHe: 'ניחוח טהור ואוורירי של אפרסק לבן, פריחת תפוז ומושק משיי בבקבוק שנהב מפוסל.'
  }
];

// ============================================================================
// SUBTLE VOLUMETRIC PERFUME SMOKE CANVAS (تأثير دخان خفيف متأثر بلون العطر ومتداخل مع برج إيفل والعطور)
// ============================================================================
const PerfumeSmokeCanvas = ({ targetRgb, className = '' }) => {
  const canvasRef = useRef(null);
  const currentRgbRef = useRef([...targetRgb]);
  const targetRgbRef = useRef([...targetRgb]);

  useEffect(() => {
    targetRgbRef.current = [...targetRgb];
  }, [targetRgb]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const width = (canvas.width = 720);
    const height = (canvas.height = 380);

    // 20 delicate rising & drifting smoke wisps bridging the Eiffel Tower on the left and the perfumes
    const wisps = Array.from({ length: 20 }, (_, i) => ({
      x: width * 0.15 + (i / 20) * (width * 0.72),
      y: height * 0.88 - ((i * 37) % 100) * 0.01 * height * 0.75,
      baseX: width * 0.14 + (i / 20) * (width * 0.72),
      radius: 48 + (i % 5) * 20,
      vy: 0.24 + (i % 5) * 0.07,
      vx: 0.12 + (i % 3) * 0.05,
      swayAmp: 22 + (i % 4) * 10,
      swayFreq: 0.007 + (i % 3) * 0.003,
      phase: i * 1.15,
      maxAlpha: 0.08 + (i % 3) * 0.025
    }));

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate smoke RGB toward active perfume color
      const cur = currentRgbRef.current;
      const tgt = targetRgbRef.current;
      cur[0] += (tgt[0] - cur[0]) * 0.05;
      cur[1] += (tgt[1] - cur[1]) * 0.05;
      cur[2] += (tgt[2] - cur[2]) * 0.05;

      const r = Math.round(cur[0]);
      const g = Math.round(cur[1]);
      const b = Math.round(cur[2]);

      for (let i = 0; i < wisps.length; i++) {
        const w = wisps[i];
        w.y -= w.vy;
        w.baseX += w.vx * 0.35;
        if (w.baseX > width * 0.86) w.baseX = width * 0.12;
        if (w.y < 25) {
          w.y = height * 0.9;
        }

        // Normalized vertical life (0 at bottom -> 1 at top)
        const life = 1 - (w.y - 25) / (height * 0.9 - 25);
        const fade = life < 0.25 ? life / 0.25 : Math.max(0, 1 - (life - 0.25) / 0.75);
        const alpha = w.maxAlpha * fade;

        const curX = w.baseX + Math.sin(tick * w.swayFreq + w.phase) * w.swayAmp;
        const curRadius = w.radius * (0.85 + life * 0.6);

        const grad = ctx.createRadialGradient(curX, w.y, 2, curX, w.y, curRadius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha * 0.48})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(curX, w.y, curRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!document.hidden) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-[480px] sm:w-[720px] h-[280px] sm:h-[380px] pointer-events-none select-none ${className}`}
    />
  );
};

const PerfumeShelfHero = ({ products = [] }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [activeIndex, setActiveIndex] = useState(0);
  const [slotSpacing, setSlotSpacing] = useState(285);

  // Responsive horizontal spacing for standalone 3D bottles
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

  // Always-active continuous automatic rotation
  useEffect(() => {
    const timer = setInterval(() => {
      nextPerfume();
    }, 4500);
    return () => clearInterval(timer);
  }, [nextPerfume]);

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
      className="relative w-full min-h-[88dvh] bg-[#0B0A09] text-[#F5F0E8] flex flex-col justify-center pt-28 sm:pt-32 pb-12 overflow-hidden select-none"
    >
      {/* Cinematic Nighttime Paris Background with Eiffel Tower on Left & Atmospheric Perfume Backdrop */}
      <div
        dir="ltr"
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 96% 90% at 36% 50%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(ellipse 96% 90% at 36% 50%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0) 100%)'
        }}
      >
        <img
          src="/editorial/eiffel-paris-flipped.jpg"
          alt="Paris Eiffel Tower Night Atmosphere"
          draggable={false}
          className="w-full h-full object-cover object-[15%_center] sm:object-[18%_center] opacity-80 mix-blend-screen scale-100 select-none"
        />
        {/* Soft Perfume-Colored Atmospheric Mist Bridging Eiffel Tower & Bottles */}
        <motion.div
          animate={{ backgroundColor: activePerfume.glow }}
          transition={{ duration: 0.9 }}
          className="absolute inset-y-1/4 left-1/4 w-1/2 opacity-25 blur-[90px] rounded-full mix-blend-screen"
        />
      </div>

      {/* Dynamic Dual-Tone Ambient Studio Lighting matching active bottle (Not Overexposed) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ backgroundColor: activePerfume.glow }}
          transition={{ duration: 0.9 }}
          className="w-[380px] sm:w-[680px] h-[440px] opacity-22 blur-[140px] rounded-full -mt-12"
        />
        <motion.div
          animate={{ backgroundColor: activePerfume.secondaryGlow }}
          transition={{ duration: 0.9 }}
          className="absolute w-[280px] sm:w-[480px] h-[300px] opacity-18 blur-[110px] rounded-full mt-20"
        />
      </div>

      {/* ========================================================================= */}
      {/* 3D LUXURY PERFUME SHOWCASE STAGE (بدون رف سفلي + دخان متأثر بلون العطر)    */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-2 sm:px-6 my-2">
        <div className="relative">
          {/* Left / Right Navigation Arrows */}
          <button
            type="button"
            onClick={language === 'ar' ? nextPerfume : prevPerfume}
            aria-label="العطر السابق"
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#151310]/90 hover:bg-[#C5A36A] text-[#F5F0E8] hover:text-[#0B0A09] border border-[#C5A36A]/35 flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={language === 'ar' ? prevPerfume : nextPerfume}
            aria-label="العطر التالي"
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#151310]/90 hover:bg-[#C5A36A] text-[#F5F0E8] hover:text-[#0B0A09] border border-[#C5A36A]/35 flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* 3D Perspective Coordinate Stage */}
          <motion.div
            dir="ltr"
            className="relative h-[240px] sm:h-[290px] lg:h-[320px] w-full flex items-end justify-center overflow-visible"
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
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden pb-6 -translate-x-10 sm:-translate-x-16">
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
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 mb-2.5 backdrop-blur-sm"
                    style={{
                      borderColor: activePerfume.accentHex,
                      color: activePerfume.accentHex,
                      opacity: 0.55,
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
                    style={{ color: activePerfume.accentHex, opacity: 0.7 }}
                  >
                    {activePerfume.brand}
                  </span>

                  {/* Giant Background Perfume Name */}
                  <span
                    className="font-serif font-black uppercase tracking-[0.14em] text-4xl sm:text-6xl lg:text-7xl leading-none whitespace-nowrap"
                    style={{
                      color: activePerfume.accentHex,
                      opacity: 0.25,
                      textShadow: `0 0 50px ${activePerfume.glow}`
                    }}
                  >
                    {activePerfume.model}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subtle Volumetric Perfume-Colored Smoke Effect Intertwined with Eiffel Tower & Bottles */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-[58%] pointer-events-none z-15 flex items-center justify-center">
              <PerfumeSmokeCanvas targetRgb={activePerfume.smokeRgb} />
            </div>

            {/* Secondary Delicate Foreground Smoke Veil Bridging Left Eiffel Tower & Perfumes */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-[65%] pointer-events-none z-35 flex items-center justify-center opacity-45 mix-blend-screen">
              <PerfumeSmokeCanvas targetRgb={activePerfume.smokeRgb} />
            </div>

            {/* Soft Studio Spotlight (Low-glare, non-overexposed) */}
            <motion.div
              animate={{
                background: `radial-gradient(closest-side, ${activePerfume.glow} 0%, transparent 100%)`
              }}
              transition={{ duration: 0.7 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] sm:w-[700px] h-full opacity-30 pointer-events-none z-10"
            />

            {/* 7 Exact-Cropped 8K Glossy Perfumes Shifting Smoothly */}
            {LUXURY_3D_PERFUMES.map((item, idx) => {
              const diff = getOffset(idx);
              const absDiff = Math.abs(diff);
              const isCenter = diff === 0;
              const isVisible = absDiff <= 2;

              const scale = isCenter ? 1.08 : absDiff === 1 ? 0.72 : absDiff === 2 ? 0.5 : 0.35;
              const opacity = isCenter ? 1 : absDiff === 1 ? 0.68 : absDiff === 2 ? 0.32 : 0;
              const yOffset = isCenter ? -6 : absDiff === 1 ? 2 : 10;
              const rotateY = diff * -16;
              const zIndex = isCenter ? 30 : absDiff === 1 ? 20 : absDiff === 2 ? 10 : 0;

              // Glossy, rich, NON-overexposed filter (بالوان لامعة و غير ساطعة)
              const filterStyle = isCenter
                ? 'brightness(0.95) saturate(1.14) contrast(1.08)'
                : absDiff === 1
                ? 'brightness(0.40) saturate(0.45) contrast(1.04)'
                : 'brightness(0.22) saturate(0.28)';

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
                    x: diff * slotSpacing + (isCenter ? 38 : diff > 0 ? 18 : 0),
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
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group origin-bottom"
                  title={`${item.brand} — ${item.fullModel}`}
                >
                  {/* Standalone Exact-Cropped 8K Perfume Bottle */}
                  <motion.div
                    whileHover={isCenter ? { rotateY: 8, rotateX: -4, y: -6, scale: 1.04 } : { y: -4 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="relative flex items-end justify-center"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <img
                      src={item.image}
                      alt={`${item.brand} ${item.fullModel}`}
                      draggable={false}
                      className="relative z-10 h-[155px] sm:h-[195px] lg:h-[220px] w-auto object-contain select-none transition-all duration-500"
                      style={{
                        filter: isCenter
                          ? 'drop-shadow(0 18px 24px rgba(0,0,0,0.92))'
                          : 'drop-shadow(0 12px 16px rgba(0,0,0,0.85))'
                      }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
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
            className="text-center space-y-2.5 px-6 py-5 rounded-3xl bg-[#1A1714]/90 border border-[#C5A36A]/25 text-[#F5F0E8] backdrop-blur-md shadow-xl"
          >
            <span
              className="text-[11px] font-serif tracking-[0.25em] uppercase block font-bold transition-colors duration-500"
              style={{ color: activePerfume.accentHex }}
            >
              {activePerfume.brand}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-[#F5F0E8]">
              {activePerfume.fullModel}
            </h2>

            <p className="text-sm sm:text-base text-[#F5F0E8]/80 leading-relaxed max-w-xl mx-auto">
              {language === 'ar' ? activePerfume.descriptionAr : activePerfume.descriptionHe}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PerfumeShelfHero;
