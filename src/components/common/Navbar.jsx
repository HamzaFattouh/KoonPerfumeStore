import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
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
  ChevronDown 
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';

const Navbar = () => {
  const { cartCount, wishlist, setIsCartOpen, setQuickViewProduct } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Filtered search products
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : PRODUCTS.filter(p => 
        p.name.includes(searchQuery) || 
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.scentFamily.includes(searchQuery) ||
        p.categoryName.includes(searchQuery)
      );

  const handleSearchResultClick = (productId) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/shop', label: 'المتجر والكتالوج' },
    { to: '/shop?filter=bestseller', label: 'الأكثر مبيعاً ⭐' },
    { to: '/quiz', label: 'مستكشف العطور 🪐' },
    { to: '/about', label: 'عن كون بيرفيوم' },
    { to: '/track-order', label: 'تتبع طلبك' },
    { to: '/contact', label: 'اتصل بنا' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/20 text-xs py-2 px-4 text-center text-slate-300 flex items-center justify-center gap-4 relative z-40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>شحن كوني مجاني للطلبات فوق <strong>350 ر.س</strong> | كود الخصم <strong>KOON10</strong> لخصم 10% | عينة فاخرة مجاناً مع كل طلب</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl py-2.5' 
          : 'bg-slate-950/70 backdrop-blur-sm border-b border-slate-800/60 py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-500/40 group-hover:border-amber-400 transition-all shadow-lg group-hover:shadow-amber-500/30">
                <img 
                  src="/koon-logo.webp" 
                  alt="Koon Perfume Logo" 
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-wide text-white group-hover:text-amber-400 transition">
                  كون بيرفيوم
                </span>
                <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-amber-400/90 group-hover:text-amber-300 transition">
                  KOON PERFUME
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
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

            {/* Actions: Search, Wishlist, Cart, Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 sm:p-2.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 rounded-xl transition"
                title="بحث عن عطر"
                aria-label="بحث"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative p-2 sm:p-2.5 text-slate-300 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition"
                title="المفضلة"
                aria-label="المفضلة"
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
                title="حسابي"
                aria-label="حسابي"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-gradient-to-r from-amber-500/15 to-amber-600/25 hover:from-amber-500/25 hover:to-amber-600/35 border border-amber-500/40 text-amber-300 rounded-xl transition shadow-sm active:scale-95"
                aria-label="سلة المشتريات"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold hidden md:inline">السلة</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
                aria-label="القائمة"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

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
                placeholder="ابحث بالاسم، العائلة العطرية، النوتات (مثال: عود، فانيليا، الشفق، نيش)..."
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
                >
                  مسح
                </button>
              )}
              <button 
                onClick={() => setSearchOpen(false)}
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
                          <span className="text-sm font-mono font-bold text-amber-400">{product.price} ر.س</span>
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
                  <img src="/koon-logo.webp" alt="Logo" className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/40 shadow-md shadow-amber-500/20" />
                  <div>
                    <h3 className="font-bold text-white text-base">كون بيرفيوم</h3>
                    <span className="text-[10px] text-amber-400/90 font-serif tracking-widest">KOON PERFUME</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Links */}
              <nav className="py-6 space-y-2">
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
                  حسابي والطلبات
                </NavLink>
                <NavLink
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition"
                >
                  الأسئلة الشائعة والضمان
                </NavLink>
              </nav>
            </div>

            {/* Bottom contact info */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <div className="text-xs text-slate-400 leading-relaxed">
                خدمة العملاء متوفرة يومياً لمساعدتك في اختيار عطرك الفلكي.
              </div>
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

