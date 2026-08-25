import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arTranslations from '../locales/ar.json';
import enTranslations from '../locales/en.json';

const savedLanguage = (typeof window !== 'undefined' ? localStorage.getItem('pharmacy_language') : null) as 'ar' | 'en' | null;
const defaultLanguage = savedLanguage || 'ar';

i18n.use(initReactI18next).init({
  resources: {
    ar: {
      translation: arTranslations,
    },
    en: {
      translation: enTranslations,
    },
  },
  lng: defaultLanguage,
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

// Update document direction on language change
export function applyLanguageSettings(lang: 'ar' | 'en') {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
  }
}

// Apply initial language settings on load
applyLanguageSettings(defaultLanguage);

export default i18n;
