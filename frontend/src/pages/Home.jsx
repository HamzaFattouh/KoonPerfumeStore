import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Flame } from 'lucide-react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import CosmicLogoHero from '../components/home/CosmicLogoHero';

const Home = () => {
  const { language } = useLanguage();

  // Active Category Filter for Showcase
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch live products directly from Supabase / Backend API
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProducts(true);
    getProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data || []);
          setIsLoadingProducts(false);
        }
      })
      .catch((err) => {
        console.error('Error loading products for Home:', err);
        if (isMounted) setIsLoadingProducts(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Filter products based on active tab
  const getFilteredProducts = () => {
    if (activeCategory === 'bestseller') {
      return products.filter(p => p.isBestseller).slice(0, 4);
    }
    if (activeCategory === 'oriental') {
      return products.filter(p => p.category === 'unisex' || p.category === 'men').slice(0, 4);
    }
    if (activeCategory === 'floral') {
      return products.filter(p => p.category === 'women').slice(0, 4);
    }
    if (activeCategory === 'niche') {
      return products.filter(p => p.badge?.includes('فاخر') || p.badge?.includes('كوني') || p.category === 'unisex').slice(0, 4);
    }
    // 'all' default: bestsellers + featured
    return products.slice(0, 4);
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="space-y-16 pb-20 text-slate-100">
      
      {/* 1. Masterpiece Cosmic Emblem & Brand Hero Section */}
      <CosmicLogoHero />

      {/* 2. Curated Luxury Perfumes Showcase */}
      <section id="products-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'مختارات لعشاق التميز والندرة' : 'נבחרת הניחוחות המובילים'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {language === 'ar' ? 'العطور الأكثر طلباً وشهرة' : 'הבשמים המבוקשים ביותר'}
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md">
            {[
              { id: 'all', labelAr: 'الكل', labelHe: 'הכל' },
              { id: 'bestseller', labelAr: 'الأكثر مبيعاً', labelHe: 'הנמכרים ביותר' },
              { id: 'oriental', labelAr: 'المدار الشرقي', labelHe: 'מזרחי ועוד' },
              { id: 'floral', labelAr: 'سديم الزهور', labelHe: 'וניל ופרחים' },
              { id: 'niche', labelAr: 'إصدارات نيش', labelHe: 'מהדורות נישה' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {language === 'ar' ? tab.labelAr : tab.labelHe}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-900/40 border border-slate-800/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/50 text-slate-200 hover:text-amber-300 text-xs sm:text-sm font-bold backdrop-blur-md transition-all shadow-lg hover:shadow-amber-500/5 cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض الكتالوج الكامل والتشكيلة الفلكية' : 'צפה בכל הקטלוג והקולקציות'}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
