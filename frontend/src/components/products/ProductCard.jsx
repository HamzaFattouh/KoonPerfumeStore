import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { ShoppingBag, Heart, Eye, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useCart();
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const [selectedSize, setSelectedSize] = useState('100ml');
  const isWish = isInWishlist(product.id);

  // Price for chosen size
  const currentPrice = product.sizes?.find((s) => s.size === selectedSize)?.price || product.price;

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
    <div
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
        isDark
          ? 'bg-[#222222] border-[#C5A36A]/20 hover:border-[#C5A36A]/65 shadow-[0_14px_34px_rgba(0,0,0,0.65)]'
          : 'bg-[#FFFFFF] border-[#A98750]/25 hover:border-[#A98750] shadow-[0_14px_32px_rgba(41,35,29,0.08)]'
      }`}
    >
      {/* Top Badges & Actions */}
      <div
        className={`relative aspect-square overflow-hidden p-6 flex items-center justify-center transition-colors duration-300 ${
          isDark ? 'bg-[#1D1D1D]' : 'bg-[#F3EBDD]/70'
        }`}
      >
        {/* Badge */}
        {product.badge && (
          <span
            className={` absolute top-3 end-3 z-10 px-2.5 py-1 text-[11px] font-bold rounded-full border backdrop-blur-md ${
              isDark
                ? 'bg-[#111111]/85 text-[#C5A36A] border-[#C5A36A]/40'
                : 'bg-[#FFFFFF]/90 text-[#A98750] border-[#A98750]/45'
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist and Quickview Floating Buttons */}
        <div className="absolute top-3 start-3 z-10 flex flex-col gap-2">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-xl backdrop-blur-md transition-all border cursor-pointer ${
              isWish
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-500'
                : isDark
                ? 'bg-[#111111]/80 border-white/10 text-[#F5F0E8] hover:text-rose-400'
                : 'bg-[#FFFFFF]/90 border-[#A98750]/30 text-[#29231D] hover:text-rose-600'
            }`}
            title={t.actions?.wishlist || 'المفضلة'}
            aria-label={t.actions?.wishlist || 'المفضلة'}
          >
            <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
              isDark
                ? 'bg-[#111111]/80 border-white/10 text-[#F5F0E8] hover:text-[#C5A36A]'
                : 'bg-[#FFFFFF]/90 border-[#A98750]/30 text-[#29231D] hover:text-[#A98750]'
            }`}
            title={t.actions?.quickView || 'نظرة سريعة'}
            aria-label={t.actions?.quickView || 'نظرة سريعة'}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Perfume Image with Zoom on hover */}
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-contain rounded-xl transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Olfactory Family */}
          <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
            <span className={isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}>{product.categoryName}</span>
            <span className={isDark ? 'text-[#F5F0E8]/60' : 'text-[#29231D]/65'}>{product.scentFamily}</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`}>
            <h3
              className={`text-base font-bold transition mb-0.5 line-clamp-1 ${
                isDark
                  ? 'text-[#F5F0E8] group-hover:text-[#C5A36A]'
                  : 'text-[#29231D] group-hover:text-[#A98750]'
              }`}
            >
              {product.name}
            </h3>
            <p
              className={`text-[11px] font-serif tracking-widest uppercase mb-2 ${
                isDark ? 'text-[#F5F0E8]/60' : 'text-[#29231D]/60'
              }`}
            >
              {product.nameEn}
            </p>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className={`flex items-center ${isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'}`}>
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className={`text-xs font-bold ms-1 ${isDark ? 'text-[#F5F0E8]' : 'text-[#29231D]'}`}>
                {product.rating}
              </span>
            </div>
            <span className={`text-[11px] ${isDark ? 'text-[#F5F0E8]/55' : 'text-[#29231D]/55'}`}>
              ({product.reviewsCount})
            </span>
          </div>

          {/* Key Notes */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.notes?.top?.slice(0, 2).map((note, idx) => (
              <span
                key={idx}
                className={`text-[10px] px-2 py-0.5 rounded border ${
                  isDark
                    ? 'bg-[#1D1D1D] text-[#F5F0E8]/80 border-white/10'
                    : 'bg-[#F3EBDD] text-[#29231D]/85 border-[#A98750]/25'
                }`}
              >
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
                className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer ${
                  selectedSize === s.size
                    ? isDark
                      ? 'border-[#C5A36A] text-[#C5A36A] bg-[#C5A36A]/15 font-bold'
                      : 'border-[#A98750] text-[#A98750] bg-[#F3EBDD] font-bold'
                    : isDark
                    ? 'border-[#2C2C2C] text-[#F5F0E8]/60 hover:border-[#C5A36A]/50'
                    : 'border-[#E9DECC] text-[#29231D]/65 hover:border-[#A98750]/50'
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div
          className={`pt-3 border-t flex items-center justify-between gap-2 ${
            isDark ? 'border-[#2C2C2C]' : 'border-[#E9DECC]'
          }`}
        >
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-lg font-extrabold font-mono ${
                  isDark ? 'text-[#C5A36A]' : 'text-[#A98750]'
                }`}
              >
                {currentPrice} {t.currency}
              </span>
              {product.originalPrice && (
                <span className="text-xs opacity-50 line-through">{product.originalPrice}</span>
              )}
            </div>
            <span className="text-[10px] opacity-60 block">
              {language === 'ar' ? 'شامل الضريبة' : 'כולל מע״מ'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`keep-white-text flex items-center gap-1.5 px-3.5 py-2 font-bold text-xs rounded-xl shadow-md transition transform active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-[#C5A36A] hover:bg-[#D4B67D] text-[#111111]'
                : 'bg-[#A98750] hover:bg-[#8F6F3C] text-[#FFFFFF]'
            }`}
            title={t.actions?.addToCart || 'إضافة للسلة'}
            aria-label={`${t.actions?.addToCart || 'إضافة'} ${product.name}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'أضف' : 'הוסף'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
