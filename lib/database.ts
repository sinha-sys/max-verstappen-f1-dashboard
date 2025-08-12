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

// Career stats queries - Multi-driver support with backward compatibility
export async function getCareerStats(db: D1Database, driverSlug: string = 'max-verstappen') {
  // Try new multi-driver structure first
  let stmt = db.prepare(`
    SELECT 
      driver, as_of_date, starts, wins, podiums, poles, fastest_laps,
      points, dnfs, championships, win_rate, podium_rate, pole_rate,
      dnf_rate, avg_points_per_start
    FROM current_career_stats
    WHERE slug = ?
  `);
  
  let result = await stmt.bind(driverSlug).first();
  
  // Fallback to old structure for backward compatibility
  if (!result && driverSlug === 'max-verstappen') {
    stmt = db.prepare(`
      SELECT 
        driver, as_of_date, starts, wins, podiums, poles, fastest_laps,
        points, dnfs, championships, win_rate, podium_rate, pole_rate,
        dnf_rate, avg_points_per_start
      FROM career_stats 
      WHERE id = 1
    `);
    result = await stmt.first();
  }
  
  if (!result) {
    throw new Error(`Career stats not found for driver: ${driverSlug}`);
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

// Season results queries - Multi-driver support with backward compatibility
export async function getSeasonResults(db: D1Database, driverSlug: string = 'max-verstappen') {
  // Try new multi-driver structure first
  let stmt = db.prepare(`
    SELECT season, starts, wins, podiums, poles, fastest_laps, points, rank
    FROM driver_season_results dsr
    JOIN drivers d ON d.id = dsr.driver_id
    WHERE d.slug = ?
    ORDER BY season ASC
  `);
  
  let result = await stmt.bind(driverSlug).all();
  
  // Fallback to old structure for backward compatibility
  if ((!result.results || result.results.length === 0) && driverSlug === 'max-verstappen') {
    stmt = db.prepare(`
      SELECT season, starts, wins, podiums, poles, fastest_laps, points, rank
      FROM season_results
      ORDER BY season ASC
    `);
    result = await stmt.all();
  }
  
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

// Records queries - Multi-driver support with backward compatibility
export async function getRecords(db: D1Database, driverSlug: string = 'max-verstappen') {
  // Try new multi-driver structure first
  let stmt = db.prepare(`
    SELECT category, value, note
    FROM driver_records dr
    JOIN drivers d ON d.id = dr.driver_id
    WHERE d.slug = ? AND dr.active = TRUE
    ORDER BY dr.id ASC
  `);
  
  let result = await stmt.bind(driverSlug).all();
  
  // Fallback to old structure for backward compatibility
  if ((!result.results || result.results.length === 0) && driverSlug === 'max-verstappen') {
    stmt = db.prepare(`
      SELECT category, value, note
      FROM records
      ORDER BY id ASC
    `);
    result = await stmt.all();
  }
  
  return result.results?.map((row: any) => ({
    category: row.category,
    value: row.value,
    note: row.note
  })) || [];
}

// New multi-driver utility functions

// Get list of all drivers
export async function getAllDrivers(db: D1Database) {
  const stmt = db.prepare(`
    SELECT id, full_name, short_name, nationality, team_current, status, bio_summary, slug
    FROM drivers
    WHERE status = 'active'
    ORDER BY full_name
  `);
  
  const result = await stmt.all();
  
  return result.results?.map((row: any) => ({
    id: row.id,
    fullName: row.full_name,
    shortName: row.short_name,
    nationality: row.nationality,
    currentTeam: row.team_current,
    status: row.status,
    bioSummary: row.bio_summary,
    slug: row.slug
  })) || [];
}

// Get driver info by slug
export async function getDriverInfo(db: D1Database, slug: string) {
  const stmt = db.prepare(`
    SELECT id, full_name, short_name, nationality, birth_date, debut_season, 
           team_current, status, bio_summary, slug
    FROM drivers
    WHERE slug = ?
  `);
  
  const result = await stmt.first(slug);
  
  if (!result) {
    throw new Error(`Driver not found: ${slug}`);
  }
  
  return {
    id: result.id,
    fullName: result.full_name,
    shortName: result.short_name,
    nationality: result.nationality,
    birthDate: result.birth_date,
    debutSeason: result.debut_season,
    currentTeam: result.team_current,
    status: result.status,
    bioSummary: result.bio_summary,
    slug: result.slug
  };
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
