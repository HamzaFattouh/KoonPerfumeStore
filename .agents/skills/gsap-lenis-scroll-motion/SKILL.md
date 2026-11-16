---
name: gsap-lenis-scroll-motion
description: >-
  Orchestrate smooth page scrolling with Lenis, camera-linked scroll choreography with
  GSAP ScrollTrigger, and editorial text/UI reveals with Framer Motion. Use whenever
  implementing scroll-driven 3D camera paths, parallax storytelling, smooth scrolling,
  or animated UI transitions in KAWN PERFUME.
---

# GSAP ScrollTrigger, Lenis & Framer Motion — Cinematic Scroll & Animation Skill

This skill governs scroll choreography and motion design in **KAWN PERFUME (كون بيرفيوم)** using:
- **GSAP ScrollTrigger (`gsap`, `gsap/ScrollTrigger`)**: Linking 3D camera/bottle rotation and position to scroll progress (`ربط حركة الكاميرا بالتمرير`)
- **Lenis (`lenis`)**: Silky-smooth inertial page scrolling (`تمرير ناعم للصفحة`)
- **Framer Motion (`framer-motion`)**: Staggered reveals for Arabic (`IBM Plex Sans Arabic`) and Hebrew (`Heebo`) typography and UI cards (`ظهور النصوص والعناصر`)

## 1. Synchronizing Lenis with GSAP ScrollTrigger
Always register `ScrollTrigger` and connect `Lenis` to GSAP's ticker so scroll-driven 3D animations never jitter:

```js
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

## 2. Linking 3D Bottle / Camera to ScrollTrigger
- Use a shared mutable ref (`scrollStateRef = useRef({ progress: 0 })`) updated by `ScrollTrigger.create({ onUpdate: (self) => { scrollStateRef.current.progress = self.progress; } })`.
- Inside the R3F `useFrame((state, delta) => ...)` loop, interpolate (`THREE.MathUtils.lerp`) camera position and bottle rotation smoothly toward the target scroll state.

## 3. Framer Motion RTL & Theme Rules
- Prefer vertical (`y`) and scale/opacity transitions or RTL-aware offsets so animations behave identically in Arabic (`ar`) and Hebrew (`he`).
- Keep `viewport={{ once: true, amount: 0.25 }}` on `whileInView` elements for smooth 60fps scrolling.
