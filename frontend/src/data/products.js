// All perfume products are loaded directly and dynamically from the Database (Supabase / Backend API).
// No static products are stored in the client application bundle.
export const PRODUCTS = [];

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
    perfume: 'الوردة الفلكية',
    comment: 'عطر أنثوي راقي وهادئ، خالي تماماً من رائحة الكحول المزعجة، نقي جداً ومكونات طبيعية واضحة. شكراً على الهدية والتغليف الأنيق.',
    date: 'منذ 3 أسابيع'
  }
];

export const DEFAULT_SOCIAL_CHATS = [
  {
    id: 'chat-1',
    platform: 'instagram',
    platform_name: 'إنستغرام Instagram',
    customer_name: 'سارة آل سعود - الرياض',
    perfume: 'كون أبسولوت (Koon Absolute)',
    image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop',
    caption: 'سديم كون أبسولوت وصلني اليوم.. فخامة العبوة والتغليف الملكي لحالها تحفة، والثبات جلس بالملابس أكثر من 48 ساعة! شكراً دار كون ❤️',
    date: 'أمس'
  },
  {
    id: 'chat-2',
    platform: 'facebook',
    platform_name: 'فيسبوك Facebook',
    customer_name: 'م. أحمد الشريف - جدة',
    perfume: 'الشفق الأسود (Dark Twilight)',
    image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop',
    caption: 'طلبته والدفع عند الاستلام بعد المعاينة، مصداقية عالية والعطر رجالي رسمي وثقيل يستحق كل ريال.',
    date: 'منذ يومين'
  },
  {
    id: 'chat-3',
    platform: 'whatsapp',
    platform_name: 'واتساب WhatsApp',
    customer_name: 'د. طارق الزهراني - مكة المكرمة',
    perfume: 'سديم الفانيليا (Nebula Vanilla)',
    image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
    caption: 'السلام عليكم، العطر وصلني وفحصت العينة المرفقة أولاً.. ما شاء الله ريحة سحرية ومميزة جداً، شكراً لكم على سرعة التوصيل 🤍',
    date: 'منذ 3 أيام'
  },
  {
    id: 'chat-4',
    platform: 'instagram',
    platform_name: 'إنستغرام Instagram',
    customer_name: 'ريما القحطاني - الخبر',
    perfume: 'الوردة الفلكية (Cosmic Rose)',
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    caption: 'عطر أنثوي نيش راقي جداً غير مكرر.. الكل في الدوام سألني عن اسم العطر وشاركتهم حسابكم!',
    date: 'منذ 5 أيام'
  }
];

export const SAMPLE_GIFTS = [
  { id: 'sample-1', name: 'عينة كون أبسولوت (3ml)' },
  { id: 'sample-2', name: 'عينة سديم الفانيليا (3ml)' },
  { id: 'sample-3', name: 'عينة الشفق الأسود (3ml)' },
  { id: 'sample-4', name: 'عينة سوبرنوفا عود (3ml)' }
];
