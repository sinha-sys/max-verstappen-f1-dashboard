import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, formatPoints } from "@/lib/format";
import { useTranslation } from "react-i18next";
import { Trophy, Flag, Target, Zap, Timer, MapPin, AlertTriangle, Crown } from "lucide-react";
import type { CareerTotals } from "@/lib/types";

interface KPIGroupProps {
  career: CareerTotals;
}

export function KPIGroup({ career }: KPIGroupProps) {
  const { t } = useTranslation();
  
  const kpis = [
    {
      icon: Flag,
      label: t('kpi.starts'),
      value: formatNumber(career.starts),
      color: "text-blue-600",
    },
    {
      icon: Trophy,
      label: t('kpi.wins'),
      value: formatNumber(career.wins),
      color: "text-yellow-600",
    },
    {
      icon: Target,
      label: t('kpi.podiums'),
      value: formatNumber(career.podiums),
      color: "text-green-600",
    },
    {
      icon: Zap,
      label: t('kpi.poles'),
      value: formatNumber(career.poles),
      color: "text-purple-600",
    },
    {
      icon: Timer,
      label: t('kpi.fastestLaps'),
      value: formatNumber(career.fastestLaps),
      color: "text-pink-600",
    },
    {
      icon: MapPin,
      label: t('kpi.points'),
      value: formatPoints(career.points),
      color: "text-indigo-600",
    },
    {
      icon: AlertTriangle,
      label: t('kpi.dnfs'),
      value: formatNumber(career.dnfs),
      color: "text-red-600",
    },
    {
      icon: Crown,
      label: t('kpi.championships'),
      value: formatNumber(career.championships),
      color: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 md:grid-cols-4 lg:grid-cols-8 w-full min-w-0">
      {kpis.map(({ icon: Icon, label, value, color }) => (
        <Card key={label} className="hover:shadow-lg hover:scale-105 transition-all duration-200 mobile-tap-highlight mobile-touch-action min-w-0 bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-3 sm:p-4 md:p-5 min-w-0">
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className={`p-2 rounded-full bg-gradient-to-br from-background to-muted/30 shadow-sm`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 ${color}`} />
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-none tracking-tight text-foreground">{value}</p>
                <p className="text-sm sm:text-base md:text-lg font-medium text-muted-foreground leading-tight">{label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
