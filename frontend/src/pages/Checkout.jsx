import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { submitOrder } from '../services/orderService';
import { 
  ShieldCheck, 
  Banknote, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  PackageCheck,
  AlertCircle
} from 'lucide-react';

const CITIES = [
  'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 
  'الخبر', 'الظهران', 'الأحساء', 'بريدة', 'عنيزة', 'تبوك', 
  'أبها', 'خميس مشيط', 'الطائف', 'حائل', 'جازان', 'نجران', 'الجبيل',
  'ירושלים', 'תל אביב', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'באר שבע'
];

const Checkout = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const ct = t.checkout || {};
  const currency = t.currency || 'ر.س';

  const { 
    cart, 
    subtotal, 
    discountAmount, 
    shippingCost, 
    giftWrapping, 
    giftWrapCost, 
    grandTotal, 
    promoCode, 
    clearCart,
    selectedSample,
    showToast
  } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: language === 'he' ? 'תל אביב' : 'الرياض',
    address: '',
    notes: '',
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">السلة فارغة حالياً / עגלת הקניות ריקה</h2>
        <p className="text-xs text-slate-400">يرجى إضافة عطور إلى السلة أولاً قبل إتمام الطلب.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition cursor-pointer"
        >
          {t.actions?.exploreBtn || 'الذهاب للمتجر'}
        </button>
      </div>
    );
  }

  const expressShippingAddon = shippingMethod === 'express' ? 25 : 0;
  const finalPayable = grandTotal + expressShippingAddon;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.firstName || !formData.phone || !formData.address) {
      showToast('يرجى ملء الحقول الإلزامية وعنوان التوصيل', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const customerFullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const payload = {
        customer_name: customerFullName,
        customer_phone: formData.phone,
        customer_email: formData.email,
        shipping_city: formData.city,
        shipping_address: formData.address,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          nameEn: item.nameEn || item.name_en,
          price: item.sizes?.find(s => s.size === item.selectedSize)?.price || item.price,
          selectedSize: item.selectedSize || '100ml',
          quantity: item.quantity || 1,
          image: item.images?.[0] || item.image_url
        })),
        total_amount: finalPayable,
        subtotal: subtotal,
        discount_amount: discountAmount,
        promo_code: promoCode || '',
        payment_method: 'cod',
        payment_status: 'pending_cash',
        sample_gift: selectedSample || '',
        notes: formData.notes || ''
      };

      const savedOrder = await submitOrder(payload);

      // Local storage backup for immediate tracking & profile view
      try {
        const existingOrders = JSON.parse(localStorage.getItem('koon_orders') || '[]');
        localStorage.setItem('koon_orders', JSON.stringify([savedOrder, ...existingOrders]));
      } catch (err) {}

      clearCart();
      setIsProcessing(false);
      navigate('/order-confirmation', { state: { order: savedOrder } });
    } catch (err) {
      console.error('Order submission error:', err);
      setIsProcessing(false);
      setSubmitError(err.message || 'حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة مجدداً.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {ct.title || 'إتمام الطلب والدفع عند الاستلام'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {ct.subtitle || 'عملية شراء آمنة ومريحة، ادفع نقداً عند استلام عطرك وتفقده'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/20">
          <Banknote className="w-4 h-4 text-amber-400" />
          <span>{ct.codTitle || 'الدفع عند الاستلام نقداً'}</span>
        </div>
      </div>

      {submitError && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Checkout Inputs (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Customer Information & Shipping Address */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">
                  {ct.customerInfo || 'بيانات العميل وعنوان التوصيل'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {ct.firstName || 'الاسم الأول'} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                    <input
                      type="text"
                      required
                      placeholder="محمد"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {ct.lastName || 'اسم العائلة'}
                  </label>
                  <input
                    type="text"
                    placeholder="العتيبي"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {ct.phone || 'رقم الجوال للتوصيل'} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                    <input
                      type="tel"
                      required
                      placeholder="05XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      dir="ltr"
                    />
                  </div>
                  <p className="text-[10px] text-amber-400/80 mt-1">
                    {ct.phoneHint || 'ضروري لتنسيق المندوب معك قبل التوصيل'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {ct.email || 'البريد الإلكتروني (اختياري)'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                    <input
                      type="email"
                      placeholder="example@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {ct.city || 'المدينة'} *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {ct.address || 'العنوان التفصيلي (الحي، الشارع، رقم المبنى)'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="حي النرجس، شارع أنس بن مالك، مبنى رقم 12"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {ct.notes || 'ملاحظات إضافية للتوصيل'}
                  </label>
                  <textarea
                    rows="2"
                    placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Exclusive Payment Method: Cash on Delivery (الدفع عند الاستلام) */}
            <div className="bg-slate-900/50 border border-amber-500/30 p-6 rounded-2xl space-y-4 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <Banknote className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">
                  {ct.paymentMethodTitle || 'طريقة الدفع المعتمدة'}
                </h2>
              </div>

              {/* COD Prominent Card */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-slate-100 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      {ct.codTitle || 'الدفع عند الاستلام نقداً (Cash on Delivery)'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      بدون رسوم إضافية
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {ct.codDesc || 'ادفع نقداً لمندوب التوصيل عند استلام شحنتك وتفقد عطرك الفاخر بكل راحة واطمئنان.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ct.guarantee || 'ضمان أصالة وثبات 100% مع حق المعاينة عند الاستلام'}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6 backdrop-blur-sm sticky top-24">
              <h2 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
                {ct.orderSummary || 'ملخص الطلبية'}
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-950 p-1 border border-slate-800 shrink-0">
                      <img 
                        src={item.images?.[0] || item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-400">
                        {item.selectedSize || '100ml'} × {item.quantity || 1}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-amber-400">
                      {((item.sizes?.find(s => s.size === item.selectedSize)?.price || item.price) * (item.quantity || 1)).toFixed(2)} {currency}
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{ct.subtotal || 'المجموع الفرعي'}</span>
                  <span>{subtotal.toFixed(2)} {currency}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>{ct.discount || 'الخصم'} ({promoCode})</span>
                    <span>-{discountAmount.toFixed(2)} {currency}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>{ct.shipping || 'الشحن والتوصيل'}</span>
                  <span className="text-emerald-400 font-bold">{ct.shippingFree || 'مجاني'}</span>
                </div>

                {giftWrapping && (
                  <div className="flex justify-between text-slate-400">
                    <span>تغليف ملكي كوني فاخر</span>
                    <span>+{giftWrapCost} {currency}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-black text-white">
                  <span>{ct.grandTotal || 'المبلغ الإجمالي عند الاستلام'}</span>
                  <span className="text-amber-400">{finalPayable.toFixed(2)} {currency}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{ct.processing || 'جاري تأكيد وتسجيل طلبك...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{ct.placeOrderBtn || 'تأكيد الطلب والدفع عند الاستلام ✨'}</span>
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-slate-500">
                الدفع نقداً للمندوب عند الاستلام • فحص العبوة متاح قبل الدفع
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default Checkout;
