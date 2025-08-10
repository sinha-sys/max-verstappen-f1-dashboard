"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercentage, formatDecimal } from "@/lib/format";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { RateSummary } from "@/lib/types";

interface RateCardsProps {
  rates: RateSummary;
}

export function RateCards({ rates }: RateCardsProps) {
  const createDonutData = (rate: number, label: string) => [
    { name: label, value: rate, fill: "#3b82f6" },
    { name: "Other", value: 1 - rate, fill: "#e5e7eb" },
  ];

  const rateCards = [
    {
      title: "Win Rate",
      rate: rates.winRate,
      color: "#10b981",
      data: createDonutData(rates.winRate, "Wins"),
    },
    {
      title: "Podium Rate",
      rate: rates.podiumRate,
      color: "#3b82f6",
      data: createDonutData(rates.podiumRate, "Podiums"),
    },
    {
      title: "Pole Rate",
      rate: rates.poleRate,
      color: "#8b5cf6",
      data: createDonutData(rates.poleRate, "Poles"),
    },
    {
      title: "DNF Rate",
      rate: rates.dnfRate,
      color: "#ef4444",
      data: createDonutData(rates.dnfRate, "DNFs"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 iphone:gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {rateCards.map(({ title, rate, color, data }) => (
        <Card key={title} className="hover:shadow-md transition-shadow mobile-tap-highlight">
          <CardHeader className="pb-1 iphone:pb-2">
            <CardTitle className="text-xs iphone:text-sm font-medium">{title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 iphone:space-y-1">
                <p className="text-lg iphone:text-xl sm:text-2xl font-bold">{formatPercentage(rate)}</p>
                <p className="text-xs text-muted-foreground">
                  {(rate * 100).toFixed(1)}%
                </p>
              </div>
              <div className="h-12 w-12 iphone:h-14 iphone:w-14 sm:h-16 sm:w-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={12}
                      outerRadius={18}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      <Cell fill={color} />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Average Points per Start card */}
      <Card className="hover:shadow-md transition-shadow mobile-tap-highlight">
        <CardHeader className="pb-1 iphone:pb-2">
          <CardTitle className="text-xs iphone:text-sm font-medium">Avg Points/Start</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center h-12 iphone:h-14 sm:h-16">
            <div className="text-center">
              <p className="text-lg iphone:text-xl sm:text-2xl font-bold">
                {formatDecimal(rates.avgPointsPerStart, 1)}
              </p>
              <p className="text-xs text-muted-foreground">points per race</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
