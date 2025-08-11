"use client";

import { useEffect, useState } from "react";
import { getSeasonsClient } from "@/lib/fetchers";
import { SeasonTable } from "@/components/dashboard/SeasonTable";
import { FilterControls } from "@/components/dashboard/FilterControls";
import { Separator } from "@/components/ui/separator";
import type { SeasonStat, FilterState } from "@/lib/types";
import Script from "next/script";

export default function ResultsPage() {
  const [allSeasons, setAllSeasons] = useState<SeasonStat[]>([]);
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
        const seasonsData = await getSeasonsClient();

        setAllSeasons(seasonsData);

        // Set initial filter range based on actual data
        const minYear = Math.min(...seasonsData.map(s => s.season));
        const maxYear = Math.max(...seasonsData.map(s => s.season));
        setFilters({ yearRange: [minYear, maxYear] });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load season data");
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
            {!mounted ? "Initializing..." : "Loading season results..."}
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
          <h1 className="text-2xl font-bold">Unable to Load Season Data</h1>
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

  // Filter seasons based on year range
  const filteredSeasons = allSeasons.filter(
    (season) =>
      season.season >= filters.yearRange[0] && season.season <= filters.yearRange[1]
  );

  // Calculate filter range limits
  const minYear = Math.min(...allSeasons.map(s => s.season));
  const maxYear = Math.max(...allSeasons.map(s => s.season));

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="results-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            "name": "Max Verstappen Formula 1 Season Results",
            "description": "Complete season-by-season Formula 1 results and statistics for Max Verstappen",
            "sport": "Formula 1",
            "competitor": {
              "@type": "Person",
              "name": "Max Verstappen"
            },
            "organizer": {
              "@type": "Organization",
              "name": "Formula 1"
            }
          })
        }}
      />

      <div className="min-h-screen bg-background mobile-safe-area">
        <main className="container mx-auto px-3 py-6 sm:px-6 lg:px-8 lg:py-12 max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Season Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete season-by-season Formula 1 results and performance data
            </p>
          </div>

          <div className="space-y-6 lg:space-y-8">
            {/* Filter Controls */}
            <section className="w-full flex justify-center">
              <div className="w-full max-w-md sm:max-w-lg">
                <FilterControls
                  filters={filters}
                  onFiltersChange={setFilters}
                  minYear={minYear}
                  maxYear={maxYear}
                />
              </div>
            </section>

            <Separator />

            {/* Season Results Table */}
            <section className="w-full min-w-0" aria-labelledby="season-results-heading">
              <h2 id="season-results-heading" className="sr-only">Season by Season Results Table</h2>
              <SeasonTable seasons={filteredSeasons} />
            </section>

            {/* Results Summary */}
            <section className="w-full">
              <div className="bg-muted/30 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Results Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {filteredSeasons.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Seasons Shown
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {filteredSeasons.reduce((sum, season) => sum + season.wins, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Wins
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredSeasons.reduce((sum, season) => sum + season.podiums, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Podiums
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {filteredSeasons.reduce((sum, season) => sum + season.points, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Points
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
