import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart, showToast } = useCart();

  const handleAddAllToCart = () => {
    wishlist.forEach(product => {
      addToCart(product, '100ml', 1);
    });
    showToast('تمت إضافة جميع العطور المفضلة إلى سلتك ✨', 'success');
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">قائمة أمنياتك خالية حالياً</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          احتفظ بعطورك المفضلة هنا للرجوع إليها في أي وقت أو طلبها لاحقاً.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
        >
          <span>استكشف عطور كون الفاخرة</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">قائمة العطور المفضلة</h1>
          <p className="text-xs text-slate-400 mt-1">
            لديك <strong className="text-amber-400">{wishlist.length}</strong> عطور محفوظة في قائمتك
          </p>
        </div>

        <button
          onClick={handleAddAllToCart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>إضافة الكل إلى السلة</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
