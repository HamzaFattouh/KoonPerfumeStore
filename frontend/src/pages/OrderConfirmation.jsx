import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  Truck, 
  ArrowLeft, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { fireConfetti } from '../utils/confetti';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // Run celebration confetti on mount
  useEffect(() => {
    try {
      fireConfetti();
    } catch (e) {
      // safe fallback
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Fallback demo order if visited directly
  const displayOrder = order || {
    orderId: 'KOON-782914',
    date: new Date().toLocaleDateString('ar-SA'),
    customer: {
      firstName: 'عبدالله',
      lastName: 'الشمري',
      email: 'a.alshammari@example.com',
      phone: '501234567',
      city: 'الرياض',
      district: 'حي النرجس',
      street: 'طريق الأمير فيصل'
    },
    paymentMethod: 'مدى Mada',
    total: 480,
    items: [
      {
        name: 'كون أبسولوت',
        nameEn: 'Koon Absolute',
        size: '100ml',
        price: 480,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop'
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Success Hero Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10 animate-bounce-short">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 text-xs font-bold rounded-full border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>تم اعتماد طلبك الفلكي بنجاح</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white">
          شكراً لثقتك في دار كون بيرفيوم
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          تم استلام طلبك وبدأ خبراؤنا في تجهيز وتعتيق عطرك الخاص بعناية فائقة وتغليفه بإحكام لضمان وصوله بأعلى معايير النقاء.
        </p>

        <div className="inline-block bg-slate-900 border border-slate-700/80 px-6 py-2.5 rounded-2xl text-xs">
          <span className="text-slate-400">رقم تتبع الطلب: </span>
          <strong className="text-amber-400 font-mono text-base mr-2">{displayOrder.orderId}</strong>
        </div>
      </div>

      {/* Live Order Status Timeline */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>مراحل تجهيز وتوصيل شحنتك:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
            <span className="text-xs font-bold text-amber-400 block">1. تم التأكيد</span>
            <span className="text-[11px] text-slate-300">تم حجز طلبك بنجاح</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1">
            <span className="text-xs font-bold text-white block">2. جاري التجهيز والتغليف</span>
            <span className="text-[11px] text-slate-400">فحص العطر وإضافة العينات</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1 opacity-70">
            <span className="text-xs font-bold text-slate-400 block">3. تسليم المندوب</span>
            <span className="text-[11px] text-slate-500">في مستودعات الشحن المبرد</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1 opacity-70">
            <span className="text-xs font-bold text-slate-400 block">4. تم التوصيل</span>
            <span className="text-[11px] text-slate-500">استلام العطر عند بابك</span>
          </div>
        </div>
      </div>

      {/* Invoice Details Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-sm print:bg-white print:text-black">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:border-black">
          <div>
            <h3 className="text-lg font-bold text-white print:text-black">تفاصيل الفاتورة الإلكترونية</h3>
            <span className="text-xs text-slate-400 print:text-gray-600">تاريخ الطلب: {displayOrder.date}</span>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الفاتورة</span>
          </button>
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="font-bold text-slate-200">بيانات العميل:</h4>
            <div className="text-slate-300">{displayOrder.customer.firstName} {displayOrder.customer.lastName}</div>
            <div className="text-slate-400">{displayOrder.customer.email}</div>
            <div className="text-slate-400 font-mono" dir="ltr">+966 {displayOrder.customer.phone}</div>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="font-bold text-slate-200">عنوان التوصيل:</h4>
            <div className="text-slate-300">{displayOrder.customer.city} - {displayOrder.customer.district}</div>
            <div className="text-slate-400">{displayOrder.customer.street}</div>
            <div className="text-slate-400">طريقة الدفع: {displayOrder.paymentMethod}</div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-200">العطور المشتراة:</h4>
          {displayOrder.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <img src={item.image} alt="" className="w-12 h-12 object-contain rounded-lg bg-slate-950" />
                <div>
                  <div className="font-bold text-white print:text-black">{item.name}</div>
                  <div className="text-slate-400">{item.size} • الكمية: {item.quantity}</div>
                </div>
              </div>
              <div className="font-mono font-bold text-amber-400">
                {item.price * item.quantity} ر.س
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
          <span className="font-bold text-white print:text-black">المجموع الكلي المدفوع:</span>
          <span className="text-xl font-mono font-extrabold text-amber-400">{displayOrder.total} ر.س</span>
        </div>
      </div>

      {/* Return Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
        <Link
          to={`/track-order?orderId=${displayOrder.orderId}`}
          className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>تتبع الشحنة المباشر</span>
        </Link>

        <Link
          to="/"
          className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
        >
          <span>العودة للرئيسية</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
