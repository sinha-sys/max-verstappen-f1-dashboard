"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatPercentage } from "@/lib/format";
import type { SeasonStat } from "@/lib/types";

interface WinRateTrendProps {
  seasons: SeasonStat[];
}

export function WinRateTrend({ seasons }: WinRateTrendProps) {
  const data = seasons.map((season) => ({
    season: season.season,
    winRate: season.starts > 0 ? season.wins / season.starts : 0,
  }));

  return (
    <Card className="mobile-tap-highlight">
      <CardHeader className="pb-3 iphone:pb-4">
        <CardTitle className="text-base iphone:text-lg">Win Rate by Season</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250} className="iphone:h-[280px] sm:h-[300px]">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="season" 
              className="text-muted-foreground"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tickFormatter={(value) => formatPercentage(value, 0)}
              className="text-muted-foreground"
              tick={{ fontSize: 10 }}
              width={40}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="text-sm font-medium">{label}</div>
                        <div className="text-sm text-muted-foreground">
                          Win Rate: {formatPercentage(payload[0].value as number)}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="winRate"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
