import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award, 
  Phone, 
  Mail, 
  MapPin 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Footer = () => {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast('شكراً لاشتراكك! كود الخصم كوني الخاص بك: WELCOME15', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/80 text-slate-300 pt-16 pb-12 overflow-hidden z-10">
      
      {/* Guarantees Highlight Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">عطور أصلية 100%</h4>
              <p className="text-xs text-slate-400">زيوت عطرية أوروبية نيش فاخرة</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">شحن مبرد وسريع</h4>
              <p className="text-xs text-slate-400">مجاناً للطلبات فوق 350 ر.س</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-rose-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">ضمان ذهبي للاستبدال</h4>
              <p className="text-xs text-slate-400">عينات مجانية لتجربة العطر أولاً</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">متجر موثق رسمياً</h4>
              <p className="text-xs text-slate-400">سجل تجاري ومعتمد في معروف</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/koon-logo.jpg" 
                alt="كون بيرفيوم" 
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-700/80 shadow-lg shadow-amber-500/10" 
              />
              <div>
                <h3 className="text-2xl font-black text-white">كون بيرفيوم</h3>
                <span className="text-xs font-serif text-slate-400 tracking-[0.2em] uppercase">KOON PERFUME</span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              دار عطور فاخرة تستلهم نفحاتها الاستثنائية من مدارات وأبعاد الفضاء السحيق. نقدم تركيبات عطرية نيش معتقة بمكونات نقية صممت لتدوم طويلاً وتمنحك حضوراً أسطورياً كالكواكب.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>المملكة العربية السعودية - الرياض، طريق التخصصي</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span dir="ltr">+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>care@koonperfume.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop" className="hover:text-amber-400 transition">جميع العطور</Link></li>
              <li><Link to="/shop?filter=bestseller" className="hover:text-amber-400 transition">العطور الأكثر طلباً</Link></li>
              <li><Link to="/shop?category=niche" className="hover:text-amber-400 transition">عطور النيش الخاصة</Link></li>
              <li><Link to="/quiz" className="hover:text-amber-400 transition">مستكشف العطر الكوني (Quiz)</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition">عن كون بيرفيوم</Link></li>
              <li><Link to="/track-order" className="hover:text-amber-400 transition">تتبع حالة شحنتك</Link></li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">خدمة العملاء</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/faq" className="hover:text-amber-400 transition">الأسئلة الشائعة</Link></li>
              <li><Link to="/faq#shipping" className="hover:text-amber-400 transition">سياسة الشحن والتوصيل</Link></li>
              <li><Link to="/faq#returns" className="hover:text-amber-400 transition">سياسة الاستبدال والضمان الذهبي</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition">تواصل مع خدمة العملاء</Link></li>
              <li><Link to="/faq#care" className="hover:text-amber-400 transition">نصائح لحفظ العطور وثباتها</Link></li>
              <li><Link to="/profile" className="hover:text-amber-400 transition">حسابي وقائمة طلباتي</Link></li>
            </ul>
          </div>

          {/* Exclusive Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">نادي كون الحصري</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              انضم لعشاق العطور الراقية واحصل على <strong>خصم 15%</strong> على أول طلب وإشعارات فورية بالإصدارات المحدودة.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="بريدك الإلكتروني..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="absolute left-1.5 top-1.5 p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition"
                  aria-label="اشتراك"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  تم اشتراكك بنجاح! كودك: WELCOME15
                </div>
              )}
            </form>

            <div className="pt-2">
              <span className="text-[11px] text-slate-500 block mb-1.5">طرق الدفع والتقسيط المعتمدة:</span>
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-semibold">
                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">مدى Mada</span>
                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Apple Pay</span>
                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Visa / Mastercard</span>
                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">تمارا Tamara</span>
                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">تابي Tabby</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} كون بيرفيوم (Koon Perfume). جميع الحقوق محفوظة.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>سجل تجاري: 1010892741</span>
            <span>•</span>
            <span>الرقم الضريبي: 31089274100003</span>
            <span>•</span>
            <span className="text-amber-400/90 font-medium">موثق في المركز السعودي للأعمال</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

