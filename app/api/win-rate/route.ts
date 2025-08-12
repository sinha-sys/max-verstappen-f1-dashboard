import { NextResponse } from "next/server";
import { getWinRateData, getWinRateDataFromJSON, type Env } from "@/lib/database";

export async function GET(request: Request, { env }: { env?: Env }) {
  try {
    let winRateData;
    
    // Try to use D1 database if available (Cloudflare environment)
    if (env?.DB) {
      winRateData = await getWinRateData(env.DB);
    } else {
      // Fallback to JSON file for development
      winRateData = await getWinRateDataFromJSON();
    }
    
    return NextResponse.json(winRateData);
  } catch (error) {
    console.error("Error reading win rate data:", error);
    
    // If D1 fails, try JSON fallback
    try {
      const winRateData = await getWinRateDataFromJSON();
      return NextResponse.json(winRateData);
    } catch (fallbackError) {
      console.error("Fallback to JSON also failed:", fallbackError);
      return NextResponse.json(
        { error: "Failed to load win rate data" },
        { status: 500 }
      );
    }
  }
}
