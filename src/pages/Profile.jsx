import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  LogOut,
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { wishlist } = useCart();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'settings'
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('koon_orders') || '[]');
      if (savedOrders.length > 0) {
        setOrders(savedOrders);
      } else {
        // Sample initial order so page is never empty
        setOrders([
          {
            orderId: 'KOON-782914',
            date: '11 نوفمبر 2026',
            total: 480,
            status: 'قيد التوصيل 🚚',
            paymentMethod: 'مدى Mada',
            items: [
              {
                name: 'كون أبسولوت',
                size: '100ml',
                quantity: 1,
                price: 480,
                image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop'
              }
            ]
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-xl shadow-amber-500/20">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
              <User className="w-10 h-10" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">عبدالله الشمري</h1>
              <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                عضو كوني ماسي 🪐
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">a.alshammari@example.com • 0501234567</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-300">
              <span>رصيد نقاط الولاء: <strong className="text-amber-400 font-mono">350 نقطة</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">حساب موثق</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => alert('تم تسجيل الخروج بنجاح')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* Main Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="space-y-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-right ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/40 text-slate-300 hover:bg-slate-800/60 border border-slate-800/80'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>قائمة طلباتي ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-right ${
              activeTab === 'addresses'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/40 text-slate-300 hover:bg-slate-800/60 border border-slate-800/80'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>العناوين المحفوظة (2)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-right ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/40 text-slate-300 hover:bg-slate-800/60 border border-slate-800/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>إعدادات الحساب والأمان</span>
          </button>

          <Link
            to="/wishlist"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold bg-slate-900/40 text-slate-300 hover:bg-slate-800/60 border border-slate-800/80 transition"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>العطور المفضلة ({wishlist.length})</span>
          </Link>
        </aside>

        {/* Tab Content Area */}
        <div className="lg:col-span-3">
          
          {/* 1. Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">سجل الطلبات</h3>
              {orders.map((ord, idx) => (
                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400">رقم الطلب: </span>
                      <strong className="text-amber-400 font-mono text-sm">{ord.orderId}</strong>
                      <span className="text-slate-500 mr-2">({ord.date})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                        {ord.status || 'تم اعتماد الطلب'}
                      </span>
                      <Link
                        to={`/track-order?orderId=${ord.orderId}`}
                        className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>تتبع الشحنة</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {ord.items.map((it, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img src={it.image} alt="" className="w-12 h-12 object-contain rounded-lg bg-slate-950 p-1" />
                          <div>
                            <div className="font-bold text-white">{it.name}</div>
                            <div className="text-slate-400">{it.size} • الكمية: {it.quantity}</div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-slate-200">
                          {it.price * it.quantity} ر.س
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">الإجمالي المدفوع:</span>
                    <span className="text-base font-bold text-amber-400 font-mono">{ord.total} ر.س</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">العناوين المحفوظة للشحن</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/50 border border-amber-500/30 space-y-2 relative">
                  <span className="absolute top-4 left-4 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                    العنوان الافتراضي
                  </span>
                  <div className="font-bold text-sm text-white">المنزل - الرياض</div>
                  <div className="text-xs text-slate-300">حي النرجس، شارع أنس بن مالك</div>
                  <div className="text-xs text-slate-400 font-mono">هاتف: 0501234567</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <div className="font-bold text-sm text-white">العمل - الرياض</div>
                  <div className="text-xs text-slate-300">طريق الملك فهد، برج العقيق، الطابق 14</div>
                  <div className="text-xs text-slate-400 font-mono">هاتف: 0501234567</div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-base font-bold text-white">إعدادات الحساب</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">الاسم الكامل</label>
                  <input type="text" defaultValue="عبدالله الشمري" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">البريد الإلكتروني</label>
                  <input type="email" defaultValue="a.alshammari@example.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">رقم الجوال</label>
                  <input type="tel" defaultValue="0501234567" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                </div>
              </div>
              <button className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition">
                حفظ التغييرات
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

