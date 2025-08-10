"use client";

import { useEffect, useState } from "react";
import { getCareerClient, getSeasonsClient, getRecordsClient } from "@/lib/fetchers";
import type { CareerTotals, RateSummary, SeasonStat, RecordItem, FilterState } from "@/lib/types";

export default function HomePage() {
  const [career, setCareer] = useState<(CareerTotals & { rates: RateSummary }) | null>(null);
  const [allSeasons, setAllSeasons] = useState<SeasonStat[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    yearRange: [2015, 2025],
  });
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
        const [careerData, seasonsData, recordsData] = await Promise.all([
          getCareerClient(),
          getSeasonsClient(),
          getRecordsClient(),
        ]);

        setCareer(careerData.career);
        setAllSeasons(seasonsData);
        setRecords(recordsData);

        // Set initial filter range based on actual data
        const minYear = Math.min(...seasonsData.map(s => s.season));
        const maxYear = Math.max(...seasonsData.map(s => s.season));
        setFilters({ yearRange: [minYear, maxYear] });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
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
            {!mounted ? "Initializing..." : "Loading dashboard data..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Error loading data</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!career) {
    return null;
  }

  // Filter seasons based on year range
  const filteredSeasons = allSeasons.filter(
    season => season.season >= filters.yearRange[0] && season.season <= filters.yearRange[1]
  );

  const minYear = Math.min(...allSeasons.map(s => s.season));
  const maxYear = Math.max(...allSeasons.map(s => s.season));

  return (
    <div className="min-h-screen bg-background p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">Max Verstappen F1 Dashboard</h1>
        <p className="text-center text-muted-foreground mt-2">
          Last updated: {career?.asOfDate || "Loading..."}
        </p>
      </header>
      
      <main className="container mx-auto max-w-6xl">
        {career && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-card rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold">Starts</h3>
              <p className="text-3xl font-bold text-blue-600">{career.starts}</p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold">Wins</h3>
              <p className="text-3xl font-bold text-yellow-600">{career.wins}</p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold">Podiums</h3>
              <p className="text-3xl font-bold text-green-600">{career.podiums}</p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold">Championships</h3>
              <p className="text-3xl font-bold text-amber-600">{career.championships}</p>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Season Records</h2>
          <div className="bg-card rounded-lg p-6">
            <p className="text-center text-muted-foreground">
              Showing {allSeasons.length} seasons of F1 data
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
