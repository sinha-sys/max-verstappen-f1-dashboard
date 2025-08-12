import { NextResponse } from "next/server";
import { getCareerStats, getCareerStatsFromJSON, type Env } from "@/lib/database";
import type { CareerTotals, RateSummary } from "@/lib/types";

export async function GET(request: Request, { env }: { env?: Env }) {
  try {
    let careerData: CareerTotals & { rates: RateSummary };
    
    // Try to use D1 database if available (Cloudflare environment)
    if (env?.DB) {
      careerData = await getCareerStats(env.DB);
    } else {
      // Fallback to JSON file for development
      careerData = await getCareerStatsFromJSON();
    }
    
    return NextResponse.json({ career: careerData });
  } catch (error) {
    console.error("Error reading career data:", error);
    
    // If D1 fails, try JSON fallback
    try {
      const careerData = await getCareerStatsFromJSON();
      return NextResponse.json({ career: careerData });
    } catch (fallbackError) {
      console.error("Fallback to JSON also failed:", fallbackError);
      return NextResponse.json(
        { error: "Failed to load career data" },
        { status: 500 }
      );
    }
  }
}
