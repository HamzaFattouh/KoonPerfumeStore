import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS, SAMPLE_GIFTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Share2, 
  Gift, 
  Clock, 
  Wind, 
  Plus, 
  Minus, 
  Check, 
  ArrowLeft 
} from 'lucide-react';
import ProductCard from '../components/products/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, showToast, setIsCartOpen } = useCart();

  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'specs' | 'reviews'
  const [giftCardOpen, setGiftCardOpen] = useState(false);
  const [giftNoteText, setGiftNoteText] = useState('');
  const [userReview, setUserReview] = useState({ name: '', comment: '', rating: 5 });
  const [reviewsList, setReviewsList] = useState([
    { name: 'سلطان العنزي', rating: 5, date: 'منذ 3 أيام', comment: 'عطر أسطوري وفخم جداً، الرائحة ثابتة وفواحة حتى بعد غسيل الثوب!' },
    { name: 'ريما العتيبي', rating: 5, date: 'منذ أسبوع', comment: 'تغليف راقي وريحته تأسر القلب، عينة الهدية كانت مفاجأة رائعة.' }
  ]);

  // Reset image and size when route changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      const defaultSize = product.sizes?.find(s => s.isDefault)?.size || '100ml';
      setSelectedSize(defaultSize);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, product]);

  const currentSizeObj = product.sizes?.find(s => s.size === selectedSize);
  const currentPrice = currentSizeObj ? currentSizeObj.price : product.price;
  const isWish = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `اكتشف عطر ${product.name} من كون بيرفيوم`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ رابط العطر للمشاركة ✨', 'info');
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (userReview.name && userReview.comment) {
      setReviewsList([
        { ...userReview, date: 'الآن' },
        ...reviewsList
      ]);
      setUserReview({ name: '', comment: '', rating: 5 });
      showToast('شكراً لتقييمك! تم نشر رأيك بنجاح', 'success');
    }
  };

  // Related products (same category or others)
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-amber-400">الرئيسية</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-amber-400">العطور</Link>
        <span>/</span>
        <span className="text-slate-200 font-semibold">{product.name}</span>
      </nav>

      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Images Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-slate-950 rounded-3xl border border-slate-800 p-8 flex items-center justify-center overflow-hidden shadow-2xl">
            {product.badge && (
              <span className="absolute top-4 right-4 z-10 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full">
                {product.badge}
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition"
              title="مشاركة العطر"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <img 
              src={selectedImage} 
              alt={product.name}
              className="w-full h-full object-contain max-h-[460px] rounded-2xl hover:scale-105 transition-transform duration-500" 
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl bg-slate-950 border overflow-hidden p-1 transition ${
                    selectedImage === img 
                      ? 'border-amber-400 ring-2 ring-amber-400/30' 
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Info */}
        <div className="space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                {product.categoryName} • {product.scentFamily}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">
              {product.name}
            </h1>
            <p className="text-sm text-slate-400 font-serif tracking-[0.2em] uppercase mb-4">
              {product.nameEn}
            </p>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-sm font-bold mr-1.5 text-slate-200">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({product.reviewsCount} تقييم موثق)</span>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                متوفر في المخزون
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">
              {currentPrice} ر.س
            </span>
            {product.originalPrice && (
              <span className="text-base text-slate-400 line-through">
                {product.originalPrice} ر.س
              </span>
            )}
            {product.discount && (
              <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                وفر {product.discount}
              </span>
            )}
            <span className="text-xs text-slate-400 mr-auto">السعر شامل الضريبة</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 block">اختر سعة الزجاجة:</label>
            <div className="flex flex-wrap gap-3">
              {product.sizes?.map((s) => (
                <button
                  key={s.size}
                  onClick={() => setSelectedSize(s.size)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                    selectedSize === s.size
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span>{s.size}</span>
                  <span>({s.price} ر.س)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              
              {/* Quantity Counter */}
              <div className="flex items-center border border-slate-700 rounded-xl bg-slate-900 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-mono font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 transform active:scale-98 text-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>أضف إلى السلة</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition ${
                  isWish 
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="إضافة للمفضلة"
              >
                <Heart className={`w-5 h-5 ${isWish ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>شراء فوري مباشر (الدفع السريع)</span>
            </button>
          </div>

          {/* Quick Perks Bar */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-400">
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80">
              <Truck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span>شحن سريع مبرد</span>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80">
              <Gift className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span>عينة مجانية مرفقة</span>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80">
              <RotateCcw className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span>ضمان ذهبي للاستبدال</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Fragrance Pyramid / Specifications / Reviews */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-md">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-800 pb-4 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2 transition relative ${
              activeTab === 'notes' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            الهرم العطري والنوتات
            {activeTab === 'notes' && <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-400" />}
          </button>
          
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-2 transition relative ${
              activeTab === 'specs' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مواصفات العطر والتركيز
            {activeTab === 'specs' && <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-400" />}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 transition relative ${
              activeTab === 'reviews' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            آراء وتجارب العملاء ({reviewsList.length})
            {activeTab === 'reviews' && <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-400" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-8">
          
          {/* Tab 1: Fragrance Pyramid */}
          {activeTab === 'notes' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Top Notes */}
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    الافتتاحية (Top Notes)
                  </span>
                  <div className="text-xs text-slate-400">اللحظات الأولى عند الرش (أول 15 دقيقة)</div>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {product.notes.top.map((note, idx) => (
                      <span key={idx} className="text-xs bg-slate-900 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Heart Notes */}
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-amber-500/30 text-center space-y-3 shadow-lg shadow-amber-500/5">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    قلب العطر (Heart Notes)
                  </span>
                  <div className="text-xs text-slate-400">جوهر وهوية العطر (تدوم ساعات)</div>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {product.notes.heart.map((note, idx) => (
                      <span key={idx} className="text-xs bg-amber-500/10 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/20">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Base Notes */}
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                    قاعدة العطر (Base Notes)
                  </span>
                  <div className="text-xs text-slate-400">العمق الخالد الذي يثبت لأيام</div>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {product.notes.base.map((note, idx) => (
                      <span key={idx} className="text-xs bg-slate-900 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Specifications */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between p-3.5 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">التركيز:</span>
                <span className="font-bold text-white">{product.concentration}</span>
              </div>
              <div className="flex justify-between p-3.5 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">معدل الثبات:</span>
                <span className="font-bold text-white">{product.longevity}</span>
              </div>
              <div className="flex justify-between p-3.5 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">درجة الفوحان:</span>
                <span className="font-bold text-white">{product.projection}</span>
              </div>
              <div className="flex justify-between p-3.5 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">الفصول والمناسبات:</span>
                <span className="font-bold text-white">{product.season}</span>
              </div>
              <div className="flex justify-between p-3.5 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">الفئة:</span>
                <span className="font-bold text-white">{product.categoryName}</span>
              </div>
              <div className="flex justify-between p-3.5 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">طريقة الرش المثالية:</span>
                <span className="font-bold text-white">مناطق النبض وعلى الملابس عن بعد 15 سم</span>
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white">أضف تجربتك ورأيك في العطر</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="اسمك الكريم..."
                    value={userReview.name}
                    onChange={(e) => setUserReview({ ...userReview, name: e.target.value })}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">تقييمك:</span>
                    <select
                      value={userReview.rating}
                      onChange={(e) => setUserReview({ ...userReview, rating: Number(e.target.value) })}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 focus:outline-none"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 من 5)</option>
                      <option value="4">⭐⭐⭐⭐ (4 من 5)</option>
                      <option value="3">⭐⭐⭐ (3 من 5)</option>
                    </select>
                  </div>
                </div>
                <textarea
                  required
                  rows="3"
                  placeholder="اكتب انطباعك عن الرائحة والثبات والتوصيل..."
                  value={userReview.comment}
                  onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition"
                >
                  نشر التقييم
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map((rev, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{rev.name}</span>
                      <span className="text-slate-500">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Perfumes */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white">عطور كوكبية أخرى قد تروق لك</h2>
          <Link to="/shop" className="text-xs font-bold text-amber-400 hover:underline">
            عرض المزيد
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

