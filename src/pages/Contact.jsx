import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Contact = () => {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'استفسار عن عطر',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('تم إرسال رسالتك بنجاح! سيتواصل معك مستشار العطور قريباً ✨', 'success');
    setFormData({ name: '', email: '', phone: '', subject: 'استفسار عن عطر', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>خدمة عملاء كون الملكية</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          يسعدنا تواصلك واستقبال استفساراتك
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          فريق مستشاري العطور لدينا متواجد يومياً لتقديم المشورة ومساعدتك في اختيار العطر المناسب أو متابعة طلباتك.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Information & Channels */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6 backdrop-blur-sm">
            <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
              قنوات الاتصال المباشرة
            </h3>

            <div className="space-y-4 text-xs">
              <a 
                href="https://wa.me/966501234567" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition group"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-300 text-sm">محادثة واتساب فورية</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">رد فوري خلال دقائق معدودة</div>
                </div>
              </a>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">الرقم الموحد / الهاتف</div>
                  <div className="text-slate-400 font-mono mt-0.5" dir="ltr">+966 50 123 4567</div>
                  <div className="text-[10px] text-slate-500">يومياً من 9:00 ص - 11:00 م</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">البريد الإلكتروني للشكاوى والاستفسارات</div>
                  <div className="text-slate-400 mt-0.5">care@koonperfume.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">معرض واستوديو العطور</div>
                  <div className="text-slate-400 mt-0.5">المملكة العربية السعودية، الرياض - طريق التخصصي</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-2">أرسل لنا رسالة</h3>
            <p className="text-xs text-slate-400 mb-6">
              املأ البيانات التالية وسيتولى فريق العناية بالعملاء التواصل معك في أسرع وقت.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-slate-950/60 border border-emerald-500/30 rounded-2xl space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">تم استلام رسالتك بنجاح</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  شكراً لتواصلك مع كون بيرفيوم. سنقوم بالرد عليك عبر البريد أو الواتساب في غضون 60 دقيقة.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-700"
                >
                  إرسال استفسار آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">الاسم بالكامل *</label>
                    <input
                      type="text"
                      required
                      placeholder="اسمك الكريم..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">رقم الجوال *</label>
                    <input
                      type="tel"
                      required
                      placeholder="05XXXXXXXX"
                      dir="ltr"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">موضوع الرسالة *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="استفسار عن عطر">استفسار واختيار عطر</option>
                      <option value="متابعة شحنة وطلب">متابعة شحنة أو طلب</option>
                      <option value="طلب هدايا شركات وتوزيعات">طلب هدايا شركات وتوزيعات</option>
                      <option value="اقتراح أو ملاحظة">اقتراح أو ملاحظة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">نص الرسالة أو الاستفسار *</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="اكتب استفسارك بالتفصيل..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span>إرسال الرسالة</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

