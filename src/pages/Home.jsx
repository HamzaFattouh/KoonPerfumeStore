import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Compass, 
  ShieldCheck, 
  Clock, 
  Star, 
  ChevronRight, 
  Gift, 
  Flame, 
  Award 
} from 'lucide-react';
import { PRODUCTS, TESTIMONIALS } from '../data/products';
import ProductCard from '../components/products/ProductCard';

const Home = () => {
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
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 overflow-hidden">
        
        {/* Celestial Ring Animation behind Hero */}
        <div className="absolute w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full border border-slate-700/40 pointer-events-none animate-spin-slow" />
        <div className="absolute w-[280px] sm:w-[480px] h-[280px] sm:h-[480px] rounded-full border border-dashed border-amber-500/20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
          
          {/* Left Text Column */}
          <div className="flex-1 text-center lg:text-right space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-amber-500/10">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>إصدارات فلكية مستوحاة من مدارات وأسرار الكون</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
              الفخامة في <br />
              <span className="text-gold-gradient">أبعاد كوكبية لا نهائية</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              مرحباً بك في دار <strong className="text-white font-semibold">كون بيرفيوم</strong>. نبتكر عطور نيش استثنائية تمزج بين عراقة العود والعنبر الشرقي وأرقى مستخلصات الطبيعة، لتمنحك حضوراً آسراً يدوم طويلاً كخلود النجوم.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>استكشف التشكيلة الفلكية</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <Link
                to="/quiz"
                className="w-full sm:w-auto px-7 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>اكتشف عطرك المناسب (Quiz)</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-200">4.9 / 5</span>
              </div>
              <span>•</span>
              <span>أكثر من <strong>12,000+</strong> عميل في المملكة والخليج</span>
            </div>
          </div>

          {/* Right Visual Column: Signature Bottle Highlight */}
          <div className="flex-1 relative flex items-center justify-center">
            
            {/* Glowing Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Floating Orbit Cards */}
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              
              {/* Centerpiece Image */}
              <div className="relative z-10 w-72 h-80 sm:w-80 sm:h-96 rounded-3xl bg-slate-950/80 border border-slate-800/80 p-6 flex flex-col items-center justify-between shadow-2xl backdrop-blur-xl group hover:border-amber-500/50 transition-all duration-500">
                <div className="w-full flex justify-between items-center text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    توقيع الدار الأيقوني
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">KOON-01</span>
                </div>

                <img 
                  src="/koon-logo.jpg" 
                  alt="Koon Absolute Logo"
                  className="w-48 h-48 object-contain rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-700" 
                />

                <div className="w-full text-center">
                  <h3 className="text-xl font-black text-white">كون أبسولوت</h3>
                  <p className="text-xs text-amber-400 font-serif tracking-widest mt-0.5">KOON ABSOLUTE</p>
                  <div className="mt-2 text-sm font-bold text-slate-200 font-mono">480 ر.س</div>
                </div>
              </div>

              {/* Floating Badge 1: Longevity */}
              <div className="absolute -top-3 -right-2 sm:right-0 z-20 bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2.5 animate-float">
                <Clock className="w-4 h-4 text-amber-400" />
                <div className="text-right">
                  <div className="text-[11px] font-bold text-white">ثبات 24 ساعة</div>
                  <div className="text-[10px] text-slate-400">تركيز Extrait 35%</div>
                </div>
              </div>

              {/* Floating Badge 2: Natural Ingredients */}
              <div className="absolute -bottom-3 -left-2 sm:left-0 z-20 bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2.5 animate-float" style={{ animationDelay: '2s' }}>
                <Award className="w-4 h-4 text-emerald-400" />
                <div className="text-right">
                  <div className="text-[11px] font-bold text-white">زيوت نقية 100%</div>
                  <div className="text-[10px] text-slate-400">مستوردة من غراس وفرنسا</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
