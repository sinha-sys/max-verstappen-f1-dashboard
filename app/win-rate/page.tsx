"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp } from "lucide-react";
import Script from "next/script";

interface WinRateDriver {
  rank: number;
  driverName: string;
  starts: number;
  wins: number;
  winPercentage: number;
  era: string;
  notes: string;
}

export default function WinRatePage() {
  const [drivers, setDrivers] = useState<WinRateDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/win-rate');
        if (!response.ok) {
          throw new Error('Failed to fetch win rate data');
        }
        const data = await response.json();
        setDrivers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load win rate data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            {!mounted ? "Initializing..." : "Loading win rate data..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="text-red-500 text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold">Unable to Load Win Rate Data</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="win-rate-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "Formula 1 Drivers Win Rate Statistics",
            "description": "Top 10 Formula 1 drivers by career win percentage with minimum 15 starts",
            "keywords": "Formula 1, F1, win rate, statistics, drivers, career percentage",
            "creator": {
              "@type": "Organization",
              "name": "F1 Stats Dashboard"
            }
          })
        }}
      />

      <div className="min-h-screen bg-background mobile-safe-area">
        <main className="container mx-auto px-3 py-6 sm:px-6 lg:px-8 lg:py-12 max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              F1 Win Rate Leaders
            </h1>
            <p className="text-lg text-muted-foreground">
              Top 10 Formula 1 drivers by career win percentage (minimum 15 starts)
            </p>
          </div>

          <div className="space-y-6 lg:space-y-8">
            {/* Win Rate Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  Career Win Percentage Leaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto w-full max-w-full">
                  <Table className="min-w-full w-full">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-center font-semibold">Rank</TableHead>
                        <TableHead className="text-left font-semibold">Driver</TableHead>
                        <TableHead className="text-center font-semibold">Starts</TableHead>
                        <TableHead className="text-center font-semibold">Wins</TableHead>
                        <TableHead className="text-center font-semibold">Win %</TableHead>
                        <TableHead className="text-center font-semibold">Era</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers.map((driver) => (
                        <TableRow key={driver.rank} className="hover:bg-muted/50">
                          <TableCell className="text-center">
                            <Badge 
                              variant={driver.rank <= 3 ? "default" : "secondary"}
                              className={`${
                                driver.rank === 1 ? "bg-yellow-600" : 
                                driver.rank === 2 ? "bg-gray-400" : 
                                driver.rank === 3 ? "bg-amber-600" : ""
                              }`}
                            >
                              #{driver.rank}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {driver.driverName === 'Max Verstappen' && (
                                <TrendingUp className="h-4 w-4 text-primary" />
                              )}
                              <span className={driver.driverName === 'Max Verstappen' ? 'text-primary font-bold' : ''}>
                                {driver.driverName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{driver.starts.toLocaleString()}</TableCell>
                          <TableCell className="text-center">
                            <span className="text-yellow-600 font-semibold">
                              {driver.wins}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-bold text-lg">
                              {driver.winPercentage.toFixed(2)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-xs">
                              {driver.era}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Highlights & Context */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Highlights & Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-base leading-relaxed">
                  <p>
                    <strong className="text-yellow-600">Juan Manuel Fangio (47.06%)</strong> reigns supreme in win percentage—almost one win for every two races—a testament to his dominance in the early 1950s.
                  </p>
                  
                  <p>
                    <strong className="text-gray-600">Alberto Ascari (40.62%)</strong> and <strong className="text-blue-600">Jim Clark (34.72%)</strong> also shine with exceptionally efficient win rates from mid‑20th century eras.
                  </p>
                  
                  <p>
                    Among modern drivers, <strong className="text-primary">Verstappen (≈29.8%)</strong> and <strong className="text-green-600">Hamilton (≈28.8%)</strong> lead the pack, showcasing consistent performance across vastly more races.
                  </p>
                  
                  <p>
                    <strong className="text-red-600">Michael Schumacher</strong> remains in the elite with nearly 30% win rate.
                  </p>
                  
                  <p>
                    Rounding out the top 10 are all-time greats like <strong>Stewart, Prost, Senna, and Moss</strong>, whose percentages reflect both skill and era-specific race calendars and reliability.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Summary */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Quick Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      47.06%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Highest Win Rate
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Juan Manuel Fangio
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      29.82%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current Era Leader
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Max Verstappen
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      365
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Most Starts
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Lewis Hamilton
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      105
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Most Wins
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Lewis Hamilton
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
