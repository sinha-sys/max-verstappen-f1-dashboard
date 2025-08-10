"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatNumber } from "@/lib/format";
import type { SeasonStat } from "@/lib/types";

interface PodiumsPolesAreaProps {
  seasons: SeasonStat[];
}

export function PodiumsPolesArea({ seasons }: PodiumsPolesAreaProps) {
  const data = seasons.map((season) => ({
    season: season.season,
    podiums: season.podiums,
    poles: season.poles,
  }));

  return (
    <Card className="mobile-tap-highlight">
      <CardHeader className="pb-3 iphone:pb-4">
        <CardTitle className="text-base iphone:text-lg">Podiums vs Poles by Season</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250} className="iphone:h-[280px] sm:h-[300px]">
          <AreaChart data={data}>
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
                    <div className="rounded-lg border bg-background p-3 shadow-sm">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="text-sm font-medium">{label}</div>
                        {payload.map((entry, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            {entry.name}: {formatNumber(entry.value as number)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="podiums"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Podiums"
            />
            <Area
              type="monotone"
              dataKey="poles"
              stackId="1"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
              name="Pole Positions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
