---
name: r3f-threejs-3d-perfume
description: >-
  Build and customize 3D luxury perfume bottle scenes, physical refractive glass materials,
  studio lighting, cameras, and golden atmospheric particle systems using React Three Fiber
  (@react-three/fiber), Drei (@react-three/drei), and Three.js (three). Use whenever working
  on 3D product showcases, WebGL canvases, glass shaders, or 3D lighting in KAWN PERFUME.
---

# React Three Fiber, Drei & Three.js — Luxury 3D Perfume Scene Skill

This skill defines the architecture and best practices for 3D scenes in **KAWN PERFUME (كون بيرفيوم)** using:
- **React Three Fiber (`@react-three/fiber`)**: Declarative 3D bottle scene graph (`مشهد الزجاجة ثلاثي الأبعاد`)
- **Drei (`@react-three/drei`)**: Studio cameras, lighting, environment maps, float physics, and glass materials (`الإضاءة والخامات والكاميرا`)
- **Three.js (`three`)**: Custom geometries, shaders, and golden atmospheric particle effects (`المؤثرات والجزيئات`)

## 1. Core Stack & Compatibility
- React 18 compatible versions:
  - `three@^0.170.0`
  - `@react-three/fiber@^8.17.10`
  - `@react-three/drei@^9.117.3`

## 2. Physical Perfume Bottle Material Guidelines
- **Crystal Glass Outer Shell (`meshPhysicalMaterial`)**:
  - `transmission: 0.92`, `thickness: 1.4`, `roughness: 0.06`, `ior: 1.52`, `clearcoat: 1`, `reflectivity: 0.95`.
- **Golden Elixir Inner Core**:
  - Slightly scaled inner mesh (`scale={[0.86, 0.82, 0.86]}`) with warm amber/champagne gold color (`#C5A36A` in Dark Mode, `#A98750` in Light Mode), `transmission: 0.65`, `attenuationColor: "#C5A36A"`, `attenuationDistance: 1.2`.
- **Metallic Gold Collar & Cap**:
  - `metalness: 0.96`, `roughness: 0.14`, `color: "#C5A36A"`.

## 3. Dual Theme Lighting Adaptation
- **Dark Mode (`#111111`)**:
  - Dramatic low-key rim lighting, high-contrast golden key light (`#C5A36A`), deep shadow falloff, luminous golden `Sparkles`.
- **Light Mode (`#F3EBDD`)**:
  - Soft warm ivory studio fill light (`#F3EBDD`), muted champagne gold key light (`#A98750`), soft natural `ContactShadows` (`opacity={0.28}`).

## 4. Performance Rules
- Set `dpr={[1, 2]}` on `<Canvas>` for crisp Retina rendering without GPU overload.
- Wrap 3D assets in `<Suspense fallback={null}>`.
- Dispose geometries/materials or use declarative R3F primitives so WebGL contexts clean up on route changes.

