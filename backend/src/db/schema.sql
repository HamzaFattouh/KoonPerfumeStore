-- ==============================================================================
-- KOON PERFUME STORE (دار كون للعطور الفلكية)
-- SUPABASE POSTGRESQL DATABASE SCHEMA (مخطط قاعدة بيانات المنتجات والفلاتر)
-- ==============================================================================

-- 1. Enable UUID Extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Products Table (جدول المنتجات)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    
    -- بيانات الهوية الأساسية
    name TEXT NOT NULL,                                           -- اسم المنتج بالعربية (مثال: 'كون أبسولوت')
    name_en TEXT,                                                 -- اسم المنتج بالإنجليزية (مثال: 'Koon Absolute')
    brand TEXT NOT NULL DEFAULT 'KOON PERFUME',                   -- الماركة (دار العطور)
    tagline TEXT,                                                 -- نبذة تسويقية مختصرة
    description TEXT,                                             -- الوصف التفصيلي الكامل للتحفة العطرية
    
    -- التصنيف والفئات المستهدفة
    gender TEXT NOT NULL DEFAULT 'unisex'                         -- رجالي / ستاتي / رجالي وستاتي
        CHECK (gender IN ('men', 'women', 'unisex')),
        
    season TEXT NOT NULL DEFAULT 'all_seasons'                    -- صيفي / شتوي / جميع الفصول
        CHECK (season IN ('summer', 'winter', 'all_seasons', 'autumn_spring')),

    -- خصائص ونوتات العطر (بيانات الفلاتر العطرية)
    scent_family TEXT NOT NULL,                                   -- العائلة العطرية (شرقي، خشبي، فانيليا، زهري، جلدي، حمضي)
    concentration TEXT NOT NULL DEFAULT 'Extrait de Parfum (35%)',-- تركيز العطر
    longevity TEXT DEFAULT 'ثبات يتجاوز 24 ساعة',                   -- معدل الثبات
    projection TEXT DEFAULT 'فوحان فلكي قوي',                      -- معدل الفوحان

    -- الهرم العطري والمكونات النادرة (للفلترة حسب المكونات والرائحة)
    -- هيكل JSON: {"top": ["زعفران", "برغموت"], "heart": ["أرز", "ورد"], "base": ["عود", "عنبر"]}
    notes JSONB NOT NULL DEFAULT '{"top": [], "heart": [], "base": []}'::jsonb,

    -- الأسعار والأحجام المتوفرة
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),             -- السعر الحالي (ر.س)
    original_price NUMERIC(10, 2) CHECK (original_price >= price),-- السعر قبل الخصم
    discount TEXT,                                                -- نسبة أو كود الخصم (مثال: '20%')
    sizes JSONB NOT NULL DEFAULT '[{"size": "100ml", "price": 480, "stock": 25}]'::jsonb, -- خيارات الأحجام

    -- وسائط الميديا (الصور والفيديوهات)
    image_url TEXT NOT NULL,                                      -- صورة المنتج الرئيسية عالية الدقة
    images TEXT[] NOT NULL DEFAULT '{}',                          -- معرض صور إضافية للمنتج
    video_url TEXT,                                               -- رابط فيديو المنتج (فيديو ترويجي أو أنيميشن شفاف)

    -- التقييمات والحالات الخاصة
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.90 CHECK (rating BETWEEN 1.0 AND 5.0),
    reviews_count INTEGER NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
    badge TEXT,                                                   -- شارة تميز (مثال: 'الأكثر مبيعاً', 'إصدار فاخر')
    is_bestseller BOOLEAN NOT NULL DEFAULT false,                 -- هل هو ضمن الأكثر طلباً؟
    is_featured BOOLEAN NOT NULL DEFAULT false,                   -- هل يظهر في الواجهة المميزة؟
    is_active BOOLEAN NOT NULL DEFAULT true,                      -- حالة التوفر والظهور للجمهور

    -- الطوابع الزمنية
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. High Performance Indexes (فهارس البحث والتصفية السريعة)
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products(gender);
CREATE INDEX IF NOT EXISTS idx_products_season ON public.products(season);
CREATE INDEX IF NOT EXISTS idx_products_scent_family ON public.products(scent_family);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_bestseller ON public.products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- GIN Index for fast JSONB querying on scent notes and ingredients (فهرس البحث في المكونات)
CREATE INDEX IF NOT EXISTS idx_products_notes_gin ON public.products USING gin(notes);

-- 4. Automatic updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Row Level Security (RLS) - أمان وحماية البيانات
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- السماح للجمهور بقراءة المنتجات النشطة فقط
CREATE POLICY "Public can read active products"
    ON public.products
    FOR SELECT
    USING (is_active = true);

-- السماح للمشرفين المصرحين بكامل صلاحيات الإضافة والتعديل والحذف
CREATE POLICY "Admins have full access"
    ON public.products
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
