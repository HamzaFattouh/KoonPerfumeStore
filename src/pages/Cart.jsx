import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ArrowRight, 
  Gift, 
  Tag, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { SAMPLE_GIFTS } from '../data/products';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    shippingCost,
    promoCode,
    discountPercent,
    discountAmount,
    applyPromo,
    removePromo,
    selectedSample,
    setSelectedSample,
    giftWrapping,
    setGiftWrapping,
    giftNote,
    setGiftNote,
    giftWrapCost,
    grandTotal
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const navigate = useNavigate();

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (inputCode) {
      applyPromo(inputCode);
      setInputCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">سلة التسوق فارغة حالياً</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          لم تقم بإضافة أي عطر إلى سلتك بعد. استكشف تشكيلات كون بيرفيوم الفلكية واعثر على عطرك الفريد.
        </p>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-amber-500/20"
          >
            <span>تصفح متجر العطور</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">سلة مشترياتك العطرية</h1>
          <p className="text-xs text-slate-400 mt-1">
            لديك <strong className="text-amber-400">{cart.length}</strong> منتجات في السلة
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>متابعة التسوق وإضافة عطور أخرى</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Free Shipping Bar */}
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
        <div className="flex justify-between items-center text-xs mb-2">
          {remainingForFreeShipping === 0 ? (
            <span className="text-emerald-400 font-bold">🎉 تهانينا! مؤهل للشحن الكوني المجاني</span>
          ) : (
            <span className="text-slate-300">
              أضف بـ <strong className="text-amber-400 font-bold">{remainingForFreeShipping} ر.س</strong> للحصول على توصيل مجاني سريع
            </span>
          )}
          <span className="font-mono text-slate-400">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Items (Left) vs Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-slate-950 rounded-xl p-2 shrink-0 border border-slate-800" 
                />
                <div>
                  <h3 className="text-base font-bold text-white">{item.name}</h3>
                  <p className="text-xs text-slate-400 font-serif tracking-widest">{item.nameEn}</p>
                  <span className="inline-block mt-1 text-xs bg-slate-800 text-amber-300 px-2.5 py-0.5 rounded-md border border-slate-700">
                    السعة: {item.size}
                  </span>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    سعر الحبة: {item.price} ر.س
                  </div>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="flex items-center border border-slate-700 rounded-xl bg-slate-950 p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    className="p-1.5 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    className="p-1.5 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-base font-mono font-bold text-amber-400">
                  {item.price * item.quantity} ر.س
                </div>

                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="text-slate-500 hover:text-rose-400 transition p-1.5"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Complimentary Free Sample Box */}
          <div className="bg-slate-900/30 border border-amber-500/20 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>اختر عينتك المجانية الفاخرة (هدية من كون بيرفيوم):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_GIFTS.map(sample => (
                <label 
                  key={sample.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    selectedSample === sample.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-white font-bold'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="sampleSelection"
                    checked={selectedSample === sample.id}
                    onChange={() => setSelectedSample(sample.id)}
                    className="accent-amber-500"
                  />
                  <span className="text-xs">{sample.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Royal Gift Wrapping Options */}
          <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl space-y-4">
            <label className="flex items-start justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={giftWrapping}
                  onChange={(e) => setGiftWrapping(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-950 border-slate-700 mt-0.5"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">إضافة تغليف ملكي للإهداء (+25 ر.س)</h4>
                  <p className="text-[11px] text-slate-400">صندوق أسود مطرز بشعار كون الذهبي وشريط ساتان فاخر وبطاقة تهنئة.</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">+25 ر.س</span>
            </label>

            {giftWrapping && (
              <div className="pt-2 animate-fade-in">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  اكتب نص بطاقة الإهداء (اختياري):
                </label>
                <textarea
                  rows="2"
                  placeholder="مثال: إلى أغلى الناس، عطر كوني يليق بمقامك الرفيع..."
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-6 backdrop-blur-md sticky top-24">
            <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
              ملخص الطلب والحساب
            </h3>

            {/* Promo Code Applicator */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">كوبون الخصم:</label>
              {promoCode ? (
                <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>تم تطبيق ({promoCode}) - خصم {discountPercent}%</span>
                  </div>
                  <button onClick={removePromo} className="text-xs text-rose-400 hover:underline">
                    حذف
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="رمز الخصم (جرب KOON10)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs rounded-xl transition"
                  >
                    تطبيق
                  </button>
                </form>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>مجموع المنتجات:</span>
                <span className="font-mono font-semibold">{subtotal} ر.س</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>الخصم المطبق ({discountPercent}%):</span>
                  <span className="font-mono">-{discountAmount} ر.س</span>
                </div>
              )}
              {giftWrapping && (
                <div className="flex justify-between">
                  <span>التغليف الملكي الفاخر:</span>
                  <span className="font-mono font-semibold">+{giftWrapCost} ر.س</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>تكلفة الشحن والتوصيل:</span>
                <span className="font-mono font-semibold">
                  {shippingCost === 0 ? <strong className="text-emerald-400">مجاناً</strong> : `${shippingCost} ر.س`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-slate-800">
                <span>المبلغ الإجمالي للدفع:</span>
                <span className="text-amber-400 font-mono text-xl">{grandTotal} ر.س</span>
              </div>
              <span className="text-[10px] text-slate-400 block text-center">شامل ضريبة القيمة المضافة 15%</span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 transform active:scale-95"
            >
              <span>متابعة إتمام الطلب والدفع</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

