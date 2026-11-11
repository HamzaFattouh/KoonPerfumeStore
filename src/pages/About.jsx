import React from 'react';
import { Sparkles, Award, ShieldCheck, Heart, Droplets, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-slate-900/60 border border-slate-800 p-8 sm:p-16 overflow-hidden text-center backdrop-blur-md">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>حكاية الدار وتاريخ التأسيس</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            حكاية <span className="text-gold-gradient">كون بيرفيوم</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            في سكون ليالي الصحراء، وتحت قبة سماء لا متناهية تلتمع فيها ملايين النجوم، ولدت فكرة <strong className="text-white">"كون"</strong>. أن نصنع عطراً لا يكتفي بإسعاد الحواس، بل ينقلك إلى مدارات أخرى تفوق الخيال.
          </p>
        </div>
      </div>

      {/* Brand Identity & Logo Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-square max-w-md mx-auto bg-slate-950 rounded-3xl border border-slate-800 p-8 flex items-center justify-center shadow-2xl">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <img 
            src="/koon-logo.jpg" 
            alt="شعار كون بيرفيوم" 
            className="w-72 h-72 object-contain rounded-2xl shadow-inner relative z-10 hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="space-y-6">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">فلسفة الشعار والاسم</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            لماذا اخترنا اسم "كون"؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            الكون هو رمز الاتساع، الجاذبية، والغموض الآسر. كما تنجذب الأجرام السماوية نحو مداراتها بدقة متناهية، صممنا عطورنا لتخلق حول مرتديها هالة جاذبية كوكبية تسبق حضوره وتخلد في ذاكرة من حوله.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            حرف <strong className="text-amber-400 font-bold">الواو</strong> في شعارنا صُمم على هيئة كوكب محاط بحلقات مدارية، تجسيداً لدورة التعتيق العطري التي تستمر لأشهر حتى تبلغ الزيوت قمة نضجها وتجانسها.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-xl font-bold text-amber-400 block font-mono">100%</span>
              <span className="text-xs text-slate-300">مستخلصات طبيعية معتقة</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-xl font-bold text-amber-400 block font-mono">35%</span>
              <span className="text-xs text-slate-300">تركيز Extrait نقي وثابت</span>
            </div>
          </div>
        </div>
      </div>

      {/* Craftsmanship & Standards */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">معايير الدار في صناعة العطور</h2>
          <p className="text-xs text-slate-400 mt-2">لا نساوم على الجودة أو النقاء في أي قطرة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Droplets className="w-8 h-8 text-amber-400" />
            <h3 className="text-base font-bold text-white">انتقاء المكونات النادرة</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              نسافر إلى غابات كمبوديا لجلب أندر أنواع العود، ونستورد الزعفران من كشمير، والورد من مزارع الطائف وغراس الفرنسية لنضمن تفرداً لا مثيل له.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Award className="w-8 h-8 text-indigo-400" />
            <h3 className="text-base font-bold text-white">تعتيق بطيء ومتقن</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تترك التركيبات لتتفاعل وتتعتّق لأشهر طويلة في درجات حرارة محكومة، مما يزيل حدة المذيبات الكحولية ويجعل الرائحة ناعمة ومريحة للأنف.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h3 className="text-base font-bold text-white">الضمان الكوني الذهبي</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              نثق بجودة عطورنا وثباتها؛ لذلك نرفق مع كل طلب عينة مجانية لتجربة العطر بهدوء، مع إمكانية استرجاعه مجاناً في حال لم يطابق توقعاتك.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xl shadow-amber-500/20 transition"
        >
          <span>تصفح العطور الآن</span>
          <Compass className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default About;

