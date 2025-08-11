"use client";

import { useEffect, useState } from "react";
import { getCareerClient, getSeasonsClient, getRecordsClient } from "@/lib/fetchers";
import { Header } from "@/components/dashboard/Header";
import { KPIGroup } from "@/components/dashboard/KPIGroup";
import { RateCards } from "@/components/dashboard/RateCards";
import { WinRateTrend } from "@/components/dashboard/Charts/WinRateTrend";
import { CumulativeWins } from "@/components/dashboard/Charts/CumulativeWins";

import { Records } from "@/components/dashboard/Records";
import { FilterControls } from "@/components/dashboard/FilterControls";

import { Separator } from "@/components/ui/separator";
import type { CareerTotals, RateSummary, SeasonStat, RecordItem, FilterState } from "@/lib/types";
import Script from "next/script";

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

  // Generate structured data for SEO
  const structuredData = career ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Max Verstappen",
    "jobTitle": "Formula 1 Racing Driver",
    "description": "Four-time Formula 1 World Champion and Red Bull Racing driver",
    "image": "https://maxverstapen.pages.dev/images/max-verstappen.jpg",
    "url": "https://maxverstapen.pages.dev",
    "nationality": "Dutch",
    "birthDate": "1997-09-30",
    "birthPlace": {
      "@type": "Place",
      "name": "Hasselt, Belgium"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Red Bull Racing",
      "url": "https://www.redbull.com/int-en/redbullracing"
    },
    "sport": "Formula 1",
    "award": [
      "Formula 1 World Champion 2021",
      "Formula 1 World Champion 2022", 
      "Formula 1 World Champion 2023",
      "Formula 1 World Champion 2024"
    ],
    "achievement": [
      {
        "@type": "Achievement",
        "name": "Formula 1 Career Wins",
        "value": career.wins.toString()
      },
      {
        "@type": "Achievement", 
        "name": "Formula 1 Pole Positions",
        "value": career.poles.toString()
      },
      {
        "@type": "Achievement",
        "name": "Formula 1 Podium Finishes", 
        "value": career.podiums.toString()
      },
      {
        "@type": "Achievement",
        "name": "Formula 1 Championship Points",
        "value": career.points.toString()
      }
    ],
    "sameAs": [
      "https://en.wikipedia.org/wiki/Max_Verstappen",
      "https://www.formula1.com/en/drivers/max-verstappen.html"
    ]
  } : null;

  return (
    <>
      {/* Structured Data for SEO */}
      {structuredData && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      
      <div className="min-h-screen bg-background mobile-safe-area">
        <Header driverName={career?.driver || "Max Verstappen"} lastUpdated={career?.asOfDate || "Loading..."} />
      
      <main className="container mx-auto px-3 py-3 sm:px-6 lg:px-8 lg:py-8 max-w-full overflow-x-hidden" itemScope itemType="https://schema.org/Person">
        <div className="w-full">
          {/* Main Content Area */}
          <div className="space-y-3 sm:space-y-6 lg:space-y-8 min-w-0 w-full">


            {/* KPI Section - Primary stats */}
            {career && (
              <section className="w-full" aria-labelledby="kpi-heading">
                <h2 id="kpi-heading" className="sr-only">Career Statistics</h2>
                <KPIGroup career={career} />
              </section>
            )}

            <Separator className="hidden sm:block" />

            {/* Rate Cards Section - Performance percentages */}
            {career && (
              <section className="w-full" aria-labelledby="rates-heading">
                <h2 id="rates-heading" className="sr-only">Performance Rates</h2>
                <RateCards rates={career.rates} />
              </section>
            )}

            <Separator className="hidden sm:block" />

            {/* Filter Controls - Keep close to data it affects */}
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

            {/* Charts Section - Stack vertically on mobile for better readability */}
            <section className="w-full min-w-0" aria-labelledby="charts-heading">
              <h2 id="charts-heading" className="sr-only">Performance Charts</h2>
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

            {/* Records Section - Last for easy access */}
            <section className="w-full min-w-0">
              <Records records={records} />
            </section>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
