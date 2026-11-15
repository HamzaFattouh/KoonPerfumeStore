import { supabase } from '../utils/supabase';

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Validates an image file before upload
 */
export const validateImage = (file, maxMB = 15) => {
  if (!file) return { valid: false, error: 'لم يتم اختيار أي ملف.' };

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'نوع الملف غير مدعوم. الصيغ المسموحة هي: JPG, PNG, WEBP, GIF, SVG.'
    };
  }

  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `حجم الصورة كبير جداً (${(file.size / (1024 * 1024)).toFixed(1)}MB). الحد الأقصى المسموح هو ${maxMB}MB.`
    };
  }

  return { valid: true };
};

/**
 * Convert file to base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Upload an image file:
 * 1. Tries Backend /api/upload
 * 2. If Backend fails, tries Supabase Storage directly (if available)
 * 3. If both fail, falls back to optimized Base64 Data URI
 */
export const uploadImage = async (file) => {
  const check = validateImage(file);
  if (!check.valid) {
    throw new Error(check.error);
  }

  // 1. Try Backend Upload Endpoint
  try {
    const formData = new FormData();
    formData.append('image', file);

    const uploadUrl = API_BASE ? `${API_BASE}/api/upload` : '/api/upload';
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.url) {
        return {
          url: data.url,
          path: data.path || data.url,
          filename: data.filename,
          size: data.size,
          provider: data.provider || 'server'
        };
      }
    }
  } catch (backendErr) {
    console.warn('Backend upload attempt failed, falling back to storage/base64...', backendErr.message);
  }

  // 2. Try Supabase Storage directly from client
  if (supabase) {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const cleanName = file.name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 25);
      const filePath = `uploads/koon_${cleanName}_${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: pubData } = supabase.storage.from('uploads').getPublicUrl(filePath);
        if (pubData?.publicUrl) {
          return {
            url: pubData.publicUrl,
            path: filePath,
            provider: 'supabase'
          };
        }
      }
    } catch (supabaseErr) {
      console.warn('Supabase client direct upload failed:', supabaseErr.message);
    }
  }

  // 3. Guaranteed Fallback: Base64 Data URL (works 100% offline and in all environments)
  const base64 = await fileToBase64(file);
  return {
    url: base64,
    path: base64,
    provider: 'base64'
  };
};

