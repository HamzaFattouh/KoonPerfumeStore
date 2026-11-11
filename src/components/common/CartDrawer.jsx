import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SAMPLE_GIFTS } from '../../data/products';

const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
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
    giftWrapCost,
    grandTotal 
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  // Free shipping percentage
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (inputCode) {
      applyPromo(inputCode);
      setInputCode('');
    }
  };

  const proceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col text-slate-100">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">سلة المشتريات</h2>
              <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full font-mono">
                {cart.length} منتجات
              </span>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="إغلاق السلة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="p-4 bg-slate-950/40 border-b border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  🎉 مبارك! حصلت على شحن كوني مجاني
                </span>
              ) : (
                <span className="text-slate-300">
                  أضف بـ <strong className="text-amber-400 font-bold">{remainingForFreeShipping} ر.س</strong> للحصول على شحن مجاني
                </span>
              )}
              <span className="font-mono text-slate-400">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">سلتك العطرية فارغة حالياً</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  استكشف مجموعتنا الفاخرة من العطور المستوحاة من سحر وأبعاد الكون وأضف ما يناسب ذوقك الرفيع.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition"
                >
                  تصفح العطور الآن
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.id}-${item.size}`}
                  className="flex gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 hover:border-slate-600 transition"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-slate-950 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-slate-400 hover:text-rose-400 p-1 transition"
                          title="حذف من السلة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 font-serif">{item.nameEn}</p>
                      <span className="inline-block mt-1 text-[11px] bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded">
                        {item.size}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/40">
                      <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="p-1 hover:bg-slate-800 text-slate-300 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-1 hover:bg-slate-800 text-slate-300 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-sm font-bold text-amber-400 font-mono">
                        {item.price * item.quantity} ر.س
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Free Sample Gift Selector when cart has items */}
            {cart.length > 0 && (
              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Gift className="w-4 h-4 text-amber-400" />
                  عينتك المجانية الفاخرة (هدية من كون):
                </div>
                <select
                  value={selectedSample}
                  onChange={(e) => setSelectedSample(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  {SAMPLE_GIFTS.map(sample => (
                    <option key={sample.id} value={sample.id}>
                      {sample.name} - مجاناً 🎁
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Gift Wrapping Toggle */}
            {cart.length > 0 && (
              <label className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800 cursor-pointer hover:bg-slate-800/40 transition">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={giftWrapping}
                    onChange={(e) => setGiftWrapping(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 focus:ring-offset-0 bg-slate-800 border-slate-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">تغليف ملكي فاخر للهدايا</div>
                    <div className="text-[11px] text-slate-400">صندوق فاخر مع شريط حريري وكارت إهداء</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">+25 ر.س</span>
              </label>
            )}

            {/* Promo Code Input */}
            {cart.length > 0 && (
              <div className="pt-2">
                {promoCode ? (
                  <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-300">
                        كود ({promoCode}) مفعل - خصم {discountPercent}%
                      </span>
                    </div>
                    <button 
                      onClick={removePromo}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="كود الخصم (جرب KOON10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
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
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono font-semibold">{subtotal} ر.س</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>الخصم المطبق ({discountPercent}%):</span>
                    <span className="font-mono font-semibold">-{discountAmount} ر.س</span>
                  </div>
                )}
                {giftWrapping && (
                  <div className="flex justify-between">
                    <span>التغليف الملكي:</span>
                    <span className="font-mono font-semibold">+{giftWrapCost} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>الشحن والتوصيل:</span>
                  <span className="font-mono font-semibold">
                    {shippingCost === 0 ? <strong className="text-emerald-400">مجاناً</strong> : `${shippingCost} ر.س`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-amber-400 font-mono text-lg">{grandTotal} ر.س</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={proceedToCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 transform active:scale-95 text-sm"
                >
                  <span>متابعة إتمام الطلب والدفع</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>

                <div className="flex justify-center">
                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs text-slate-400 hover:text-amber-300 hover:underline"
                  >
                    عرض صفحة السلة الكاملة
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

