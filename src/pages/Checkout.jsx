import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

const SAUDI_CITIES = [
  'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 
  'الخبر', 'الظهران', 'الأحساء', 'بريدة', 'عنيزة', 'تبوك', 
  'أبها', 'خميس مشيط', 'الطائف', 'حائل', 'جازان', 'نجران', 'الجبيل'
];

const Checkout = () => {
  const navigate = useNavigate();
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
    city: 'الرياض',
    district: '',
    street: '',
    notes: '',
  });

  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('mada'); // 'mada' | 'applepay' | 'credit' | 'tamara' | 'tabby' | 'cod'
  const [cardDetails, setCardDetails] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">السلة فارغة حالياً</h2>
        <p className="text-xs text-slate-400">يرجى إضافة عطور إلى السلة أولاً قبل إتمام الطلب.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
        >
          الذهاب للمتجر
        </button>
      </div>
    );
  }

  const expressShippingAddon = shippingMethod === 'express' ? 25 : 0;
  const finalPayable = grandTotal + expressShippingAddon;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate luxury order processing
    setTimeout(() => {
      const orderId = `KOON-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData = {
        orderId,
        items: [...cart],
        customer: formData,
        paymentMethod,
        shippingMethod,
        total: finalPayable,
        discount: discountAmount,
        date: new Date().toLocaleDateString('ar-SA'),
        selectedSample
      };

      // Store in localStorage for Order Tracking & Profile lookup
      try {
        const existingOrders = JSON.parse(localStorage.getItem('koon_orders') || '[]');
        localStorage.setItem('koon_orders', JSON.stringify([orderData, ...existingOrders]));
      } catch (err) {
        console.error(err);
      }

      clearCart();
      setIsProcessing(false);
      navigate('/order-confirmation', { state: { order: orderData } });
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">إتمام الطلب والدفع الآمن</h1>
          <p className="text-xs text-slate-400 mt-1">
            عملية شراء مشفرة ومحمية ببروتوكول أمان SSL 256-bit
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>دفع آمن 100%</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Checkout Inputs (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Customer Information & Shipping Address */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">بيانات التوصيل والشحن</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">الاسم الأول *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: محمد"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">اسم العائلة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: القحطاني"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">البريد الإلكتروني (لتأكيد الفاتورة) *</label>
                  <input
                    type="email"
                    required
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">رقم الجوال للتوصيل *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="50XXXXXXX"
                      dir="ltr"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-4 pl-16 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-left font-mono"
                    />
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono" dir="ltr">+966</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">المدينة *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    {SAUDI_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">الحي السكني *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حي النرجس، حي الروضة"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">الشارع والوصف الإضافي *</label>
                  <input
                    type="text"
                    required
                    placeholder="اسم الشارع، رقم المبنى أو معلم قريب"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Speed */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-4 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
                <Truck className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">خيار سرعة التوصيل</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition ${
                  shippingMethod === 'standard'
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="accent-amber-500 mt-1"
                  />
                  <div>
                    <div className="text-xs font-bold">شحن قياسي مبرد (2-4 أيام عمل)</div>
                    <div className="text-[11px] text-slate-400">توصيل آمن لجميع مناطق المملكة</div>
                    <div className="text-xs font-bold text-amber-400 mt-1">
                      {shippingCost === 0 ? 'مجاناً' : `${shippingCost} ر.س`}
                    </div>
                  </div>
                </label>

                <label className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition ${
                  shippingMethod === 'express'
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="accent-amber-500 mt-1"
                  />
                  <div>
                    <div className="text-xs font-bold">توصيل كوني فوري (خلال 24 ساعة) ⚡</div>
                    <div className="text-[11px] text-slate-400">متاح لمدن: الرياض، جدة، الدمام</div>
                    <div className="text-xs font-bold text-amber-400 mt-1">+25 ر.س إضافية</div>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Payment Methods */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">طريقة الدفع</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                
                {/* Mada */}
                <label className={`p-3.5 rounded-xl border cursor-pointer text-center transition ${
                  paymentMethod === 'mada'
                    ? 'bg-amber-500/15 border-amber-400 text-white font-bold'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'mada'}
                    onChange={() => setPaymentMethod('mada')}
                    className="sr-only"
                  />
                  <div className="text-sm font-bold">بطاقة مدى Mada</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">بطاقات الصراف السعودية</div>
                </label>

                {/* Apple Pay */}
                <label className={`p-3.5 rounded-xl border cursor-pointer text-center transition ${
                  paymentMethod === 'applepay'
                    ? 'bg-amber-500/15 border-amber-400 text-white font-bold'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'applepay'}
                    onChange={() => setPaymentMethod('applepay')}
                    className="sr-only"
                  />
                  <div className="text-sm font-bold">Apple Pay</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">دفع فوري بلمسة واحدة</div>
                </label>

                {/* Credit Card */}
                <label className={`p-3.5 rounded-xl border cursor-pointer text-center transition ${
                  paymentMethod === 'credit'
                    ? 'bg-amber-500/15 border-amber-400 text-white font-bold'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'credit'}
                    onChange={() => setPaymentMethod('credit')}
                    className="sr-only"
                  />
                  <div className="text-sm font-bold">Visa / Mastercard</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">البطاقات الائتمانية</div>
                </label>

                {/* Tamara */}
                <label className={`p-3.5 rounded-xl border cursor-pointer text-center transition ${
                  paymentMethod === 'tamara'
                    ? 'bg-amber-500/15 border-amber-400 text-white font-bold'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'tamara'}
                    onChange={() => setPaymentMethod('tamara')}
                    className="sr-only"
                  />
                  <div className="text-sm font-bold text-amber-300">تمارا Tamara</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">قسمها على 4 دفعات</div>
                </label>

                {/* Tabby */}
                <label className={`p-3.5 rounded-xl border cursor-pointer text-center transition ${
                  paymentMethod === 'tabby'
                    ? 'bg-amber-500/15 border-amber-400 text-white font-bold'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'tabby'}
                    onChange={() => setPaymentMethod('tabby')}
                    className="sr-only"
                  />
                  <div className="text-sm font-bold text-emerald-300">تابي Tabby</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">4 دفعات بدون فوائد</div>
                </label>

                {/* COD */}
                <label className={`p-3.5 rounded-xl border cursor-pointer text-center transition ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-500/15 border-amber-400 text-white font-bold'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <div className="text-sm font-bold">الدفع عند الاستلام</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">نقداً أو شبكة للمندوب</div>
                </label>
              </div>

              {/* Card Inputs if Mada or Credit selected */}
              {(paymentMethod === 'mada' || paymentMethod === 'credit') && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">رقم البطاقة</label>
                    <input
                      type="text"
                      required
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono tracking-widest focus:outline-none focus:border-amber-400 text-left"
                      dir="ltr"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">تاريخ الانتهاء</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-amber-400 text-left"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">رمز الأمان (CVV)</label>
                      <input
                        type="password"
                        required
                        maxLength="4"
                        placeholder="•••"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-amber-400 text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Installment Info if Tamara or Tabby */}
              {(paymentMethod === 'tamara' || paymentMethod === 'tabby') && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 animate-fade-in">
                  <div className="font-bold text-amber-300">
                    قسم فاتورتك على 4 دفعات مريحة بقيمة: {(finalPayable / 4).toFixed(2)} ر.س / شهرياً
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    بدون أي فوائد أو رسوم خفية، متوافق مع أحكام الشريعة الإسلامية. سيتم تحويلك للبوابة للمصادقة السريعة عبر رقم جوالك.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Review Sticky Sidebar (Right Col) */}
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-6 backdrop-blur-md sticky top-24">
              <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
                مراجعة العطور المطلوبة ({cart.length})
              </h3>

              {/* Items mini list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-lg bg-slate-950 p-1 object-contain shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.size} × {item.quantity}</div>
                    </div>
                    <div className="font-mono font-bold text-amber-400">
                      {item.price * item.quantity} ر.س
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono">{subtotal} ر.س</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>الخصم المطبق ({promoCode}):</span>
                    <span className="font-mono">-{discountAmount} ر.س</span>
                  </div>
                )}
                {giftWrapping && (
                  <div className="flex justify-between">
                    <span>التغليف الملكي:</span>
                    <span className="font-mono">+{giftWrapCost} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>الشحن ({shippingMethod === 'express' ? 'سريع فوري' : 'قياسي'}):</span>
                  <span className="font-mono">
                    {shippingCost + expressShippingAddon === 0 ? 'مجاناً' : `${shippingCost + expressShippingAddon} ر.س`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-slate-800">
                  <span>المبلغ الإجمالي للدفع:</span>
                  <span className="text-amber-400 font-mono text-xl">{finalPayable} ر.س</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 transform active:scale-95 text-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>جاري معالجة وتأكيد الطلب الفلكي...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>تأكيد الطلب والدفع ({finalPayable} ر.س)</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-slate-500 text-center leading-relaxed">
                بالضغط على تأكيد الطلب، فإنك توافق على سياسة الخصوصية والشروط والأحكام لمتجر كون بيرفيوم.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

