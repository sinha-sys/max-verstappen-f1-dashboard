"use client";

import { useEffect, useState } from "react";
import { getCareerClient, getSeasonsClient, getRecordsClient } from "@/lib/fetchers";
import { Header } from "@/components/dashboard/Header";
import { KPIGroup } from "@/components/dashboard/KPIGroup";
import { RateCards } from "@/components/dashboard/RateCards";
import { WinRateTrend } from "@/components/dashboard/Charts/WinRateTrend";
import { CumulativeWins } from "@/components/dashboard/Charts/CumulativeWins";
import { SeasonTable } from "@/components/dashboard/SeasonTable";
import { Records } from "@/components/dashboard/Records";
import { FilterControls } from "@/components/dashboard/FilterControls";
import { DriverProfile } from "@/components/dashboard/DriverProfile";
import { Separator } from "@/components/ui/separator";
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
    <div className="min-h-screen bg-background mobile-safe-area">
      <Header driverName={career?.driver || "Max Verstappen"} lastUpdated={career?.asOfDate || "Loading..."} />
      
      <main className="container mx-auto px-3 py-3 sm:px-6 lg:px-8 lg:py-8 max-w-full overflow-x-hidden">
        <div className="grid gap-3 sm:gap-6 lg:gap-8 lg:grid-cols-4 w-full">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-6 lg:space-y-8 min-w-0 w-full">
            {/* Mobile Driver Profile - Collapsible */}
            <section className="lg:hidden w-full">
              <DriverProfile />
            </section>

            {/* KPI Section - Primary stats */}
            {career && (
              <section className="w-full">
                <KPIGroup career={career} />
              </section>
            )}

            <Separator className="hidden sm:block" />

            {/* Rate Cards Section - Performance percentages */}
            {career && (
              <section className="w-full">
                <RateCards rates={career.rates} />
              </section>
            )}

            <Separator className="hidden sm:block" />

            {/* Filter Controls - Keep close to data it affects */}
            <section className="w-full">
              <FilterControls
                filters={filters}
                onFiltersChange={setFilters}
                minYear={minYear}
                maxYear={maxYear}
              />
            </section>

            {/* Charts Section - Stack vertically on mobile for better readability */}
            <section className="w-full min-w-0">
              <div className="grid gap-3 sm:gap-6 md:grid-cols-2 w-full">
                <div className="min-w-0 w-full">
                  <WinRateTrend seasons={filteredSeasons} />
                </div>
                <div className="min-w-0 w-full">
                  <CumulativeWins seasons={filteredSeasons} />
                </div>
              </div>
            </section>

            <Separator className="hidden sm:block" />

            {/* Season Table - Horizontally scrollable */}
            <section className="w-full min-w-0">
              <SeasonTable seasons={filteredSeasons} />
            </section>

            <Separator className="hidden sm:block" />

            {/* Records Section - Last for easy access */}
            <section className="w-full min-w-0">
              <Records records={records} />
            </section>
          </div>

          {/* Sidebar - Driver Profile */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <DriverProfile />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
