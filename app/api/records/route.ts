import { NextResponse } from "next/server";
import { getRecords, getRecordsFromJSON, type Env } from "@/lib/database";
import type { RecordItem } from "@/lib/types";

export async function GET(request: Request, { env }: { env?: Env }) {
  try {
    let recordsData: RecordItem[];
    
    // Try to use D1 database if available (Cloudflare environment)
    if (env?.DB) {
      recordsData = await getRecords(env.DB);
    } else {
      // Fallback to JSON file for development
      recordsData = await getRecordsFromJSON();
    }
    
    return NextResponse.json(recordsData);
  } catch (error) {
    console.error("Error reading records data:", error);
    
    // If D1 fails, try JSON fallback
    try {
      const recordsData = await getRecordsFromJSON();
      return NextResponse.json(recordsData);
    } catch (fallbackError) {
      console.error("Fallback to JSON also failed:", fallbackError);
      return NextResponse.json(
        { error: "Failed to load records data" },
        { status: 500 }
      );
    }
  }
}
