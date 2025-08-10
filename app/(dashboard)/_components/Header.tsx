import { formatDate } from "@/lib/format";
import { ThemeToggle } from "@/components/theme-toggle";
import { Trophy, Flag, Target, Zap, Timer, MapPin, AlertTriangle, Crown } from "lucide-react";

interface HeaderProps {
  driverName: string;
  lastUpdated: string;
}

const metrics = [
  { icon: Flag, label: "Starts", key: "starts" },
  { icon: Trophy, label: "Wins", key: "wins" },
  { icon: Target, label: "Podiums", key: "podiums" },
  { icon: Zap, label: "Poles", key: "poles" },
  { icon: Timer, label: "FLaps", key: "fastestLaps" },
  { icon: MapPin, label: "Pts", key: "points" },
  { icon: AlertTriangle, label: "DNFs", key: "dnfs" },
  { icon: Crown, label: "Titles", key: "championships" },
];

export function Header({ driverName, lastUpdated }: HeaderProps) {
  return (
    <header className="border-b bg-card mobile-tap-highlight">
      <div className="container mx-auto px-3 py-4 iphone:px-4 iphone:py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-3 iphone:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 iphone:space-y-2">
            <h1 className="text-xl iphone:text-2xl sm:text-3xl font-bold tracking-tight">{driverName}</h1>
            <p className="text-xs iphone:text-sm text-muted-foreground">
              Last updated: {formatDate(lastUpdated)}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground">
              {metrics.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <Icon className="h-3 w-3" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
        
        {/* Mobile legend */}
        <div className="mt-3 iphone:mt-4 flex flex-wrap gap-2 iphone:gap-3 text-xs text-muted-foreground sm:hidden">
          {metrics.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1">
              <Icon className="h-2.5 w-2.5 iphone:h-3 iphone:w-3" />
              <span className="text-xs iphone:text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
