import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Truck, RotateCcw, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    category: 'authenticity',
    title: 'أصالة العطور والمكونات',
    items: [
      {
        q: 'هل عطور كون بيرفيوم أصلية 100%؟',
        a: 'نعم، بكل تأكيد. جميع عطورنا مصنعة من زيوت عطرية نيش طبيعية ومستوردة من مزارع غراس بفرنسا وغابات كمبوديا ومزارع الورد الطائفي، ومطابقة للمواصفات والمقاييس السعودية (SASO) وهيئة الغذاء والدواء.'
      },
      {
        q: 'ما هو تركيز الزيوت العطرية في عطوركم؟',
        a: 'نعتمد تركيز Extrait de Parfum بنسبة تصل إلى 35% وPure Parfum حتى 40%، وهو أعلى تصنيف في عالم العطور، مما يمنح العطر ثباتاً يتجاوز 18 إلى 24 ساعة وفوحاناً جذاباً دون حدة كحولية.'
      },
      {
        q: 'هل العطور آمنة على الجلد والملابس؟',
        a: 'نعم، جميع التركيبات خالية من المواد الكيميائية الضارة أو مسببات الحساسية المعروفة، وتمت صياغتها وفق أرقى المعايير العالمية لتكون آمنة على البشرة وثابتة على الأقمشة دون ترك بقع زيتية.'
      }
    ]
  },
  {
    category: 'shipping',
    title: 'الشحن والتوصيل',
    items: [
      {
        q: 'كم يستغرق توصيل الطلب؟',
        a: 'يستغرق التوصيل داخل مدينة الرياض من 24 إلى 48 ساعة عمل. ولباقي مدن ومحافظات المملكة والخليج من 2 إلى 4 أيام عمل عبر سيارات شحن مبردة خصيصاً لحماية العطور.'
      },
      {
        q: 'هل يتوفر شحن مجاني؟',
        a: 'نعم! نقدم شحناً مجانياً لكافة مناطق المملكة عند وصول قيمة سلتك إلى 350 ر.س فما فوق.'
      },
      {
        q: 'كيف تضمنون سلامة العطر أثناء الشحن؟',
        a: 'توضع الزجاجات داخل صناديق كون الفلكية المبطنة برغوة تمتص الصدمات، كما تُشحن في شاحنات مجهزة بدرجات حرارة ثابتة تتراوح بين 18-22 درجة مئوية للحفاظ على الزيوت من التلف.'
      }
    ]
  },
  {
    category: 'returns',
    title: 'الضمان الذهبي والاسترجاع',
    items: [
      {
        q: 'ما هو "الضمان الذهبي" لكون بيرفيوم؟',
        a: 'نرفق مع كل زجاجة عطر تطلبها عينة تجربة مجانية سعة 3 مل. نتيح لك تجربة العينة أولاً قبل فتح كرتون العطر الأصلي. إذا لم يناسبك العطر، يمكنك استرجاعه واسترداد كامل المبلغ دون أي رسوم إضافية خلال 7 أيام من الاستلام.'
      },
      {
        q: 'كيف أقدم طلب استرجاع أو استبدال؟',
        a: 'كل ما عليك هو مراسلتنا عبر الواتساب أو البريد الإلكتروني مع رقم الطلب، وسيقوم مندوبنا باستلام العطر من باب منزلك.'
      }
    ]
  },
  {
    category: 'care',
    title: 'نصائح لحفظ العطر وزيادة فوحانه',
    items: [
      {
        q: 'أين هو المكان الأفضل لحفظ العطور؟',
        a: 'احفظ عطورك دائماً في مكان جاف ومظلم بعيداً عن أشعة الشمس المباشرة وحرارة الصيف (تجنب ترك العطر في السيارة أو في الحمام).'
      },
      {
        q: 'أين يجب رش العطر لأطول ثبات؟',
        a: 'يفضل الرش على نقاط النبض الدافئة: خلف شحمة الأذن، على المعصمين، والرقبة، وعلى الأكتاف من مسافة 15 إلى 20 سم.'
      }
    ]
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState('authenticity-0');

  const toggle = (key) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>مركز المساعدة والضمان</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          الأسئلة الشائعة وسياسات المتجر
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          كل ما تحتاج معرفته عن جودة عطور كون، الشحن المبرد، والضمان الذهبي لحماية مشترياتك.
        </p>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-8">
        {FAQS.map((sec) => (
          <div key={sec.category} id={sec.category} className="space-y-4">
            <h3 className="text-base font-bold text-amber-400 pb-2 border-b border-slate-800">
              {sec.title}
            </h3>

            <div className="space-y-3">
              {sec.items.map((item, idx) => {
                const itemKey = `${sec.category}-${idx}`;
                const isOpen = openIndex === itemKey;
                return (
                  <div
                    key={idx}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm transition"
                  >
                    <button
                      onClick={() => toggle(itemKey)}
                      className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-amber-300 transition"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-amber-400' : ''
                      }`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still need help CTA */}
      <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
        <h4 className="text-base font-bold text-white">لديك استفسار لم تجد إجابته هنا؟</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          فريق الدعم الفني ومستشارو العطور في كون متواجدون لمساعدتك عبر الواتساب مباشرة.
        </p>
        <Link
          to="/contact"
          className="inline-block px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
        >
          تواصل معنا الآن
        </Link>
      </div>
    </div>
  );
};

export default FAQ;

