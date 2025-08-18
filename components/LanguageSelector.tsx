"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n, t } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    // Save language preference to localStorage
    localStorage.setItem('preferred-language', langCode);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted"
        aria-label={t('select')}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 top-full mt-2 w-48 z-50 shadow-lg">
            <CardContent className="p-2">
              <div className="space-y-1">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                      i18n.language === language.code
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                    {i18n.language === language.code && (
                      <span className="ml-auto text-xs opacity-70">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
