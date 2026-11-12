import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  Compass, 
  Truck, 
  PhoneCall, 
  User, 
  ChevronDown,
  Globe
} from 'lucide-react';
import { getProducts } from '../../services/productService';

const Navbar = () => {
  const { cartCount, wishlist, setIsCartOpen, setQuickViewProduct } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  // Load products from DB for live search
  useEffect(() => {
    let isMounted = true;
    getProducts().then(data => {
      if (isMounted) setAllProducts(data || []);
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // On Home page, navbar appears when scrolled past the opening video (> 80px)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Filtered search products directly from Database
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : allProducts.filter(p => 
        (p.name && p.name.includes(searchQuery)) || 
        (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.scentFamily && p.scentFamily.includes(searchQuery)) ||
        (p.categoryName && p.categoryName.includes(searchQuery))
      );

  const handleSearchResultClick = (productId) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/shop', label: t.nav.shop },
    { to: '/shop?filter=bestseller', label: t.nav.bestsellers },
    { to: '/quiz', label: t.nav.quiz },
    { to: '/about', label: t.nav.about },
    { to: '/track-order', label: t.nav.track },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <>
      {/* Fixed Navbar Container: hidden during full-screen video, slides in on scroll */}
      <div className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ease-in-out ${
        isHome && !scrolled
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto shadow-2xl'
      }`}>
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/20 text-xs py-2 px-4 text-center text-slate-300 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{t.announcement}</span>
          </div>
        </div>

        {/* Main Navbar Header */}
        <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 py-2.5 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              
              {/* Logo and Brand */}
              <Link to="/" className="flex items-center gap-3 group shrink-0">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-700/80 group-hover:border-amber-400/80 transition-all shadow-md group-hover:shadow-amber-500/20">
                  <img 
                    src="/koon-logo.jpg" 
                    alt="Koon Perfume Logo" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-wide text-white group-hover:text-amber-400 transition">
                    {t.brandName}
                  </span>
                  <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-200 transition">
                    {t.brandSub}
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => `text-sm font-medium transition-colors hover:text-amber-400 relative py-1 ${
                      isActive ? 'text-amber-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              {/* Actions: Language Switcher, Search, Wishlist, Cart, Profile */}
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* 🌐 Two Language Switcher Buttons (عربي / עברית) */}
                <div className="flex items-center p-1 bg-slate-900/90 border border-slate-700/80 rounded-xl gap-1 backdrop-blur-md shadow-inner">
                  {/* Arabic Button (زر اللغة العربية) */}
                  <button
                    type="button"
                    onClick={() => setLanguage('ar')}
                    className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                      language === 'ar'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30 border border-amber-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                    title="اللغة العربية (Arabic)"
                    aria-label="اللغة العربية"
                  >
                    {/* Arabic Letter Emblem Badge */}
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black leading-none ${
                      language === 'ar' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      ع
                    </span>
                    <span className="hidden sm:inline">عربي</span>
                  </button>

                  {/* Hebrew Button (زر اللغة العبرية) */}
                  <button
                    type="button"
                    onClick={() => setLanguage('he')}
                    className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                      language === 'he'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30 border border-amber-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                    title="עברית (Hebrew)"
                    aria-label="עברית"
                  >
                    {/* Hebrew Letter Emblem Badge */}
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black leading-none ${
                      language === 'he' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      ע
                    </span>
                    <span className="hidden sm:inline">עברית</span>
                  </button>
                </div>

                {/* Search Toggle */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 sm:p-2.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 rounded-xl transition cursor-pointer"
                  title={t.actions.search}
                  aria-label={t.actions.search}
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Wishlist Link */}
                <Link
                  to="/wishlist"
                  className="relative p-2 sm:p-2.5 text-slate-300 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition"
                  title={t.actions.wishlist}
                  aria-label={t.actions.wishlist}
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-up">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="p-2 sm:p-2.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 rounded-xl transition hidden sm:flex"
                  title={t.nav.profile}
                  aria-label={t.nav.profile}
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Cart Drawer Trigger */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-2.5 px-3 sm:px-3.5 py-2 bg-gradient-to-r from-amber-500/15 to-amber-600/25 hover:from-amber-500/25 hover:to-amber-600/35 border border-amber-500/40 text-amber-300 rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
                  aria-label={t.actions.cartTitle}
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold hidden md:inline">{t.nav.cart}</span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
                  aria-label="القائمة"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fade-in">
          <div 
            className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-amber-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.actions.searchPlaceholder}
                aria-label={t.actions.search}
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  aria-label="مسح نص البحث"
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
                >
                  مسح
                </button>
              )}
              <button 
                onClick={() => setSearchOpen(false)}
                aria-label="إغلاق نافذة البحث"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-4">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <Sparkles className="w-8 h-8 text-amber-400/50 mx-auto" />
                  <p className="text-sm">اكتب كلمة البحث لاستكشاف العطور الفاخرة</p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {['كون أبسولوت', 'سديم الفانيليا', 'الشفق الأسود', 'سوبرنوفا نيش', 'عود', 'عنبر'].map((sug) => (
                      <button
                        key={sug}
                        onClick={() => setSearchQuery(sug)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full border border-slate-700 transition"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">لم يتم العثور على نتائج تطابق "{searchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 mb-2 font-medium">
                    تم العثور على {searchResults.length} عطور:
                  </div>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSearchResultClick(product.id)}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/90 border border-slate-700/40 hover:border-amber-500/40 cursor-pointer transition"
                    >
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-slate-950 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                          <span className="text-sm font-mono font-bold text-amber-400">{product.price} {t.currency}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span>{product.nameEn}</span>
                          <span>•</span>
                          <span className="text-amber-400/80">{product.scentFamily}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-slate-950 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl text-slate-100">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <img src="/koon-logo.jpg" alt="Logo" className="w-10 h-10 rounded-full object-cover border border-amber-400/40" />
                  <div>
                    <h3 className="font-bold text-white text-base">{t.brandName}</h3>
                    <span className="text-[10px] text-slate-400 font-serif tracking-widest">{t.brandSub}</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="إغلاق القائمة الجانبية"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Language Switcher inside Mobile Drawer */}
              <div className="py-4 border-b border-slate-800">
                <span className="text-xs text-slate-400 block mb-2 font-semibold">اختر اللغة / בחר שפה:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('ar')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      language === 'ar'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/25'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center text-[10px] font-black">ع</span>
                    <span>عربي</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLanguage('he')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      language === 'he'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/25'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center text-[10px] font-black">ע</span>
                    <span>עברית</span>
                  </button>
                </div>
              </div>

              {/* Links */}
              <nav className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-semibold transition ${
                      isActive 
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition"
                >
                  {t.nav.profile}
                </NavLink>
                <NavLink
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition"
                >
                  {t.nav.faq}
                </NavLink>
              </nav>
            </div>

            {/* Bottom contact info */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <a 
                href="https://wa.me/966500000000" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold hover:bg-emerald-600/30 transition"
              >
                تواصل عبر واتساب مباشر
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
