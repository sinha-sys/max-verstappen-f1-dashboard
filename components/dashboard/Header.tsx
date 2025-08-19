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
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 w-full overflow-x-hidden relative z-[90]">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-full">
        {/* Mobile Layout */}
        <div className="flex md:hidden h-14 items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {/* Driver Image - Smaller on mobile */}
            <div className="flex-shrink-0">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/max-verstappen.jpg"
                  alt="Max Verstappen"
                  width={40}
                  height={40}
                  className="rounded-full object-cover border-2 border-primary/20 relative z-10 w-10 h-10"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.parentElement?.querySelector('.placeholder') as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />
                <div className="placeholder absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-blue-500 items-center justify-center text-white font-bold text-xs hidden">
                  MV
                </div>
              </div>
            </div>
            
            {/* Title - Compact on mobile */}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent truncate" itemProp="name">
                {t('header.title')}
              </h1>
            </div>
          </div>

          {/* Controls - Compact on mobile */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex h-20 items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Driver Image */}
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 lg:w-20 lg:h-20">
                <Image
                  src="/images/max-verstappen.jpg"
                  alt="Max Verstappen"
                  width={80}
                  height={80}
                  className="rounded-full object-cover border-2 border-primary/20 relative z-10 w-16 h-16 lg:w-20 lg:h-20"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.parentElement?.querySelector('.placeholder') as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />
                <div className="placeholder absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-blue-500 items-center justify-center text-white font-bold text-lg hidden">
                  MV
                </div>
              </div>
            </div>
            
            {/* Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent" itemProp="name">
                {t('header.title')}
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground font-medium" itemProp="description">
                {t('header.subtitle')}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
