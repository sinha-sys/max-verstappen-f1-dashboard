"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Home, User, Calendar, Trophy, Clock, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const getNavigationItems = (t: any) => [
  {
    name: t('navigation.dashboard'),
    href: "/",
    icon: Home,
    description: t('navigation.dashboardDesc')
  },
  {
    name: t('navigation.results'),
    href: "/results",
    icon: Calendar,
    description: t('navigation.resultsDesc')
  },
  {
    name: t('navigation.winRate'),
    href: "/win-rate",
    icon: Trophy,
    description: t('navigation.winRateDesc')
  },
  {
    name: t('navigation.timeline'),
    href: "/timeline",
    icon: Clock,
    description: t('navigation.timelineDesc')
  },
  {
    name: t('navigation.profile'),
    href: "/profile",
    icon: User,
    description: t('navigation.profileDesc')
  }
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  
  const navigationItems = getNavigationItems(t);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-14 items-center justify-center">
            <div className="flex space-x-4 lg:space-x-6">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-3 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <h2 className="text-lg font-semibold">{t('navigation.dashboard')}</h2>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
            <div className="container mx-auto px-3 sm:px-6 py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                    >
                      <Card className={cn(
                        "transition-colors",
                        isActive ? "bg-primary/10 border-primary/20" : "hover:bg-muted/50"
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Icon className={cn(
                              "h-5 w-5",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                            <div>
                              <div className={cn(
                                "font-medium",
                                isActive ? "text-primary" : "text-foreground"
                              )}>
                                {item.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
