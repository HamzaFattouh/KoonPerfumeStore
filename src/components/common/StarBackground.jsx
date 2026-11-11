import React, { useMemo } from 'react';

const StarBackground = () => {
  // Generate random starry points
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.2 + 0.8,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.7 + 0.3
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep cosmic nebula gradients */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-950/20 rounded-full blur-[140px] -translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-950/15 rounded-full blur-[130px] -translate-x-1/2" />
      <div className="absolute bottom-0 right-10 w-[700px] h-[700px] bg-slate-900/30 rounded-full blur-[160px]" />

      {/* Subtle twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-slate-200"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `pulse ${star.duration}s ease-in-out ${star.delay}s infinite`
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;
