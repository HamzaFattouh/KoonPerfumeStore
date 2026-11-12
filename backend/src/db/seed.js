import { supabase } from '../config/supabase.js';

export const INITIAL_PRODUCTS = [
  {
    id: 'koon-absolute',
    name: 'كون أبسولوت',
    name_en: 'Koon Absolute',
    brand: 'KOON PERFUME',
    tagline: 'توقيع الدار الأيقوني - عبير العود الملكي ونفحات النجوم',
    description: 'تحفة عطرية استثنائية تجسد ولادة المجرات وتناغم عناصر الكون. يفتتح العطر بنفحات متألقة من الزعفران الكشميري والبرغموت النقي، ليتعمق سريعاً في قلب مفعم بخشب الأرز الأطلسي والعنبر الرمادي النادر، ويستقر على قاعدة مهيبة من العود الكمبودي المعتق والمسك الأسود الفاخر.',
    gender: 'unisex',
    season: 'all_seasons',
    scent_family: 'شرقي خشبي فاخر',
    concentration: 'Extrait de Parfum (35%)',
    longevity: 'ثبات يتجاوز 24 ساعة',
    projection: 'فوحان فلكي فائق الانتشار',
    price: 480.00,
    original_price: 600.00,
    discount: '20%',
    image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop'
    ],
    video_url: '/intro_transparent.webm',
    rating: 4.95,
    reviews_count: 184,
    badge: 'الأكثر مبيعاً',
    is_bestseller: true,
    is_featured: true,
    is_active: true,
    notes: {
      top: ['زعفران كشميري ملكي', 'برغموت صقلي منعش', 'فلفل وردي مدغشقري'],
      heart: ['عنبر أبيض دافئ', 'خشب الأرز المعتق', 'ورد دي ماي الدمشقي'],
      base: ['عود كمبودي قديم', 'مسك كوني نادر', 'حبوب التونكا الفنزويلية', 'جلد إيطالي مدبوغ']
    },
    sizes: [
      { size: '50ml', price: 340, stock: 15 },
      { size: '100ml', price: 480, stock: 24, isDefault: true },
      { size: '200ml', price: 790, stock: 8 }
    ]
  },
  {
    id: 'nebula-vanilla',
    name: 'سديم الفانيليا',
    name_en: 'Nebula Vanilla',
    brand: 'KOON PERFUME',
    tagline: 'دفء الفانيليا المدخنة مع بريق العنبر الكوني',
    description: 'رحلة حالمة في أعماق سديم كوني ناعم. مزيج آسر من فانيليا البوربون النادرة المحمصة بلمسة خفيفة من البخور الكوني والكراميل المكرمل، يعززه عبق الياسمين الليلي وأخشاب الكشمير الأنيقة.',
    gender: 'women',
    season: 'winter',
    scent_family: 'سويتي عنبري دافئ',
    concentration: 'Eau de Parfum Intense',
    longevity: 'ثبات يدوم حتى 16 ساعة',
    projection: 'فوحان ناعم وجذاب يأسر الحواس',
    price: 430.00,
    original_price: 520.00,
    discount: '17%',
    image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop'
    ],
    video_url: '/intro_transparent.webm',
    rating: 4.95,
    reviews_count: 142,
    badge: 'إصدار فاخر',
    is_bestseller: true,
    is_featured: true,
    is_active: true,
    notes: {
      top: ['كراميل مملح', 'لوز محمص', 'كمثرى عصيرية مخملية'],
      heart: ['ياسمين ليلي هندي', 'أوركيد أسود', 'أخشاب كشميرية'],
      base: ['فانيليا بوربون مدغشقرية', 'بخور عطري ملكي', 'مسك نقي']
    },
    sizes: [
      { size: '50ml', price: 310, stock: 20 },
      { size: '100ml', price: 430, stock: 35, isDefault: true }
    ]
  },
  {
    id: 'black-aurora',
    name: 'الشفق الأسود',
    name_en: 'Black Aurora',
    brand: 'KOON PERFUME',
    tagline: 'غموض الهيبة الرجالية - جلود سوداء ودخان التوباكو',
    description: 'تجسيد حقيقي لقوة وهيبة الكواكب المهيبة. يدمج بين حدة الجلود الإيطالية السوداء مع أوراق التبغ الفاخرة وخشب الغاياك، تلطفها لمسة من الهيل الغواتيمالي والعرعر البري.',
    gender: 'men',
    season: 'winter',
    scent_family: 'جلدي مدخن أروماتيك',
    concentration: 'Extrait de Parfum',
    longevity: 'ثبات يتجاوز 24 ساعة',
    projection: 'هالة قوية وحضور لا يُنسى',
    price: 520.00,
    original_price: 650.00,
    discount: '20%',
    image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'
    ],
    video_url: '/intro_transparent.webm',
    rating: 4.88,
    reviews_count: 210,
    badge: 'توقيع كوني',
    is_bestseller: true,
    is_featured: true,
    is_active: true,
    notes: {
      top: ['هيل غواتيمالي أخضر', 'حبوب العرعر النبيلة', 'برغموت أسود'],
      heart: ['أوراق التبغ الكوبية', 'زهرة السوسن الفلورنسية', 'خشب الغاياك'],
      base: ['جلود توسكانية معتقة', 'بتشولي إندونيسي داكن', 'عنبر كوني']
    },
    sizes: [
      { size: '50ml', price: 370, stock: 12 },
      { size: '100ml', price: 520, stock: 28, isDefault: true }
    ]
  },
  {
    id: 'stellar-citrus',
    name: 'أثير الحمضيات',
    name_en: 'Stellar Citrus',
    brand: 'KOON PERFUME',
    tagline: 'انتعاش شمسي متوهج - حمضيات البحر الأبيض ونفحات الأوزون',
    description: 'نفحة صيفية منعشة مستوحاة من شروق الشمس فوق الكواكب المضيئة. يفيض بزيوت المندرين الإيطالي والبرغموت البارد مع لمسات بحرية نقية تعزز النشاط والحيوية طوال اليوم الصيفي الحار.',
    gender: 'unisex',
    season: 'summer',
    scent_family: 'حمضيات مائية منعشة',
    concentration: 'Eau de Parfum',
    longevity: 'ثبات يدوم 12-14 ساعة',
    projection: 'فوحان صيفي خفيف ونظيف',
    price: 390.00,
    original_price: 460.00,
    discount: '15%',
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop'
    ],
    video_url: '/intro_transparent.webm',
    rating: 4.82,
    reviews_count: 98,
    badge: 'الأكثر انتعاشاً',
    is_bestseller: false,
    is_featured: true,
    is_active: true,
    notes: {
      top: ['مندرين كالابريا الصقلي', 'ليمون إيطالي', 'نسيم بحري أوزوني'],
      heart: ['زهر البرتقال التونسي', 'ريحان إيطالي', 'زنجبيل منعش'],
      base: ['خشب الأرز الأبيض', 'مسك نظيف', 'عنبر خفيف']
    },
    sizes: [
      { size: '50ml', price: 290, stock: 18 },
      { size: '100ml', price: 390, stock: 30, isDefault: true }
    ]
  },
  {
    id: 'celestial-rose',
    name: 'الوردة الفلكية',
    name_en: 'Celestial Rose',
    brand: 'KOON PERFUME',
    tagline: 'أنوثة ملكية - ورد دي ماي الطازج مع لمسة خشب الصندل',
    description: 'تحفة أنثوية راقية تحتفي بسحر الورود النادرة المقطوفة في ساعات الفجر الأولى في غراس الفرنسية. عبير مخملي يدمج الورد الدمشقي مع توت العليق وخشب الصندل الكريمي.',
    gender: 'women',
    season: 'summer',
    scent_family: 'زهري أرستقراطي ناعم',
    concentration: 'Extrait de Parfum',
    longevity: 'ثبات 18 ساعة',
    projection: 'هالة عطرية ساحرة تدوم',
    price: 460.00,
    original_price: 550.00,
    discount: '16%',
    image_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop'
    ],
    video_url: '/intro_transparent.webm',
    rating: 4.91,
    reviews_count: 115,
    badge: 'حصري نسائي',
    is_bestseller: true,
    is_featured: true,
    is_active: true,
    notes: {
      top: ['ورد بلغاري طازج', 'توت عليق بري', 'فلفل وردي'],
      heart: ['ورد دي ماي من غراس', 'فاوانيا حريرية', 'ليتشي منعش'],
      base: ['خشب الصندل المايسوري', 'مسك أبيض', 'عنبر ذهبي']
    },
    sizes: [
      { size: '50ml', price: 330, stock: 15 },
      { size: '100ml', price: 460, stock: 25, isDefault: true }
    ]
  },
  {
    id: 'supernova-oud',
    name: 'سوبرنوفا عود',
    name_en: 'Supernova Oud',
    brand: 'KOON PERFUME',
    tagline: 'انفجار نيش استثنائي - خشب العود الهندي والزعفران الأحمر',
    description: 'أقوى إصدارات الدار وأكثرها فخامة وندرة. مستخلص من أشجار العود الهندي المعتق لأكثر من 20 عاماً مع رقائق الزعفران الأحمر ونفحات اللبان العماني الحوجري.',
    gender: 'men',
    season: 'winter',
    scent_family: 'عود خشبي بخوري نيش',
    concentration: 'Extrait de Parfum (40%)',
    longevity: 'ثبات أسطوري يتجاوز 36 ساعة',
    projection: 'فوحان ملكي مهيب',
    price: 680.00,
    original_price: 850.00,
    discount: '20%',
    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop'
    ],
    video_url: '/intro_transparent.webm',
    rating: 4.98,
    reviews_count: 167,
    badge: 'إصدار ملكي خاص',
    is_bestseller: true,
    is_featured: true,
    is_active: true,
    notes: {
      top: ['زعفران كشميري أحمر', 'لبان عماني حوجري', 'هيل حبشي'],
      heart: ['ورد طايفي معتق', 'خشب الصندل القديم', 'كاستوريوم'],
      base: ['دهن عود هندي أسام قديم', 'عنبر أشهب ملكي', 'جلود مدخنة']
    },
    sizes: [
      { size: '50ml', price: 490, stock: 10 },
      { size: '100ml', price: 680, stock: 18, isDefault: true }
    ]
  }
];

export async function seedDatabase() {
  console.log('🚀 Starting Supabase Database Seed for Koon Perfumes...');
  
  if (!supabase) {
    console.error('❌ Supabase client is not configured. Check your SUPABASE_URL and SUPABASE_KEY.');
    return;
  }

  for (const product of INITIAL_PRODUCTS) {
    const { data, error } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Failed to seed ${product.name}:`, error.message);
    } else {
      console.log(`✅ Seeded product: ${product.name} (${product.name_en})`);
    }
  }

  console.log('🎉 Seeding process completed successfully!');
}

// Run standalone if executed directly
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}

