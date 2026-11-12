import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  X, 
  RotateCcw, 
  Sparkles,
  Sun,
  Snowflake,
  Users,
  User,
  Flame,
  Droplets
} from 'lucide-react';
import { PRODUCTS, FRAGRANCE_FAMILIES } from '../data/products';
import ProductCard from '../components/products/ProductCard';

const POPULAR_INGREDIENTS = [
  { id: 'all', label: 'الكل' },
  { id: 'عود', label: 'عود كمبودي / هندي' },
  { id: 'عنبر', label: 'عنبر ملكي' },
  { id: 'فانيليا', label: 'فانيليا بوربون' },
  { id: 'زعفران', label: 'زعفران كشميري' },
  { id: 'برغموت', label: 'برغموت صقلي' },
  { id: 'ورد', label: 'ورد دي ماي' },
  { id: 'صندل', label: 'خشب الصندل' },
  { id: 'مسك', label: 'مسك نقي' },
  { id: 'جلد', label: 'جلود معتقة' }
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || (searchParams.get('filter') === 'bestseller' ? 'bestseller' : 'all');
  
  // State for all requested filters
  const [selectedGender, setSelectedGender] = useState('all'); // رجالي | ستاتي | رجالي وستاتي
  const [selectedSeason, setSelectedSeason] = useState('all'); // صيفي | شتوي | الكل
  const [selectedFamily, setSelectedFamily] = useState('all'); // العائلة العطرية
  const [selectedIngredient, setSelectedIngredient] = useState('all'); // مكونات ورائحة العطر
  const [selectedCategory, setSelectedCategory] = useState(initialCategory); // الأكثر طلباً
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
      if (['men', 'women', 'unisex'].includes(cat)) {
        setSelectedGender(cat);
      } else {
        setSelectedCategory(cat);
      }
    }
  }, [searchParams]);

  // Comprehensive Filtering Logic matching user requirements
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // 1. Gender Filter (رجالي أو ستاتي أو رجالي وستاتي)
      if (selectedGender !== 'all') {
        const itemGender = item.category || item.gender;
        if (itemGender !== selectedGender) return false;
      }

      // 2. Season Filter (صيفي أو شتوي)
      if (selectedSeason !== 'all') {
        const itemSeason = (item.season || '').toLowerCase();
        if (selectedSeason === 'summer') {
          const isSummer = itemSeason.includes('صيف') || itemSeason.includes('summer') || itemSeason.includes('فصول') || itemSeason.includes('انتعاش');
          if (!isSummer) return false;
        } else if (selectedSeason === 'winter') {
          const isWinter = itemSeason.includes('شتاء') || itemSeason.includes('خريف') || itemSeason.includes('winter') || itemSeason.includes('فصول') || itemSeason.includes('سهرات');
          if (!isWinter) return false;
        }
      }

      // 3. Olfactory Family Filter (العائلة العطرية والرائحة)
      if (selectedFamily !== 'all') {
        const itemFamily = item.scentFamily || item.scent_family || '';
        if (!itemFamily.includes(selectedFamily)) return false;
      }

      // 4. Ingredient / Scent Note Filter (مكونات ونوتات العطر)
      if (selectedIngredient !== 'all') {
        const allNotes = [
          ...(item.notes?.top || []),
          ...(item.notes?.heart || []),
          ...(item.notes?.base || [])
        ].join(' ').toLowerCase();
        if (!allNotes.includes(selectedIngredient.toLowerCase())) return false;
      }

      // 5. Category (Bestseller check)
      if (selectedCategory === 'bestseller' && !item.isBestseller) return false;

      // 6. Price Range
      if (item.price > priceRange) return false;

      // 7. Search keyword check
      if (searchKeyword.trim() !== '') {
        const query = searchKeyword.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesEn = item.nameEn?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesFamily = (item.scentFamily || '').toLowerCase().includes(query);
        const matchesBrand = (item.brand || 'KOON PERFUME').toLowerCase().includes(query);
        const matchesNotes = [
          ...(item.notes?.top || []),
          ...(item.notes?.heart || []),
          ...(item.notes?.base || [])
        ].some(n => n.toLowerCase().includes(query));
        
        if (!matchesName && !matchesEn && !matchesDesc && !matchesFamily && !matchesBrand && !matchesNotes) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.reviewsCount || 0) - (a.reviewsCount || 0); // popular
    });
  }, [selectedGender, selectedSeason, selectedFamily, selectedIngredient, selectedCategory, priceRange, searchKeyword, sortBy]);

  const resetFilters = () => {
    setSelectedGender('all');
    setSelectedSeason('all');
    setSelectedFamily('all');
    setSelectedIngredient('all');
    setSelectedCategory('all');
    setPriceRange(800);
    setSearchKeyword('');
    setSortBy('popular');
    setSearchParams({});
  };

  const hasActiveFilters = 
    selectedGender !== 'all' || 
    selectedSeason !== 'all' || 
    selectedFamily !== 'all' || 
    selectedIngredient !== 'all' || 
    selectedCategory !== 'all' || 
    priceRange < 800 || 
    searchKeyword !== '';

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
            تشكيلة عطور كون الملكية
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            استكشف روائع العطور المصنوعة بحرفية متقنة ومكونات نادرة. استخدم الفلاتر أدناه لتصفية العطور حسب الجنس، الموسم، المكونات العطرية، أو الرائحة.
          </p>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6 backdrop-blur-sm sticky top-24">
            
            {/* Header / Reset */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>تصفية وفلاتر العطور</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  إعادة ضبط
                </button>
              )}
            </div>

            {/* 1. Filter: Gender (رجالي / ستاتي / رجالي وستاتي) */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>الفئة المستهدفة (الجنس)</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'men', label: 'رجالي 👔' },
                  { id: 'women', label: 'ستاتي (نسائي) 🌸' },
                  { id: 'unisex', label: 'رجالي وستاتي 🪐' }
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGender(g.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer text-center ${
                      selectedGender === g.id
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Filter: Season (صيفي / شتوي) */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>الموسم العطري</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'summer', label: 'صيفي ☀️' },
                  { id: 'winter', label: 'شتوي ❄️' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeason(s.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer text-center ${
                      selectedSeason === s.id
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Filter: Scent Family (العائلة العطرية) */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>طابع ورائحة العطر (العائلة)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedFamily('all')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    selectedFamily === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  الكل
                </button>
                {FRAGRANCE_FAMILIES.slice(0, 6).map((family) => (
                  <button
                    key={family}
                    onClick={() => setSelectedFamily(family === selectedFamily ? 'all' : family)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
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

            {/* 4. Filter: Ingredients / Notes (مكونات ونوتات العطر) */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-amber-400" />
                <span>المكونات والنوتات البارزة</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_INGREDIENTS.map((ing) => (
                  <button
                    key={ing.id}
                    onClick={() => setSelectedIngredient(ing.id === selectedIngredient ? 'all' : ing.id)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      selectedIngredient === ing.id
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold border-amber-400 shadow-sm'
                        : 'bg-slate-800/70 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {ing.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Price Range Slider */}
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
                aria-label="نطاق السعر"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>250 ر.س</span>
                <span>800 ر.س</span>
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
                placeholder="ابحث بالاسم، المكونات، أو الرائحة..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                aria-label="البحث في الكتالوج"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              {searchKeyword && (
                <button 
                  onClick={() => setSearchKeyword('')}
                  aria-label="مسح البحث"
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
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
                  aria-label="ترتيب المنتجات"
                  className="bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
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

          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 text-[11px]">الفلاتر المطبقة:</span>
              {selectedGender !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <span>الجنس: {selectedGender === 'men' ? 'رجالي' : selectedGender === 'women' ? 'ستاتي' : 'رجالي وستاتي'}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGender('all')} />
                </span>
              )}
              {selectedSeason !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <span>الموسم: {selectedSeason === 'summer' ? 'صيفي' : 'شتوي'}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSeason('all')} />
                </span>
              )}
              {selectedFamily !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <span>الرائحة: {selectedFamily}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedFamily('all')} />
                </span>
              )}
              {selectedIngredient !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <span>المكون: {selectedIngredient}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedIngredient('all')} />
                </span>
              )}
              <button 
                onClick={resetFilters} 
                className="text-[11px] text-rose-400 hover:underline mr-auto cursor-pointer"
              >
                مسح الكل
              </button>
            </div>
          )}

          {/* Products Count Header */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>عرض {filteredProducts.length} من أصل {PRODUCTS.length} عطر</span>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">لم نجد عطوراً تطابق خيارات التصفية</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                جرب تغيير فلاتر البحث أو المكونات العطرية أو مسح بعض الخيارات لعرض التشكيلة كاملة.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-400 transition cursor-pointer"
              >
                إعادة ضبط كافة الفلاتر
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Filters Slide-over / Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in">
          <div 
            className="w-full max-w-xs bg-slate-950 border-r border-slate-800 h-full p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-white text-base">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <span>تصفية العطور</span>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900"
                  aria-label="إغلاق الفلاتر"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile: Gender */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white block">الفئة (الجنس)</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'men', label: 'رجالي' },
                    { id: 'women', label: 'ستاتي' },
                    { id: 'unisex', label: 'للجنسين' }
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGender(g.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center ${
                        selectedGender === g.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile: Season */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <label className="text-xs font-bold text-white block">الموسم</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'summer', label: 'صيفي' },
                    { id: 'winter', label: 'شتوي' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSeason(s.id)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center ${
                        selectedSeason === s.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile: Scent Family */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <label className="text-xs font-bold text-white block">الرائحة والعائلة</label>
                <div className="flex flex-wrap gap-1.5">
                  {FRAGRANCE_FAMILIES.slice(0, 6).map(f => (
                    <button
                      key={f}
                      onClick={() => setSelectedFamily(f === selectedFamily ? 'all' : f)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] ${
                        selectedFamily === f
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile: Ingredients */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <label className="text-xs font-bold text-white block">المكونات والنوتات</label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_INGREDIENTS.map(ing => (
                    <button
                      key={ing.id}
                      onClick={() => setSelectedIngredient(ing.id === selectedIngredient ? 'all' : ing.id)}
                      className={`px-2 py-1 rounded-lg text-[11px] ${
                        selectedIngredient === ing.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {ing.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                تطبيق الفلاتر ({filteredProducts.length} عطر)
              </button>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="w-full py-2 bg-slate-900 text-slate-300 text-xs rounded-xl"
                >
                  إلغاء التصفية
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Shop;
