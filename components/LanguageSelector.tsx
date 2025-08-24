"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const languages = [
  { code: 'en', name: 'EN', flag: '🇺🇸', fullName: 'English' },
  { code: 'nl', name: 'NL', flag: '🇳🇱', fullName: 'Nederlands' },
  { code: 'de', name: 'DE', flag: '🇩🇪', fullName: 'Deutsch' },
  { code: 'ru', name: 'RU', flag: '🇷🇺', fullName: 'Русский' },
  { code: 'zh', name: 'ZH', flag: '🇨🇳', fullName: '中文' },
  { code: 'ja', name: 'JP', flag: '🇯🇵', fullName: '日本語' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    // Save language preference to localStorage
    localStorage.setItem('preferred-language', langCode);
  };

  return (
    <div className="flex items-center gap-0.5 md:gap-1 p-0.5 md:p-1 bg-muted/50 rounded-lg">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className={cn(
            "flex items-center gap-1 px-1.5 md:px-2 py-1 rounded-md text-xs font-medium transition-all duration-200",
            "hover:bg-background hover:shadow-sm",
            i18n.language === language.code
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          title={language.fullName}
        >
          <span className="text-xs md:text-sm">{language.flag}</span>
          <span className="hidden md:inline">{language.name}</span>
        </button>
      ))}
    </div>
  );
}
