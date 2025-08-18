"use client";

import { useEffect } from 'react';
import '@/lib/i18n'; // Initialize i18n

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      import('@/lib/i18n').then(({ default: i18n }) => {
        i18n.changeLanguage(savedLanguage);
      });
    }
  }, []);

  return <>{children}</>;
}
