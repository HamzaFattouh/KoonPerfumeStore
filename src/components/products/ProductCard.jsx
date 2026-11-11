import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Heart, Eye, Star, Sparkles } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useCart();
  const [selectedSize, setSelectedSize] = useState('100ml');
  const isWish = isInWishlist(product.id);

  // Price for chosen size
  const currentPrice = product.sizes?.find(s => s.size === selectedSize)?.price || product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div className="group relative bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between backdrop-blur-sm">
      
      {/* Top Badges & Actions */}
      <div className="relative aspect-square overflow-hidden bg-slate-950 p-6 flex items-center justify-center">
        
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 right-3 z-10 px-2.5 py-1 text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full backdrop-blur-md">
            {product.badge}
          </span>
        )}

        {/* Wishlist and Quickview Floating Buttons */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isWish 
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400' 
                : 'bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-rose-400 hover:bg-slate-800'
            }`}
            title="إضافة للمفضلة"
            aria-label="المفضلة"
          >
            <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-amber-400 hover:bg-slate-800 backdrop-blur-md transition-all"
            title="نظرة سريعة"
            aria-label="نظرة سريعة"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Perfume Image with Zoom on hover */}
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-contain rounded-xl transition-transform duration-700 group-hover:scale-108"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Olfactory Family */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
            <span className="text-amber-400/90">{product.categoryName}</span>
            <span className="text-slate-400">{product.scentFamily}</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition mb-0.5 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-[11px] text-slate-400 font-serif tracking-widest uppercase mb-2">
              {product.nameEn}
            </p>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-xs font-bold mr-1 text-slate-200">{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
          </div>

          {/* Key Notes */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.notes.top.slice(0, 2).map((note, idx) => (
              <span key={idx} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60">
                {note}
              </span>
            ))}
          </div>

          {/* Size Selector */}
          <div className="flex gap-1.5 mb-4">
            {product.sizes?.map((s) => (
              <button
                key={s.size}
                type="button"
                onClick={() => setSelectedSize(s.size)}
                className={`text-[10px] px-2 py-0.5 rounded border transition ${
                  selectedSize === s.size
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10 font-bold'
                    : 'border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-amber-400 font-mono">
                {currentPrice} ر.س
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block">شامل الضريبة</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/15 transition transform active:scale-95"
            title="إضافة للسلة"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>أضف</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
