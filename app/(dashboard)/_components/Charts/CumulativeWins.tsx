"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatNumber } from "@/lib/format";
import type { SeasonStat } from "@/lib/types";

interface CumulativeWinsProps {
  seasons: SeasonStat[];
}

export function CumulativeWins({ seasons }: CumulativeWinsProps) {
  let cumulativeWins = 0;
  const data = seasons.map((season) => {
    cumulativeWins += season.wins;
    return {
      season: season.season,
      totalWins: cumulativeWins,
    };
  });

  return (
    <Card className="mobile-tap-highlight">
      <CardHeader className="pb-3 iphone:pb-4">
        <CardTitle className="text-base iphone:text-lg">Cumulative Wins</CardTitle>
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
              tickFormatter={formatNumber}
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
                          Total Wins: {formatNumber(payload[0].value as number)}
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
              dataKey="totalWins"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
