import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import type { CareerTotals, RateSummary } from "@/lib/types";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "max.json");
    const fileContents = readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    
    // Validate the data structure
    const career: CareerTotals & { rates: RateSummary } = data.career;
    
    return NextResponse.json({ career });
  } catch (error) {
    console.error("Error reading stats data:", error);
    return NextResponse.json(
      { error: "Failed to load stats data" },
      { status: 500 }
    );
  }
}
