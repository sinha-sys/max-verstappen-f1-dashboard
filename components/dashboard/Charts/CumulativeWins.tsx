"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy } from "lucide-react";
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
      seasonWins: season.wins,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Cumulative Wins
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Total career victories accumulated over time, highlighting the acceleration during championship years
        </p>
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
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border rounded-lg p-2 shadow-md">
                        <p className="font-medium">{label} Season</p>
                        <p className="text-sm text-muted-foreground">
                          Total Wins: {payload[0].value}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Season Wins: {data.seasonWins}
                        </p>
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
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
