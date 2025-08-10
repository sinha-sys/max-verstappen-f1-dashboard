import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import type { RecordItem } from "@/lib/types";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "records.json");
    const fileContents = readFileSync(filePath, "utf8");
    const records: RecordItem[] = JSON.parse(fileContents);
    
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error reading records data:", error);
    return NextResponse.json(
      { error: "Failed to load records data" },
      { status: 500 }
    );
  }
}
