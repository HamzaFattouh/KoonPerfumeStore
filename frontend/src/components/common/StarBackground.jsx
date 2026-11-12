import React, { useEffect, useRef } from 'react';

const StarBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    // --- 1. STARS SYSTEM (حركة ناعمة وخفيفة للنجوم ومحسنة للأداء) ---
    const isMobile = width < 768;
    const STAR_COUNT = isMobile ? 35 : Math.min(65, Math.floor((width * height) / 18000));
    let stars = [];

    const starColors = [
      'rgba(255, 255, 255, ',    // pure white
      'rgba(254, 243, 199, ',    // warm starlight gold
      'rgba(212, 175, 55, ',     // royal luxury gold
      'rgba(224, 231, 255, ',    // soft celestial lavender
      'rgba(186, 230, 253, ',    // gentle cyan
    ];

    const initStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.4,
          baseAlpha: Math.random() * 0.6 + 0.25,
          alpha: Math.random() * 0.6 + 0.25,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          // Gentle, slow floating drift (حركة ناعمة جداً)
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.08,
          colorPrefix: starColors[Math.floor(Math.random() * starColors.length)],
          hasCrossGlow: Math.random() > 0.88 // occasional twinkling diamond star
        });
      }
    };

    initStars();

    // --- 2. SHOOTING STARS / METEORS SYSTEM (الشهب في الخلفية) ---
    const meteors = [];
    let nextMeteorTime = Date.now() + Math.random() * 1500 + 800; // first meteor appears soon

    const createMeteor = () => {
      // Spawn mainly from top or top-right, shooting downward-left
      const startX = Math.random() * (width + 300) - 100;
      const startY = Math.random() * (height * 0.45);
      
      const angle = (Math.PI / 180) * (Math.random() * 18 + 130); // ~130 to ~148 degrees (down-left)
      const speed = Math.random() * 6 + 7; // elegant swift speed
      const length = Math.random() * 120 + 90; // tail length
      const life = Math.random() * 60 + 50; // frames of visibility

      meteors.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: length,
        life: life,
        maxLife: life,
        opacity: 0,
        thickness: Math.random() * 1.4 + 1.1,
        // Golden celestial trail matching Koon Perfume logo
        color: Math.random() > 0.4 ? 'gold' : 'silver'
      });

      // Schedule next meteor (every 2.5 to 5.5 seconds)
      nextMeteorTime = Date.now() + Math.random() * 3000 + 2500;
    };

    // --- 3. ANIMATION LOOP ---
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // --- Draw Gentle Floating Stars ---
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Smooth drift
        star.x += star.vx;
        star.y += star.vy;

        // Screen wrap
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Gentle sinusoidal twinkle
        const twinkle = Math.sin(tick * star.twinkleSpeed + star.twinkleOffset);
        const currentAlpha = Math.max(0.1, Math.min(1, star.baseAlpha + twinkle * 0.35));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.colorPrefix + currentAlpha + ')';
        ctx.fill();

        // Subtle soft glow cross for selected bright stars
        if (star.hasCrossGlow && currentAlpha > 0.55) {
          const glowLen = star.radius * 3.5;
          ctx.strokeStyle = star.colorPrefix + (currentAlpha * 0.35) + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(star.x - glowLen, star.y);
          ctx.lineTo(star.x + glowLen, star.y);
          ctx.moveTo(star.x, star.y - glowLen);
          ctx.lineTo(star.x, star.y + glowLen);
          ctx.stroke();
        }
      }

      // --- Spawn & Update Shooting Stars (الشهب) ---
      if (Date.now() > nextMeteorTime) {
        createMeteor();
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.dx;
        m.y += m.dy;
        m.life--;

        // Fade in rapidly, then fade out smoothly
        const progress = 1 - m.life / m.maxLife;
        if (progress < 0.2) {
          m.opacity = progress / 0.2;
        } else {
          m.opacity = Math.max(0, 1 - (progress - 0.2) / 0.8);
        }

        // Calculate tail end point
        const tailAngle = Math.atan2(m.dy, m.dx);
        const tailX = m.x - Math.cos(tailAngle) * m.length;
        const tailY = m.y - Math.sin(tailAngle) * m.length;

        // Gradient trail
        const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        if (m.color === 'gold') {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
          gradient.addColorStop(0.15, `rgba(253, 224, 71, ${m.opacity * 0.9})`);
          gradient.addColorStop(0.5, `rgba(212, 175, 55, ${m.opacity * 0.45})`);
          gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
          gradient.addColorStop(0.2, `rgba(224, 231, 255, ${m.opacity * 0.85})`);
          gradient.addColorStop(0.6, `rgba(99, 102, 241, ${m.opacity * 0.35})`);
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        }

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glowing meteor head
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.thickness * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
        ctx.shadowColor = m.color === 'gold' ? '#d4af37' : '#818cf8';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Remove dead meteors
        if (m.life <= 0 || m.x < -m.length || m.y > height + m.length) {
          meteors.splice(i, 1);
        }
      }

      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Defer start slightly so initial paint & LCP complete without main-thread jitter
    const timerId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(render);
    }, 60);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep cosmic nebula gradients matching the golden logo aura */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-indigo-950/20 rounded-full blur-[150px] -translate-y-1/2 animate-pulse-slow" />
      <div className="absolute top-1/3 left-0 w-[550px] h-[550px] bg-amber-950/15 rounded-full blur-[140px] -translate-x-1/2" />
      <div className="absolute bottom-0 right-10 w-[700px] h-[700px] bg-slate-900/40 rounded-full blur-[160px]" />
      <div className="absolute top-2/3 right-1/3 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />

      {/* HTML5 Canvas for Gentle Drifting Stars & Meteors (شهب) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default StarBackground;
