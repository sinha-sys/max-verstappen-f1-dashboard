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
      starts: 224,
      wins: 65,
      winPercentage: 29.02,
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

// Predictions database functions
export async function getAllPredictions(db: D1Database, userIdentifier?: string) {
  const stmt = db.prepare(`
    SELECT 
      id,
      title,
      description,
      category,
      status,
      resolution,
      created_at,
      updated_at,
      expires_at,
      yes_votes,
      no_votes,
      total_votes,
      yes_percentage
    FROM prediction_vote_summary
    WHERE status = 'active'
    ORDER BY created_at DESC
  `);
  
  const result = await stmt.all();
  const predictions = result.results || [];
  
  // If user identifier is provided, get their votes
  if (userIdentifier && predictions.length > 0) {
    const predictionIds = predictions.map((p: any) => p.id);
    const placeholders = predictionIds.map(() => '?').join(',');
    
    const voteStmt = db.prepare(`
      SELECT prediction_id, vote
      FROM prediction_votes
      WHERE user_identifier = ? AND prediction_id IN (${placeholders})
    `);
    
    const voteResult = await voteStmt.bind(userIdentifier, ...predictionIds).all();
    const userVotes = new Map(
      (voteResult.results || []).map((v: any) => [v.prediction_id, v.vote])
    );
    
    return predictions.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      status: p.status,
      resolution: p.resolution,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      expiresAt: p.expires_at,
      yesVotes: p.yes_votes,
      noVotes: p.no_votes,
      totalVotes: p.total_votes,
      yesPercentage: p.yes_percentage,
      userVote: userVotes.get(p.id) || null
    }));
  }
  
  return predictions.map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    status: p.status,
    resolution: p.resolution,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    expiresAt: p.expires_at,
    yesVotes: p.yes_votes,
    noVotes: p.no_votes,
    totalVotes: p.total_votes,
    yesPercentage: p.yes_percentage,
    userVote: null
  }));
}

export async function getPredictionById(db: D1Database, id: number, userIdentifier?: string) {
  const stmt = db.prepare(`
    SELECT 
      id,
      title,
      description,
      category,
      status,
      resolution,
      created_at,
      updated_at,
      expires_at,
      yes_votes,
      no_votes,
      total_votes,
      yes_percentage
    FROM prediction_vote_summary
    WHERE id = ?
  `);
  
  const result = await stmt.bind(id).first();
  
  if (!result) {
    throw new Error(`Prediction not found: ${id}`);
  }
  
  let userVote = null;
  if (userIdentifier) {
    const voteStmt = db.prepare(`
      SELECT vote
      FROM prediction_votes
      WHERE prediction_id = ? AND user_identifier = ?
    `);
    
    const voteResult = await voteStmt.bind(id, userIdentifier).first();
    userVote = voteResult?.vote || null;
  }
  
  return {
    id: result.id,
    title: result.title,
    description: result.description,
    category: result.category,
    status: result.status,
    resolution: result.resolution,
    createdAt: result.created_at,
    updatedAt: result.updated_at,
    expiresAt: result.expires_at,
    yesVotes: result.yes_votes,
    noVotes: result.no_votes,
    totalVotes: result.total_votes,
    yesPercentage: result.yes_percentage,
    userVote
  };
}

export async function submitVote(db: D1Database, predictionId: number, vote: 'yes' | 'no', userIdentifier: string) {
  // Check if prediction exists and is active
  const predictionStmt = db.prepare(`
    SELECT status FROM predictions WHERE id = ?
  `);
  
  const prediction = await predictionStmt.bind(predictionId).first();
  
  if (!prediction) {
    throw new Error('Prediction not found');
  }
  
  if (prediction.status !== 'active') {
    throw new Error('Prediction is not active');
  }
  
  // Check if user has already voted
  const existingVoteStmt = db.prepare(`
    SELECT vote FROM prediction_votes WHERE prediction_id = ? AND user_identifier = ?
  `);
  
  const existingVote = await existingVoteStmt.bind(predictionId, userIdentifier).first();
  
  if (existingVote) {
    // User has already voted - check if it's the same vote
    if (existingVote.vote === vote) {
      throw new Error('You have already voted for this prediction');
    }
    
    // Update existing vote
    const updateStmt = db.prepare(`
      UPDATE prediction_votes 
      SET vote = ?, created_at = CURRENT_TIMESTAMP 
      WHERE prediction_id = ? AND user_identifier = ?
    `);
    
    const result = await updateStmt.bind(vote, predictionId, userIdentifier).run();
    
    if (!result.success) {
      throw new Error('Failed to update vote');
    }
    
    return result;
  } else {
    // Insert new vote
    const insertStmt = db.prepare(`
      INSERT INTO prediction_votes (prediction_id, user_identifier, vote, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    const result = await insertStmt.bind(predictionId, userIdentifier, vote).run();
    
    if (!result.success) {
      throw new Error('Failed to submit vote');
    }
    
    return result;
  }
}

export async function getUserVote(db: D1Database, predictionId: number, userIdentifier: string) {
  const stmt = db.prepare(`
    SELECT vote
    FROM prediction_votes
    WHERE prediction_id = ? AND user_identifier = ?
  `);
  
  const result = await stmt.bind(predictionId, userIdentifier).first();
  return result?.vote || null;
}

// Development fallback functions for predictions
export async function getAllPredictionsFromJSON() {
  // Static predictions data for development fallback
  return [
    {
      id: 1,
      title: "Will Max Verstappen leave Red Bull before the end of 2025?",
      description: "Max has been with Red Bull Racing since 2016. Will he switch teams before the 2025 season concludes?",
      category: "Driver Transfer",
      status: "active" as const,
      resolution: null,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      expiresAt: null,
      yesVotes: 42,
      noVotes: 158,
      totalVotes: 200,
      yesPercentage: 21.0,
      userVote: null
    },
    {
      id: 2,
      title: "Will Lewis Hamilton win a race in 2025?",
      description: "After moving to Ferrari, will Hamilton manage to secure at least one victory in the 2025 season?",
      category: "Race Results",
      status: "active" as const,
      resolution: null,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      expiresAt: null,
      yesVotes: 167,
      noVotes: 33,
      totalVotes: 200,
      yesPercentage: 83.5,
      userVote: null
    },
    {
      id: 3,
      title: "Will there be more than 5 different race winners in 2025?",
      description: "Formula 1 has seen increased competition. Will we see diversity in race winners this season?",
      category: "Season Outcomes",
      status: "active" as const,
      resolution: null,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      expiresAt: null,
      yesVotes: 124,
      noVotes: 76,
      totalVotes: 200,
      yesPercentage: 62.0,
      userVote: null
    },
    {
      id: 4,
      title: "Will any driver score their first F1 win in 2025?",
      description: "Will we see a breakthrough victory for a driver who has never won before?",
      category: "Race Results",
      status: "active" as const,
      resolution: null,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      expiresAt: null,
      yesVotes: 89,
      noVotes: 111,
      totalVotes: 200,
      yesPercentage: 44.5,
      userVote: null
    },
    {
      id: 5,
      title: "Will Red Bull win the Constructors Championship in 2025?",
      description: "Red Bull has dominated recent seasons. Will they continue their streak in 2025?",
      category: "Season Outcomes",
      status: "active" as const,
      resolution: null,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      expiresAt: null,
      yesVotes: 134,
      noVotes: 66,
      totalVotes: 200,
      yesPercentage: 67.0,
      userVote: null
    }
  ];
}
