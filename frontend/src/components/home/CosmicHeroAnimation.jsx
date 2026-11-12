import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ChevronDown, 
  ArrowLeft, 
  Compass,
  Sparkles,
  FastForward
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const CosmicHeroAnimation = () => {
  const { t, language } = useLanguage();
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Play video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        console.log('Autoplay handled', e);
      });
    }
  }, []);

  const handleVideoEnded = () => {
    setVideoEnded(true);
    if (videoRef.current) {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 8.45;
      } catch (e) {
        // ignore
      }
    }
  };

  const handleReplay = () => {
    setVideoEnded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 8.45;
      videoRef.current.pause();
      setVideoEnded(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const scrollToContent = () => {
    const target = document.getElementById('brand-pillars');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight - 40, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[100dvh] min-h-[650px] flex flex-col items-center justify-between overflow-hidden bg-transparent select-none pt-20 pb-8">
      
      {/* 1. Ambient Cosmic Glow behind logo area */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full bg-amber-500/10 blur-[130px] animate-pulse-slow" />
        <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      {/* 2. Pure Native Transparent WebM Video (خلفية شفافة 100% بدون نجوم الفيديو الخارجية) */}
      <div className="relative w-full flex-1 flex items-center justify-center px-4 my-auto">
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          playsInline
          onEnded={handleVideoEnded}
          className="w-full h-auto max-h-[64vh] max-w-[1150px] object-contain pointer-events-none transition-all duration-700 select-none z-10"
        >
          {/* Native 100% Transparent WebM with yuva420p alpha channel */}
          <source src="/intro_transparent.webm" type="video/webm" />
          {/* Fallback MP4 with pitch black background */}
          <source src="/intro.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 3. Top Floating Controls (صوت / إعادة تشغيل / تخطي) */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-amber-400 backdrop-blur-md transition shadow-lg cursor-pointer"
          title={isMuted ? (language === 'ar' ? 'تشغيل الصوت' : 'הפעל סאונד') : (language === 'ar' ? 'كتم الصوت' : 'השתק')}
          aria-label="Sound Toggle"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        <button
          onClick={handleReplay}
          className="p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-amber-400 backdrop-blur-md transition shadow-lg cursor-pointer"
          title={language === 'ar' ? 'إعادة تشغيل الأنيميشن' : 'הפעל אנימציה מחדש'}
          aria-label="Replay Animation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {!videoEnded && (
          <button
            onClick={handleSkip}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-amber-400 text-xs font-medium backdrop-blur-md transition shadow-lg cursor-pointer"
            title={language === 'ar' ? 'تخطي للوغو' : 'דלג ללוגו'}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تخطي' : 'דלג'}</span>
          </button>
        )}
      </div>

      {/* 4. Bottom Actions & Smooth Scroll Cue (تظهر بسلاسة أسفل الشعار) */}
      <div className={`relative z-20 w-full flex flex-col items-center justify-center gap-3 transition-all duration-700 pb-2 ${
        videoEnded ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-0'
      }`}>
        {/* Quick CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 px-4">
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-2xl shadow-amber-500/30 transition transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
          >
            <span>{t.actions.exploreBtn}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <Link
            to="/quiz"
            className="px-6 py-3.5 bg-slate-950/85 hover:bg-slate-900 text-slate-200 border border-slate-700/80 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 backdrop-blur-md hover:border-amber-400/50"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{t.actions.quizBtn}</span>
          </Link>
        </div>

        {/* Smooth Scroll Cue */}
        <button
          onClick={scrollToContent}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-300 transition pt-1 animate-bounce cursor-pointer group"
        >
          <span>{t.actions.scrollDown}</span>
          <ChevronDown className="w-4 h-4 text-amber-400 group-hover:translate-y-0.5 transition" />
        </button>
      </div>

    </section>
  );
};

export default CosmicHeroAnimation;
