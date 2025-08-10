"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercentage, formatNumber } from "@/lib/format";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { RateSummary } from "@/lib/types";

interface RateCardsProps {
  rates: RateSummary;
}

const COLORS = {
  win: "#fbbf24", // yellow-400
  podium: "#10b981", // emerald-500
  pole: "#8b5cf6", // violet-500
  dnf: "#ef4444", // red-500
};

export function RateCards({ rates }: RateCardsProps) {
  const rateCards = [
    {
      title: "Win Rate",
      value: rates.winRate,
      color: COLORS.win,
      data: [
        { name: "Wins", value: rates.winRate },
        { name: "Other", value: 1 - rates.winRate },
      ],
    },
    {
      title: "Podium Rate",
      value: rates.podiumRate,
      color: COLORS.podium,
      data: [
        { name: "Podiums", value: rates.podiumRate },
        { name: "Other", value: 1 - rates.podiumRate },
      ],
    },
    {
      title: "Pole Rate",
      value: rates.poleRate,
      color: COLORS.pole,
      data: [
        { name: "Poles", value: rates.poleRate },
        { name: "Other", value: 1 - rates.poleRate },
      ],
    },
    {
      title: "DNF Rate",
      value: rates.dnfRate,
      color: COLORS.dnf,
      data: [
        { name: "DNFs", value: rates.dnfRate },
        { name: "Other", value: 1 - rates.dnfRate },
      ],
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {rateCards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-center">{card.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 sm:pb-4">
            <div className="flex items-center justify-center">
              <div className="relative h-12 w-12 sm:h-16 sm:w-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={card.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={16}
                      outerRadius={24}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill={card.color} />
                      <Cell fill="hsl(var(--muted))" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold">{formatPercentage(card.value)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Average Points per Start */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-center">Avg Points/Start</CardTitle>
        </CardHeader>
        <CardContent className="pb-3 sm:pb-4">
          <div className="flex items-center justify-center h-12 sm:h-16">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-indigo-600">
                {formatNumber(rates.avgPointsPerStart)}
              </div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
