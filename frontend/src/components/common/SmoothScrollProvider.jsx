import { useEffect } from 'react';

const SmoothScrollProvider = ({ children }) => {
  useEffect(() => {
    // Touch/mobile devices natively support hardware momentum scrolling without JS overhead
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (isTouch) return;

    let lenis;
    let updateTicker;

    Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([{ default: Lenis }, { default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1
      });

      lenis.on('scroll', ScrollTrigger.update);

      updateTicker = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(0);
    }).catch(() => {});

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return children;
};

export default SmoothScrollProvider;
