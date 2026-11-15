import crypto from 'crypto';
import { supabase } from '../config/supabase.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@koonperfume.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'KoonAdmin2026!';
const JWT_SECRET = process.env.JWT_SECRET || 'koon-celestial-admin-secret-key-2026';

/**
 * Simple secure HMAC token generator for Admin sessions
 */
function generateAdminToken(email) {
  const payload = {
    email,
    role: 'superadmin',
    issuedAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };
  const base = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(base).digest('base64url');
  return `${base}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [base, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(base).digest('base64url');
  if (signature !== expectedSig) return null;

  try {
    const payload = JSON.parse(Buffer.from(base, 'base64url').toString('utf8'));
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Admin Login Endpoint
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanAdminEmail = ADMIN_EMAIL.trim().toLowerCase();

    if (cleanEmail !== cleanAdminEmail || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة. يرجى التحقق والمحاولة مجدداً.'
      });
    }

    const token = generateAdminToken(cleanEmail);

    return res.json({
      success: true,
      message: 'تم تسجيل دخول المشرف بنجاح.',
      token,
      admin: {
        email: cleanEmail,
        name: 'مدير دار كون للعطور',
        role: 'superadmin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Verify current Admin session token
 */
export const verifySession = async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      message: 'انتهت صلاحية الجلسة أو الرمز غير صالح.'
    });
  }

  return res.json({
    success: true,
    admin: {
      email: payload.email,
      role: payload.role
    }
  });
};

/**
 * Admin Dashboard Unified Statistics
 */
export const getAdminOverview = async (req, res) => {
  try {
    if (!supabase) {
      return res.json({
        success: true,
        data: {
          productsCount: 0,
          ordersCount: 0,
          totalRevenue: 0,
          pendingCash: 0,
          newOrdersCount: 0
        }
      });
    }

    // 1. Products Count
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // 2. Orders Summary
    const { data: orders = [] } = await supabase
      .from('orders')
      .select('*');

    const ordersCount = orders.length;
    const newOrdersCount = orders.filter(o => o.order_status === 'new').length;
    const totalRevenue = orders
      .filter(o => o.order_status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const pendingCash = orders
      .filter(o => o.payment_status === 'pending_cash' && o.order_status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const collectedCash = orders
      .filter(o => o.payment_status === 'collected')
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

    return res.json({
      success: true,
      data: {
        productsCount: productsCount || 0,
        ordersCount,
        newOrdersCount,
        totalRevenue,
        pendingCash,
        collectedCash
      }
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
