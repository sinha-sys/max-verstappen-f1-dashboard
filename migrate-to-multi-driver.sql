-- Migration script to convert single-driver schema to multi-driver schema
-- This preserves all existing Max Verstappen data while enabling future drivers

-- Step 1: Insert Max Verstappen as the first driver
INSERT OR IGNORE INTO drivers (
    id, full_name, short_name, nationality, birth_date, debut_season, 
    team_current, status, bio_summary, slug
) VALUES (
    1, 
    'Max Verstappen', 
    'VER', 
    'Dutch', 
    '1997-09-30', 
    2015, 
    'Red Bull Racing',
    'active',
    'Four-time Formula 1 World Champion and Red Bull Racing driver, widely recognized as one of the most dominant competitors in modern motorsport.',
    'max-verstappen'
);

-- Step 2: Migrate career stats from old table to new structure
INSERT OR REPLACE INTO driver_career_stats (
    driver_id, as_of_date, starts, wins, podiums, poles, fastest_laps,
    points, dnfs, championships, win_rate, podium_rate, pole_rate,
    dnf_rate, avg_points_per_start, is_current
)
SELECT 
    1 as driver_id,
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
    avg_points_per_start,
    TRUE as is_current
FROM career_stats
WHERE id = 1;

-- Step 3: Migrate season results to new structure
INSERT OR REPLACE INTO driver_season_results (
    driver_id, season, starts, wins, podiums, poles, fastest_laps, points, rank, team
)
SELECT 
    1 as driver_id,
    season,
    starts,
    wins,
    podiums,
    poles,
    fastest_laps,
    points,
    rank,
    CASE 
        WHEN season <= 2016 THEN 'Toro Rosso'
        ELSE 'Red Bull Racing'
    END as team
FROM season_results;

-- Step 4: Migrate records to new structure
INSERT OR REPLACE INTO driver_records (
    driver_id, category, value, note, record_type, active
)
SELECT 
    1 as driver_id,
    category,
    value,
    note,
    CASE 
        WHEN note LIKE '%F1 record%' THEN 'f1_record'
        WHEN note LIKE '%history%' THEN 'f1_record'
        ELSE 'personal'
    END as record_type,
    TRUE as active
FROM records;

-- Step 5: Update sequences to ensure future inserts work properly
-- This ensures auto-increment starts from the right number
UPDATE sqlite_sequence SET seq = 1 WHERE name = 'drivers';
UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM driver_career_stats) WHERE name = 'driver_career_stats';
UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM driver_season_results) WHERE name = 'driver_season_results';
UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM driver_records) WHERE name = 'driver_records';

-- Step 6: Verify migration by checking record counts
-- These should match the original tables
SELECT 'Career stats migrated:' as check_type, COUNT(*) as count FROM driver_career_stats WHERE driver_id = 1
UNION ALL
SELECT 'Season results migrated:', COUNT(*) FROM driver_season_results WHERE driver_id = 1
UNION ALL
SELECT 'Records migrated:', COUNT(*) FROM driver_records WHERE driver_id = 1;
