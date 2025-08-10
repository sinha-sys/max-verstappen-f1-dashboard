import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

interface HeaderProps {
  driverName: string;
  lastUpdated: string;
}

export function Header({ driverName, lastUpdated }: HeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 w-full overflow-x-hidden">
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
              <h1 className="text-lg sm:text-xl font-bold">{driverName}</h1>
              <p className="text-xs text-muted-foreground">
                F1 Career Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-xs text-muted-foreground">{lastUpdated}</p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Legend - More compact on mobile */}
        <div className="border-t py-2 overflow-x-hidden">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 md:gap-4 text-xs text-muted-foreground max-w-full">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="hidden sm:inline">Starts</span>
              <span className="sm:hidden">S</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <span className="hidden sm:inline">Wins</span>
              <span className="sm:hidden">W</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="hidden sm:inline">Podiums</span>
              <span className="sm:hidden">P</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span className="hidden sm:inline">Poles</span>
              <span className="sm:hidden">Pol</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-pink-500"></div>
              <span className="hidden sm:inline">Fastest Laps</span>
              <span className="sm:hidden">FL</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              <span className="hidden sm:inline">Points</span>
              <span className="sm:hidden">Pts</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="hidden sm:inline">DNFs</span>
              <span className="sm:hidden">DNF</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <span className="hidden sm:inline">Titles</span>
              <span className="sm:hidden">T</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
