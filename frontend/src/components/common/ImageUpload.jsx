import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { uploadImage } from '../../services/uploadService';

const ImageUpload = ({
  value = '',
  onChange,
  label = 'صورة الملف',
  helperText = 'الصيغ المدعومة: JPG, PNG, WEBP, GIF حتى 15MB',
  aspectRatio = 'square', // 'square' | 'banner' | 'auto'
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [tempUrl, setTempUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setErrorMessage('');
    setIsUploading(true);

    try {
      const result = await uploadImage(file);
      if (result && result.url) {
        onChange(result.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setErrorMessage(err.message || 'فشل في رفع الصورة، يرجى المحاولة مجدداً.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualUrlSubmit = (e) => {
    e.preventDefault();
    if (!tempUrl.trim()) return;
    onChange(tempUrl.trim());
    setTempUrl('');
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Aspect ratio classes
  const aspectClasses = {
    square: 'aspect-square max-h-56',
    banner: 'aspect-[21/9] sm:aspect-[3/1] max-h-48',
    auto: 'h-48'
  }[aspectRatio] || 'h-48';

  return (
    <div className={`space-y-2 text-right ${className}`}>
      {/* Top Header & Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
        
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-0.5 rounded-lg font-medium transition cursor-pointer ${
              mode === 'upload' 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            رفع من الجهاز
          </button>
          <span className="text-slate-600">|</span>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-0.5 rounded-lg font-medium transition cursor-pointer ${
              mode === 'url' 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            إدخال رابط URL
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        className="hidden"
      />

      {/* When Image Exists: Rich Preview Card */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-slate-950 p-2 group shadow-xl">
          <div className={`relative w-full ${aspectClasses} rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center`}>
            <img
              src={value}
              alt="صورة تم رفعها"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/koon-logo.jpg';
              }}
            />

            {/* Hover Actions Bar */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg cursor-pointer"
                title="تغيير الصورة واختيار ملف آخر"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
                <span>استبدال الصورة</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="px-3 py-2 bg-rose-500/90 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg cursor-pointer"
                title="حذف الصورة الحالية"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            </div>
          </div>

          {/* Footer Info & URL Display */}
          <div className="pt-2 px-1 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>جاهزة للعرض في المتجر</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 truncate max-w-[200px]" title={value}>
              {value.startsWith('data:') ? 'Base64 Embedded' : value.slice(0, 35) + '...'}
            </span>
          </div>
        </div>
      ) : mode === 'upload' ? (
        /* Upload Mode: Drag & Drop Zone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
            dragActive
              ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
              : 'border-slate-700 hover:border-amber-500/60 bg-slate-950/60 hover:bg-slate-900/60'
          } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
        >
          {isUploading ? (
            <div className="py-4 space-y-2">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-amber-300">جاري رفع وحفظ الصورة...</p>
              <span className="text-[10px] text-slate-400 block">يرجى الانتظار ثوانٍ معدودة</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">
                  اضغط لاختيار صورة من جهازك <span className="text-amber-400">أو اسحبها إلى هنا</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  {helperText}
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 transition"
              >
                تصفح الملفات 📁
              </button>
            </>
          )}
        </div>
      ) : (
        /* URL Input Mode: Direct Link Input */
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... أو رابط الصورة المباشر"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleManualUrlSubmit}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
            >
              استخدام الرابط
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            يمكنك إدخال رابط صورة مباشرة من أي موقع، وسيتم ربطها وعرضها فوراً.
          </p>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

