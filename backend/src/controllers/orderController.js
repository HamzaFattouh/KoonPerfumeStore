import { supabase } from '../config/supabase.js';

/**
 * Create a new Cash on Delivery (COD) order
 */
export const createOrder = async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email = '',
      shipping_city,
      shipping_address,
      items = [],
      total_amount,
      subtotal = 0,
      discount_amount = 0,
      promo_code = '',
      sample_gift = '',
      notes = ''
    } = req.body;

    if (!customer_name || !customer_phone || !shipping_city || !shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'جميع بيانات العميل وعنوان التوصيل مطلوبة لتأكيد طلب الدفع عند الاستلام.'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'سلة المشتريات فارغة.'
      });
    }

    const orderId = `KOON-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderRecord = {
      id: orderId,
      customer_name,
      customer_phone,
      customer_email,
      shipping_city,
      shipping_address,
      items,
      total_amount: Number(total_amount),
      subtotal: Number(subtotal) || Number(total_amount),
      discount_amount: Number(discount_amount) || 0,
      promo_code,
      payment_method: 'cod',
      payment_status: 'pending_cash',
      order_status: 'new',
      sample_gift,
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderRecord])
        .select()
        .single();

      if (error) {
        console.error('Supabase order insert error:', error);
        throw error;
      }

      return res.status(201).json({
        success: true,
        message: 'تم تسجيل طلب الدفع عند الاستلام بنجاح.',
        data: data || orderRecord
      });
    }

    // Local fallback
    return res.status(201).json({
      success: true,
      message: 'تم تسجيل الطلب محلياً بنجاح.',
      data: orderRecord
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'تعذر حفظ الطلب في قاعدة البيانات.',
      error: error.message
    });
  }
};

/**
 * Get all orders with filtering and search (for Admin)
 */
export const getOrders = async (req, res) => {
  try {
    const { status, payment_status, search, limit = 50, page = 1 } = req.query;

    if (supabase) {
      let query = supabase.from('orders').select('*', { count: 'exact' });

      if (status && status !== 'all') {
        query = query.eq('order_status', status);
      }
      if (payment_status && payment_status !== 'all') {
        query = query.eq('payment_status', payment_status);
      }
      if (search) {
        query = query.or(`id.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,shipping_city.ilike.%${search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      return res.json({
        success: true,
        count: count ?? data?.length ?? 0,
        data: data || []
      });
    }

    res.json({ success: true, count: 0, data: [] });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'فشل جلب الطلبيات.',
      error: error.message
    });
  }
};

/**
 * Get order by ID (for Admin or Customer Order Tracking)
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({
          success: false,
          message: 'الطلب غير موجود.'
        });
      }

      return res.json({ success: true, data });
    }

    res.status(404).json({ success: false, message: 'قاعدة البيانات غير متصلة' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update order status and payment status (for Admin)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status, notes } = req.body;

    const updates = {
      updated_at: new Date().toISOString()
    };
    if (order_status) updates.order_status = order_status;
    if (payment_status) updates.payment_status = payment_status;
    if (notes !== undefined) updates.notes = notes;

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.json({
        success: true,
        message: 'تم تحديث حالة الطلب بنجاح.',
        data
      });
    }

    res.status(400).json({ success: false, message: 'قاعدة البيانات غير متصلة' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get quick dashboard statistics for orders
 */
export const getOrderStats = async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) throw error;

      const totalOrders = data.length;
      const newOrders = data.filter(o => o.order_status === 'new').length;
      const processingOrders = data.filter(o => o.order_status === 'processing').length;
      const shippedOrders = data.filter(o => o.order_status === 'shipped').length;
      const deliveredOrders = data.filter(o => o.order_status === 'delivered').length;
      const cancelledOrders = data.filter(o => o.order_status === 'cancelled').length;

      // Revenue Calculations
      const totalRevenue = data
        .filter(o => o.order_status !== 'cancelled')
        .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

      const collectedCash = data
        .filter(o => o.payment_status === 'collected')
        .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

      const pendingCash = data
        .filter(o => o.payment_status === 'pending_cash' && o.order_status !== 'cancelled')
        .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

      return res.json({
        success: true,
        data: {
          totalOrders,
          newOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          totalRevenue,
          collectedCash,
          pendingCash
        }
      });
    }

    res.json({
      success: true,
      data: {
        totalOrders: 0,
        newOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        collectedCash: 0,
        pendingCash: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
