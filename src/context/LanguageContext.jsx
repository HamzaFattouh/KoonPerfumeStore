import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translations Dictionary (Arabic & Hebrew)
export const TRANSLATIONS = {
  ar: {
    announcement: 'شحن كوني مجاني للطلبات فوق 350 ر.س | كود الخصم KOON10 لخصم 10% | عينة فاخرة مجاناً',
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
      cart: 'السلة'
    },
    actions: {
      search: 'بحث عن عطر',
      searchPlaceholder: 'ابحث بالاسم، العائلة العطرية، النوتات (مثال: عود، فانيليا، الشفق، نيش)...',
      wishlist: 'المفضلة',
      cartTitle: 'سلة المشتريات',
      itemsCount: 'منتجات',
      checkout: 'متابعة إتمام الطلب والدفع',
      exploreBtn: 'استكشف عطور كون الفلكية',
      quizBtn: 'مستكشف العطور (Quiz)',
      scrollDown: 'مرر للأسفل لاكتشاف المجموعات'
    },
    currency: 'ر.س'
  },
  he: {
    announcement: 'משלוח קוסמי חינם בהזמנות מעל 350 ₪ | קוד קופון KOON10 ל-10% הנחה | דוגמית יוקרתית חינם',
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
      cart: 'עגלה'
    },
    actions: {
      search: 'חיפוש בושם',
      searchPlaceholder: 'חפש לפי שם, משפחת ריח, תווים (למשל: עוד, וניל, אוד, נישה)...',
      wishlist: 'מועדפים',
      cartTitle: 'עגלת קניות',
      itemsCount: 'מוצרים',
      checkout: 'המשך לתשלום מאובטח',
      exploreBtn: 'גלה את בשמי קון הקוסמיים',
      quizBtn: 'בוחן התאמת בושם (Quiz)',
      scrollDown: 'גלול למטה כדי לגלות את הקולקציות'
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

