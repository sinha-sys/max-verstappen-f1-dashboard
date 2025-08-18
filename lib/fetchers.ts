import type { CareerTotals, RateSummary, SeasonStat, RecordItem } from "@/lib/types";

// Import JSON data directly for static export
import maxData from "@/data/max.json";
import seasonsData from "@/data/seasons.json";
import recordsData from "@/data/records.json";
import racesData from "@/data/races2025.json";

export interface Race {
  round: number;
  name: string;
  location: string;
  date: string;
  startTimeGMT: string;
}

export async function getCareer(): Promise<{ career: CareerTotals & { rates: RateSummary } }> {
  // Return data directly for static export
  return Promise.resolve(maxData as { career: CareerTotals & { rates: RateSummary } });
}

export async function getSeasons(): Promise<SeasonStat[]> {
  // Return data directly for static export
  return Promise.resolve(seasonsData as SeasonStat[]);
}

export async function getRecords(): Promise<RecordItem[]> {
  // Return data directly for static export
  return Promise.resolve(recordsData as RecordItem[]);
}

// Client-side fetchers (same as server-side for static export)
export async function getCareerClient(): Promise<{ career: CareerTotals & { rates: RateSummary } }> {
  return Promise.resolve(maxData as { career: CareerTotals & { rates: RateSummary } });
}

export async function getSeasonsClient(): Promise<SeasonStat[]> {
  return Promise.resolve(seasonsData as SeasonStat[]);
}

export async function getRecordsClient(): Promise<RecordItem[]> {
  return Promise.resolve(recordsData as RecordItem[]);
}

export async function getRaces(): Promise<Race[]> {
  // Return data directly for static export
  return Promise.resolve(racesData as Race[]);
}

export async function getRacesClient(): Promise<Race[]> {
  return Promise.resolve(racesData as Race[]);
}
