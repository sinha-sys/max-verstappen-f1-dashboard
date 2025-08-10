import type { CareerTotals, RateSummary, SeasonStat, RecordItem } from "@/lib/types";

// Import JSON data directly for static export
import maxData from "@/data/max.json";
import seasonsData from "@/data/seasons.json";
import recordsData from "@/data/records.json";

export async function getCareer(): Promise<{ career: CareerTotals & { rates: RateSummary } }> {
  return maxData as { career: CareerTotals & { rates: RateSummary } };
}

export async function getSeasons(): Promise<SeasonStat[]> {
  return seasonsData as SeasonStat[];
}

export async function getRecords(): Promise<RecordItem[]> {
  return recordsData as RecordItem[];
}

// Client-side fetchers for dynamic components (same as server-side for static export)
export async function getCareerClient(): Promise<{ career: CareerTotals & { rates: RateSummary } }> {
  return maxData as { career: CareerTotals & { rates: RateSummary } };
}

export async function getSeasonsClient(): Promise<SeasonStat[]> {
  return seasonsData as SeasonStat[];
}

export async function getRecordsClient(): Promise<RecordItem[]> {
  return recordsData as RecordItem[];
}
