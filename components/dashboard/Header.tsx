import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";
import Image from "next/image";

interface HeaderProps {
  driverName: string;
}

export function Header({ driverName }: HeaderProps) {
  const { t } = useTranslation();
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 w-full overflow-x-hidden relative z-50">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-full">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Driver Image */}
            <div className="flex-shrink-0">
              <div className="relative w-12 h-12 sm:w-20 sm:h-20">
                <Image
                  src="/images/max-verstappen.jpg"
                  alt="Max Verstappen"
                  width={80}
                  height={80}
                  className="rounded-full object-cover border-2 border-primary/20 relative z-10 w-12 h-12 sm:w-20 sm:h-20"
                  priority
                  onError={(e) => {
                    // Hide the image and show placeholder
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.parentElement?.querySelector('.placeholder') as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />
                {/* Fallback placeholder - hidden by default */}
                <div className="placeholder absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-blue-500 items-center justify-center text-white font-bold text-sm sm:text-lg hidden">
                  MV
                </div>
              </div>
            </div>
                                <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent" itemProp="name">{t('header.title')}</h1>
                      <p className="text-sm sm:text-base text-muted-foreground font-medium" itemProp="description">
                        {t('header.subtitle')}
                      </p>
                    </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
