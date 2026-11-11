import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Compass, 
  ShieldCheck, 
  Clock, 
  Star, 
  ChevronDown, 
  Gift, 
  Flame, 
  Award,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';
import { PRODUCTS, TESTIMONIALS } from '../data/products';
import ProductCard from '../components/products/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import CosmicHeroAnimation from '../components/home/CosmicHeroAnimation';

const Home = () => {
  const { t } = useLanguage();

  // Countdown timer for Cosmic Limited Offer
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bestSellers = PRODUCTS.filter(p => p.isBestseller).slice(0, 4);
  const featuredPerfumes = PRODUCTS.filter(p => p.isFeatured);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Opening Transparent Cosmic Animation Hero Section (أنيميشن الفيديو المفرغة بدون خلفية على نجوم الموقع) */}
      <CosmicHeroAnimation />

      {/* 2. Brand Value Pillars */}
      <section id="brand-pillars" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition">
            <span className="text-3xl mb-4 block">🪐</span>
            <h3 className="text-lg font-bold text-white mb-2">استلهام كوني لا يتكرر</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              كل عطر من عطورنا وُلد من فكرة فلكية تجسد ولادة الكواكب، حرارة النجوم، أو برودة السدم السماوية لتمنحك طابعاً منفرداً.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition">
            <span className="text-3xl mb-4 block">🧪</span>
            <h3 className="text-lg font-bold text-white mb-2">تعتيق حرفي دقيق</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تخضع زيوتنا العطرية لعمليات تعتيق طويلة في براميل خاصة تضمن ثبات الفوحان وتدرج النوتات بسلاسة مذهلة دون أي حدة كحولية.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition">
            <span className="text-3xl mb-4 block">🎁</span>
            <h3 className="text-lg font-bold text-white mb-2">تجربة إهداء ملكية</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تصلك العطور في بوكس فاخر بلون الفضاء الحالك مع بطاقات إهداء مخصصة وعينات مجانية تتيح لك تجربة العطر قبل فتح الزجاجة.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>مختارات لعشاق التميز</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">العطور الأكثر طلباً وشهرة</h2>
          </div>
          <Link
            to="/shop?filter=bestseller"
            className="text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition"
          >
            <span>عرض كل الأكثر مبيعاً</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Limited Cosmic Offer with Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center lg:text-right max-w-xl">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold inline-block">
                عرض المدار الخاص • خصم حتى 25%
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white">
                باقة المجرة الفاخرة: عطرين + عينة نيش + تغليف ملكي مجاناً
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                استمتع بتوليفة "كون أبسولوت" مع "سديم الفانيليا" في صندوق إهداء أسود فاخر مع شحن مجاني مبرد لكافة مدن المملكة. استخدم كود <strong className="text-amber-400 font-mono">KOON10</strong>.
              </p>

              {/* Countdown Clocks */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                <div className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-xl text-center min-w-[55px]">
                  <span className="text-xl font-black text-amber-400 font-mono">{timeLeft.hours}</span>
                  <span className="block text-[10px] text-slate-400">ساعة</span>
                </div>
                <span className="text-slate-600 font-bold">:</span>
                <div className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-xl text-center min-w-[55px]">
                  <span className="text-xl font-black text-amber-400 font-mono">{timeLeft.minutes}</span>
                  <span className="block text-[10px] text-slate-400">دقيقة</span>
                </div>
                <span className="text-slate-600 font-bold">:</span>
                <div className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-xl text-center min-w-[55px]">
                  <span className="text-xl font-black text-amber-400 font-mono">{timeLeft.seconds}</span>
                  <span className="block text-[10px] text-slate-400">ثانية</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition text-center"
              >
                اطلب الباقة الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Olfactory Families / Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">العوالم العطرية</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">اختر مجموعتك حسب ذوقك المفضل</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <Link 
            to="/shop?category=oriental"
            className="group relative h-72 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition duration-500 flex flex-col justify-end p-6"
          >
            <img 
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop" 
              alt="الشرقي والعود"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase">المدار الشرقي</span>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition">عطور العود والعنبر المعتق</h3>
              <p className="text-xs text-slate-300">نفحات ملكية مستوحاة من دفء الشرق وأصالته</p>
            </div>
          </Link>

          {/* Card 2 */}
          <Link 
            to="/shop?category=women"
            className="group relative h-72 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition duration-500 flex flex-col justify-end p-6"
          >
            <img 
              src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop" 
              alt="سديم الفانيليا والزهور"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase">سديم الأنوثة</span>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition">الفانيليا والورد المخملي</h3>
              <p className="text-xs text-slate-300">نعومة فائقة وأنوثة آسرة تدوم طوال اليوم</p>
            </div>
          </Link>

          {/* Card 3 */}
          <Link 
            to="/shop?category=niche"
            className="group relative h-72 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition duration-500 flex flex-col justify-end p-6 sm:col-span-2 lg:col-span-1"
          >
            <img 
              src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop" 
              alt="النيش الحصري"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase">إصدارات نيش خاصة</span>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition">مجموعة سوبرنوفا النادرة</h3>
              <p className="text-xs text-slate-300">تركيبات خاصة لأصحاب الذوق النخبوي الرفيع</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. Interactive Quiz Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-md">
          <div className="space-y-4 max-w-xl text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20">
              <Compass className="w-4 h-4" />
              <span>مستكشف العطور الكوني الذكي</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              محتار أي عطر يناسب شخصيتك أو مناسبتك؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              أجب على 4 أسئلة بسيطة وسيقوم نظامنا الفلكي باقتراح العطر الأمثل لك بناءً على طبيعة استخدامك والنوتات المفضلة لديك مع خصم فوري.
            </p>
          </div>

          <Link
            to="/quiz"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/25 transition transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
          >
            <span>ابدأ الاختبار الآن (30 ثانية)</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. Customer Reviews / Wall of Love */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">ثقة عملائنا</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">ماذا يقول عشاق كون بيرفيوم؟</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{item.date}</span>
                </div>
                <div className="text-xs font-semibold text-amber-300">
                  اشترى: {item.perfume}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between text-xs">
                <span className="font-bold text-white">{item.name}</span>
                <span className="text-slate-400">{item.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

