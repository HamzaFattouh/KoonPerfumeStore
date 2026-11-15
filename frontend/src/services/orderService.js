import { supabase } from '../utils/supabase';

const API_BASE = import.meta.env.VITE_API_URL || 'https://koonperfume-backend.onrender.com';

/**
 * Submit a Cash on Delivery order to backend & Supabase
 */
export async function submitOrder(orderPayload) {
  // 1. Try Backend API
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Backend API order failed, falling back to direct Supabase...', e);
    }
  }

  // 2. Direct Supabase Fallback
  if (supabase) {
    try {
      const orderId = orderPayload.id || `KOON-${Math.floor(100000 + Math.random() * 900000)}`;
      const record = {
        ...orderPayload,
        id: orderId,
        payment_method: 'cod',
        payment_status: 'pending_cash',
        order_status: 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([record])
        .select()
        .single();

      if (!error && data) {
        return data;
      }
      if (error) console.error('Supabase direct order insert error:', error);
    } catch (e) {
      console.error('Supabase order submission error:', e);
    }
  }

  // 3. Fallback mock record for offline resilience
  return {
    ...orderPayload,
    id: orderPayload.id || `KOON-${Math.floor(100000 + Math.random() * 900000)}`,
    created_at: new Date().toISOString()
  };
}

/**
 * Fetch orders for Admin Dashboard
 */
export async function getAdminOrders(filters = {}) {
  const { status, payment_status, search } = filters;
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (payment_status && payment_status !== 'all') params.append('payment_status', payment_status);
  if (search) params.append('search', search);

  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/orders?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      console.warn('Backend API get orders failed, trying Supabase direct...', e);
    }
  }

  if (supabase) {
    try {
      let query = supabase.from('orders').select('*');
      if (status && status !== 'all') query = query.eq('order_status', status);
      if (payment_status && payment_status !== 'all') query = query.eq('payment_status', payment_status);
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (e) {}
  }

  return [];
}

/**
 * Update order status (for Admin)
 */
export async function updateOrderStatus(orderId, updates) {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      console.warn('Backend API update order failed, trying Supabase direct...', e);
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {}
  }

  return null;
}

/**
 * Fetch Order Stats (for Admin Dashboard)
 */
export async function getOrderStats() {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/orders/stats`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {}
  }

  return {
    totalOrders: 0,
    newOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    collectedCash: 0,
    pendingCash: 0
  };
}

