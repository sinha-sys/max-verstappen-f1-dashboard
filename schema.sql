-- Max Verstappen F1 Database Schema

-- Career stats table (single row with all career totals)
CREATE TABLE IF NOT EXISTS career_stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    driver TEXT NOT NULL,
    as_of_date TEXT NOT NULL,
    starts INTEGER NOT NULL,
    wins INTEGER NOT NULL,
    podiums INTEGER NOT NULL,
    poles INTEGER NOT NULL,
    fastest_laps INTEGER NOT NULL,
    points REAL NOT NULL,
    dnfs INTEGER NOT NULL,
    championships INTEGER NOT NULL,
    win_rate REAL NOT NULL,
    podium_rate REAL NOT NULL,
    pole_rate REAL NOT NULL,
    dnf_rate REAL NOT NULL,
    avg_points_per_start REAL NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Season by season results
CREATE TABLE IF NOT EXISTS season_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    season INTEGER NOT NULL UNIQUE,
    starts INTEGER NOT NULL,
    wins INTEGER NOT NULL,
    podiums INTEGER NOT NULL,
    poles INTEGER NOT NULL,
    fastest_laps INTEGER NOT NULL,
    points REAL NOT NULL,
    rank INTEGER, -- Championship position (NULL if not in top positions)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- F1 records and achievements
CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    value TEXT NOT NULL,
    note TEXT, -- Optional additional information
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_season_results_season ON season_results(season);
CREATE INDEX IF NOT EXISTS idx_records_category ON records(category);
