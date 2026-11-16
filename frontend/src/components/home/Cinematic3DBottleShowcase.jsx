import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Float,
  Sparkles,
  ContactShadows,
  RoundedBox,
  Cylinder
} from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Sparkles as SparklesIcon, Compass, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// 1. THREE.JS + REACT THREE FIBER + DREI 3D LUXURY PERFUME BOTTLE MESH
// ============================================================================
const LuxuryPerfumeFlacon3D = ({ scrollStateRef, isDark }) => {
  const bottleGroupRef = useRef();
  const liquidRef = useRef();
  const orbitRingRef = useRef();
  const cameraRef = useRef();

  const goldHex = isDark ? '#C5A36A' : '#A98750';
  const liquidHex = isDark ? '#D4A857' : '#B8893A';

  // Procedural Three.js golden aura particles orbiting the bottle
  const ringGeometry = useMemo(() => new THREE.TorusGeometry(1.75, 0.012, 16, 100), []);

  useFrame((state, delta) => {
    const progress = scrollStateRef.current.progress || 0;

    if (bottleGroupRef.current) {
      // Smoothly rotate bottle 360+ degrees & tilt based on GSAP ScrollTrigger progress
      const targetRotY = progress * Math.PI * 2.2 + state.clock.elapsedTime * 0.22;
      const targetRotX = Math.sin(progress * Math.PI * 2) * 0.16;
      const targetRotZ = Math.cos(progress * Math.PI) * 0.08;

      bottleGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        bottleGroupRef.current.rotation.y,
        targetRotY,
        delta * 5
      );
      bottleGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        bottleGroupRef.current.rotation.x,
        targetRotX,
        delta * 5
      );
      bottleGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        bottleGroupRef.current.rotation.z,
        targetRotZ,
        delta * 5
      );
    }

    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z = state.clock.elapsedTime * 0.35;
      orbitRingRef.current.rotation.x = Math.PI / 2.6 + Math.sin(progress * Math.PI) * 0.3;
    }

    // GSAP ScrollTrigger Camera Choreography (Zoom & vertical framing)
    if (cameraRef.current) {
      const targetCamZ = 5.4 - Math.sin(progress * Math.PI) * 0.85;
      const targetCamY = 0.25 + (progress - 0.5) * 0.9;
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetCamZ, delta * 4);
      cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetCamY, delta * 4);
      cameraRef.current.lookAt(0, 0.1, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0.25, 5.4]} fov={38} />

      {/* Studio Lighting Rig (Adapts to Dark Mode #111111 & Light Mode #F3EBDD) */}
      <ambientLight intensity={isDark ? 0.75 : 1.35} color={isDark ? '#F5F0E8' : '#FFFDF9'} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={isDark ? 2.8 : 2.2}
        color={goldHex}
      />
      <directionalLight
        position={[-4, 3, -3]}
        intensity={isDark ? 1.6 : 1.1}
        color={isDark ? '#E5CFA0' : '#FFFFFF'}
      />
      <spotLight
        position={[0, 6, 2]}
        angle={0.45}
        penumbra={0.8}
        intensity={isDark ? 3.2 : 2.0}
        color={goldHex}
      />
      <pointLight position={[0, -2, 2]} intensity={1.2} color={liquidHex} />

      {/* Drei Golden Atmospheric 3D Sparkles */}
      <Sparkles
        count={isDark ? 65 : 40}
        scale={[4.8, 4.8, 4.8]}
        size={isDark ? 2.4 : 1.8}
        speed={0.4}
        opacity={isDark ? 0.75 : 0.45}
        color={goldHex}
      />

      {/* Floating 3D Luxury Perfume Flacon */}
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.45}>
        <group ref={bottleGroupRef} position={[0, 0.05, 0]}>
          {/* 1. Outer Faceted Crystal Glass Body */}
          <RoundedBox args={[1.55, 2.05, 0.82]} radius={0.14} smoothness={6}>
            <meshPhysicalMaterial
              color={isDark ? '#FFFFFF' : '#FAF6F0'}
              transmission={0.88}
              opacity={1}
              transparent
              roughness={0.05}
              metalness={0.05}
              ior={1.52}
              thickness={1.5}
              clearcoat={1}
              clearcoatRoughness={0.04}
              reflectivity={0.95}
            />
          </RoundedBox>

          {/* 2. Inner Golden Perfume Elixir Core */}
          <RoundedBox ref={liquidRef} args={[1.32, 1.68, 0.62]} radius={0.09} smoothness={4} position={[0, -0.08, 0]}>
            <meshPhysicalMaterial
              color={liquidHex}
              emissive={liquidHex}
              emissiveIntensity={isDark ? 0.22 : 0.1}
              transmission={0.55}
              transparent
              opacity={0.92}
              roughness={0.08}
              metalness={0.15}
              ior={1.38}
              thickness={1.2}
            />
          </RoundedBox>

          {/* 3. Front Luxury Gold & Obsidian Plaque on the Flacon */}
          <RoundedBox args={[0.92, 0.96, 0.04]} radius={0.03} smoothness={2} position={[0, 0.02, 0.41]}>
            <meshStandardMaterial
              color={isDark ? '#141414' : '#29231D'}
              metalness={0.6}
              roughness={0.25}
            />
          </RoundedBox>

          {/* Gold Frame Border around Front Plaque */}
          <RoundedBox args={[0.98, 1.02, 0.02]} radius={0.04} smoothness={2} position={[0, 0.02, 0.40]}>
            <meshStandardMaterial
              color={goldHex}
              metalness={0.95}
              roughness={0.15}
            />
          </RoundedBox>

          {/* 4. Internal Dip Tube */}
          <Cylinder args={[0.018, 0.018, 1.75, 16]} position={[0, 0.05, 0]}>
            <meshPhysicalMaterial color="#FFFFFF" transmission={0.8} transparent opacity={0.55} roughness={0.1} />
          </Cylinder>

          {/* 5. Engraved Champagne Gold Neck Collar */}
          <Cylinder args={[0.28, 0.31, 0.34, 32]} position={[0, 1.18, 0]}>
            <meshStandardMaterial color={goldHex} metalness={0.96} roughness={0.14} />
          </Cylinder>
          <Cylinder args={[0.33, 0.33, 0.06, 32]} position={[0, 1.04, 0]}>
            <meshStandardMaterial color={goldHex} metalness={0.98} roughness={0.1} />
          </Cylinder>

          {/* 6. Sculpted Faceted Crystal & Gold Stopper Cap */}
          <RoundedBox args={[0.88, 0.48, 0.56]} radius={0.08} smoothness={4} position={[0, 1.56, 0]}>
            <meshPhysicalMaterial
              color={goldHex}
              metalness={0.88}
              roughness={0.14}
              clearcoat={1}
              clearcoatRoughness={0.08}
            />
          </RoundedBox>

          {/* 7. Orbital Golden Ring (Three.js Torus) */}
          <mesh ref={orbitRingRef} geometry={ringGeometry}>
            <meshStandardMaterial
              color={goldHex}
              emissive={goldHex}
              emissiveIntensity={0.35}
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>
        </group>
      </Float>

      {/* Drei Ground Contact Shadows */}
      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={isDark ? 0.65 : 0.28}
        scale={6.5}
        blur={2.2}
        far={3.5}
        color={isDark ? '#000000' : '#29231D'}
      />
    </>
  );
};

// ============================================================================
// 2. GSAP SCROLLTRIGGER + FRAMER MOTION STORYTELLING SHOWCASE
// ============================================================================
const Cinematic3DBottleShowcase = () => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const scrollStateRef = useRef({ progress: 0 });
  const [activeStep, setActiveStep] = useState(0);

  const chapters = useMemo(
    () =>
      language === 'ar'
        ? [
            {
              badge: 'المرحلة الأولى · القمة العطرية',
              title: 'إشراقة البرغموت والزعفران الملكي',
              desc: 'تبدأ الرحلة بنفحات مشرقة من البرغموت الإيطالي والزعفران الذهبي، مع انعكاسات كريستالية تتفاعل مع حركة التمرير في المشهد ثلاثي الأبعاد.',
              notes: ['برغموت كالابريا', 'زعفران ملكي', 'هيل أخضر']
            },
            {
              badge: 'المرحلة الثانية · قلب العطر',
              title: 'عمق الورد الدمشقي والعنبر الدافئ',
              desc: 'مع دوران الزجاجة بزاوية 360 درجة عبر GSAP ScrollTrigger، يتكشف قلب العطر الغني بالورد الدمشقي وزهر البرتقال واللبان العُماني.',
              notes: ['ورد دمشقي', 'عنبر كهرماني', 'لبان حوجري']
            },
            {
              badge: 'المرحلة الثالثة · القاعدة المعتّقة',
              title: 'ثبات العود الفاخر والفانيليا المدغشقرية',
              desc: 'تستقر التوليفة على قاعدة مخملية من دهن العود المعتّق وخشب الصندل والمسك الأبيض بتركيز Extrait de Parfum يدوم لأيام.',
              notes: ['عود ملكي معتّق', 'فانيليا مدغشقر', 'مسك أبيض صافي']
            }
          ]
        : [
            {
              badge: 'שלב ראשון · תווי ראש',
              title: 'זוהר ברגמוט וזעפרן מלכותי',
              desc: 'המסע נפתח בניחוח מואר של ברגמוט איטלקי וזעפרן זהוב, עם השתקפויות קריסטליות המגיבות לגלילה בזמן אמת.',
              notes: ['ברגמוט איטלקי', 'זעפרן מלכותי', 'הל ירוק']
            },
            {
              badge: 'שלב שני · לב הבושם',
              title: 'עומק ורד דמשקאי וענבר חם',
              desc: 'עם סיבוב הבקבוק ב-360 מעלות באמצעות GSAP ScrollTrigger, נחשף לב הבושם העשיר בוורד דמשקאי ולבונה יוקרתית.',
              notes: ['ורד דמשקאי', 'ענבר זהוב', 'לבונה מלכותית']
            },
            {
              badge: 'שלב שלישי · תווי בסיס',
              title: 'עמידות עוד מיושן ווניל ממדגסקר',
              desc: 'הקומפוזיציה מתייצבת על בסיס קטיפתי של עוד מלכותי, עץ אלמוג ומושק לבן בריכוז Extrait de Parfum שנשאר לימים.',
              notes: ['עוד מלכותי', 'וניל ממדגסקר', 'מושק לבן טהור']
            }
          ],
    [language]
  );

  // GSAP ScrollTrigger linking scroll progress to 3D Camera & Bottle Rotation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      end: 'bottom 25%',
      scrub: 0.6,
      onUpdate: (self) => {
        scrollStateRef.current.progress = self.progress;
        const stepIdx = Math.min(2, Math.floor(self.progress * 3));
        setActiveStep(stepIdx);
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cinematic-3d-bottle-section"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55 }}
        className="text-center max-w-3xl mx-auto mb-10 space-y-3"
      >
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
            isDark
              ? 'bg-[#1D1D1D] border-[#C5A36A]/35 text-[#C5A36A]'
              : 'bg-[#E9DECC] border-[#A98750]/40 text-[#A98750]'
          }`}
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>
            {language === 'ar'
              ? 'تجربة ثلاثية الأبعاد تفاعلية · 3D Olfactory Experience'
              : 'חוויה תלת-ממדית אינטראקטיבית · 3D Olfactory Experience'}
          </span>
        </div>

        <h2
          className={`text-2xl sm:text-4xl font-black tracking-tight ${
            isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'
          }`}
        >
          {language === 'ar'
            ? 'تشريح الزجاجة الملكية والهرم العطري'
            : 'אנטומיית הבקבוק המלכותי ופירמידת הניחוח'}
        </h2>

        <p
          className={`text-xs sm:text-sm leading-relaxed ${
            isDark ? 'text-[#F5F0E8]/75' : 'text-[#29231D]/75'
          }`}
        >
          {language === 'ar'
            ? 'مرّر الصفحة لمشاهدة دوران زجاجة KAWN PERFUME ثلاثية الأبعاد وتغير زاوية الكاميرا والإضاءة مع مراحل تطور العطر.'
            : 'גלול כדי לצפות בסיבוב בקבוק KAWN PERFUME בתלת-ממד ובתנועת המצלמה לאורך שלבי הניחוח.'}
        </p>
      </motion.div>

      {/* Main 3D Canvas + Scroll-Triggered Chapters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left/Start: Interactive React Three Fiber + Drei + Three.js 3D Stage */}
        <div
          className={`lg:col-span-6 relative h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border transition-colors duration-500 ${
            isDark
              ? 'bg-gradient-to-b from-[#1D1D1D] via-[#141414] to-[#111111] border-[#C5A36A]/30 shadow-[0_24px_60px_rgba(0,0,0,0.8)]'
              : 'bg-gradient-to-b from-[#FFFFFF] via-[#F3EBDD] to-[#E9DECC] border-[#A98750]/35 shadow-[0_20px_50px_rgba(41,35,29,0.12)]'
          }`}
        >
          {/* Ambient radial glow inside 3D stage */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? 'radial-gradient(circle at 50% 45%, rgba(197,163,106,0.22) 0%, transparent 68%)'
                : 'radial-gradient(circle at 50% 45%, rgba(169,135,80,0.18) 0%, transparent 68%)'
            }}
          />

          {/* Top-Start Brand Watermark */}
          <div className="absolute top-4 start-5 z-10 pointer-events-none">
            <span
              className={`text-[10px] font-serif uppercase tracking-[0.28em] font-bold block ${
                isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'
              }`}
            >
              KAWN PERFUME · 3D ATELIER
            </span>
          </div>

          {/* React Three Fiber WebGL Canvas */}
          <Suspense fallback={null}>
            <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
              <LuxuryPerfumeFlacon3D scrollStateRef={scrollStateRef} isDark={isDark} />
            </Canvas>
          </Suspense>

          {/* Bottom Step Indicator Pill */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center z-10 pointer-events-none">
            <div
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-md flex items-center gap-2 ${
                isDark
                  ? 'bg-[#111111]/80 border-[#C5A36A]/35 text-[#F5F0E8]'
                  : 'bg-[#FFFFFF]/85 border-[#A98750]/35 text-[#29231D]'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}`} />
              <span>{chapters[activeStep]?.badge}</span>
            </div>
          </div>
        </div>

        {/* Right/End: Framer Motion Olfactory Chapters */}
        <div className="lg:col-span-6 space-y-4">
          {chapters.map((ch, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => {
                  scrollStateRef.current.progress = idx * 0.45;
                  setActiveStep(idx);
                }}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? isDark
                      ? 'bg-[#222222] border-[#C5A36A] shadow-xl'
                      : 'bg-[#FFFFFF] border-[#A98750] shadow-lg'
                    : isDark
                    ? 'bg-[#1D1D1D]/70 border-[#C5A36A]/15 opacity-75 hover:opacity-100'
                    : 'bg-[#FFFFFF]/65 border-[#A98750]/20 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{ch.badge}</span>
                  </span>
                  <span className="text-xs font-mono opacity-50">0{idx + 1} / 03</span>
                </div>

                <h3
                  className={`text-lg sm:text-xl font-black mb-2 ${
                    isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'
                  }`}
                >
                  {ch.title}
                </h3>

                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                    isDark ? 'text-[#F5F0E8]/75' : 'text-[#29231D]/75'
                  }`}
                >
                  {ch.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {ch.notes.map((note, nIdx) => (
                    <span
                      key={nIdx}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                        isDark
                          ? 'bg-[#111111] border-[#C5A36A]/30 text-[#C5A36A]'
                          : 'bg-[#F3EBDD] border-[#A98750]/35 text-[#29231D]'
                      }`}
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Cinematic3DBottleShowcase;
