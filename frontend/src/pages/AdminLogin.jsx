import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin, verifyAdminSession } from '../services/adminService';
import { useLanguage } from '../context/LanguageContext';
import { 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Eye, 
  EyeOff, 
  ShieldCheck,
  AlertCircle,
  Globe
} from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const at = t.admin || {};

  const [email, setEmail] = useState('admin@koonperfume.com');
  const [password, setPassword] = useState('KoonAdmin2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect immediately
  useEffect(() => {
    verifyAdminSession().then(isAuth => {
      if (isAuth) navigate('/admin');
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const result = await adminLogin(email, password, rememberMe);
      if (result.success) {
        navigate('/admin');
      } else {
        setErrorMessage(result.message || 'بيانات الدخول غير صحيحة.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'حدث خطأ في الاتصال بالخادم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] flex flex-col justify-center items-center px-4 relative overflow-hidden py-12 select-none">
      
      {/* Cosmic background glows */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar with Language Switch & Return to Store */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 z-10">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition"
        >
          {language === 'he' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{language === 'he' ? 'חזרה לחנות' : 'العودة للمتجر'}</span>
        </Link>

        <button
          onClick={() => setLanguage(language === 'ar' ? 'he' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-300 hover:text-amber-300 transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ar' ? 'עברית' : 'العربية'}</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800/90 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80 z-10 space-y-6">
        
        {/* Emblem & Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-indigo-600/20 border border-amber-500/30 flex items-center justify-center p-2.5 shadow-lg shadow-amber-500/10">
            <img 
              src="/koon_emblem_hq.webp" 
              alt="Koon Logo" 
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">
              {at.loginTitle || 'تسجيل دخول إدارة دار كون للعطور'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {at.loginSubtitle || 'الرجاء إدخال بيانات المشرف للوصول إلى لوحة التحكم'}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {at.email || 'البريد الإلكتروني للإدارة'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@koonperfume.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {at.password || 'كلمة المرور'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-10 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3.5 left-3 text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <span>تذكرني على هذا الجهاز</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{at.loginBtn || 'دخول لوحة الإدارة 🪐'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-[11px] text-slate-500">
            دار كون للعطور الفلكية • نظام إدارة المتجر الآمن 2026
          </p>
        </div>

      </div>

    </div>
  );
};

export default AdminLogin;

