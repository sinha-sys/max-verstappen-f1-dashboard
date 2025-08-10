import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  driverName: string;
  lastUpdated: string;
}

export function Header({ driverName, lastUpdated }: HeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold">{driverName}</h1>
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

        {/* Legend */}
        <div className="border-t py-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              Starts
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              Wins
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Podiums
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              Poles
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-pink-500"></div>
              Fastest Laps
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              Points
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              DNFs
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              Titles
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
