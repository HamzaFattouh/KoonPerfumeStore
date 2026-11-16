import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const COLLECTION_IMAGES = [
  '/editorial/royal-collection.jpg',
  '/editorial/spotlight-amber.jpg',
  '/editorial/velvet-elixir.jpg',
];

const CinematicCollectionsSection = () => {
  const { language, t } = useLanguage();
  const { isDark } = useTheme();

  const colData = t.collectionsSection || {};
  const items = colData.items || [];

  return (
    <section id="collections-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Section Editorial Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto mb-12 space-y-3"
      >
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
            isDark
              ? 'bg-[#1D1D1D] border-[#C5A36A]/35 text-[#C5A36A]'
              : 'bg-[#E9DECC] border-[#A98750]/40 text-[#A98750]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{colData.eyebrow}</span>
        </div>

        <h2
          className={`text-3xl sm:text-4xl font-black tracking-tight ${
            isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'
          }`}
        >
          {colData.title}
        </h2>

        <p
          className={`text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-[#F5F0E8]/75' : 'text-[#29231D]/75'
          }`}
        >
          {colData.subtitle}
        </p>
      </motion.div>

      {/* 3 Luxury Collection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {items.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: idx * 0.12, ease: 'easeOut' }}
            className={`group relative rounded-3xl overflow-hidden border flex flex-col justify-between transition-all duration-500 ${
              isDark
                ? 'bg-[#222222] border-[#C5A36A]/25 hover:border-[#C5A36A] shadow-[0_20px_50px_rgba(0,0,0,0.65)]'
                : 'bg-[#FFFFFF] border-[#A98750]/30 hover:border-[#A98750] shadow-[0_18px_40px_rgba(41,35,29,0.1)]'
            }`}
          >
            {/* Editorial Visual */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#111111]">
              <img
                src={COLLECTION_IMAGES[idx % COLLECTION_IMAGES.length]}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <span className="keep-white-text absolute bottom-4 start-4 px-3 py-1 rounded-full bg-black/65 border border-[#C5A36A]/45 text-[#C5A36A] text-[11px] font-serif tracking-wider backdrop-blur-md">
                {item.tag}
              </span>
            </div>

            {/* Editorial Copy */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-2.5">
                <h3
                  className={`text-xl font-black transition-colors ${
                    isDark
                      ? 'text-[#F5F0E8] group-hover:text-[#C5A36A]'
                      : 'text-[#29231D] group-hover:text-[#A98750]'
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'text-[#F5F0E8]/75' : 'text-[#29231D]/75'
                  }`}
                >
                  {item.description}
                </p>
              </div>

              <div>
                <Link
                  to="/shop"
                  className={`inline-flex items-center gap-2 text-xs font-bold py-2.5 px-5 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-[#1D1D1D] hover:bg-[#C5A36A] text-[#C5A36A] hover:text-[#111111] border-[#C5A36A]/40'
                      : 'bg-[#F3EBDD] hover:bg-[#A98750] text-[#29231D] hover:text-[#FFFFFF] border-[#A98750]/40'
                  }`}
                >
                  <span>{item.cta}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cinematic Scroll-Triggered Storytelling Banner (Floating Mist Bottle) */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`mt-12 relative rounded-3xl overflow-hidden border grid grid-cols-1 lg:grid-cols-12 items-center ${
          isDark
            ? 'bg-[#1D1D1D] border-[#C5A36A]/30 shadow-[0_24px_60px_rgba(0,0,0,0.75)]'
            : 'bg-[#E9DECC] border-[#A98750]/35 shadow-[0_20px_50px_rgba(41,35,29,0.12)]'
        }`}
      >
        <div className="lg:col-span-7 p-8 sm:p-12 space-y-5">
          <span
            className={`text-xs font-serif uppercase tracking-[0.28em] block font-bold ${
              isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'
            }`}
          >
            KAWN PERFUME · A UNIVERSE OF FRAGRANCE
          </span>
          <h3
            className={`text-2xl sm:text-4xl font-black leading-tight ${
              isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'
            }`}
          >
            {language === 'ar'
              ? 'حيث تلتقي حرفية العطور الفرنسية بنفائس الشرق المعتّقة'
              : 'המקום שבו אומנות הבישום הצרפתית פוגשת את אוצרות המזרח'}
          </h3>
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-[#F5F0E8]/80' : 'text-[#29231D]/80'
            }`}
          >
            {language === 'ar'
              ? 'كل زجاجة في دار كون بيرفيوم تُصاغ بتركيز Extrait de Parfum فائق النقاء، لتمنحك هالة عطرية متفردة تتفاعل مع دفء البشرة وتدوم لساعات طويلة.'
              : 'כל בקבוק בבית הבישום קון פרפיום מיוצר בריכוז Extrait de Parfum טהור במיוחד, להענקת הילה יוקרתית שנשארת לאורך ימים.'}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/shop"
              className={`keep-white-text px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black transition shadow-lg ${
                isDark
                  ? 'bg-[#C5A36A] hover:bg-[#D4B67D] text-[#111111]'
                  : 'bg-[#A98750] hover:bg-[#8F6F3C] text-[#FFFFFF]'
              }`}
            >
              {t.actions?.exploreBtn}
            </Link>
            <Link
              to="/quiz"
              className={`px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold border transition ${
                isDark
                  ? 'bg-[#222222] hover:border-[#C5A36A] border-[#C5A36A]/35 text-[#F5F0E8]'
                  : 'bg-[#FFFFFF] hover:border-[#A98750] border-[#A98750]/40 text-[#29231D]'
              }`}
            >
              {t.actions?.quizBtn}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 h-72 sm:h-80 lg:h-full w-full relative overflow-hidden bg-[#111111]">
          <img
            src="/editorial/floating-mist.jpg"
            alt="KAWN PERFUME Luxury Bottle Reveal"
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};

export default CinematicCollectionsSection;
