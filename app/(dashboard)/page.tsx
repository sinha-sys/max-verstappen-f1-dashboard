"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { getCareerClient, getSeasonsClient, getRecordsClient } from "@/lib/fetchers";
import { Header } from "./_components/Header";
import { KPIGroup } from "./_components/KPIGroup";
import { RateCards } from "./_components/RateCards";
import { WinRateTrend } from "./_components/Charts/WinRateTrend";
import { CumulativeWins } from "./_components/Charts/CumulativeWins";
import { PodiumsPolesArea } from "./_components/Charts/PodiumsPolesArea";
import { SeasonTable } from "./_components/SeasonTable";
import { Records } from "./_components/Records";
import { FilterControls } from "./_components/FilterControls";
import { DriverProfile } from "./_components/DriverProfile";
import { Separator } from "@/components/ui/separator";
import type { CareerTotals, RateSummary, SeasonStat, RecordItem, FilterState } from "@/lib/types";

export default function DashboardPage() {
  const [career, setCareer] = useState<(CareerTotals & { rates: RateSummary }) | null>(null);
  const [allSeasons, setAllSeasons] = useState<SeasonStat[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    yearRange: [2015, 2025],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
      <Header driverName={career.driver} lastUpdated={career.asOfDate} />
      
      <main className="container mx-auto px-3 py-4 iphone:px-4 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-4 iphone:gap-6 lg:gap-8 lg:grid-cols-4">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4 iphone:space-y-6 lg:space-y-8">
            {/* Mobile Driver Profile */}
            <section className="lg:hidden">
              <DriverProfile />
            </section>

            {/* KPI Section */}
            <section>
              <KPIGroup career={career} />
            </section>

            <Separator />

            {/* Rate Cards Section */}
            <section>
              <RateCards rates={career.rates} />
            </section>

            <Separator />

            {/* Filter Controls */}
            <section>
              <FilterControls
                filters={filters}
                onFiltersChange={setFilters}
                minYear={minYear}
                maxYear={maxYear}
              />
            </section>

            {/* Charts Section */}
            <section className="grid gap-6 lg:grid-cols-2">
              <WinRateTrend seasons={filteredSeasons} />
              <CumulativeWins seasons={filteredSeasons} />
              <div className="lg:col-span-2">
                <PodiumsPolesArea seasons={filteredSeasons} />
              </div>
            </section>

            <Separator />

            {/* Season Table */}
            <section>
              <SeasonTable seasons={filteredSeasons} />
            </section>

            <Separator />

            {/* Records Section */}
            <section>
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
