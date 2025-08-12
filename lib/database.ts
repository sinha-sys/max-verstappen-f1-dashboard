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

// Win Rate data queries
export async function getWinRateData(db: D1Database) {
  const stmt = db.prepare(`
    SELECT rank, driver_name, starts, wins, win_percentage, era, notes
    FROM f1_drivers_win_rate
    ORDER BY rank ASC
  `);
  
  const result = await stmt.all();
  
  return result.results?.map((row: any) => ({
    rank: row.rank,
    driverName: row.driver_name,
    starts: row.starts,
    wins: row.wins,
    winPercentage: row.win_percentage,
    era: row.era,
    notes: row.notes
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

export async function getWinRateDataFromJSON() {
  // Static win rate data for development fallback
  return [
    {
      rank: 1,
      driverName: "Juan Manuel Fangio",
      starts: 51,
      wins: 24,
      winPercentage: 47.06,
      era: "1950s",
      notes: "Reigns supreme in win percentage—almost one win for every two races"
    },
    {
      rank: 2,
      driverName: "Alberto Ascari",
      starts: 32,
      wins: 13,
      winPercentage: 40.62,
      era: "1950s",
      notes: "Exceptionally efficient win rate from mid-20th century era"
    },
    {
      rank: 3,
      driverName: "Jim Clark",
      starts: 72,
      wins: 25,
      winPercentage: 34.72,
      era: "1960s",
      notes: "Shine with exceptionally efficient win rates from mid-20th century era"
    },
    {
      rank: 4,
      driverName: "Michael Schumacher",
      starts: 306,
      wins: 91,
      winPercentage: 29.74,
      era: "Modern",
      notes: "Remains in the elite with nearly 30% win rate"
    },
    {
      rank: 5,
      driverName: "Max Verstappen",
      starts: 218,
      wins: 65,
      winPercentage: 29.82,
      era: "Current",
      notes: "Among modern drivers, leads the pack with consistent performance"
    },
    {
      rank: 6,
      driverName: "Lewis Hamilton",
      starts: 365,
      wins: 105,
      winPercentage: 28.77,
      era: "Modern",
      notes: "Among modern drivers, showcasing consistent performance across vastly more races"
    },
    {
      rank: 7,
      driverName: "Jackie Stewart",
      starts: 99,
      wins: 27,
      winPercentage: 27.27,
      era: "1970s",
      notes: "All-time great whose percentage reflects both skill and era-specific race calendars"
    },
    {
      rank: 8,
      driverName: "Alain Prost",
      starts: 199,
      wins: 51,
      winPercentage: 25.63,
      era: "1980s",
      notes: "All-time great whose percentage reflects both skill and era-specific race calendars"
    },
    {
      rank: 9,
      driverName: "Ayrton Senna",
      starts: 161,
      wins: 41,
      winPercentage: 25.47,
      era: "1980s-1990s",
      notes: "All-time great whose percentage reflects both skill and era-specific race calendars"
    },
    {
      rank: 10,
      driverName: "Stirling Moss",
      starts: 66,
      wins: 16,
      winPercentage: 24.24,
      era: "1950s-1960s",
      notes: "All-time great whose percentage reflects both skill and era-specific race calendars"
    }
  ];
}
