import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

interface Race {
  round: number;
  name: string;
  location: string;
  date: string;
  startTimeGMT: string;
}

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'races2025.json');
    const fileContents = await readFile(filePath, 'utf8');
    const races: Race[] = JSON.parse(fileContents);
    
    return NextResponse.json(races);
  } catch (error) {
    console.error("Error reading races data:", error);
    return NextResponse.json(
      { error: "Failed to load races data" },
      { status: 500 }
    );
  }
}
