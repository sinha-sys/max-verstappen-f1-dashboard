import { NextResponse } from "next/server";
import { getSeasonResults, getSeasonResultsFromJSON, type Env } from "@/lib/database";
import type { SeasonStat } from "@/lib/types";

export async function GET(request: Request, { env }: { env?: Env }) {
  try {
    let seasonsData: SeasonStat[];
    
    // Try to use D1 database if available (Cloudflare environment)
    if (env?.DB) {
      seasonsData = await getSeasonResults(env.DB);
    } else {
      // Fallback to JSON file for development
      seasonsData = await getSeasonResultsFromJSON();
    }
    
    return NextResponse.json(seasonsData);
  } catch (error) {
    console.error("Error reading seasons data:", error);
    
    // If D1 fails, try JSON fallback
    try {
      const seasonsData = await getSeasonResultsFromJSON();
      return NextResponse.json(seasonsData);
    } catch (fallbackError) {
      console.error("Fallback to JSON also failed:", fallbackError);
      return NextResponse.json(
        { error: "Failed to load seasons data" },
        { status: 500 }
      );
    }
  }
}
