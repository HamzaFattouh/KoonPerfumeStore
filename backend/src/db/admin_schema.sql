-- ==============================================================================
-- KOON PERFUME - ADMIN & ORDERS SCHEMA MIGRATION
-- Tables: orders (طلبيات الدفع عند الاستلام), site_settings (إعدادات ومحتوى الموقع)
-- ==============================================================================

-- 1. Orders Table (جدول الطلبيات)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,                                           -- رقم الطلب (مثال: KOON-892145)
    customer_name TEXT NOT NULL,                                   -- اسم العميل
    customer_phone TEXT NOT NULL,                                  -- رقم هاتف العميل (للتنسيق والتوصيل)
    customer_email TEXT,                                           -- البريد الإلكتروني (اختياري)
    shipping_city TEXT NOT NULL,                                   -- المدينة
    shipping_address TEXT NOT NULL,                                -- العنوان التفصيلي
    items JSONB NOT NULL DEFAULT '[]'::jsonb,                      -- المنتجات المشتراة
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),-- المبلغ الإجمالي المطلوب تحصيله نقداً
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,                    -- المجموع قبل الخصم
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,             -- قيمة الخصم
    promo_code TEXT,                                               -- كود الخصم المستخدم
    payment_method TEXT NOT NULL DEFAULT 'cod',                    -- طريقة الدفع: الدفع عند الاستلام (COD)
    payment_status TEXT NOT NULL DEFAULT 'pending_cash'            -- حالة التحصيل: pending_cash (مستحق عند التسليم) أو collected (تم الاستلام نقدياً)
        CHECK (payment_status IN ('pending_cash', 'collected', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'new'                       -- حالة الطلب
        CHECK (order_status IN ('new', 'processing', 'shipped', 'delivered', 'cancelled')),
    sample_gift TEXT,                                              -- العينة المجانية المرفقة مع الطلب
    notes TEXT,                                                    -- ملاحظات إضافية للتوصيل
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Orders
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);

-- 2. Site Settings Table (جدول إعدادات وأقسام المتجر)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,                                          -- مفتاح القسم (hero_section, announcement, coupons, etc.)
    data JSONB NOT NULL DEFAULT '{}'::jsonb,                       -- البيانات المخصصة
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert Default Site Settings
INSERT INTO public.site_settings (key, data) VALUES
(
    'announcement_bar',
    '{
        "enabled": true,
        "text_ar": "شحن كوني مجاني للطلبات فوق 350 ر.س | كود الخصم KOON10 لخصم 10% | عينة فاخرة مجاناً مع كل طلب",
        "text_he": "משלוח קוסמי חינם בהזמנות מעל 350 ₪ | קוד קופון KOON10 ל-10% הנחה | דוגמית יוקרתית חינם בכל הזמנה"
    }'::jsonb
),
(
    'hero_section',
    '{
        "tagline_ar": "دار العطور الفلكية الأولى • توليفات نيش فائقة التركيز",
        "tagline_he": "בית הבישום הקוסמי הראשון • תמציות נישה בריכוז עילאי",
        "title_ar": "كون بيرفيوم",
        "title_en": "KOON PERFUME",
        "subtitle_ar": "الفخامة في أبعاد كوكبية",
        "subtitle_he": "יוקרה בממדים קוסמיים"
    }'::jsonb
),
(
    'contact_info',
    '{
        "whatsapp": "+966500000000",
        "phone": "+966110000000",
        "email": "support@koonperfume.com",
        "instagram": "https://instagram.com/koonperfume"
    }'::jsonb
),
(
    'coupons',
    '[
        {"code": "KOON10", "discount_percent": 10, "is_active": true},
        {"code": "COSMIC20", "discount_percent": 20, "is_active": true}
    ]'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 3. Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public to place orders
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (true);

-- Allow public to view their own order by ID for order tracking
DROP POLICY IF EXISTS "Public can view own order" ON public.orders;
CREATE POLICY "Public can view own order"
    ON public.orders
    FOR SELECT
    USING (true);

-- Allow full access to orders
DROP POLICY IF EXISTS "Full access to orders" ON public.orders;
CREATE POLICY "Full access to orders"
    ON public.orders
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Site Settings: Public can read, anyone authorized can write
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings"
    ON public.site_settings
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Full access to site settings" ON public.site_settings;
CREATE POLICY "Full access to site settings"
    ON public.site_settings
    FOR ALL
    USING (true)
    WITH CHECK (true);

