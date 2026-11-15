import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Comprehensive Translations Dictionary (Arabic & Hebrew)
export const TRANSLATIONS = {
  ar: {
    announcement: 'شحن كوني مجاني للطلبات فوق 350 ر.س | كود الخصم KOON10 لخصم 10% | عينة فاخرة مجاناً مع كل طلب',
    brandName: 'كون بيرفيوم',
    brandSub: 'KOON PERFUME',
    nav: {
      home: 'الرئيسية',
      shop: 'المتجر والكتالوج',
      bestsellers: 'الأكثر مبيعاً ⭐',
      quiz: 'مستكشف العطور 🪐',
      about: 'عن كون بيرفيوم',
      track: 'تتبع طلبك',
      contact: 'اتصل بنا',
      profile: 'حسابي والطلبات',
      faq: 'الأسئلة الشائعة والضمان',
      cart: 'السلة',
      admin: 'لوحة التحكم الإدارية'
    },
    actions: {
      search: 'بحث عن عطر',
      searchPlaceholder: 'ابحث بالاسم، العائلة العطرية، النوتات (مثال: عود، فانيليا، الشفق، نيش)...',
      wishlist: 'المفضلة',
      cartTitle: 'سلة المشتريات',
      itemsCount: 'منتجات',
      checkout: 'إتمام الطلب والدفع عند الاستلام',
      exploreBtn: 'استكشف عطور كون الفلكية',
      quizBtn: 'مستكشف العطور (Quiz)',
      scrollDown: 'مرر للأسفل لاكتشاف المجموعات',
      addToCart: 'إضافة للسلة',
      quickView: 'نظرة سريعة',
      buyNow: 'شراء فوري'
    },
    checkout: {
      title: 'إتمام الطلب والدفع عند الاستلام',
      subtitle: 'عملية شراء آمنة ومريحة، ادفع نقداً عند استلام عطرك وتفقده',
      customerInfo: 'بيانات العميل وعنوان التوصيل',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      phone: 'رقم الجوال للتوصيل',
      phoneHint: 'ضروري لتنسيق المندوب معك قبل التوصيل',
      email: 'البريد الإلكتروني (اختياري)',
      city: 'المدينة',
      address: 'العنوان التفصيلي (الحي، الشارع، رقم المبنى)',
      notes: 'ملاحظات إضافية للتوصيل (اختياري)',
      paymentMethodTitle: 'طريقة الدفع المعتمدة',
      codTitle: 'الدفع عند الاستلام نقداً (Cash on Delivery)',
      codDesc: 'ادفع نقداً للمندوب عند استلام شحنتك وتفقد عطورك الفاخرة بكل أمان',
      orderSummary: 'ملخص الطلبية',
      subtotal: 'المجموع الفرعي',
      shipping: 'الشحن والتوصيل',
      shippingFree: 'شحن مجاني',
      discount: 'الخصم',
      grandTotal: 'المبلغ الإجمالي المطلوب عند الاستلام',
      placeOrderBtn: 'تأكيد الطلب والدفع عند الاستلام ✨',
      processing: 'جاري تأكيد وتسجيل طلبك...',
      guarantee: 'ضمان أصالة وثبات 100% مع حق المعاينة عند الاستلام'
    },
    admin: {
      dashboard: 'لوحة التحكم الفلكية',
      welcome: 'مرحباً بك في إدارة دار كون للعطور',
      tabs: {
        overview: 'نظرة عامة والإحصائيات',
        products: 'إدارة العطور والمنتجات',
        orders: 'طلبيات الدفع عند الاستلام',
        homepage: 'محتوى الصفحة الرئيسية',
        settings: 'إعدادات وأقسام الموقع'
      },
      stats: {
        totalRevenue: 'إجمالي قيمة المبيعات',
        totalOrders: 'إجمالي الطلبيات',
        newOrders: 'طلبات جديدة بحاجة للتأكيد',
        pendingCash: 'مبالغ مستحقة للتحصيل عند التسليم',
        collectedCash: 'مبالغ محصلة نقداً',
        productsCount: 'العطور المتاحة في المتجر'
      },
      orders: {
        orderId: 'رقم الطلب',
        customer: 'العميل',
        phone: 'الهاتف',
        city: 'المدينة',
        amount: 'المبلغ المطلوب',
        orderStatus: 'حالة الطلب',
        paymentStatus: 'حالة الدفع النقدي',
        date: 'تاريخ الطلب',
        actions: 'إجراءات',
        statuses: {
          new: 'طلب جديد 🟡',
          processing: 'جاري التجهيز 🔵',
          shipped: 'خرج مع المندوب 🟣',
          delivered: 'تم التوصيل بنجاح 🟢',
          cancelled: 'ملغي 🔴'
        },
        paymentStatuses: {
          pending_cash: 'قيد التحصيل عند التسليم 💵',
          collected: 'تم الاستلام نقدياً ✅',
          refunded: 'مسترجع ↩️'
        }
      },
      products: {
        addNew: 'إضافة عطر جديد ✨',
        edit: 'تعديل العطر',
        delete: 'حذف العطر',
        nameAr: 'اسم العطر بالعربية',
        nameEn: 'اسم العطر بالإنجليزية',
        brand: 'الماركة',
        tagline: 'النبذة التسويقية',
        description: 'الوصف التفصيلي',
        price: 'السعر الحالي (ر.س)',
        originalPrice: 'السعر قبل الخصم (ر.س)',
        gender: 'الفئة المستهدفة',
        season: 'الموسم المناسب',
        scentFamily: 'العائلة العطرية',
        imageUrl: 'رابط الصورة الرئيسية',
        videoUrl: 'رابط الفيديو (اختياري)',
        notesTop: 'القمة العطرية (مفصولة بفواصل)',
        notesHeart: 'قلب العطر (مفصولة بفواصل)',
        notesBase: 'قاعدة العطر (مفصولة بفواصل)',
        active: 'نشط في المتجر',
        bestseller: 'ضمن الأكثر مبيعاً',
        featured: 'مميز في الواجهة',
        save: 'حفظ وتحديث العطر',
        cancel: 'إلغاء'
      },
      homepage: {
        title: 'تخصيص محتوى وترتيب الصفحة الرئيسية',
        heroTagline: 'عبارة البانر الترويجي العلوي',
        heroTitleAr: 'عنوان المتجر الرئيسي (عربي)',
        heroTitleEn: 'عنوان المتجر بالإنجليزية',
        heroSubtitleAr: 'العبارة الوصفية الكونية',
        announcementText: 'نص الشريط الإعلاني المتحرك',
        announcementEnabled: 'تفعيل الشريط الإعلاني',
        saveChanges: 'حفظ التغييرات ونشرها فوراً'
      },
      logout: 'تسجيل الخروج',
      loginTitle: 'تسجيل دخول إدارة دار كون للعطور',
      loginSubtitle: 'الرجاء إدخال بيانات المشرف للوصول إلى لوحة التحكم',
      email: 'البريد الإلكتروني للإدارة',
      password: 'كلمة المرور',
      loginBtn: 'دخول لوحة الإدارة 🪐'
    },
    currency: 'ر.س'
  },
  he: {
    announcement: 'משלוח קוסמי חינם בהזמנות מעל 350 ₪ | קוד קופון KOON10 ל-10% הנחה | דוגמית יוקרתית חינם בכל הזמנה',
    brandName: 'קון פרפיום',
    brandSub: 'KOON PERFUME',
    nav: {
      home: 'דף הבית',
      shop: 'חנות וקטלוג',
      bestsellers: 'הנמכרים ביותר ⭐',
      quiz: 'בוחן בשמים 🪐',
      about: 'אודות קון פרפיום',
      track: 'מעקב משלוח',
      contact: 'צור קשר',
      profile: 'החשבון שלי והזמנות',
      faq: 'שאלות נפוצות ואחריות',
      cart: 'עגלה',
      admin: 'לוח בקרה ניהולי'
    },
    actions: {
      search: 'חיפוש בושם',
      searchPlaceholder: 'חפש לפי שם, משפחת ריח, תווים (למשל: עוד, וניל, אוד, נישה)...',
      wishlist: 'מועדפים',
      cartTitle: 'עגלת קניות',
      itemsCount: 'מוצרים',
      checkout: 'השלמת הזמנה ותשלום בעת מסירה',
      exploreBtn: 'גלה את בשמי קון הקוסמיים',
      quizBtn: 'בוחן התאמת בושם (Quiz)',
      scrollDown: 'גלול למטה כדי לגלות את הקולקציות',
      addToCart: 'הוסף לעגלה',
      quickView: 'מבט מהיר',
      buyNow: 'קנה עכשיו'
    },
    checkout: {
      title: 'השלמת הזמנה ותשלום בעת מסירה (COD)',
      subtitle: 'רכישה בטוחה ונוחה, שלם במזומן לשליח בעת קבלת הבושם ובדיקתו',
      customerInfo: 'פרטי הלקוח וכתובת למשלוח',
      firstName: 'שם פרטי',
      lastName: 'שם משפחה',
      phone: 'מספר טלפון לתיאום משלוח',
      phoneHint: 'חיוני לתיאום מול השליח לפני ההגעה',
      email: 'דוא״ל (אופציונלי)',
      city: 'עיר',
      address: 'כתובת מלאה (שכונה, רחוב, מספר בית)',
      notes: 'הערות נוספות לשליח (אופציונלי)',
      paymentMethodTitle: 'אמצעי תשלום נבחר',
      codTitle: 'תשלום במזומן בעת מסירה (Cash on Delivery)',
      codDesc: 'שלם במזומן לשליח בבטחה מלאה בעת קבלת החבילה ובדיקת הבושם',
      orderSummary: 'סיכום הזמנה',
      subtotal: 'סכום ביניים',
      shipping: 'משלוח ואספקה',
      shippingFree: 'משלוח חינם',
      discount: 'הנחה',
      grandTotal: 'סכום כולל לתשלום במזומן בעת מסירה',
      placeOrderBtn: 'אישור הזמנה ותשלום בעת מסירה ✨',
      processing: 'רושם את ההזמנה במערכת...',
      guarantee: '100% אחריות למקוריות ועמידות עם זכות בדיקה בעת המסירה'
    },
    admin: {
      dashboard: 'לוח בקרה קוסמי',
      welcome: 'ברוכים הבאים לניהול בית הבישום קון',
      tabs: {
        overview: 'סקירה כללית וסטטיסטיקה',
        products: 'ניהול בשמים ומוצרים',
        orders: 'הזמנות תשלום בעת מסירה (COD)',
        homepage: 'תוכן דף הבית',
        settings: 'הגדרות האתר ומחלקות'
      },
      stats: {
        totalRevenue: 'סך שווי מכירות',
        totalOrders: 'סך כל ההזמנות',
        newOrders: 'הזמנות חדשות הממתינות לאישור',
        pendingCash: 'סכומים לגבייה במזומן במסירה',
        collectedCash: 'סכומים שנגבו במזומן בפועל',
        productsCount: 'בשמים פעילים בחנות'
      },
      orders: {
        orderId: 'מספר הזמנה',
        customer: 'לקוח',
        phone: 'טלפון',
        city: 'עיר',
        amount: 'סכום לגבייה',
        orderStatus: 'סטטוס הזמנה',
        paymentStatus: 'סטטוס תשלום במזומן',
        date: 'תאריך הזמנה',
        actions: 'פעולות',
        statuses: {
          new: 'הזמנה חדשה 🟡',
          processing: 'בהכנה 🔵',
          shipped: 'יצא עם שליח 🟣',
          delivered: 'נמסר בהצלחה 🟢',
          cancelled: 'בוטל 🔴'
        },
        paymentStatuses: {
          pending_cash: 'ממתין לגבייה במסירה 💵',
          collected: 'נגבה במזומן ✅',
          refunded: 'הוחזר ↩️'
        }
      },
      products: {
        addNew: 'הוספת בושם חדש ✨',
        edit: 'עריכת בושם',
        delete: 'מחיקת בושם',
        nameAr: 'שם הבושם בערבית',
        nameEn: 'שם הבושם באנגלית',
        brand: 'מותג',
        tagline: 'תקציר שיווקי',
        description: 'תיאור מפורט',
        price: 'מחיר נוכחי (₪)',
        originalPrice: 'מחיר מקורי (₪)',
        gender: 'קהל יעד',
        season: 'עונה מתאימה',
        scentFamily: 'משפחת ריח',
        imageUrl: 'קישור לתמונה ראשית',
        videoUrl: 'קישור לווידאו (אופציונלי)',
        notesTop: 'תווי ראש (מופרדים בפסיקים)',
        notesHeart: 'תווי לב (מופרדים בפסיקים)',
        notesBase: 'תווי בסיס (מופרדים בפסיקים)',
        active: 'פעיל בחנות',
        bestseller: 'הנמכר ביותר',
        featured: 'מוצג בדף הבית',
        save: 'שמור ועדכן בושם',
        cancel: 'ביטול'
      },
      homepage: {
        title: 'התאמת תוכן וסדר דף הבית',
        heroTagline: 'כותרת משנה בבאנר הראשי',
        heroTitleAr: 'שם החנות הראשי (ערבית)',
        heroTitleEn: 'שם החנות באנגלית',
        heroSubtitleAr: 'תיאור קוסמי',
        announcementText: 'טקסט באנר עליון נע',
        announcementEnabled: 'הפעלת באנר עליון',
        saveChanges: 'שמור שינויים ופרסם מיד'
      },
      logout: 'התנתקות',
      loginTitle: 'כניסת מנהל לבית הבישום קון',
      loginSubtitle: 'אנא הזן את פרטי המנהל כדי לגשת ללוח הבקרה',
      email: 'דוא״ל מנהל',
      password: 'סיסמה',
      loginBtn: 'כניסה ללוח הניהול 🪐'
    },
    currency: '₪'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('koon_language') || 'ar';
    } catch {
      return 'ar';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('koon_language', language);
      document.documentElement.lang = language;
      // Both Arabic and Hebrew are RTL
      document.documentElement.dir = 'rtl';
    } catch (e) {
      console.error(e);
    }
  }, [language]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
