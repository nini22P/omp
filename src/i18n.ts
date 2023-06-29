import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import zh_CN from './locales/zh-CN.json'

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      caches: []  // Disable LanguageDetector cache
    },
    resources: {
      'en': { translation: en },
      'zh-CN': { translation: zh_CN },
    },
  })

export default i18next