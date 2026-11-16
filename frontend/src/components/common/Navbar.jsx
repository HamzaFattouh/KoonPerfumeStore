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
  User,
  Globe,
  Check
} from 'lucide-react';
import { getProducts } from '../../services/productService';

const Navbar = () => {
  const { cartCount, wishlist, setIsCartOpen } = useCart();
  const { language, setLanguage, t } = useLanguage();
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
      {/* Fixed Navbar Container — Official KOON Dark Luxury Palette (#0B0A09, #151310, #C6A15B, #D8BD83, #F5F0E7) */}
      <div className="fixed top-0 inset-x-0 z-40 transition-all duration-500 ease-in-out shadow-2xl">
        {/* Top Announcement Bar */}
        <div className="bg-[#0B0A09] border-b border-[#C6A15B]/25 text-xs py-2 px-4 text-center text-[#F5F0E7]/90 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D8BD83] animate-pulse" />
            <span className="font-medium">{t.announcement}</span>
          </div>
        </div>

        {/* Main Navbar Header */}
        <header className="bg-[#0B0A09]/92 backdrop-blur-md border-b border-[#C6A15B]/20 text-[#F5F0E7] py-2.5 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              {/* Brand Identity: KOON | كون بيرفيوم */}
              <Link to="/" className="flex items-center gap-3 group shrink-0">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#C6A15B]/55 group-hover:border-[#D8BD83] transition-all shadow-md shrink-0">
                  <img
                    src="/koon-logo.jpg"
                    alt="KOON PERFUME Logo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="hidden xl:flex flex-col">
                  <span className="text-lg font-black tracking-wide text-[#F5F0E7] group-hover:text-[#D8BD83] transition leading-tight">
                    {t.brandName}
                  </span>
                  <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#C6A15B]">
                    KOON · {t.brandTagline || 'A Universe of Fragrance.'}
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
                      className="text-xs xl:text-sm font-medium transition-colors relative py-1 whitespace-nowrap shrink-0 text-[#F5F0E7]/85 hover:text-[#D8BD83]"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `text-xs xl:text-sm font-medium transition-colors relative py-1 whitespace-nowrap shrink-0 ${
                          isActive ? 'text-[#D8BD83] font-bold' : 'text-[#F5F0E7]/85 hover:text-[#D8BD83]'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                )}
              </nav>

              {/* Actions: Language Switcher, Search, Wishlist, Cart, Profile */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                {/* 🌐 Globe Language Switcher with Native Scripts (العربية / עברית) */}
                <div ref={langDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setLangDropdownOpen((prev) => !prev)}
                    className={`p-2 sm:p-2.5 rounded-xl transition cursor-pointer relative flex items-center justify-center group border ${
                      langDropdownOpen
                        ? 'bg-[#151310] text-[#D8BD83] border-[#D8BD83]'
                        : 'bg-[#151310] text-[#F5F0E7] border-[#C6A15B]/30 hover:border-[#D8BD83]'
                    }`}
                    title={language === 'ar' ? 'تغيير اللغة' : 'בחר שפה'}
                    aria-label="تغيير اللغة"
                  >
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#C6A15B] group-hover:scale-110 transition-transform" />
                    <span className="absolute -bottom-1 -end-1 w-4 h-4 rounded-full bg-[#0B0A09] border border-[#C6A15B] text-[#D8BD83] text-[10px] font-black flex items-center justify-center leading-none shadow-sm">
                      {language === 'ar' ? 'ع' : 'ע'}
                    </span>
                  </button>

                  {langDropdownOpen && (
                    <div className="absolute top-full mt-2.5 end-0 z-50 w-44 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl space-y-1 border bg-[#151310]/95 border-[#C6A15B]/35">
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('ar');
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          language === 'ar'
                            ? 'bg-[#C6A15B]/20 text-[#D8BD83] border border-[#C6A15B]/45'
                            : 'text-[#F5F0E7] hover:bg-[#1A1714]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#0B0A09] border border-[#C6A15B]/50 flex items-center justify-center text-[10px] font-black text-[#D8BD83]">
                            ع
                          </span>
                          <span className="font-arabic">العربية</span>
                        </div>
                        {language === 'ar' && <Check className="w-4 h-4 text-[#D8BD83]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('he');
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          language === 'he'
                            ? 'bg-[#C6A15B]/20 text-[#D8BD83] border border-[#C6A15B]/45'
                            : 'text-[#F5F0E7] hover:bg-[#1A1714]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#0B0A09] border border-[#C6A15B]/50 flex items-center justify-center text-[10px] font-black text-[#D8BD83]">
                            ע
                          </span>
                          <span className="font-hebrew">עברית</span>
                        </div>
                        {language === 'he' && <Check className="w-4 h-4 text-[#D8BD83]" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Search Toggle */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 sm:p-2.5 rounded-xl transition cursor-pointer text-[#F5F0E7] hover:text-[#D8BD83] hover:bg-[#151310]"
                  title={t.actions.search}
                  aria-label={t.actions.search}
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Wishlist Link */}
                <Link
                  to="/wishlist"
                  className="relative p-2 sm:p-2.5 rounded-xl transition text-[#F5F0E7] hover:text-rose-400 hover:bg-[#151310]"
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
                  className="p-2 sm:p-2.5 rounded-xl transition hidden sm:flex text-[#F5F0E7] hover:text-[#D8BD83] hover:bg-[#151310]"
                  title={t.nav.profile}
                  aria-label={t.nav.profile}
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Cart Drawer Trigger */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-2.5 px-3 sm:px-3.5 py-2 border rounded-xl transition shadow-sm active:scale-95 cursor-pointer bg-[#C6A15B]/15 hover:bg-[#C6A15B]/25 border-[#C6A15B]/45 text-[#D8BD83]"
                  aria-label={t.actions.cartTitle}
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -end-2 w-4 h-4 text-[10px] font-black rounded-full flex items-center justify-center bg-[#C6A15B] text-[#0B0A09]">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold hidden md:inline">{t.nav.cart}</span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-xl transition cursor-pointer text-[#F5F0E7] hover:bg-[#151310]"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#151310] border border-[#C6A15B]/35 text-[#F5F0E7] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#C6A15B]/20 flex items-center gap-3">
              <Search className="w-5 h-5 shrink-0 text-[#C6A15B]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.actions.searchPlaceholder}
                aria-label={t.actions.search}
                className="w-full bg-transparent text-base focus:outline-none text-[#F5F0E7]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs px-2 py-1 rounded border border-[#C6A15B]/30 opacity-75 hover:opacity-100"
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
                  <Sparkles className="w-8 h-8 mx-auto text-[#C6A15B]" />
                  <p className="text-sm">
                    {language === 'ar'
                      ? 'اكتب كلمة البحث لاستكشاف عطور KOON الفاخرة'
                      : 'הקלד מילת חיפוש כדי לגלות בשמי KOON יוקרתיים'}
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
                      className="flex items-center gap-3 p-2.5 rounded-xl border bg-[#1A1714] hover:border-[#D8BD83] border-[#C6A15B]/20 cursor-pointer transition"
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold truncate">{product.name}</h4>
                          <span className="text-sm font-mono font-bold text-[#D8BD83]">
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 start-0 w-full max-w-xs border-e p-6 flex flex-col justify-between shadow-2xl overflow-y-auto bg-[#0B0A09] border-[#C6A15B]/25 text-[#F5F0E7]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#151310]">
                <div className="flex items-center gap-3">
                  <img
                    src="/koon-logo.jpg"
                    alt="KOON PERFUME"
                    className="w-10 h-10 rounded-full object-cover border border-[#C6A15B]/50"
                  />
                  <div>
                    <h3 className="font-bold text-base">{t.brandName}</h3>
                    <span className="text-[10px] font-serif tracking-widest block text-[#C6A15B]">
                      KOON PERFUME
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

              {/* Language Switcher inside Mobile Drawer */}
              <div className="py-4 border-b border-[#151310]">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('ar')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      language === 'ar'
                        ? 'bg-[#C6A15B] text-[#0B0A09] border-[#D8BD83]'
                        : 'bg-[#151310] text-[#F5F0E7] border-[#C6A15B]/25'
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
                        ? 'bg-[#C6A15B] text-[#0B0A09] border-[#D8BD83]'
                        : 'bg-[#151310] text-[#F5F0E7] border-[#C6A15B]/25'
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
                      className="block px-4 py-2.5 rounded-xl text-sm font-semibold transition hover:bg-[#151310]"
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
                            ? 'bg-[#C6A15B]/15 text-[#D8BD83] border border-[#C6A15B]/35'
                            : 'hover:bg-[#151310]'
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
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold transition hover:bg-[#151310]"
                >
                  {t.nav.profile}
                </NavLink>
                <NavLink
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold transition hover:bg-[#151310]"
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
