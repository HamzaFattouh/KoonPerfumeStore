import { supabase } from '../utils/supabase';

const API_BASE = import.meta.env.VITE_API_URL || 'https://koonperfume-backend.onrender.com';
const TOKEN_KEY = 'koon_admin_token';
const ADMIN_USER_KEY = 'koon_admin_user';

export function getAdminToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function getAdminUser() {
  try {
    const u = localStorage.getItem(ADMIN_USER_KEY) || sessionStorage.getItem(ADMIN_USER_KEY);
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export function logoutAdmin() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
  } catch {}
}

/**
 * Admin Login
 */
export async function adminLogin(email, password, remember = true) {
  // 1. Try Backend API
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const json = await res.json();
      if (res.ok && json.success && json.token) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(TOKEN_KEY, json.token);
        storage.setItem(ADMIN_USER_KEY, JSON.stringify(json.admin));
        return { success: true, admin: json.admin };
      }
      return { success: false, message: json.message || 'بيانات الدخول غير صحيحة.' };
    } catch (e) {
      console.warn('Backend admin login request failed, falling back to local credentials...', e);
    }
  }

  // Fallback offline validation
  if (email.trim().toLowerCase() === 'admin@koonperfume.com' && password === 'KoonAdmin2026!') {
    const adminUser = { email: 'admin@koonperfume.com', name: 'مدير دار كون للعطور', role: 'superadmin' };
    const dummyToken = 'local-admin-token-' + Date.now();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, dummyToken);
    storage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUser));
    return { success: true, admin: adminUser };
  }

  return { success: false, message: 'بيانات الدخول غير صحيحة.' };
}

/**
 * Verify admin session validity
 */
export async function verifyAdminSession() {
  const token = getAdminToken();
  if (!token) return false;

  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        return json.success === true;
      }
    } catch (e) {
      // In case backend is temporarily restarting, accept stored token
      return true;
    }
  }

  return true;
}

/**
 * Dashboard Overview
 */
export async function getAdminOverview() {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/overview`, {
        headers: { Authorization: `Bearer ${getAdminToken()}` }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {}
  }

  return {
    productsCount: 6,
    ordersCount: 0,
    newOrdersCount: 0,
    totalRevenue: 0,
    pendingCash: 0,
    collectedCash: 0
  };
}

/**
 * Add a new Perfume Product (Admin)
 */
export async function createProduct(productData) {
  // 1. Backend API
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      console.warn('Backend API create product failed, trying Supabase direct...', e);
    }
  }

  // 2. Direct Supabase
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  throw new Error('تعذر إنشاء المنتج: قاعدة البيانات غير متصلة.');
}

/**
 * Update an existing Perfume Product (Admin)
 */
export async function updateProduct(id, updates) {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      console.warn('Backend API update product failed, trying Supabase direct...', e);
    }
  }

  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  throw new Error('تعذر تحديث المنتج.');
}

/**
 * Delete a Perfume Product (Admin)
 */
export async function deleteProduct(id) {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getAdminToken()}` }
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Backend API delete failed, trying Supabase direct...', e);
    }
  }

  if (supabase) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  return false;
}

/**
 * Fetch all site settings (Admin & Public)
 */
export async function getSiteSettings() {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {}
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (!error && data) {
        const map = {};
        data.forEach(item => { map[item.key] = item.data; });
        return map;
      }
    } catch (e) {}
  }

  return {};
}

/**
 * Update a specific site section setting (Admin)
 */
export async function updateSiteSetting(key, data) {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify({ data })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {}
  }

  if (supabase) {
    const { data: updated, error } = await supabase
      .from('site_settings')
      .upsert({ key, data, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  return null;
}

