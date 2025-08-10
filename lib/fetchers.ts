import type { CareerTotals, RateSummary, SeasonStat, RecordItem } from "@/lib/types";

export async function getCareer(): Promise<{ career: CareerTotals & { rates: RateSummary } }> {
  const res = await fetch("/api/stats", { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error("Failed to fetch career stats");
  }
  return res.json();
}

export async function getSeasons(): Promise<SeasonStat[]> {
  const res = await fetch("/api/seasons", { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error("Failed to fetch seasons data");
  }
  return res.json();
}

export async function getRecords(): Promise<RecordItem[]> {
  const res = await fetch("/api/records", { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error("Failed to fetch records data");
  }
  return res.json();
}

// Client-side fetchers for dynamic components
export async function getCareerClient(): Promise<{ career: CareerTotals & { rates: RateSummary } }> {
  const res = await fetch("/api/stats");
  if (!res.ok) {
    throw new Error("Failed to fetch career stats");
  }
  return res.json();
}

export async function getSeasonsClient(): Promise<SeasonStat[]> {
  const res = await fetch("/api/seasons");
  if (!res.ok) {
    throw new Error("Failed to fetch seasons data");
  }
  return res.json();
}

export async function getRecordsClient(): Promise<RecordItem[]> {
  const res = await fetch("/api/records");
  if (!res.ok) {
    throw new Error("Failed to fetch records data");
  }
  return res.json();
}
