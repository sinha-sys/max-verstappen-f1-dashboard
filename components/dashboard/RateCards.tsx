"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercentage, formatNumber } from "@/lib/format";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ExternalLink } from "lucide-react";
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
    <div className="grid gap-3 grid-cols-2 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5 w-full min-w-0">
      {rateCards.map((card) => {
        // Make Win Rate card clickable
        const isWinRate = card.title === "Win Rate";
        const CardComponent = isWinRate ? "div" : Card;
        
        const cardContent = (
          <>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base font-semibold text-center flex items-center justify-center gap-1">
                {card.title}
                {isWinRate && <ExternalLink className="h-3 w-3 opacity-60" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <div className="flex flex-col items-center space-y-3">
                {/* Large, prominent percentage value */}
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: card.color }}>
                  {formatPercentage(card.value)}
                </div>
                
                {/* Larger, more visible pie chart */}
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={card.data}
                        cx="50%"
                        cy="50%"
                        innerRadius="45%"
                        outerRadius="85%"
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill={card.color} />
                        <Cell fill="hsl(var(--muted-foreground) / 0.2)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Optional: Add a subtle center dot for better visual appeal */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full opacity-60" 
                      style={{ backgroundColor: card.color }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        );

        if (isWinRate) {
          return (
            <Link key={card.title} href="/win-rate" className="block min-w-0">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-0 cursor-pointer hover:bg-muted/20">
                {cardContent}
              </Card>
            </Link>
          );
        }

        return (
          <Card key={card.title} className="hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-0">
            {cardContent}
          </Card>
        );
      })}

      {/* Average Points per Start - Enhanced */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base font-semibold text-center">Avg Points/Start</CardTitle>
        </CardHeader>
        <CardContent className="pb-4 sm:pb-6">
          <div className="flex flex-col items-center space-y-3">
            {/* Large, prominent points value */}
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600">
              {formatNumber(rates.avgPointsPerStart)}
            </div>
            
            {/* Visual element for consistency */}
            <div className="flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                <div className="text-white text-xs sm:text-sm md:text-base font-bold">
                  PTS
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
