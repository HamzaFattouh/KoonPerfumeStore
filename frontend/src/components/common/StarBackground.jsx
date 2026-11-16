import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const StarBackground = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

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

    const isMobile = width < 768;
    const STAR_COUNT = isMobile ? 32 : Math.min(60, Math.floor((width * height) / 19000));
    let stars = [];

    // Theme-aware champagne gold & warm white/ivory particle palette
    const starColors = isDark
      ? [
          'rgba(245, 240, 232, ', // #F5F0E8 warm white
          'rgba(197, 163, 106, ', // #C5A36A champagne gold
          'rgba(229, 207, 160, ', // pale champagne
          'rgba(169, 135, 80, ',  // muted gold
        ]
      : [
          'rgba(169, 135, 80, ',  // #A98750 muted champagne gold
          'rgba(143, 111, 60, ',  // deep warm gold
          'rgba(197, 163, 106, ', // soft gold dust
          'rgba(41, 35, 29, ',    // #29231D subtle espresso mote
        ];

    const initStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.45 + 0.45,
          baseAlpha: isDark ? Math.random() * 0.55 + 0.22 : Math.random() * 0.28 + 0.1,
          twinkleSpeed: Math.random() * 0.014 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.11,
          vy: (Math.random() - 0.5) * 0.08,
          colorPrefix: starColors[Math.floor(Math.random() * starColors.length)],
          hasCrossGlow: Math.random() > 0.88,
        });
      }
    };

    initStars();

    // Shooting stars in Dark Mode only for dramatic nocturnal luxury
    const meteors = [];
    let nextMeteorTime = Date.now() + Math.random() * 2000 + 1000;

    const createMeteor = () => {
      if (!isDark) return;
      const startX = Math.random() * (width + 300) - 100;
      const startY = Math.random() * (height * 0.45);
      const angle = (Math.PI / 180) * (Math.random() * 18 + 130);
      const speed = Math.random() * 6 + 7;
      const length = Math.random() * 120 + 90;
      const life = Math.random() * 60 + 50;

      meteors.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length,
        life,
        maxLife: life,
        opacity: 0,
        thickness: Math.random() * 1.3 + 1.0,
      });

      nextMeteorTime = Date.now() + Math.random() * 3500 + 2800;
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const twinkle = Math.sin(tick * star.twinkleSpeed + star.twinkleOffset);
        const maxAlpha = isDark ? 0.85 : 0.38;
        const currentAlpha = Math.max(0.06, Math.min(maxAlpha, star.baseAlpha + twinkle * (isDark ? 0.3 : 0.12)));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.colorPrefix + currentAlpha + ')';
        ctx.fill();

        if (star.hasCrossGlow && currentAlpha > (isDark ? 0.5 : 0.25)) {
          const glowLen = star.radius * 3.2;
          ctx.strokeStyle = star.colorPrefix + currentAlpha * 0.35 + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(star.x - glowLen, star.y);
          ctx.lineTo(star.x + glowLen, star.y);
          ctx.moveTo(star.x, star.y - glowLen);
          ctx.lineTo(star.x, star.y + glowLen);
          ctx.stroke();
        }
      }

      if (isDark && Date.now() > nextMeteorTime) {
        createMeteor();
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.dx;
        m.y += m.dy;
        m.life--;

        const progress = 1 - m.life / m.maxLife;
        m.opacity = progress < 0.2 ? progress / 0.2 : Math.max(0, 1 - (progress - 0.2) / 0.8);

        const tailAngle = Math.atan2(m.dy, m.dx);
        const tailX = m.x - Math.cos(tailAngle) * m.length;
        const tailY = m.y - Math.sin(tailAngle) * m.length;

        const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(245, 240, 232, ${m.opacity})`);
        gradient.addColorStop(0.2, `rgba(197, 163, 106, ${m.opacity * 0.85})`);
        gradient.addColorStop(0.6, `rgba(169, 135, 80, ${m.opacity * 0.35})`);
        gradient.addColorStop(1, 'rgba(197, 163, 106, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

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
    const timerId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(render);
    }, 60);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700">
      {isDark ? (
        <>
          <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-[#C5A36A]/[0.05] rounded-full blur-[160px] -translate-y-1/2" />
          <div className="absolute top-1/3 left-0 w-[550px] h-[550px] bg-[#A98750]/[0.04] rounded-full blur-[150px] -translate-x-1/2" />
          <div className="absolute bottom-0 right-10 w-[700px] h-[700px] bg-[#1D1D1D]/60 rounded-full blur-[160px]" />
        </>
      ) : (
        <>
          <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-[#A98750]/[0.08] rounded-full blur-[160px] -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 w-[550px] h-[550px] bg-[#E9DECC]/80 rounded-full blur-[140px] -translate-x-1/2" />
          <div className="absolute bottom-0 right-10 w-[650px] h-[650px] bg-[#E9DECC]/70 rounded-full blur-[150px]" />
        </>
      )}

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default StarBackground;
