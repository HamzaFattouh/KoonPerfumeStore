import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Float,
  Sparkles,
  ContactShadows,
  useGLTF
} from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles as SparklesIcon,
  Play,
  Pause,
  ShoppingBag
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

// Preload both real GLB 3D models for instant rendering
useGLTF.preload('/models/koon-perfume-bottle.glb');
useGLTF.preload('/models/eiffel-tower.glb');

// ============================================================================
// KOON LUXURY SIGNATURE FRAGRANCES (Dark Mode Identity: #0B0A09, #C6A15B, #D8BD83)
// ============================================================================
const KOON_LUXURY_FRAGRANCES = [
  {
    id: 'koon-royal-oud',
    brand: 'KOON',
    nameEn: 'ROYAL OUD ÉLIXIR',
    nameAr: 'كون رويال عود إكسير',
    nameHe: 'קון רויאל עוד אליקסיר',
    liquidHex: '#C6A15B',
    smokeHex: '#D8BD83',
    capHex: '#D8BD83',
    notesAr: ['دهن عود ملكي', 'زعفران ذهبي', 'عنبر دافئ'],
    notesHe: ['עוד מלכותי', 'זעפרן זהוב', 'ענבר חם'],
    descriptionAr:
      'تحفة عطرية ملكية من دار KOON تجمع بين فخامة العود المعتّق والزعفران الذهبي ونفحات العنبر الباريسي الدافئ في زجاجة كريستالية فاخرة.',
    descriptionHe:
      'יצירת מופת מלכותית מבית KOON המשלבת עוד מיושן, זעפרן זהוב וענבר פריזאי חם בבקבוק קריסטל יוקרתי.'
  },
  {
    id: 'koon-amber-nuit',
    brand: 'KOON',
    nameEn: 'AMBER NUIT DE PARIS',
    nameAr: 'كون عنبر نوي دي باريس',
    nameHe: 'קון ענבר ליל פריז',
    liquidHex: '#D97706',
    smokeHex: '#F59E0B',
    capHex: '#C6A15B',
    notesAr: ['عنبر كهرماني', 'فانيليا مدغشقر', 'برغموت ليلي'],
    notesHe: ['ענברB זהוב', 'וניל ממדגסקר', 'ברגמוט לילי'],
    descriptionAr:
      'إشراقة ليلية مستوحاة من أضواء باريس الذهبية، تمتزج فيها الفانيليا المدغشقرية مع العنبر الكهرماني والبرغموت المعتّق.',
    descriptionHe:
      'זוהר לילי בהשראת אורות פריז הזהובים, המשלב וניל ממדגסקר עם ענבר חם וברגמוט מיושן.'
  },
  {
    id: 'koon-velvet-rose',
    brand: 'KOON',
    nameEn: 'VELVET ROSE ABSOLU',
    nameAr: 'كون فيلفيت روز أبسولو',
    nameHe: 'קון ולווט רוז אבסולו',
    liquidHex: '#BE123C',
    smokeHex: '#F43F5E',
    capHex: '#D8BD83',
    notesAr: ['ورد دمشقي', 'توت بري داكن', 'مسك مخملي'],
    notesHe: ['ורד דמשקאי', 'פירות יער כהים', 'מושק קטיפתי'],
    descriptionAr:
      'سيمفونية مخملية آسرة من الورد الدمشقي النادر واللبان العُماني والمسك الحريري، تمنحك هالة ساحرة في أمسيات باريس.',
    descriptionHe:
      'סימפוניה קטיפתית מהפנטת של ורד דמשקאי נדיר, לבונה ומושק משיי המעניקים הילה יוקרתית.'
  },
  {
    id: 'koon-bleu-imperial',
    brand: 'KOON',
    nameEn: 'BLEU IMPÉRIAL',
    nameAr: 'كون بلو إمبريال',
    nameHe: 'קון בלו אימפריאל',
    liquidHex: '#0284C7',
    smokeHex: '#38BDF8',
    capHex: '#D8BD83',
    notesAr: ['برغموت كالابريا', 'أخشاب الأرز', 'بخور ملكي'],
    notesHe: ['ברגמוט איטלקי', 'עץ ארז', 'קטורת מלכותית'],
    descriptionAr:
      'حضور إمبراطوري يجمع بين انتعاش البرغموت الإيطالي وعمق أخشاب الأرز والبخور الأزرق المعتّق بتركيز فائق الثبات.',
    descriptionHe:
      'נוכחות אימפריאלית המשלבת רעננות ברגמוט איטלקי עם עומק עץ ארז וקטורת מלכותית בעמידות יוצאת דופן.'
  },
  {
    id: 'koon-emerald-santal',
    brand: 'KOON',
    nameEn: 'ÉMERAUDE SANTAL',
    nameAr: 'كون إميرود صندل',
    nameHe: 'קון אמרלד סנטל',
    liquidHex: '#059669',
    smokeHex: '#34D399',
    capHex: '#C6A15B',
    notesAr: ['خشب الصندل', 'هيل أخضر', 'نجيل الهند'],
    notesHe: ['עץ אלמוג', 'הל ירוק', 'וטיבר'],
    descriptionAr:
      'توليفة نيش خضراء فاخرة من خشب الصندل الهندي والهيل الأخضر ونجيل الهند، مصممة لعشاق التفرد والفخامة الهادئة.',
    descriptionHe:
      'קומפוזיציית נישה ירוקה ויוקרתית של עץ אלמוג, הל ירוק ווטיבר לאוהבי ייחודיות ואלגנטיות.'
  }
];

// ============================================================================
// 1. PROCEDURAL STUDIO HDR ENVIRONMENT MAP (For realistic PBR glass & metal)
// ============================================================================
const StudioEnvironmentMap = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    // Create virtual high-contrast commercial studio softboxes for crisp glass reflections
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color('#0B0A09');

    const softboxGeo = new THREE.PlaneGeometry(10, 24);

    // Left warm champagne key softbox
    const leftMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFE8B8').multiplyScalar(3.5), side: THREE.DoubleSide });
    const leftLight = new THREE.Mesh(softboxGeo, leftMat);
    leftLight.position.set(-9, 3, 4);
    leftLight.lookAt(0, 0, 0);
    envScene.add(leftLight);

    // Right crisp warm-white rim softbox
    const rightMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#F5F0E7').multiplyScalar(4.0), side: THREE.DoubleSide });
    const rightLight = new THREE.Mesh(softboxGeo, rightMat);
    rightLight.position.set(9, 4, 3);
    rightLight.lookAt(0, 0, 0);
    envScene.add(rightLight);

    // Overhead golden beauty dish
    const topGeo = new THREE.PlaneGeometry(14, 14);
    const topMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#D8BD83').multiplyScalar(3.2), side: THREE.DoubleSide });
    const topLight = new THREE.Mesh(topGeo, topMat);
    topLight.position.set(0, 11, 1);
    topLight.lookAt(0, 0, 0);
    envScene.add(topLight);

    // Back golden kicker strip
    const backMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#C6A15B').multiplyScalar(2.8), side: THREE.DoubleSide });
    const backLight = new THREE.Mesh(softboxGeo, backMat);
    backLight.position.set(0, 2, -10);
    backLight.lookAt(0, 0, 0);
    envScene.add(backLight);

    const renderTarget = pmremGenerator.fromScene(envScene, 0.03);
    scene.environment = renderTarget.texture;

    return () => {
      renderTarget.dispose();
      pmremGenerator.dispose();
      softboxGeo.dispose();
      topGeo.dispose();
      leftMat.dispose();
      rightMat.dispose();
      topMat.dispose();
      backMat.dispose();
    };
  }, [gl, scene]);

  return null;
};

// ============================================================================
// 2. SOFT VOLUMETRIC PERFUME SMOKE AROUND THE BOTTLE (Matches Liquid Color)
// ============================================================================
const VolumetricPerfumeSmoke = ({ smokeColorHex, isMobile }) => {
  const groupRef = useRef();
  const targetColor = useMemo(() => new THREE.Color(smokeColorHex), [smokeColorHex]);

  // Generate soft radial Gaussian smoke puff texture in memory
  const smokeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 6, 128, 128, 124);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    grad.addColorStop(0.32, 'rgba(255, 255, 255, 0.24)');
    grad.addColorStop(0.68, 'rgba(255, 255, 255, 0.06)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const puffs = useMemo(() => {
    const count = isMobile ? 9 : 16;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.85 + (i % 3) * 0.42;
      return {
        id: i,
        baseX: Math.cos(angle) * radius * 1.15,
        baseY: -1.1 + (i % 5) * 0.48,
        // Keep smoke slightly behind or flanking the bottle so it never covers the front label
        baseZ: -0.55 - (i % 3) * 0.35,
        scale: 1.55 + (i % 4) * 0.45,
        speed: 0.22 + (i % 5) * 0.06,
        phase: i * 1.3,
        opacity: 0.075 + (i % 3) * 0.025
      };
    });
  }, [isMobile]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((mesh, idx) => {
      const p = puffs[idx];
      if (!p) return;
      mesh.position.x = p.baseX + Math.sin(t * p.speed + p.phase) * 0.38;
      mesh.position.y = p.baseY + Math.cos(t * (p.speed * 0.8) + p.phase) * 0.26;
      mesh.rotation.z = t * 0.12 * (idx % 2 === 0 ? 1 : -1) + p.phase;
      // Smoothly transition smoke tint when perfume changes
      mesh.material.color.lerp(targetColor, delta * 3.5);
    });
  });

  return (
    <group ref={groupRef}>
      {puffs.map((p) => (
        <mesh key={p.id} position={[p.baseX, p.baseY, p.baseZ]} scale={[p.scale, p.scale, 1]}>
          <planeGeometry args={[1.6, 1.6]} />
          <meshBasicMaterial
            map={smokeTexture}
            color={smokeColorHex}
            transparent
            opacity={p.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

// ============================================================================
// 3. REALISTIC EIFFEL TOWER ON THE LEFT SIDE (Nighttime Paris Atmosphere)
// ============================================================================
const NighttimeParisEiffelTower = ({ isMobile }) => {
  const { nodes } = useGLTF('/models/eiffel-tower.glb');
  const towerRef = useRef();
  const beaconRef = useRef();

  const towerGeometry = useMemo(() => {
    const firstMesh = Object.values(nodes).find((n) => n.isMesh);
    return firstMesh ? firstMesh.geometry : null;
  }, [nodes]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (beaconRef.current) {
      beaconRef.current.rotation.z = Math.sin(t * 0.55) * 0.45;
    }
    if (towerRef.current) {
      // Subtle parallax with mouse pointer
      towerRef.current.rotation.z = THREE.MathUtils.lerp(
        towerRef.current.rotation.z,
        0.18 + state.pointer.x * 0.05,
        0.04
      );
    }
  });

  if (!towerGeometry) return null;

  return (
    <group
      position={isMobile ? [-1.95, -2.15, -5.4] : [-3.85, -2.35, -4.6]}
      scale={isMobile ? 2.65 : 3.45}
    >
      {/* Warm Golden Architectural Uplights Illuminating the Eiffel Tower */}
      <pointLight position={[0.2, 0.3, 0.6]} intensity={4.5} distance={6} color="#D8BD83" />
      <pointLight position={[0.1, 0.85, 0.4]} intensity={3.2} distance={5} color="#C6A15B" />

      {/* Eiffel Tower 3D Mesh (Oriented upright: Z-up in GLB -> -90 deg X rotation) */}
      <mesh
        ref={towerRef}
        geometry={towerGeometry}
        rotation={[-Math.PI / 2, 0, 0.18]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#C6A15B"
          emissive="#D8BD83"
          emissiveIntensity={0.48}
          metalness={0.88}
          roughness={0.26}
        />
      </mesh>

      {/* Subtle Golden Architectural Glow Halo Behind Tower */}
      <mesh position={[0, 0.58, -0.2]}>
        <planeGeometry args={[1.3, 1.5]} />
        <meshBasicMaterial
          color="#C6A15B"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Iconic Paris Nighttime Beacon Light Beam at Tower Pinnacle */}
      <group position={[0, 1.26, 0]} ref={beaconRef}>
        <mesh position={[0.55, 0.08, 0]} rotation={[0, 0, -Math.PI / 2.2]}>
          <coneGeometry args={[0.18, 1.25, 24, 1, true]} />
          <meshBasicMaterial
            color="#D8BD83"
            transparent
            opacity={0.14}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <pointLight intensity={2.5} distance={3} color="#FFF3D1" />
      </group>
    </group>
  );
};

// ============================================================================
// 4. REAL 3D GLB LUXURY PERFUME BOTTLE (151,000-Vertex Blender Model)
// ============================================================================
const KoonLuxuryPerfumeBottleGLB = ({ activeFragrance, scrollProgressRef, isMobile }) => {
  const { nodes } = useGLTF('/models/koon-perfume-bottle.glb');
  const bottleRootRef = useRef();
  const liquidMatRef = useRef();
  const innerCoreMatRef = useRef();
  const glassMatRef = useRef();
  const capMatRef = useRef();

  const targetLiquidColor = useMemo(() => new THREE.Color(activeFragrance.liquidHex), [activeFragrance.liquidHex]);
  const targetCapColor = useMemo(() => new THREE.Color(activeFragrance.capHex), [activeFragrance.capHex]);

  // Dynamic High-Resolution KOON Luxury Label Texture for the Bottle's Front Plaque (nodes.Plane)
  const labelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep Obsidian Plaque Background
    ctx.fillStyle = '#0B0A09';
    ctx.fillRect(0, 0, 1024, 1024);

    // Outer & Inner Champagne Gold Borders
    ctx.strokeStyle = '#C6A15B';
    ctx.lineWidth = 22;
    ctx.strokeRect(44, 44, 936, 936);

    ctx.strokeStyle = '#D8BD83';
    ctx.lineWidth = 6;
    ctx.strokeRect(78, 78, 868, 868);

    // Subtle Corner Ornaments
    ctx.fillStyle = '#C6A15B';
    const corners = [
      [78, 78],
      [946, 78],
      [78, 946],
      [946, 946]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top Royal Emblem / Star
    ctx.fillStyle = '#D8BD83';
    ctx.font = '600 44px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦  H A U T E   P A R F U M E R I E  ✦', 512, 220);

    // Main Brand Name: KOON
    ctx.fillStyle = '#F5F0E7';
    ctx.font = 'bold 170px Georgia, "Playfair Display", serif';
    ctx.fillText('KOON', 512, 430);

    // Gold Divider Line
    ctx.strokeStyle = '#C6A15B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(260, 495);
    ctx.lineTo(764, 495);
    ctx.stroke();

    // Active Fragrance Name
    ctx.fillStyle = '#D8BD83';
    ctx.font = 'bold 58px Georgia, serif';
    ctx.fillText(activeFragrance.nameEn, 512, 610);

    // Concentration & Origin
    ctx.fillStyle = '#C6A15B';
    ctx.font = '500 38px Georgia, serif';
    ctx.fillText('EXTRAIT DE PARFUM', 512, 745);

    ctx.fillStyle = '#F5F0E7';
    ctx.font = '400 34px Georgia, serif';
    ctx.fillText('PARIS  ·  100 ML', 512, 835);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }, [activeFragrance.nameEn]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const scrollProg = scrollProgressRef.current || 0;

    if (bottleRootRef.current) {
      // Combine gentle continuous showcase rotation + mouse parallax + GSAP ScrollTrigger rotation
      const targetRotY =
        Math.sin(t * 0.45) * 0.28 +
        state.pointer.x * 0.42 +
        scrollProg * Math.PI * 1.35;
      const targetRotX = -state.pointer.y * 0.14 + Math.sin(scrollProg * Math.PI) * 0.1;

      bottleRootRef.current.rotation.y = THREE.MathUtils.lerp(
        bottleRootRef.current.rotation.y,
        targetRotY,
        delta * 4.5
      );
      bottleRootRef.current.rotation.x = THREE.MathUtils.lerp(
        bottleRootRef.current.rotation.x,
        targetRotX,
        delta * 4.5
      );
    }

    // Smoothly transition PBR liquid & glass attenuation colors when switching fragrances
    if (liquidMatRef.current) {
      liquidMatRef.current.color.lerp(targetLiquidColor, delta * 4);
      liquidMatRef.current.emissive.lerp(targetLiquidColor, delta * 4);
    }
    if (innerCoreMatRef.current) {
      innerCoreMatRef.current.color.lerp(targetLiquidColor, delta * 4);
      innerCoreMatRef.current.emissive.lerp(targetLiquidColor, delta * 4);
    }
    if (glassMatRef.current) {
      glassMatRef.current.attenuationColor.lerp(targetLiquidColor, delta * 4);
    }
    if (capMatRef.current) {
      capMatRef.current.color.lerp(targetCapColor, delta * 4);
    }
  });

  const bottleScale = isMobile ? 0.68 : 0.82;

  return (
    <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.32}>
      <group
        ref={bottleRootRef}
        position={[isMobile ? 0.15 : 0.45, -0.22, 0]}
        scale={[bottleScale, bottleScale, bottleScale]}
      >
        {/* 1. OUTER SCULPTED CRYSTAL GLASS BOTTLE (138,624 vertices from GLB) */}
        {nodes.Cube && (
          <mesh
            geometry={nodes.Cube.geometry}
            scale={[1.3495, 1.4829, 1.0613]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              ref={glassMatRef}
              color="#FFFFFF"
              transmission={0.93}
              opacity={1}
              transparent
              roughness={0.04}
              metalness={0.04}
              ior={1.52}
              thickness={2.2}
              attenuationColor={activeFragrance.liquidHex}
              attenuationDistance={2.8}
              clearcoat={1}
              clearcoatRoughness={0.03}
              reflectivity={0.98}
              envMapIntensity={2.5}
            />
          </mesh>
        )}

        {/* 2. INNER REFRACTIVE LIQUID ELIXIR VOLUME (Form-fitting inner sculpted chamber) */}
        {nodes.Cube && (
          <mesh
            geometry={nodes.Cube.geometry}
            position={[0, -0.16, 0]}
            scale={[1.14, 1.15, 0.86]}
          >
            <meshPhysicalMaterial
              ref={innerCoreMatRef}
              color={activeFragrance.liquidHex}
              emissive={activeFragrance.liquidHex}
              emissiveIntensity={0.28}
              transmission={0.62}
              transparent
              opacity={0.92}
              roughness={0.06}
              metalness={0.1}
              ior={1.38}
              thickness={1.5}
              envMapIntensity={1.8}
            />
          </mesh>
        )}

        {/* 3. UPPER NECK LIQUID / SHOULDER CHAMBER (7,360 vertices from GLB) */}
        {nodes['1'] && (
          <mesh
            geometry={nodes['1'].geometry}
            position={[-0.0203, 0.5724, -0.0193]}
            scale={[0.7915, 1, 0.6611]}
          >
            <meshPhysicalMaterial
              ref={liquidMatRef}
              color={activeFragrance.liquidHex}
              emissive={activeFragrance.liquidHex}
              emissiveIntensity={0.22}
              transmission={0.72}
              transparent
              opacity={0.88}
              roughness={0.07}
              ior={1.42}
              thickness={1.1}
            />
          </mesh>
        )}

        {/* 4. INTERNAL ATOMIZER DIP TUBE */}
        <mesh position={[0, -0.1, 0]} rotation={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.022, 0.018, 2.45, 16]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={0.85}
            transparent
            opacity={0.55}
            roughness={0.1}
            ior={1.48}
          />
        </mesh>

        {/* 5. METALLIC GOLD ATOMIZER COLLAR & NECK (From GLB) */}
        {nodes.Cylinder2 && (
          <mesh
            geometry={nodes.Cylinder2.geometry}
            position={[-0.0085, 1.1288, -0.0817]}
            scale={[0.3042, 1, 0.3404]}
            castShadow
          >
            <meshPhysicalMaterial
              color="#D8BD83"
              metalness={0.98}
              roughness={0.14}
              clearcoat={1}
              clearcoatRoughness={0.06}
              envMapIntensity={2.6}
            />
          </mesh>
        )}

        {/* 6. DETAILED LUXURY METALLIC CAP (4,928 vertices from GLB) */}
        {nodes.Cylinder && (
          <mesh
            geometry={nodes.Cylinder.geometry}
            position={[-0.0079, 1.9473, -0.0125]}
            scale={[0.4967, 0.2824, 0.497]}
            castShadow
          >
            <meshPhysicalMaterial
              ref={capMatRef}
              color={activeFragrance.capHex}
              metalness={0.95}
              roughness={0.15}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={2.6}
            />
          </mesh>
        )}

        {/* 7. EMBOSSED GOLD BACKING FRAME + KOON FRONT LABEL PLAQUE (From GLB) */}
        <mesh position={[0.0257, 0.3745, 0.862]}>
          <boxGeometry args={[2.06, 1.12, 0.025]} />
          <meshPhysicalMaterial
            color="#C6A15B"
            metalness={0.96}
            roughness={0.16}
            clearcoat={1}
            envMapIntensity={2.4}
          />
        </mesh>

        <mesh position={[0.0257, 0.3745, 0.878]}>
          <planeGeometry args={[1.96, 1.04]} />
          <meshStandardMaterial
            map={labelTexture}
            metalness={0.35}
            roughness={0.25}
          />
        </mesh>
      </group>
    </Float>
  );
};

// ============================================================================
// 5. CAMERA RIG WITH SMOOTH MOUSE PARALLAX & GSAP SCROLL CHOREOGRAPHY
// ============================================================================
const ParisStudioCameraRig = ({ scrollProgressRef, isMobile }) => {
  const camRef = useRef();

  useFrame((state, delta) => {
    if (!camRef.current) return;
    const scrollProg = scrollProgressRef.current || 0;
    const baseZ = isMobile ? 6.4 : 5.6;
    const targetZ = baseZ - Math.sin(scrollProg * Math.PI) * 0.55;
    const targetX = state.pointer.x * 0.28;
    const targetY = 0.2 + state.pointer.y * 0.18 + scrollProg * 0.25;

    camRef.current.position.x = THREE.MathUtils.lerp(camRef.current.position.x, targetX, delta * 3.5);
    camRef.current.position.y = THREE.MathUtils.lerp(camRef.current.position.y, targetY, delta * 3.5);
    camRef.current.position.z = THREE.MathUtils.lerp(camRef.current.position.z, targetZ, delta * 3.5);
    camRef.current.lookAt(isMobile ? 0.05 : 0.2, 0.12, 0);
  });

  return <PerspectiveCamera ref={camRef} makeDefault position={[0, 0.2, isMobile ? 6.4 : 5.6]} fov={38} />;
};

// ============================================================================
// 6. MAIN KOON HOMEPAGE 3D HERO SECTION
// ============================================================================
const PerfumeShelfHero = ({ products = [] }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const heroRef = useRef(null);
  const scrollProgressRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP ScrollTrigger for cinematic scroll-linked bottle & camera choreography
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      }
    });

    return () => trigger.kill();
  }, []);

  const totalItems = KOON_LUXURY_FRAGRANCES.length;

  const nextPerfume = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevPerfume = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  // Auto-advance fragrance showcase
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextPerfume, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextPerfume]);

  const activeFragrance = KOON_LUXURY_FRAGRANCES[activeIndex];
  const linkedProduct = products[activeIndex % (products.length || 1)] || null;

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[94dvh] bg-[#0B0A09] text-[#F5F0E7] flex flex-col justify-between pt-24 sm:pt-28 pb-10 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Nighttime Paris Atmospheric Gradient & Dynamic Liquid Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Night Sky Horizon Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 25% 55%, rgba(198,161,91,0.12) 0%, rgba(21,19,16,0.65) 45%, #0B0A09 85%)'
          }}
        />
        {/* Active Perfume Colored Studio Rim Glow */}
        <motion.div
          animate={{ backgroundColor: activeFragrance.liquidHex }}
          transition={{ duration: 0.9 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/3 w-[340px] sm:w-[580px] h-[380px] opacity-20 blur-[135px] rounded-full"
        />
      </div>

      {/* Giant Editorial Background Watermark (Shifted left so bottle on right reveals logo) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden pb-16 -translate-x-10 sm:-translate-x-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFragrance.id}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -12 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center text-center"
          >
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center mb-3 backdrop-blur-sm"
              style={{
                borderColor: '#C6A15B',
                color: '#D8BD83',
                opacity: 0.45,
                boxShadow: `0 0 40px ${activeFragrance.liquidHex}44`
              }}
            >
              <span className="font-serif font-black text-xl sm:text-2xl tracking-widest">KOON</span>
            </div>

            <span className="font-serif uppercase tracking-[0.42em] text-xs sm:text-sm font-bold text-[#C6A15B]/70 mb-1">
              KOON PARFUMS · PARIS
            </span>

            <span
              className="font-serif font-black uppercase tracking-[0.12em] text-4xl sm:text-6xl lg:text-7xl leading-none whitespace-nowrap"
              style={{
                color: '#D8BD83',
                opacity: 0.16,
                textShadow: `0 0 60px ${activeFragrance.liquidHex}`
              }}
            >
              {activeFragrance.nameEn}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN REAL 3D WEBGL SHOWROOM STAGE (Bottle + Left Eiffel Tower)     */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-2 sm:px-6 flex-1 flex flex-col justify-center">
        <div className="relative h-[370px] sm:h-[450px] lg:h-[500px] w-full">
          {/* Left / Right Navigation Arrows */}
          <button
            type="button"
            onClick={language === 'ar' ? nextPerfume : prevPerfume}
            aria-label="العطر السابق"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#151310]/90 hover:bg-[#C6A15B] text-[#F5F0E7] hover:text-[#0B0A09] border border-[#C6A15B]/40 flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={language === 'ar' ? prevPerfume : nextPerfume}
            aria-label="العطر التالي"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#151310]/90 hover:bg-[#C6A15B] text-[#F5F0E7] hover:text-[#0B0A09] border border-[#C6A15B]/40 flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Nighttime Paris Location Badge on Left Side */}
          <div className="absolute top-3 left-3 sm:left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151310]/85 border border-[#C6A15B]/30 text-[#D8BD83] text-[11px] font-serif tracking-widest uppercase backdrop-blur-md">
            <SparklesIcon className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>PARIS NIGHTFALL · TOUR EIFFEL</span>
          </div>

          {/* React Three Fiber 3D Canvas */}
          <Canvas
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            shadows
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.18
            }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            {/* Atmospheric Paris Night Fog */}
            <fog attach="fog" args={['#0B0A09', 6.5, 17]} />

            <Suspense fallback={null}>
              <StudioEnvironmentMap />
              <ParisStudioCameraRig scrollProgressRef={scrollProgressRef} isMobile={isMobile} />

              {/* High-Contrast Commercial Studio Lighting */}
              <ambientLight intensity={0.55} color="#F5F0E7" />
              <spotLight
                position={[4, 7, 5]}
                angle={0.45}
                penumbra={0.85}
                intensity={3.6}
                color="#D8BD83"
                castShadow
              />
              <directionalLight position={[-5, 4, 3]} intensity={2.2} color="#C6A15B" />
              <pointLight
                position={[0.5, 0.2, -2.5]}
                intensity={3.2}
                distance={7}
                color={activeFragrance.liquidHex}
              />

              {/* 1. LEFT SIDE: Illuminated Nighttime Paris Eiffel Tower (GLB) */}
              <NighttimeParisEiffelTower isMobile={isMobile} />

              {/* 2. VOLUMETRIC PERFUME SMOKE (Tinted to match active perfume liquid) */}
              <VolumetricPerfumeSmoke
                smokeColorHex={activeFragrance.smokeHex}
                isMobile={isMobile}
              />

              {/* 3. DELICATE FLOATING GOLDEN PARTICLES */}
              <Sparkles
                count={isMobile ? 42 : 85}
                scale={[8, 5, 5]}
                size={isMobile ? 1.8 : 2.3}
                speed={0.35}
                opacity={0.78}
                color="#D8BD83"
              />

              {/* 4. REAL 3D GLB LUXURY PERFUME BOTTLE */}
              <KoonLuxuryPerfumeBottleGLB
                activeFragrance={activeFragrance}
                scrollProgressRef={scrollProgressRef}
                isMobile={isMobile}
              />

              {/* Subtle Studio Contact Shadow under the 3D Bottle */}
              <ContactShadows
                position={[isMobile ? 0.15 : 0.45, -1.55, 0]}
                opacity={0.55}
                scale={5.5}
                blur={2.4}
                far={3.2}
                color="#000000"
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Fragrance Selector Dots & Auto-Play Control */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className="p-1.5 rounded-lg bg-[#151310] border border-[#C6A15B]/30 text-[#F5F0E7]/75 hover:text-[#D8BD83] transition cursor-pointer"
            title={isPaused ? 'تشغيل العرض التلقائي' : 'إيقاف العرض التلقائي'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-2">
            {KOON_LUXURY_FRAGRANCES.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={item.nameEn}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? 'w-8 bg-[#C6A15B] shadow-sm shadow-[#C6A15B]/50'
                    : 'w-2 bg-[#26221D] hover:bg-[#C6A15B]/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FRAMER MOTION ANIMATED PERFUME DESCRIPTION & OLFACTORY NOTES              */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-2xl w-full mx-auto px-4 mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFragrance.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center space-y-3 px-6 py-5 rounded-3xl bg-[#151310]/88 border border-[#C6A15B]/30 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-serif tracking-[0.28em] uppercase font-bold text-[#C6A15B]">
                {activeFragrance.brand} · {activeFragrance.nameEn}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#F5F0E7]">
              {language === 'ar' ? activeFragrance.nameAr : activeFragrance.nameHe}
            </h1>

            <p className="text-sm sm:text-base text-[#F5F0E7]/80 leading-relaxed max-w-xl mx-auto">
              {language === 'ar' ? activeFragrance.descriptionAr : activeFragrance.descriptionHe}
            </p>

            {/* Olfactory Notes Pills + Explore CTA */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              {(language === 'ar' ? activeFragrance.notesAr : activeFragrance.notesHe).map(
                (note, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#0B0A09] border border-[#C6A15B]/35 text-[#D8BD83]"
                  >
                    {note}
                  </span>
                )
              )}

              {linkedProduct && (
                <button
                  type="button"
                  onClick={() => navigate(`/product/${linkedProduct.id}`)}
                  className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#C6A15B] hover:bg-[#D8BD83] text-[#0B0A09] text-[11px] font-black transition cursor-pointer ms-1"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>{language === 'ar' ? 'تسوّق العطر' : 'לרכישת הבושם'}</span>
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PerfumeShelfHero;
