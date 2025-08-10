"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import type { SeasonStat } from "@/lib/types";

interface WinRateTrendProps {
  seasons: SeasonStat[];
}

export function WinRateTrend({ seasons }: WinRateTrendProps) {
  const data = seasons.map((season) => ({
    season: season.season,
    winRate: season.starts > 0 ? (season.wins / season.starts) * 100 : 0,
    wins: season.wins,
    starts: season.starts,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-yellow-600" />
          Win Rate Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="season" 
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border rounded-lg p-2 shadow-md">
                        <p className="font-medium">{label} Season</p>
                        <p className="text-sm text-muted-foreground">
                          Win Rate: {typeof payload[0].value === 'number' ? payload[0].value.toFixed(1) : payload[0].value}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {data.wins} wins in {data.starts} starts
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="winRate" 
                stroke="#fbbf24" 
                strokeWidth={2}
                dot={{ fill: "#fbbf24", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#fbbf24", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
