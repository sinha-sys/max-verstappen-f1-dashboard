import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import type { SeasonStat } from "@/lib/types";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "seasons.json");
    const fileContents = readFileSync(filePath, "utf8");
    const seasons: SeasonStat[] = JSON.parse(fileContents);
    
    return NextResponse.json(seasons);
  } catch (error) {
    console.error("Error reading seasons data:", error);
    return NextResponse.json(
      { error: "Failed to load seasons data" },
      { status: 500 }
    );
  }
}
