import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Star, ShoppingBag, Heart, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [qty, setQty] = useState(1);

  if (!quickViewProduct) return null;

  const currentPrice = quickViewProduct.sizes?.find(s => s.size === selectedSize)?.price || quickViewProduct.price;
  const isWish = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, qty);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative bg-slate-950 p-8 flex items-center justify-center border-b md:border-b-0 md:border-l border-slate-800">
            {quickViewProduct.badge && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-500/30">
                {quickViewProduct.badge}
              </span>
            )}
            <img 
              src={quickViewProduct.images[0]} 
              alt={quickViewProduct.name}
              className="max-h-72 object-contain rounded-xl hover:scale-105 transition-transform duration-500 shadow-xl"
            />
          </div>

          {/* Product Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider text-amber-400/90 font-medium">
                  {quickViewProduct.categoryName} • {quickViewProduct.scentFamily}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">
                {quickViewProduct.name}
              </h3>
              <p className="text-xs text-slate-400 font-serif mb-3 tracking-widest uppercase">
                {quickViewProduct.nameEn}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-sm font-semibold mr-1">{quickViewProduct.rating}</span>
                </div>
                <span className="text-xs text-slate-400">({quickViewProduct.reviewsCount} تقييم حقيقي)</span>
              </div>

              <p className="text-sm text-slate-300 line-clamp-3 mb-5 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Fragrance Pyramid Peek */}
              <div className="mb-5 bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                <div className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  أبرز النوتات العطرية:
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {[...quickViewProduct.notes.top.slice(0, 2), ...quickViewProduct.notes.heart.slice(0, 1), ...quickViewProduct.notes.base.slice(0, 1)].map((note, idx) => (
                    <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-300 mb-2">الحجم المتاح:</label>
                <div className="flex gap-2">
                  {quickViewProduct.sizes.map((s) => (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition border ${
                        selectedSize === s.size 
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20' 
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {s.size} - {s.price} ر.س
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-extrabold text-amber-400">{currentPrice} ر.س</span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm line-through text-slate-500">{quickViewProduct.originalPrice} ر.س</span>
                )}
                <span className="text-xs bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                  شامل ضريبة القيمة المضافة
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  أضف إلى السلة
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`p-3 rounded-xl border transition ${
                    isWish 
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  aria-label="المفضلة"
                >
                  <Heart className={`w-5 h-5 ${isWish ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <div className="text-center">
                <Link
                  to={`/product/${quickViewProduct.id}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="text-xs text-amber-400/90 hover:text-amber-300 hover:underline inline-block pt-1"
                >
                  عرض تفاصيل العطر الكاملة والهرم العطري ←
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
