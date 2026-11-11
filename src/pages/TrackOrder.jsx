import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const urlOrderId = searchParams.get('orderId') || '';
  
  const [searchQuery, setSearchQuery] = useState(urlOrderId || 'KOON-782914');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Auto track if param provided or on mount with default
  useEffect(() => {
    handleTrack(searchQuery);
  }, []);

  const handleTrack = (id) => {
    if (!id.trim()) return;

    // Check localStorage first
    try {
      const orders = JSON.parse(localStorage.getItem('koon_orders') || '[]');
      const found = orders.find(o => o.orderId.toLowerCase() === id.trim().toLowerCase());
      if (found) {
        setTrackedOrder({
          id: found.orderId,
          date: found.date,
          status: 'processing', // 'confirmed' | 'processing' | 'shipped' | 'delivered'
          carrier: 'شحن كون كوزميك المبرد (SMSA Express)',
          trackingNumber: `SMSA-${found.orderId}`,
          city: found.customer.city,
          estimatedDate: 'خلال 48 ساعة عمل',
          items: found.items
        });
        setNotFound(false);
        return;
      }
    } catch (e) {}

    // Demo fallback for default or any simulated ID
    if (id.trim().toUpperCase().startsWith('KOON') || id.trim().length >= 4) {
      setTrackedOrder({
        id: id.trim().toUpperCase(),
        date: '11 نوفمبر 2026',
        status: 'shipped',
        carrier: 'أسطول كون للشحن المبرد السريع',
        trackingNumber: `KOON-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
        city: 'الرياض - حي النرجس',
        estimatedDate: 'غداً قبل الساعة 4:00 مساءً',
        items: [
          { name: 'كون أبسولوت (100ml)', qty: 1 }
        ]
      });
      setNotFound(false);
    } else {
      setNotFound(true);
      setTrackedOrder(null);
    }
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleTrack(searchQuery);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">
          <Truck className="w-3.5 h-3.5" />
          <span>تتبع الشحنات المباشر</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          أين وصل عطري؟
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          أدخل رقم طلبك الفلكي (مثال: <strong className="text-amber-400 font-mono">KOON-782914</strong>) للاطلاع على خط سير الشحنة لحظة بلحظة.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={onSearchSubmit} className="max-w-lg mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required
            placeholder="أدخل رقم الطلب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" />
          <span>تتبع</span>
        </button>
      </form>

      {/* Tracking Result */}
      {notFound ? (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-white">لم يتم العثور على شحنة بهذا الرقم</h3>
          <p className="text-xs text-slate-400">تأكد من كتابة الرقم بالشكل الصحيح أو تواصل مع خدمة العملاء.</p>
        </div>
      ) : trackedOrder ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-md shadow-2xl">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400">رقم الشحنة:</span>
              <h2 className="text-xl font-bold text-amber-400 font-mono">{trackedOrder.id}</h2>
              <span className="text-xs text-slate-400">تاريخ الطلب: {trackedOrder.date}</span>
            </div>

            <div className="sm:text-left">
              <span className="text-xs text-slate-400 block">موعد التوصيل المتوقع:</span>
              <span className="text-sm font-bold text-emerald-400">{trackedOrder.estimatedDate}</span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">مراحل الشحن:</h3>
            
            <div className="relative border-r-2 border-slate-800 mr-4 pr-6 space-y-8">
              
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -right-[33px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-900 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-slate-950" />
                </span>
                <div className="text-xs font-bold text-white">تم استلام الطلب وتأكيد الفاتورة</div>
                <div className="text-[11px] text-slate-400 mt-0.5">تمت المصادقة وبدء تخصيص زجاجات العطر المعتّقة.</div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className="absolute -right-[33px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-900 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-slate-950" />
                </span>
                <div className="text-xs font-bold text-white">التجهيز والتغليف الملكي وإرفاق العينات</div>
                <div className="text-[11px] text-slate-400 mt-0.5">تم وضع العطر في بوكس كون الفلكي المقاوم للصدمات.</div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <span className="absolute -right-[33px] top-0 w-4 h-4 rounded-full bg-amber-400 ring-4 ring-slate-900 animate-pulse" />
                <div className="text-xs font-bold text-amber-300">خرج مع المندوب وفي الطريق إليك 🚚</div>
                <div className="text-[11px] text-slate-400 mt-0.5">الشحنة في سيارة مبردة لضمان ثبات الزيوت العطرية بدرجة حرارة مثالية.</div>
              </div>

              {/* Step 4 */}
              <div className="relative opacity-50">
                <span className="absolute -right-[33px] top-0 w-4 h-4 rounded-full bg-slate-700 ring-4 ring-slate-900" />
                <div className="text-xs font-bold text-slate-400">التسليم النهائي</div>
                <div className="text-[11px] text-slate-500 mt-0.5">استلام الشحنة وتوقيع الاستلام.</div>
              </div>
            </div>
          </div>

          {/* Shipping Meta Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">الناقل اللوجستي:</span>
              <div className="font-bold text-slate-200 mt-0.5">{trackedOrder.carrier}</div>
              <div className="text-slate-500 font-mono text-[11px] mt-0.5">رقم البوليصة: {trackedOrder.trackingNumber}</div>
            </div>
            <div>
              <span className="text-slate-400">وجهة التوصيل:</span>
              <div className="font-bold text-slate-200 mt-0.5">{trackedOrder.city}</div>
              <div className="text-emerald-400 text-[11px] mt-0.5">الشحنة مبردة ومؤمنة بالكامل</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TrackOrder;
