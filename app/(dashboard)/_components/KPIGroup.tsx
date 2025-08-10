import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, formatPoints } from "@/lib/format";
import { Trophy, Flag, Target, Zap, Timer, MapPin, AlertTriangle, Crown } from "lucide-react";
import type { CareerTotals } from "@/lib/types";

interface KPIGroupProps {
  career: CareerTotals;
}

export function KPIGroup({ career }: KPIGroupProps) {
  const kpis = [
    {
      icon: Flag,
      label: "Starts",
      value: formatNumber(career.starts),
      color: "text-blue-600",
    },
    {
      icon: Trophy,
      label: "Wins",
      value: formatNumber(career.wins),
      color: "text-yellow-600",
    },
    {
      icon: Target,
      label: "Podiums",
      value: formatNumber(career.podiums),
      color: "text-green-600",
    },
    {
      icon: Zap,
      label: "Poles",
      value: formatNumber(career.poles),
      color: "text-purple-600",
    },
    {
      icon: Timer,
      label: "Fastest Laps",
      value: formatNumber(career.fastestLaps),
      color: "text-pink-600",
    },
    {
      icon: MapPin,
      label: "Points",
      value: formatPoints(career.points),
      color: "text-indigo-600",
    },
    {
      icon: AlertTriangle,
      label: "DNFs",
      value: formatNumber(career.dnfs),
      color: "text-red-600",
    },
    {
      icon: Crown,
      label: "Championships",
      value: formatNumber(career.championships),
      color: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 iphone:gap-3 sm:gap-4 sm:grid-cols-4 lg:grid-cols-8">
      {kpis.map(({ icon: Icon, label, value, color }) => (
        <Card key={label} className="hover:shadow-md transition-shadow mobile-tap-highlight mobile-touch-action">
          <CardContent className="p-2 iphone:p-3 sm:p-4">
            <div className="flex flex-col items-center text-center space-y-1 iphone:space-y-2">
              <Icon className={`h-4 w-4 iphone:h-5 iphone:w-5 sm:h-6 sm:w-6 ${color}`} />
              <div>
                <p className="text-lg iphone:text-xl sm:text-2xl font-bold leading-tight">{value}</p>
                <p className="text-xs sm:text-xs text-muted-foreground leading-tight">{label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
