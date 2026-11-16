import React, { createContext, useContext, useState, useEffect } from 'react';
import arTranslations from '../locales/ar.json';
import heTranslations from '../locales/he.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Organized JSON Translations (Arabic & Hebrew)
export const TRANSLATIONS = {
  ar: arTranslations,
  he: heTranslations,
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('koon_language');
      return saved === 'he' || saved === 'ar' ? saved : 'ar';
    } catch {
      return 'ar';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('koon_language', language);
      document.documentElement.lang = language;
      // Both Arabic and Hebrew use RTL direction
      document.documentElement.dir = 'rtl';
    } catch (e) {
      console.error(e);
    }
  }, [language]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;

  const toggleLanguage = (lang) => {
    if (lang === 'ar' || lang === 'he') {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
