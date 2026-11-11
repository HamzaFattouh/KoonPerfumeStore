import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { 
  Compass, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  ShoppingBag, 
  Star 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fireConfetti } from '../utils/confetti';

const QUESTIONS = [
  {
    id: 1,
    title: 'لمن تبحث عن العطر اليوم؟',
    subtitle: 'سنحدد الفئة العطرية الأكثر ملاءمة لطبيعة استخدامك',
    options: [
      { id: 'men', label: 'لي شخصياً (رجالي أنيق)', icon: '👔', category: 'men' },
      { id: 'women', label: 'لي شخصياً (نسائي ساحر)', icon: '🌸', category: 'women' },
      { id: 'unisex', label: 'عطر مشترك للجنسين', icon: '🪐', category: 'unisex' },
      { id: 'gift', label: 'هدية فاخرة لشخص عزيز', icon: '🎁', category: 'unisex' }
    ]
  },
  {
    id: 2,
    title: 'ما هو الطابع العطري الذي تفضله وتنجذب إليه؟',
    subtitle: 'الهالة والنوتات التي تترك انطباعك الخاص',
    options: [
      { id: 'oud', label: 'هيبة العود والزعفران والعنبر الشرقي الملكي', icon: '🪵', target: 'koon-absolute' },
      { id: 'vanilla', label: 'دفء الفانيليا المدخنة والكراميل والزهور', icon: '✨', target: 'nebula-vanilla' },
      { id: 'leather', label: 'غموض الجلود السوداء والتبغ والأخشاب', icon: '🖤', target: 'black-aurora' },
      { id: 'niche', label: 'تركيبة نيش نادرة وغير مكررة تخطف الأنفاس', icon: '💎', target: 'niche-supernova' }
    ]
  },
  {
    id: 3,
    title: 'في أي أوقات ومناسبات ترغب بارتداء العطر؟',
    subtitle: 'حتى نحدد التركيز المناسب وثبات العطر المطلوب',
    options: [
      { id: 'parties', label: 'المناسبات الكبرى، الأعراس والسهرات الفاخرة', icon: '👑' },
      { id: 'work', label: 'العمل، الاجتماعات الرسمية والإطلالات اليومية', icon: '💼' },
      { id: 'intimate', label: 'اللقاءات الخاصة والأمسيات الراقية', icon: '🌙' },
      { id: 'anytime', label: 'عطر توقيع يومي لجميع الفصول والأوقات', icon: '☀️' }
    ]
  },
  {
    id: 4,
    title: 'ما هي درجة الفوحان والثبات التي تبحث عنها؟',
    subtitle: 'معايير الانتشار والأثر العطري (Sillage)',
    options: [
      { id: 'intense', label: 'فوحان كوني صارخ يملأ المكان ويثبت لأيام (Extrait 35%)', icon: '⚡' },
      { id: 'moderate', label: 'هالة أرستقراطية أنيقة ومريحة لا تسبب أي إزعاج', icon: '🕊️' }
    ]
  }
];

const PerfumeQuiz = () => {
  const { addToCart, applyPromo } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matchedProduct, setMatchedProduct] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const handleSelectOption = (questionId, option) => {
    const updated = { ...answers, [questionId]: option };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate outcome
      calculateResult(updated);
    }
  };

  const calculateResult = (ans) => {
    setCalculating(true);
    setTimeout(() => {
      let chosenId = 'koon-absolute';
      if (ans[2]?.target) {
        chosenId = ans[2].target;
      } else if (ans[1]?.category === 'women') {
        chosenId = 'nebula-vanilla';
      } else if (ans[1]?.category === 'men') {
        chosenId = 'black-aurora';
      }

      const match = PRODUCTS.find(p => p.id === chosenId) || PRODUCTS[0];
      setMatchedProduct(match);
      setCalculating(false);

      // Trigger celebration
      try {
        fireConfetti();
      } catch (e) {}
    }, 1200);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setMatchedProduct(null);
  };

  const handleAddToCartWithDiscount = () => {
    if (matchedProduct) {
      applyPromo('KOON10');
      addToCart(matchedProduct, '100ml', 1);
    }
  };

  const q = QUESTIONS[currentStep];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Calculating Animation State */}
      {calculating ? (
        <div className="py-24 text-center space-y-6">
          <div className="w-20 h-20 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-2xl font-bold text-white">جاري تحليل تفضيلاتك الفلكية...</h2>
          <p className="text-xs text-slate-400">نقوم بمطابقة إجاباتك مع النوتات العطرية وقواعد التعتيق في دار كون</p>
        </div>
      ) : matchedProduct ? (
        
        /* Result State */
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 backdrop-blur-md shadow-2xl animate-fade-in">
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
              نتيجة المطابقة الفلكية: تطابق بنسبة 98% ✨
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              عطرك الكوني المثالي هو:
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800">
            <div className="aspect-square flex items-center justify-center bg-slate-900/40 rounded-xl p-4">
              <img 
                src={matchedProduct.images[0]} 
                alt={matchedProduct.name}
                className="max-h-64 object-contain rounded-xl hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-amber-400 font-semibold">{matchedProduct.scentFamily}</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">{matchedProduct.name}</h3>
                <p className="text-xs text-slate-400 font-serif tracking-widest uppercase">{matchedProduct.nameEn}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {matchedProduct.description}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-amber-400 font-mono">{matchedProduct.price} ر.س</span>
                <span className="text-xs bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/20">
                  كود الخصم الفوري KOON10 جاهز
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCartWithDiscount}
                  className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>أضف إلى السلة مع الخصم</span>
                </button>

                <Link
                  to={`/product/${matchedProduct.id}`}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 text-center transition"
                >
                  تفاصيل أكثر
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة الاختبار واكتشاف عطر آخر</span>
            </button>
          </div>
        </div>
      ) : (
        
        /* Question Step */
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-md shadow-2xl">
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <Compass className="w-4 h-4" />
                <span>مستكشف العطور الكوني</span>
              </span>
              <span>السؤال {currentStep + 1} من {QUESTIONS.length}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">{q.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400">{q.subtitle}</p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(q.id, option)}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-400/80 hover:bg-slate-800/60 text-right transition-all group flex items-start gap-4"
              >
                <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition shrink-0">
                  {option.icon}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                    {option.label}
                  </h4>
                </div>
              </button>
            ))}
          </div>

          {/* Back Button */}
          {currentStep > 0 && (
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>السؤال السابق</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerfumeQuiz;
