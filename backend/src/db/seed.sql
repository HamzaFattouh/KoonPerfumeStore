-- ==============================================================================
-- ADJUST RLS POLICIES & SEED INITIAL PRODUCTS
-- ==============================================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public can read active products" ON public.products;
DROP POLICY IF EXISTS "Admins have full access" ON public.products;
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Allow all operations for service_role" ON public.products;

-- 1. Public (anon & authenticated) can read all active products
CREATE POLICY "Allow public read access"
    ON public.products
    FOR SELECT
    USING (is_active = true);

-- 2. Allow all operations for authenticated users (admins) and service_role
CREATE POLICY "Allow full access for authenticated"
    ON public.products
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. Allow insert for initial setup / backend
CREATE POLICY "Allow insert for backend"
    ON public.products
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow update for backend"
    ON public.products
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- SEED INITIAL 6 ASTRONOMICAL PERFUMES (بذر العطور الفلكية الستة)
-- ==============================================================================

INSERT INTO public.products (
    id, name, name_en, brand, tagline, description, gender, season, scent_family,
    concentration, longevity, projection, price, original_price, discount,
    image_url, images, video_url, rating, reviews_count, badge, is_bestseller,
    is_featured, is_active, notes, sizes
) VALUES 
(
    'koon-absolute',
    'كون أبسولوت',
    'Koon Absolute',
    'KOON PERFUME',
    'توقيع الدار الأيقوني - عبير العود الملكي ونفحات النجوم',
    'تحفة عطرية استثنائية تجسد ولادة المجرات وتناغم عناصر الكون. يفتتح العطر بنفحات متألقة من الزعفران الكشميري والبرغموت النقي، ليتعمق سريعاً في قلب مفعم بخشب الأرز الأطلسي والعنبر الرمادي النادر، ويستقر على قاعدة مهيبة من العود الكمبودي المعتق والمسك الأسود الفاخر.',
    'unisex',
    'all_seasons',
    'شرقي خشبي فاخر',
    'Extrait de Parfum (35%)',
    'ثبات يتجاوز 24 ساعة',
    'فوحان فلكي فائق الانتشار',
    480.00,
    600.00,
    '20%',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop'],
    '/intro_transparent.webm',
    4.95,
    184,
    'الأكثر مبيعاً',
    true,
    true,
    true,
    '{"top": ["زعفران كشميري ملكي", "برغموت صقلي منعش", "فلفل وردي مدغشقري"], "heart": ["عنبر أبيض دافئ", "خشب الأرز المعتق", "ورد دي ماي الدمشقي"], "base": ["عود كمبودي قديم", "مسك كوني نادر", "حبوب التونكا الفنزويلية", "جلد إيطالي مدبوغ"]}'::jsonb,
    '[{"size": "50ml", "price": 340, "stock": 15}, {"size": "100ml", "price": 480, "stock": 24, "isDefault": true}, {"size": "200ml", "price": 790, "stock": 8}]'::jsonb
),
(
    'nebula-vanilla',
    'سديم الفانيليا',
    'Nebula Vanilla',
    'KOON PERFUME',
    'دفء الفانيليا المدخنة مع بريق العنبر الكوني',
    'رحلة حالمة في أعماق سديم كوني ناعم. مزيج آسر من فانيليا البوربون النادرة المحمصة بلمسة خفيفة من البخور الكوني والكراميل المكرمل، يعززه عبق الياسمين الليلي وأخشاب الكشمير الأنيقة.',
    'women',
    'winter',
    'سويتي عنبري دافئ',
    'Eau de Parfum Intense',
    'ثبات يدوم حتى 16 ساعة',
    'فوحان ناعم وجذاب يأسر الحواس',
    430.00,
    520.00,
    '17%',
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop'],
    '/intro_transparent.webm',
    4.95,
    142,
    'إصدار فاخر',
    true,
    true,
    true,
    '{"top": ["كراميل مملح", "لوز محمص", "كمثرى عصيرية مخملية"], "heart": ["ياسمين ليلي هندي", "أوركيد أسود", "أخشاب كشميرية"], "base": ["فانيليا بوربون مدغشقرية", "بخور عطري ملكي", "مسك نقي"]}'::jsonb,
    '[{"size": "50ml", "price": 310, "stock": 20}, {"size": "100ml", "price": 430, "stock": 35, "isDefault": true}]'::jsonb
),
(
    'black-aurora',
    'الشفق الأسود',
    'Black Aurora',
    'KOON PERFUME',
    'غموض الهيبة الرجالية - جلود سوداء ودخان التوباكو',
    'تجسيد حقيقي لقوة وهيبة الكواكب المهيبة. يدمج بين حدة الجلود الإيطالية السوداء مع أوراق التبغ الفاخرة وخشب الغاياك، تلطفها لمسة من الهيل الغواتيمالي والعرعر البري.',
    'men',
    'winter',
    'جلدي مدخن أروماتيك',
    'Extrait de Parfum',
    'ثبات يتجاوز 24 ساعة',
    'هالة قوية وحضور لا يُنسى',
    520.00,
    650.00,
    '20%',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'],
    '/intro_transparent.webm',
    4.88,
    210,
    'توقيع كوني',
    true,
    true,
    true,
    '{"top": ["هيل غواتيمالي أخضر", "حبوب العرعر النبيلة", "برغموت أسود"], "heart": ["أوراق التبغ الكوبية", "زهرة السوسن الفلورنسية", "خشب الغاياك"], "base": ["جلود توسكانية معتقة", "بتشولي إندونيسي داكن", "عنبر كوني"]}'::jsonb,
    '[{"size": "50ml", "price": 370, "stock": 12}, {"size": "100ml", "price": 520, "stock": 28, "isDefault": true}]'::jsonb
),
(
    'stellar-citrus',
    'أثير الحمضيات',
    'Stellar Citrus',
    'KOON PERFUME',
    'انتعاش شمسي متوهج - حمضيات البحر الأبيض ونفحات الأوزون',
    'نفحة صيفية منعشة مستوحاة من شروق الشمس فوق الكواكب المضيئة. يفيض بزيوت المندرين الإيطالي والبرغموت البارد مع لمسات بحرية نقية تعزز النشاط والحيوية طوال اليوم الصيفي الحار.',
    'unisex',
    'summer',
    'حمضيات مائية منعشة',
    'Eau de Parfum',
    'ثبات يدوم 12-14 ساعة',
    'فوحان صيفي خفيف ونظيف',
    390.00,
    460.00,
    '15%',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop'],
    '/intro_transparent.webm',
    4.82,
    98,
    'الأكثر انتعاشاً',
    false,
    true,
    true,
    '{"top": ["مندرين كالابريا الصقلي", "ليمون إيطالي", "نسيم بحري أوزوني"], "heart": ["زهر البرتقال التونسي", "ريحان إيطالي", "زنجبيل منعش"], "base": ["خشب الأرز الأبيض", "مسك نظيف", "عنبر خفيف"]}'::jsonb,
    '[{"size": "50ml", "price": 290, "stock": 18}, {"size": "100ml", "price": 390, "stock": 30, "isDefault": true}]'::jsonb
),
(
    'celestial-rose',
    'الوردة الفلكية',
    'Celestial Rose',
    'KOON PERFUME',
    'أنوثة ملكية - ورد دي ماي الطازج مع لمسة خشب الصندل',
    'تحفة أنثوية راقية تحتفي بسحر الورود النادرة المقطوفة في ساعات الفجر الأولى في غراس الفرنسية. عبير مخملي يدمج الورد الدمشقي مع توت العليق وخشب الصندل الكريمي.',
    'women',
    'summer',
    'زهري أرستقراطي ناعم',
    'Extrait de Parfum',
    'ثبات 18 ساعة',
    'هالة عطرية ساحرة تدوم',
    460.00,
    550.00,
    '16%',
    'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop'],
    '/intro_transparent.webm',
    4.91,
    115,
    'حصري نسائي',
    true,
    true,
    true,
    '{"top": ["ورد بلغاري طازج", "توت عليق بري", "فلفل وردي"], "heart": ["ورد دي ماي من غراس", "فاوانيا حريرية", "ليتشي منعش"], "base": ["خشب الصندل المايسوري", "مسك أبيض", "عنبر ذهبي"]}'::jsonb,
    '[{"size": "50ml", "price": 330, "stock": 15}, {"size": "100ml", "price": 460, "stock": 25, "isDefault": true}]'::jsonb
),
(
    'supernova-oud',
    'سوبرنوفا عود',
    'Supernova Oud',
    'KOON PERFUME',
    'انفجار نيش استثنائي - خشب العود الهندي والزعفران الأحمر',
    'أقوى إصدارات الدار وأكثرها فخامة وندرة. مستخلص من أشجار العود الهندي المعتق لأكثر من 20 عاماً مع رقائق الزعفران الأحمر ونفحات اللبان العماني الحوجري.',
    'men',
    'winter',
    'عود خشبي بخوري نيش',
    'Extrait de Parfum (40%)',
    'ثبات أسطوري يتجاوز 36 ساعة',
    'فوحان ملكي مهيب',
    680.00,
    850.00,
    '20%',
    'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop'],
    '/intro_transparent.webm',
    4.98,
    167,
    'إصدار ملكي خاص',
    true,
    true,
    true,
    '{"top": ["زعفران كشميري أحمر", "لبان عماني حوجري", "هيل حبشي"], "heart": ["ورد طايفي معتق", "خشب الصندل القديم", "كاستوريوم"], "base": ["دهن عود هندي أسام قديم", "عنبر أشهب ملكي", "جلود مدخنة"]}'::jsonb,
    '[{"size": "50ml", "price": 490, "stock": 10}, {"size": "100ml", "price": 680, "stock": 18, "isDefault": true}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_en = EXCLUDED.name_en,
    price = EXCLUDED.price,
    notes = EXCLUDED.notes,
    sizes = EXCLUDED.sizes,
    updated_at = NOW();

