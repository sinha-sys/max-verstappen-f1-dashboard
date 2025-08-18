import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from '../messages/en.json';
import nl from '../messages/nl.json';
import de from '../messages/de.json';
import ru from '../messages/ru.json';
import zh from '../messages/zh.json';

const resources = {
  en: { translation: en },
  nl: { translation: nl },
  de: { translation: de },
  ru: { translation: ru },
  zh: { translation: zh },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already does escaping
    },
  });

export default i18n;
