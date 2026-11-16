import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  User,
  Globe,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { getProducts } from '../../services/productService';

const Navbar = () => {
  const { cartCount, wishlist, setIsCartOpen } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close language dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langDropdownOpen]);

  // Load products from DB for live search
  useEffect(() => {
    let isMounted = true;
    getProducts()
      .then((data) => {
        if (isMounted) setAllProducts(data || []);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Focus search input when open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Filtered search products directly from Database
  const searchResults =
    searchQuery.trim() === ''
      ? []
      : allProducts.filter(
          (p) =>
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

  const handleCollectionsClick = (e) => {
    if (location.pathname === '/') {
      const el = document.getElementById('collections-section') || document.getElementById('products-showcase');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/shop', label: t.nav.shop },
    { to: '/#collections-section', label: t.nav.collections || (language === 'ar' ? 'المجموعات' : 'קולקציות'), isAnchor: true },
    { to: '/quiz', label: t.nav.quiz },
    { to: '/about', label: t.nav.about },
    { to: '/track-order', label: t.nav.track },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <>
      {/* Fixed Navbar Container */}
      <div className="fixed top-0 inset-x-0 z-40 transition-all duration-500 ease-in-out shadow-xl">
        {/* Top Announcement Bar */}
        <div
          className={`border-b text-xs py-2 px-4 text-center flex items-center justify-center gap-4 transition-colors duration-500 ${
            isDark
              ? 'bg-[#111111] border-[#C5A36A]/25 text-[#F5F0E8]/90'
              : 'bg-[#E9DECC] border-[#A98750]/30 text-[#29231D]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className={`w-3.5 h-3.5 animate-pulse ${isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}`} />
            <span className="font-medium">{t.announcement}</span>
          </div>
        </div>

        {/* Main Navbar Header */}
        <header
          className={`backdrop-blur-md border-b py-2.5 transition-colors duration-500 ${
            isDark
              ? 'bg-[#111111]/95 border-[#C5A36A]/20 text-[#F5F0E8]'
              : 'bg-[#F3EBDD]/95 border-[#A98750]/25 text-[#29231D]'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              {/* Brand Identity: KAWN PERFUME | كون بيرفيوم */}
              <Link to="/" className="flex items-center gap-3 group shrink-0">
                <div
                  className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 transition-all shadow-md shrink-0 ${
                    isDark
                      ? 'border-[#C5A36A]/50 group-hover:border-[#C5A36A]'
                      : 'border-[#A98750]/60 group-hover:border-[#A98750]'
                  }`}
                >
                  <img
                    src="/koon-logo.jpg"
                    alt="KAWN PERFUME Logo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="hidden xl:flex flex-col">
                  <span
                    className={`text-lg font-black tracking-wide transition leading-tight ${
                      isDark ? 'text-[#F5F0E8] group-hover:text-[#C5A36A]' : 'text-[#29231D] group-hover:text-[#A98750]'
                    }`}
                  >
                    {t.brandName}
                  </span>
                  <span
                    className={`text-[10px] font-serif uppercase tracking-[0.22em] transition ${
                      isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'
                    }`}
                  >
                    {t.brandSub} · {t.brandTagline || 'A Universe of Fragrance.'}
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 whitespace-nowrap">
                {navLinks.map((link) =>
                  link.isAnchor ? (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={handleCollectionsClick}
                      className={`text-xs xl:text-sm font-medium transition-colors relative py-1 whitespace-nowrap shrink-0 ${
                        isDark ? 'text-[#F5F0E8]/85 hover:text-[#C5A36A]' : 'text-[#29231D]/85 hover:text-[#A98750]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `text-xs xl:text-sm font-medium transition-colors relative py-1 whitespace-nowrap shrink-0 ${
                          isActive
                            ? isDark
                              ? 'text-[#C5A36A] font-bold'
                              : 'text-[#A98750] font-bold'
                            : isDark
                            ? 'text-[#F5F0E8]/85 hover:text-[#C5A36A]'
                            : 'text-[#29231D]/85 hover:text-[#A98750]'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                )}
              </nav>

              {/* Actions: Theme Toggle, Language Switcher, Search, Wishlist, Cart, Profile */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                {/* 🌗 Dual Theme Toggle (Dark Mode #111111 <-> Light Mode #F3EBDD) */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 cursor-pointer relative flex items-center gap-1.5 border ${
                    isDark
                      ? 'bg-[#1D1D1D] text-[#C5A36A] border-[#C5A36A]/35 hover:border-[#C5A36A] hover:bg-[#222222]'
                      : 'bg-[#E9DECC] text-[#29231D] border-[#A98750]/40 hover:border-[#A98750] hover:bg-[#FFFFFF]'
                  }`}
                  title={isDark ? t.theme?.light || 'الوضع النهاري' : t.theme?.dark || 'الوضع الداكن'}
                  aria-label={t.theme?.toggle || 'تبديل المظهر'}
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A36A] transition-transform duration-300 hover:rotate-45" />
                  ) : (
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-[#A98750] transition-transform duration-300 hover:-rotate-12" />
                  )}
                </button>

                {/* 🌐 Globe Language Switcher with Native Scripts (العربية / עברית) */}
                <div ref={langDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setLangDropdownOpen((prev) => !prev)}
                    className={`p-2 sm:p-2.5 rounded-xl transition cursor-pointer relative flex items-center justify-center group border ${
                      langDropdownOpen
                        ? isDark
                          ? 'bg-[#222222] text-[#C5A36A] border-[#C5A36A]'
                          : 'bg-[#FFFFFF] text-[#A98750] border-[#A98750]'
                        : isDark
                        ? 'bg-[#1D1D1D] text-[#F5F0E8] border-[#C5A36A]/30 hover:border-[#C5A36A]'
                        : 'bg-[#E9DECC] text-[#29231D] border-[#A98750]/35 hover:border-[#A98750]'
                    }`}
                    title={language === 'ar' ? 'تغيير اللغة' : 'בחר שפה'}
                    aria-label="تغيير اللغة"
                  >
                    <Globe
                      className={`w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform ${
                        isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'
                      }`}
                    />
                    <span
                      className={`absolute -bottom-1 -end-1 w-4 h-4 rounded-full border text-[10px] font-black flex items-center justify-center leading-none shadow-sm ${
                        isDark
                          ? 'bg-[#111111] border-[#C5A36A] text-[#C5A36A]'
                          : 'bg-[#FFFFFF] border-[#A98750] text-[#29231D]'
                      }`}
                    >
                      {language === 'ar' ? 'ع' : 'ע'}
                    </span>
                  </button>

                  {/* Native Script Language Dropdown */}
                  {langDropdownOpen && (
                    <div
                      className={`absolute top-full mt-2.5 end-0 z-50 w-44 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl space-y-1 border ${
                        isDark ? 'bg-[#1D1D1D]/95 border-[#C5A36A]/30' : 'bg-[#FFFFFF]/95 border-[#A98750]/35'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('ar');
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          language === 'ar'
                            ? isDark
                              ? 'bg-[#C5A36A]/20 text-[#C5A36A] border border-[#C5A36A]/40'
                              : 'bg-[#F3EBDD] text-[#29231D] border border-[#A98750]/50'
                            : isDark
                            ? 'text-[#F5F0E8] hover:bg-[#222222]'
                            : 'text-[#29231D] hover:bg-[#F3EBDD]/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black ${
                              isDark ? 'bg-[#111111] border-[#C5A36A]/50 text-[#C5A36A]' : 'bg-[#E9DECC] border-[#A98750]/50 text-[#A98750]'
                            }`}
                          >
                            ع
                          </span>
                          <span className="font-arabic">العربية</span>
                        </div>
                        {language === 'ar' && <Check className="w-4 h-4 text-[#C5A36A]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('he');
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          language === 'he'
                            ? isDark
                              ? 'bg-[#C5A36A]/20 text-[#C5A36A] border border-[#C5A36A]/40'
                              : 'bg-[#F3EBDD] text-[#29231D] border border-[#A98750]/50'
                            : isDark
                            ? 'text-[#F5F0E8] hover:bg-[#222222]'
                            : 'text-[#29231D] hover:bg-[#F3EBDD]/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black ${
                              isDark ? 'bg-[#111111] border-[#C5A36A]/50 text-[#C5A36A]' : 'bg-[#E9DECC] border-[#A98750]/50 text-[#A98750]'
                            }`}
                          >
                            ע
                          </span>
                          <span className="font-hebrew">עברית</span>
                        </div>
                        {language === 'he' && <Check className="w-4 h-4 text-[#C5A36A]" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Search Toggle */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className={`p-2 sm:p-2.5 rounded-xl transition cursor-pointer ${
                    isDark
                      ? 'text-[#F5F0E8] hover:text-[#C5A36A] hover:bg-[#1D1D1D]'
                      : 'text-[#29231D] hover:text-[#A98750] hover:bg-[#E9DECC]'
                  }`}
                  title={t.actions.search}
                  aria-label={t.actions.search}
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Wishlist Link */}
                <Link
                  to="/wishlist"
                  className={`relative p-2 sm:p-2.5 rounded-xl transition ${
                    isDark
                      ? 'text-[#F5F0E8] hover:text-rose-400 hover:bg-[#1D1D1D]'
                      : 'text-[#29231D] hover:text-rose-600 hover:bg-[#E9DECC]'
                  }`}
                  title={t.actions.wishlist}
                  aria-label={t.actions.wishlist}
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 end-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className={`p-2 sm:p-2.5 rounded-xl transition hidden sm:flex ${
                    isDark
                      ? 'text-[#F5F0E8] hover:text-[#C5A36A] hover:bg-[#1D1D1D]'
                      : 'text-[#29231D] hover:text-[#A98750] hover:bg-[#E9DECC]'
                  }`}
                  title={t.nav.profile}
                  aria-label={t.nav.profile}
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Cart Drawer Trigger */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className={`flex items-center gap-2.5 px-3 sm:px-3.5 py-2 border rounded-xl transition shadow-sm active:scale-95 cursor-pointer ${
                    isDark
                      ? 'bg-[#C5A36A]/15 hover:bg-[#C5A36A]/25 border-[#C5A36A]/45 text-[#C5A36A]'
                      : 'bg-[#A98750] hover:bg-[#8F6F3C] border-[#A98750] text-[#FFFFFF] keep-white-text'
                  }`}
                  aria-label={t.actions.cartTitle}
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span
                        className={`absolute -top-2 -end-2 w-4 h-4 text-[10px] font-black rounded-full flex items-center justify-center ${
                          isDark ? 'bg-[#C5A36A] text-[#111111]' : 'bg-[#29231D] text-[#F5F0E8]'
                        }`}
                      >
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold hidden md:inline">{t.nav.cart}</span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className={`lg:hidden p-2 rounded-xl transition cursor-pointer ${
                    isDark ? 'text-[#F5F0E8] hover:bg-[#1D1D1D]' : 'text-[#29231D] hover:bg-[#E9DECC]'
                  }`}
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
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className={`w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden ${
              isDark ? 'bg-[#1D1D1D] border-[#C5A36A]/30 text-[#F5F0E8]' : 'bg-[#FFFFFF] border-[#A98750]/35 text-[#29231D]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`p-4 border-b flex items-center gap-3 ${
                isDark ? 'border-[#2C2C2C]' : 'border-[#E9DECC]'
              }`}
            >
              <Search className={`w-5 h-5 shrink-0 ${isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}`} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.actions.searchPlaceholder}
                aria-label={t.actions.search}
                className="w-full bg-transparent text-base focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs px-2 py-1 rounded border opacity-75 hover:opacity-100"
                >
                  {language === 'ar' ? 'مسح' : 'נקה'}
                </button>
              )}
              <button onClick={() => setSearchOpen(false)} className="p-1.5 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 opacity-80 space-y-2">
                  <Sparkles className={`w-8 h-8 mx-auto ${isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}`} />
                  <p className="text-sm">
                    {language === 'ar'
                      ? 'اكتب كلمة البحث لاستكشاف العطور الفاخرة'
                      : 'הקלד מילת חיפוש כדי לגלות בשמי יוקרה'}
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 opacity-75">
                  <p className="text-sm">
                    {language === 'ar'
                      ? `لم يتم العثور على نتائج تطابق "${searchQuery}"`
                      : `לא נמצאו תוצאות עבור "${searchQuery}"`}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSearchResultClick(product.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition ${
                        isDark
                          ? 'bg-[#222222] hover:border-[#C5A36A]/60 border-white/10'
                          : 'bg-[#F3EBDD]/60 hover:border-[#A98750] border-[#A98750]/20'
                      }`}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold truncate">{product.name}</h4>
                          <span className={`text-sm font-mono font-bold ${isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}`}>
                            {product.price} {t.currency}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-75 mt-0.5">
                          <span>{product.nameEn}</span>
                          <span>•</span>
                          <span>{product.scentFamily}</span>
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
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div
            className={`fixed inset-y-0 start-0 w-full max-w-xs border-e p-6 flex flex-col justify-between shadow-2xl overflow-y-auto ${
              isDark
                ? 'bg-[#111111] border-[#C5A36A]/25 text-[#F5F0E8]'
                : 'bg-[#F3EBDD] border-[#A98750]/30 text-[#29231D]'
            }`}
          >
            <div>
              {/* Header */}
              <div
                className={`flex items-center justify-between pb-5 border-b ${
                  isDark ? 'border-[#222222]' : 'border-[#E9DECC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/koon-logo.jpg"
                    alt="KAWN PERFUME"
                    className={`w-10 h-10 rounded-full object-cover border ${
                      isDark ? 'border-[#C5A36A]/50' : 'border-[#A98750]/60'
                    }`}
                  />
                  <div>
                    <h3 className="font-bold text-base">{t.brandName}</h3>
                    <span className={`text-[10px] font-serif tracking-widest block ${isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}`}>
                      {t.brandSub}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="إغلاق القائمة الجانبية"
                  className="p-1.5 rounded-lg cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Theme & Language Controls inside Mobile Drawer */}
              <div className={`py-4 border-b space-y-3 ${isDark ? 'border-[#222222]' : 'border-[#E9DECC]'}`}>
                {/* Theme Switcher */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    isDark
                      ? 'bg-[#1D1D1D] border-[#C5A36A]/35 text-[#F5F0E8]'
                      : 'bg-[#FFFFFF] border-[#A98750]/35 text-[#29231D]'
                  }`}
                >
                  <span>{isDark ? t.theme?.dark || 'الوضع الداكن' : t.theme?.light || 'الوضع النهاري'}</span>
                  <span className="flex items-center gap-1.5 text-[#C5A36A]">
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-[#A98750]" />}
                    <span className="text-[11px]">{isDark ? t.theme?.darkSub : t.theme?.lightSub}</span>
                  </span>
                </button>

                {/* Language Switcher */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('ar')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      language === 'ar'
                        ? isDark
                          ? 'bg-[#C5A36A] text-[#111111] border-[#C5A36A]'
                          : 'bg-[#A98750] text-[#FFFFFF] border-[#A98750] keep-white-text'
                        : isDark
                        ? 'bg-[#1D1D1D] text-[#F5F0E8] border-[#2C2C2C]'
                        : 'bg-[#FFFFFF] text-[#29231D] border-[#E9DECC]'
                    }`}
                  >
                    <span>ع</span>
                    <span className="font-arabic">العربية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLanguage('he')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      language === 'he'
                        ? isDark
                          ? 'bg-[#C5A36A] text-[#111111] border-[#C5A36A]'
                          : 'bg-[#A98750] text-[#FFFFFF] border-[#A98750] keep-white-text'
                        : isDark
                        ? 'bg-[#1D1D1D] text-[#F5F0E8] border-[#2C2C2C]'
                        : 'bg-[#FFFFFF] text-[#29231D] border-[#E9DECC]'
                    }`}
                  >
                    <span>ע</span>
                    <span className="font-hebrew">עברית</span>
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="py-4 space-y-1.5">
                {navLinks.map((link) =>
                  link.isAnchor ? (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={handleCollectionsClick}
                      className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                        isDark ? 'hover:bg-[#1D1D1D]' : 'hover:bg-[#E9DECC]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                          isActive
                            ? isDark
                              ? 'bg-[#C5A36A]/15 text-[#C5A36A] border border-[#C5A36A]/35'
                              : 'bg-[#E9DECC] text-[#A98750] border border-[#A98750]/40'
                            : isDark
                            ? 'hover:bg-[#1D1D1D]'
                            : 'hover:bg-[#E9DECC]'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                )}
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isDark ? 'hover:bg-[#1D1D1D]' : 'hover:bg-[#E9DECC]'
                  }`}
                >
                  {t.nav.profile}
                </NavLink>
                <NavLink
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isDark ? 'hover:bg-[#1D1D1D]' : 'hover:bg-[#E9DECC]'
                  }`}
                >
                  {t.nav.faq}
                </NavLink>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
