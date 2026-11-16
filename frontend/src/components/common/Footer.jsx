import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
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
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { showToast } = useCart();
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast(
        language === 'ar'
          ? 'شكراً لاشتراكك! كود الخصم الخاص بك: WELCOME15'
          : 'תודה על ההרשמה! קוד הקופון שלך: WELCOME15',
        'success'
      );
      setEmail('');
    }
  };

  return (
    <footer
      className={`relative border-t pt-16 pb-12 overflow-hidden z-10 transition-colors duration-500 ${
        isDark
          ? 'bg-[#111111] border-[#C5A36A]/20 text-[#F5F0E8]/80'
          : 'bg-[#E9DECC] border-[#A98750]/25 text-[#29231D]/85'
      }`}
    >
      {/* Guarantees Highlight Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl border backdrop-blur-md ${
            isDark ? 'bg-[#1D1D1D] border-[#C5A36A]/20' : 'bg-[#FFFFFF] border-[#A98750]/25'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-[#C5A36A]/15 border-[#C5A36A]/30 text-[#C5A36A]'
                  : 'bg-[#F3EBDD] border-[#A98750]/35 text-[#A98750]'
              }`}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'}`}>
                {language === 'ar' ? 'عطور أصلية 100%' : '100% בשמים מקוריים'}
              </h4>
              <p className="text-xs opacity-70">
                {language === 'ar' ? 'زيوت عطرية أوروبية نيش فاخرة' : 'שמני בושם אירופיים יוקרתיים'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-[#C5A36A]/15 border-[#C5A36A]/30 text-[#C5A36A]'
                  : 'bg-[#F3EBDD] border-[#A98750]/35 text-[#A98750]'
              }`}
            >
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'}`}>
                {language === 'ar' ? 'شحن مبرد وسريع' : 'משלוח מבוקר ומהיר'}
              </h4>
              <p className="text-xs opacity-70">
                {language === 'ar' ? 'مجاناً للطلبات فوق 350 ر.س' : 'חינם בהזמנות מעל 350 ₪'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-[#C5A36A]/15 border-[#C5A36A]/30 text-[#C5A36A]'
                  : 'bg-[#F3EBDD] border-[#A98750]/35 text-[#A98750]'
              }`}
            >
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'}`}>
                {language === 'ar' ? 'ضمان ذهبي للاستبدال' : 'אחריות זהב להחלפה'}
              </h4>
              <p className="text-xs opacity-70">
                {language === 'ar' ? 'عينات مجانية لتجربة العطر أولاً' : 'דוגמיות חינם להתנסות'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-[#C5A36A]/15 border-[#C5A36A]/30 text-[#C5A36A]'
                  : 'bg-[#F3EBDD] border-[#A98750]/35 text-[#A98750]'
              }`}
            >
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'}`}>
                {language === 'ar' ? 'دار عطور معتمدة' : 'בית בישום רשמי'}
              </h4>
              <p className="text-xs opacity-70">KAWN PERFUME</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b ${
            isDark ? 'border-[#222222]' : 'border-[#A98750]/25'
          }`}
        >
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/koon-logo.jpg"
                alt="KAWN PERFUME"
                className={`w-14 h-14 rounded-full object-cover border-2 shadow-lg ${
                  isDark ? 'border-[#C5A36A]/50' : 'border-[#A98750]/60'
                }`}
              />
              <div>
                <h3 className={`text-2xl font-black ${isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'}`}>
                  {t.brandName}
                </h3>
                <span
                  className={`text-xs font-serif tracking-[0.2em] uppercase block ${
                    isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'
                  }`}
                >
                  {t.brandSub} · A Universe of Fragrance.
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed max-w-sm opacity-80">
              {language === 'ar'
                ? 'دار عطور عالمية فاخرة تقدم تركيبات نيش معتقة بمكونات نقية صممت لتدوم طويلاً وتمنحك حضوراً ملكياً استثنائياً.'
                : 'בית בישום בינלאומי יוקרתי המציע תמציות נישה מיושנות מרכיבים טהורים לנוכחות מלכותית בלתי נשכחת.'}
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}`} />
                <span>
                  {language === 'ar'
                    ? 'المملكة العربية السعودية - الرياض، طريق التخصصي'
                    : 'ערב הסעודית - ריאד'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}`} />
                <span dir="ltr">+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}`} />
                <span>care@kawnperfume.com</span>
              </div>
            </div>

            {/* Official Social Media Channels (إنستغرام، فيسبوك، واتساب) */}
            <div className="pt-2">
              <span className={`text-[11px] font-bold block mb-2 ${isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}`}>
                {language === 'ar' ? 'قنوات التواصل الرسمية:' : 'ערוצי תקשורת רשמיים:'}
              </span>
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
                <a
                  href="https://instagram.com/koonperfume"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold transition shrink-0 hover:scale-105"
                >
                  <span>📸 Instagram</span>
                </a>
                <a
                  href="https://facebook.com/koonperfume"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-bold transition shrink-0 hover:scale-105"
                >
                  <span>🌐 Facebook</span>
                </a>
                <a
                  href="https://wa.me/966501234567"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold transition shrink-0 hover:scale-105"
                >
                  <span>💬 WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'}`}>
              {language === 'ar' ? 'روابط سريعة' : 'קישורים מהירים'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:underline">{t.nav.home}</Link></li>
              <li><Link to="/shop" className="hover:underline">{t.nav.shop}</Link></li>
              <li><Link to="/#collections-section" className="hover:underline">{t.nav.collections}</Link></li>
              <li><Link to="/quiz" className="hover:underline">{t.nav.quiz}</Link></li>
              <li><Link to="/about" className="hover:underline">{t.nav.about}</Link></li>
              <li><Link to="/track-order" className="hover:underline">{t.nav.track}</Link></li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-3">
            <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'}`}>
              {language === 'ar' ? 'خدمة العملاء' : 'שירות לקוחות'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/faq" className="hover:underline">{t.nav.faq}</Link></li>
              <li><Link to="/contact" className="hover:underline">{t.nav.contact}</Link></li>
              <li><Link to="/profile" className="hover:underline">{t.nav.profile}</Link></li>
            </ul>
          </div>

          {/* Exclusive Newsletter */}
          <div className="space-y-3">
            <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'}`}>
              {language === 'ar' ? 'نادي كون الحصري' : 'מועדון הלקוחות של קון'}
            </h4>
            <p className="text-xs opacity-80 leading-relaxed">
              {language === 'ar'
                ? 'انضم لعشاق العطور الراقية واحصل على خصم 15% على أول طلب وإشعارات بالإصدارات المحدودة.'
                : 'הצטרף למועדון וקבל 15% הנחה על ההזמנה הראשונה ועדכונים על מהדורות מוגבלות.'}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder={language === 'ar' ? 'بريدك الإلكتروني...' : 'האימייל שלך...'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none ${
                    isDark
                      ? 'bg-[#1D1D1D] border-[#C5A36A]/30 text-[#F5F0E8]'
                      : 'bg-[#FFFFFF] border-[#A98750]/40 text-[#29231D]'
                  }`}
                />
                <button
                  type="submit"
                  className={`keep-white-text absolute end-1.5 top-1.5 p-1.5 rounded-lg transition cursor-pointer ${
                    isDark ? 'bg-[#C5A36A] text-[#111111]' : 'bg-[#A98750] text-[#FFFFFF]'
                  }`}
                  aria-label="اشتراك"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تم اشتراكك! كودك: WELCOME15' : 'נרשמת בהצלחה! קוד: WELCOME15'}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-75">
          <div className="flex items-center gap-2">
            <span>
              © {new Date().getFullYear()} {t.brandName} ({t.brandSub}).{' '}
              {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'כל הזכויות שמורות.'}
            </span>
            <span>•</span>
            <Link to="/admin" className="hover:underline font-mono">
              {t.nav.admin} 🪐
            </Link>
          </div>

          <div className="font-serif tracking-widest uppercase text-[11px]">
            KAWN PERFUME · A UNIVERSE OF FRAGRANCE
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
