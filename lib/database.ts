// Database utility functions for Cloudflare D1

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first(colName?: string): Promise<any>;
  run(): Promise<D1Result>;
  all(): Promise<D1Result>;
}

export interface D1Result {
  results?: any[];
  success: boolean;
  error?: string;
  meta: {
    changed_db: boolean;
    changes: number;
    duration: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
  };
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

// Environment interface for D1 binding
export interface Env {
  DB: D1Database;
}

// Helper function to get database instance
export function getDatabase(): D1Database {
  // In development, we'll use a mock or return null
  // In production, this will be injected by Cloudflare Workers
  if (typeof globalThis !== 'undefined' && (globalThis as any).DB) {
    return (globalThis as any).DB;
  }
  
  // For development/local testing, you can implement a mock here
  throw new Error('Database not available. Make sure you are running in Cloudflare Workers environment.');
}

// Career stats queries
export async function getCareerStats(db: D1Database) {
  const stmt = db.prepare(`
    SELECT 
      driver, as_of_date, starts, wins, podiums, poles, fastest_laps,
      points, dnfs, championships, win_rate, podium_rate, pole_rate,
      dnf_rate, avg_points_per_start
    FROM career_stats 
    WHERE id = 1
  `);
  
  const result = await stmt.first();
  
  if (!result) {
    throw new Error('Career stats not found');
  }
  
  return {
    driver: result.driver,
    asOfDate: result.as_of_date,
    starts: result.starts,
    wins: result.wins,
    podiums: result.podiums,
    poles: result.poles,
    fastestLaps: result.fastest_laps,
    points: result.points,
    dnfs: result.dnfs,
    championships: result.championships,
    rates: {
      winRate: result.win_rate,
      podiumRate: result.podium_rate,
      poleRate: result.pole_rate,
      dnfRate: result.dnf_rate,
      avgPointsPerStart: result.avg_points_per_start
    }
  };
}

// Season results queries
export async function getSeasonResults(db: D1Database) {
  const stmt = db.prepare(`
    SELECT season, starts, wins, podiums, poles, fastest_laps, points, rank
    FROM season_results
    ORDER BY season ASC
  `);
  
  const result = await stmt.all();
  
  return result.results?.map((row: any) => ({
    season: row.season,
    starts: row.starts,
    wins: row.wins,
    podiums: row.podiums,
    poles: row.poles,
    fastestLaps: row.fastest_laps,
    points: row.points,
    rank: row.rank
  })) || [];
}

// Records queries
export async function getRecords(db: D1Database) {
  const stmt = db.prepare(`
    SELECT category, value, note
    FROM records
    ORDER BY id ASC
  `);
  
  const result = await stmt.all();
  
  return result.results?.map((row: any) => ({
    category: row.category,
    value: row.value,
    note: row.note
  })) || [];
}

// Development fallback functions (using existing JSON files)
export async function getCareerStatsFromJSON() {
  const fs = await import('fs');
  const path = await import('path');
  
  const filePath = path.join(process.cwd(), 'data', 'max.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  
  return data.career;
}

export async function getSeasonResultsFromJSON() {
  const fs = await import('fs');
  const path = await import('path');
  
  const filePath = path.join(process.cwd(), 'data', 'seasons.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  return JSON.parse(fileContents);
}

export async function getRecordsFromJSON() {
  const fs = await import('fs');
  const path = await import('path');
  
  const filePath = path.join(process.cwd(), 'data', 'records.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  return JSON.parse(fileContents);
}
