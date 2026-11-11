export const PRODUCTS = [
  {
    id: 'koon-absolute',
    name: 'كون أبسولوت',
    nameEn: 'Koon Absolute',
    tagline: 'توقيع الدار الأيقوني - عبير العود الملكي ونفحات النجوم',
    category: 'unisex',
    categoryName: 'للجنسين',
    scentFamily: 'شرقي خشبي فاخر',
    price: 480,
    originalPrice: 600,
    discount: '20%',
    rating: 4.9,
    reviewsCount: 184,
    badge: 'الأكثر مبيعاً',
    isBestseller: true,
    isFeatured: true,
    isNew: false,
    concentration: 'Extrait de Parfum (تركيز 35%)',
    longevity: 'ثبات يتجاوز 18 ساعة',
    projection: 'فوحان كوني فائق الانتشار',
    season: 'مناسب لجميع الفصول والمناسبات الكبرى',
    description: 'تحفة عطرية استثنائية تجسد ولادة المجرات وتناغم عناصر الكون. يفتتح العطر بنفحات متألقة من الزعفران الكشميري والبرغموت النقي، ليتعمق سريعاً في قلب مفعم بخشب الأرز الأطلسي والعنبر الرمادي النادر، ويستقر على قاعدة مهيبة من العود الكمبودي المعتق والمسك الأسود الفاخر.',
    notes: {
      top: ['زعفران كشميري ملكي', 'برغموت صقلي منعش', 'فلفل وردي مدغشقري'],
      heart: ['عنبر أبيض دافئ', 'خشب الأرز المعتق', 'ورد دي ماي الدمشقي'],
      base: ['عود كمبودي قديم', 'مسك كوني نادر', 'حبوب التونكا الفنزويلية', 'جلد إيطالي مدبوغ']
    },
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [
      { size: '50ml', price: 340, stock: 15 },
      { size: '100ml', price: 480, stock: 24, isDefault: true },
      { size: '200ml', price: 790, stock: 8 }
    ]
  },
  {
    id: 'nebula-vanilla',
    name: 'سديم الفانيليا',
    nameEn: 'Nebula Vanilla',
    tagline: 'دفء الفانيليا المدخنة مع بريق العنبر الكوني',
    category: 'women',
    categoryName: 'نسائي',
    scentFamily: 'سويتي عنبري دافئ',
    price: 430,
    originalPrice: 520,
    discount: '17%',
    rating: 4.95,
    reviewsCount: 142,
    badge: 'إصدار فاخر',
    isBestseller: true,
    isFeatured: true,
    isNew: false,
    concentration: 'Eau de Parfum Intense',
    longevity: 'ثبات يدوم حتى 16 ساعة',
    projection: 'فوحان ناعم وجذاب يأسر الحواس',
    season: 'سهرات، شتاء، خريف',
    description: 'رحلة حالمة في أعماق سديم كوني ناعم. مزيج آسر من فانيليا البوربون النادرة المحمصة بلمسة خفيفة من البخور الكوني والكراميل المكرمل، يعززه عبق الياسمين الليلي وأخشاب الكشمير الأنيقة.',
    notes: {
      top: ['كراميل مملح', 'لوز محمص', 'كمثرى عصيرية مخملية'],
      heart: ['ياسمين ليلي هندي', 'أوركيد أسود', 'أخشاب كشميرية'],
      base: ['فانيليا بوربون مدغشقرية', 'بخور عطري ملكي', 'مسك نقي']
    },
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [
      { size: '50ml', price: 310, stock: 20 },
      { size: '100ml', price: 430, stock: 35, isDefault: true }
    ]
  },
  {
    id: 'black-aurora',
    name: 'الشفق الأسود',
    nameEn: 'Black Aurora',
    tagline: 'غموض الهيبة الرجالية - جلود سوداء ودخان التوباكو',
    category: 'men',
    categoryName: 'رجالي',
    scentFamily: 'جلدي مدخن أروماتيك',
    price: 520,
    originalPrice: 650,
    discount: '20%',
    rating: 4.88,
    reviewsCount: 210,
    badge: 'توقيع كوني',
    isBestseller: true,
    isFeatured: true,
    isNew: false,
    concentration: 'Extrait de Parfum',
    longevity: 'ثبات يتجاوز 24 ساعة',
    projection: 'هالة قوية وحضور لا يُنسى',
    season: 'مناسبات، اجتماعات رسمية، شتاء',
    description: 'تجسيد حقيقي لقوة وهيبة الكواكب المهيبة. يدمج بين حدة الجلود الإيطالية السوداء مع أوراق التبغ الفاخرة وخشب الغاياك، تلطفها لمسة من الهيل الغواتيمالي والعرعر البري.',
    notes: {
      top: ['هيل غواتيمالي أخضر', 'حبوب العرعر النبيلة', 'برغموت أسود'],
      heart: ['أوراق التبغ الكوبية', 'زهرة السوسن الفلورنسية', 'خشب الغاياك'],
      base: ['جلد أسود مدبوغ', 'باتشولي إندونيسي غامق', 'عنبر جاف']
    },
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [
      { size: '50ml', price: 370, stock: 12 },
      { size: '100ml', price: 520, stock: 18, isDefault: true },
      { size: '200ml', price: 860, stock: 5 }
    ]
  },
  {
    id: 'stellar-rose',
    name: 'ورد النجوم',
    nameEn: 'Stellar Rose',
    tagline: 'وردة طائفية نادرة تتفتح تحت ضوء القمر',
    category: 'women',
    categoryName: 'نسائي',
    scentFamily: 'زهري خشبي راقٍ',
    price: 390,
    originalPrice: 470,
    discount: '17%',
    rating: 4.92,
    reviewsCount: 96,
    badge: 'رائج الآن',
    isBestseller: false,
    isFeatured: true,
    isNew: true,
    concentration: 'Eau de Parfum Intense',
    longevity: 'ثبات 14 ساعة',
    projection: 'فوحان فواح مفعم بالأنوثة',
    season: 'الربيع، الصيف، الاستخدام اليومي الراقي',
    description: 'انعكاس لنور النجوم على بتلات الورد الندِيّة. تلتقي فيه الوردة الطائفية الفاخرة برائحة توت العليق الطازج والفاوانيا المتفتحة، مع لمسات مسك بيضاء نقية تثري الإحساس بالنقاء والرقي.',
    notes: {
      top: ['توت العليق الوردي', 'يوسفي إيطالي مشرق', 'ليتشي استوائي'],
      heart: ['ورد طائفي أصيل', 'فاوانيا بيضاء مخملية', 'زنبق الوادي'],
      base: ['مسك الحرير الأبيض', 'خشب الأرز الأبيض', 'عنبر شفاف']
    },
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [
      { size: '50ml', price: 280, stock: 30 },
      { size: '100ml', price: 390, stock: 40, isDefault: true }
    ]
  },
  {
    id: 'cosmic-velvet',
    name: 'مخمل الكون',
    nameEn: 'Cosmic Velvet',
    tagline: 'نعومة خشب الصندل والتونكا ولمسات المسك الملكي',
    category: 'unisex',
    categoryName: 'للجنسين',
    scentFamily: 'خشبي بودري مخملي',
    price: 450,
    originalPrice: 550,
    discount: '18%',
    rating: 4.85,
    reviewsCount: 112,
    badge: 'مفضل الخبراء',
    isBestseller: false,
    isFeatured: true,
    isNew: false,
    concentration: 'Eau de Parfum',
    longevity: 'ثبات 15 ساعة',
    projection: 'فوحان أرستقراطي مريح',
    season: 'جميع الفصول، بيئة العمل، الإطلالات الأنيقة',
    description: 'عطر مصمم لمن يقدرون الرقي الهادئ والتفاصيل المخملية. ينساب بسلاسة من افتتاحية بودرية ناعمة إلى قلب غني بخشب الصندل الميسوري واللوز الحلو، ليستقر في قاعدة مسكية دافئة لا تقاوم.',
    notes: {
      top: ['لوز حلو بودري', 'هيل أبيض', 'جوزة الطيب'],
      heart: ['خشب الصندل الميسوري', 'حبوب التونكا الذهبية', 'إيريس سوسني'],
      base: ['مسك الكشمير', 'فانيليا كاسترد نقية', 'خشب البتولا']
    },
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [
      { size: '50ml', price: 320, stock: 22 },
      { size: '100ml', price: 450, stock: 28, isDefault: true }
    ]
  },
  {
    id: 'celestial-fresh',
    name: 'نسيم المدار',
    nameEn: 'Orbit Breeze',
    tagline: 'انتعاش نقي كأكسجين الفضاء مع الحمضيات البحرية',
    category: 'men',
    categoryName: 'رجالي',
    scentFamily: 'أروماتيك بحري حمضي',
    price: 360,
    originalPrice: 440,
    discount: '18%',
    rating: 4.79,
    reviewsCount: 88,
    badge: 'انتعاش صيفي',
    isBestseller: false,
    isFeatured: false,
    isNew: true,
    concentration: 'Eau de Parfum',
    longevity: 'ثبات 10-12 ساعة',
    projection: 'فوحان منعش ونابض بالحياة',
    season: 'الصيف، الصباح، الرياضة والنشاط',
    description: 'جرعة عالية من الطاقة الإيجابية والانتعاش الكوني. يفتتح بأمواج منعشة من الجريب فروت الوردي والمياه المعدنية البحرية، مدعمة بإكليل الجبل والخزامى البرية، وتنتهي بقاعدة خشبية خفيفة من نجيل الهند والمسك.',
    notes: {
      top: ['جريب فروت وردي', 'أكورد مائي أوزوني', 'ماندارين أخضر'],
      heart: ['إكليل الجبل', 'لافندر بري كرواتي', 'ميرمية كلاري'],
      base: ['نجيل الهند الهايتي (فيتيفر)', 'خشب الأرز الفيرجيني', 'عنبر الحوت النقي']
    },
    images: [
      'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [
      { size: '50ml', price: 260, stock: 18 },
      { size: '100ml', price: 360, stock: 25, isDefault: true }
    ]
  },
  {
    id: 'galaxy-amber',
    name: 'عنبر المجرة',
    nameEn: 'Galaxy Amber',
    tagline: 'أسطورة العنبر الملكي مع نفحات التوابل الذهبية',
    category: 'oriental',
    categoryName: 'شرقي نيش',
    scentFamily: 'عنبري شرقي دافئ',
    price: 540,
    originalPrice: 680,
    discount: '21%',
    rating: 4.97,
    reviewsCount: 165,
    badge: 'إصدار ملكي خاص',
    isBestseller: true,
    isFeatured: true,
    isNew: false,
    concentration: 'Extrait de Parfum',
    longevity: 'ثبات يتجاوز 20 ساعة',
    projection: 'فوحان فخم يملأ المكان',
    season: 'الشتاء، الأعراس، المناسبات الرسمية',
    description: 'سيمفونية شرقية مترفة تدور حول أندر أنواع العنبر الشمسي. يمتزج بلطف مع القرفة السيلانية، واللبان العماني الحوجري، ولمسة ناعمة من المر وزهرة الخزامى العطرية.',
    notes: {
      top: ['قرفة سيلانية فاخرة', 'كزبرة عطرية', 'برغموت ذهبي'],
      heart: ['لبان عماني حوجري', 'عنبر بلطيقي ثمين', 'بنزوين سيامي'],
      base: ['عود هندي صافي', 'فانيليا سوداء', 'خشب الباتشولي']
    },
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [
      { size: '50ml', price: 390, stock: 14 },
      { size: '100ml', price: 540, stock: 19, isDefault: true },
      { size: '200ml', price: 890, stock: 6 }
    ]
  },
  {
    id: 'niche-supernova',
    name: 'سوبرنوفا نيش',
    nameEn: 'Supernova Niche',
    tagline: 'انفجار عطري مبهر يجمع الهيل والعود الأبيض والخوخ الأسود',
    category: 'niche',
    categoryName: 'عطور النيش',
    scentFamily: 'نيش فاخر نادر',
    price: 590,
    originalPrice: 720,
    discount: '18%',
    rating: 4.98,
    reviewsCount: 78,
    badge: 'كمية محدودة',
    isBestseller: false,
    isFeatured: true,
    isNew: true,
    concentration: 'Pure Parfum (40%)',
    longevity: 'ثبات يدوم لأيام على الملابس',
    projection: 'فوحان استثنائي كوني',
    season: 'كل الأوقات الراقية',
    description: 'ابتكار نيش غير مسبوق في عالم العطور الفاخرة، يحاكي الانفجار العظيم للنجوم الكونية. يباغتك بلمسة من الخوخ المخملي الداكن، يتبعها نبض عميق من الهيل الغواتيمالي مع العود الأبيض النقي وخشب الأبنوس.',
    notes: {
      top: ['خوخ أسود مخملي', 'هيل أخضر بري', 'زعفران أبيض'],
      heart: ['عود أبيض نادر', 'نرجس جبلي', 'أخشاب الأبنوس'],
      base: ['عنبر الحوت الأسود', 'مسك غزال نباتي', 'جلد روسي فاخر']
    },
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [
      { size: '100ml', price: 590, stock: 11, isDefault: true }
    ]
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'الكل', nameEn: 'All' },
  { id: 'bestseller', name: 'الأكثر مبيعاً ⭐', nameEn: 'Best Sellers' },
  { id: 'men', name: 'عطور رجالية 👔', nameEn: 'Men' },
  { id: 'women', name: 'عطور نسائية 🌸', nameEn: 'Women' },
  { id: 'unisex', name: 'للجنسين 🪐', nameEn: 'Unisex' },
  { id: 'oriental', name: 'شرقي وعود 🪵', nameEn: 'Oriental & Oud' },
  { id: 'niche', name: 'عطور النيش 💎', nameEn: 'Niche Perfumes' }
];

export const FRAGRANCE_FAMILIES = [
  'شرقي خشبي فاخر',
  'سويتي عنبري دافئ',
  'جلدي مدخن أروماتيك',
  'زهري خشبي راقٍ',
  'خشبي بودري مخملي',
  'أروماتيك بحري حمضي',
  'عنبري شرقي دافئ',
  'نيش فاخر نادر'
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'عبدالله الشمري',
    city: 'الرياض',
    rating: 5,
    perfume: 'كون أبسولوت',
    comment: 'عطر كوني بمعنى الكلمة! الثباتية أذهلتني، جلس على الشماغ والملابس أكثر من يومين وفوحانه يجلب الإطراء أينما ذهبت. التغليف الملكي فاق توقعاتي.',
    date: 'منذ يومين'
  },
  {
    id: 2,
    name: 'سارة الدوسري',
    city: 'جدة',
    rating: 5,
    perfume: 'سديم الفانيليا',
    comment: 'أفضل عطر فانيليا جربته في حياتي! ليس سكّرياً مزعجاً بل فانيليا مدخنة فاخرة جداً مع عنبر دافئ. خدمة التوصيل كانت سريعة جداً والعينات المرفقة تحفة.',
    date: 'منذ أسبوع'
  },
  {
    id: 3,
    name: 'م. فهد القحطاني',
    city: 'الدمام',
    rating: 5,
    perfume: 'الشفق الأسود',
    comment: 'عطر رجالي فخم ذو هيبة غير عادية. رائحة الجلود مع التبغ والهيل تعطيك طابع الشخصيات القيادية. كون بيرفيوم تفوقوا على براندات نيش عالمية!',
    date: 'منذ أسبوعين'
  },
  {
    id: 4,
    name: 'نورة العتيبي',
    city: 'الخبر',
    rating: 5,
    perfume: 'ورد النجوم',
    comment: 'عطر أنثوي راقي وهادئ، خالي تماماً من رائحة الكحول المزعجة، نقي جداً ومكونات طبيعية واضحة. شكراً على الهدية والتغليف الأنيق.',
    date: 'منذ 3 أسابيع'
  }
];

export const SAMPLE_GIFTS = [
  { id: 'sample-1', name: 'عينة كون أبسولوت (3ml)' },
  { id: 'sample-2', name: 'عينة سديم الفانيليا (3ml)' },
  { id: 'sample-3', name: 'عينة الشفق الأسود (3ml)' },
  { id: 'sample-4', name: 'عينة سوبرنوفا نيش (3ml)' }
];
