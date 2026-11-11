import React from 'react';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast } = useCart();

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-900/95 border border-amber-500/30 text-slate-100 rounded-xl shadow-2xl backdrop-blur-xl max-w-md">
        {icons[toast.type] || icons.success}
        <span className="text-sm font-medium leading-relaxed">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
