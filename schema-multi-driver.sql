-- Multi-Driver F1 Database Schema
-- Backward compatible with existing Max Verstappen data

-- Drivers table (master list of all drivers)
CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL UNIQUE,
    short_name TEXT, -- For display (e.g., "VER", "HAM")
    nationality TEXT,
    birth_date TEXT, -- ISO date format
    debut_season INTEGER,
    team_current TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'retired', 'inactive'
    bio_summary TEXT, -- Short description for cards/lists
    slug TEXT UNIQUE, -- URL-friendly identifier (e.g., 'max-verstappen')
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Career stats table (now linked to drivers)
CREATE TABLE IF NOT EXISTS driver_career_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_id INTEGER NOT NULL,
    as_of_date TEXT NOT NULL,
    starts INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    podiums INTEGER NOT NULL DEFAULT 0,
    poles INTEGER NOT NULL DEFAULT 0,
    fastest_laps INTEGER NOT NULL DEFAULT 0,
    points REAL NOT NULL DEFAULT 0,
    dnfs INTEGER NOT NULL DEFAULT 0,
    championships INTEGER NOT NULL DEFAULT 0,
    win_rate REAL NOT NULL DEFAULT 0,
    podium_rate REAL NOT NULL DEFAULT 0,
    pole_rate REAL NOT NULL DEFAULT 0,
    dnf_rate REAL NOT NULL DEFAULT 0,
    avg_points_per_start REAL NOT NULL DEFAULT 0,
    is_current BOOLEAN DEFAULT TRUE, -- Flag for current stats
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- Season results table (now linked to drivers)
CREATE TABLE IF NOT EXISTS driver_season_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_id INTEGER NOT NULL,
    season INTEGER NOT NULL,
    starts INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    podiums INTEGER NOT NULL DEFAULT 0,
    poles INTEGER NOT NULL DEFAULT 0,
    fastest_laps INTEGER NOT NULL DEFAULT 0,
    points REAL NOT NULL DEFAULT 0,
    rank INTEGER, -- Championship position
    team TEXT, -- Team for that season
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    UNIQUE(driver_id, season) -- One record per driver per season
);

-- Records table (now linked to drivers)
CREATE TABLE IF NOT EXISTS driver_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    value TEXT NOT NULL,
    note TEXT,
    record_type TEXT DEFAULT 'personal', -- 'personal', 'f1_record', 'team_record'
    season INTEGER, -- If record is specific to a season
    active BOOLEAN DEFAULT TRUE, -- Whether record is still current
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- Create optimized indexes
CREATE INDEX IF NOT EXISTS idx_drivers_slug ON drivers(slug);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_career_stats_driver_current ON driver_career_stats(driver_id, is_current);
CREATE INDEX IF NOT EXISTS idx_season_results_driver ON driver_season_results(driver_id);
CREATE INDEX IF NOT EXISTS idx_season_results_season ON driver_season_results(season);
CREATE INDEX IF NOT EXISTS idx_season_results_driver_season ON driver_season_results(driver_id, season);
CREATE INDEX IF NOT EXISTS idx_records_driver ON driver_records(driver_id);
CREATE INDEX IF NOT EXISTS idx_records_active ON driver_records(active);

-- Views for backward compatibility and easy querying

-- View to get current career stats for all drivers
CREATE VIEW IF NOT EXISTS current_career_stats AS
SELECT 
    d.id as driver_id,
    d.full_name as driver,
    d.slug,
    dcs.as_of_date,
    dcs.starts,
    dcs.wins,
    dcs.podiums,
    dcs.poles,
    dcs.fastest_laps,
    dcs.points,
    dcs.dnfs,
    dcs.championships,
    dcs.win_rate,
    dcs.podium_rate,
    dcs.pole_rate,
    dcs.dnf_rate,
    dcs.avg_points_per_start
FROM drivers d
JOIN driver_career_stats dcs ON d.id = dcs.driver_id
WHERE dcs.is_current = TRUE;

-- View to get Max Verstappen's data (for backward compatibility)
CREATE VIEW IF NOT EXISTS max_verstappen_career AS
SELECT 
    driver,
    as_of_date,
    starts,
    wins,
    podiums,
    poles,
    fastest_laps,
    points,
    dnfs,
    championships,
    win_rate,
    podium_rate,
    pole_rate,
    dnf_rate,
    avg_points_per_start
FROM current_career_stats
WHERE slug = 'max-verstappen';

-- View for Max Verstappen's season results (backward compatibility)
CREATE VIEW IF NOT EXISTS max_verstappen_seasons AS
SELECT 
    season,
    starts,
    wins,
    podiums,
    poles,
    fastest_laps,
    points,
    rank
FROM driver_season_results dsr
JOIN drivers d ON d.id = dsr.driver_id
WHERE d.slug = 'max-verstappen'
ORDER BY season;

-- View for Max Verstappen's records (backward compatibility)
CREATE VIEW IF NOT EXISTS max_verstappen_records AS
SELECT 
    category,
    value,
    note
FROM driver_records dr
JOIN drivers d ON d.id = dr.driver_id
WHERE d.slug = 'max-verstappen' AND dr.active = TRUE
ORDER BY dr.id;
