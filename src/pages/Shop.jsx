import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Search, 
  X, 
  RotateCcw, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, FRAGRANCE_FAMILIES } from '../data/products';
import ProductCard from '../components/products/ProductCard';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || (searchParams.get('filter') === 'bestseller' ? 'bestseller' : 'all');
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [priceRange, setPriceRange] = useState(800);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync category state if searchParam changes
  useEffect(() => {
    const cat = searchParams.get('category');
    const filter = searchParams.get('filter');
    if (filter === 'bestseller') {
      setSelectedCategory('bestseller');
    } else if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category check
      if (selectedCategory === 'bestseller' && !item.isBestseller) return false;
      if (selectedCategory !== 'all' && selectedCategory !== 'bestseller' && item.category !== selectedCategory) return false;

      // Olfactory family check
      if (selectedFamily !== 'all' && item.scentFamily !== selectedFamily) return false;

      // Price check
      if (item.price > priceRange) return false;

      // Search keyword check
      if (searchKeyword.trim() !== '') {
        const query = searchKeyword.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesEn = item.nameEn.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesFamily = item.scentFamily.toLowerCase().includes(query);
        const matchesNotes = [...item.notes.top, ...item.notes.heart, ...item.notes.base].some(n => n.toLowerCase().includes(query));
        if (!matchesName && !matchesEn && !matchesDesc && !matchesFamily && !matchesNotes) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return b.reviewsCount - a.reviewsCount; // popular
    });
  }, [selectedCategory, selectedFamily, priceRange, searchKeyword, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedFamily('all');
    setPriceRange(800);
    setSearchKeyword('');
    setSortBy('popular');
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedFamily !== 'all' || priceRange < 800 || searchKeyword !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12 overflow-hidden text-center backdrop-blur-md">
        <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-semibold border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>كتالوج عطور النيش الفلكية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            تشكيلة كون بيرفيوم
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            استكشف روائع العطور المصنوعة بحرفية متقنة ومكونات نادرة تم انتقاؤها لتعكس هيبتك وأناقتك في كل مناسبة.
          </p>
        </div>
      </div>

      {/* Main Content Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6 backdrop-blur-sm sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>تصفية النتائج</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  إعادة ضبط
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-200 block">الفئة والتصنيف</label>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchParams(cat.id === 'all' ? {} : { category: cat.id });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      selectedCategory === cat.id 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200">الحد الأقصى للسعر:</span>
                <span className="font-mono font-bold text-amber-400">{priceRange} ر.س</span>
              </div>
              <input 
                type="range"
                min="250"
                max="800"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>250 ر.س</span>
                <span>800 ر.س</span>
              </div>
            </div>

            {/* Olfactory Family Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-200 block">العائلة العطرية</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedFamily('all')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                    selectedFamily === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  الكل
                </button>
                {FRAGRANCE_FAMILIES.map((family) => (
                  <button
                    key={family}
                    onClick={() => setSelectedFamily(family === selectedFamily ? 'all' : family)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                      selectedFamily === family
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {family}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Control Bar: Search input, Mobile Filter Toggle, and Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                placeholder="ابحث في الكتالوج..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              {searchKeyword && (
                <button 
                  onClick={() => setSearchKeyword('')}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                <Filter className="w-4 h-4 text-amber-400" />
                <span>الفلاتر ({hasActiveFilters ? 'مفعلة' : '0'})</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:inline">الترتيب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="popular">الأكثر شعبية وطلباً</option>
                  <option value="rating">الأعلى تقييماً ⭐</option>
                  <option value="price-low">السعر: من الأقل للأعلى</option>
                  <option value="price-high">السعر: من الأعلى للأقل</option>
                  <option value="newest">وصل حديثاً</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Tags bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">الفلاتر المطبقة:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                  {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedFamily !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                  {selectedFamily}
                  <button onClick={() => setSelectedFamily('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {priceRange < 800 && (
                <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                  أقل من {priceRange} ر.س
                  <button onClick={() => setPriceRange(800)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-rose-400 hover:underline mr-2"
              >
                مسح الكل
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-3xl p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">لم يتم العثور على عطور تطابق بحثك</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                جرب تغيير فلاتر البحث أو إعادة ضبط خيارات التصفية لتصفح كل روائع كون بيرفيوم.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <>
              <div className="text-xs text-slate-400">
                عرض <strong>{filteredProducts.length}</strong> من أصل {PRODUCTS.length} عطور فاخرة
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-slate-950 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">تصفية العطور</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-2">التصنيف</label>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium transition ${
                        selectedCategory === cat.id ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-slate-200">الحد الأقصى:</span>
                  <span className="text-amber-400 font-mono">{priceRange} ر.س</span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="800"
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                تطبيق الفلاتر ({filteredProducts.length} نتائج)
              </button>
              <button
                onClick={() => { resetFilters(); setIsMobileFilterOpen(false); }}
                className="w-full py-2.5 bg-slate-900 text-slate-400 text-xs rounded-xl"
              >
                إعادة ضبط
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
