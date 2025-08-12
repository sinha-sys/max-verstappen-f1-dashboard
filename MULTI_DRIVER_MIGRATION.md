# Multi-Driver Database Migration Guide

This guide explains how to migrate your F1 dashboard from single-driver (Max Verstappen only) to a multi-driver architecture while maintaining full backward compatibility.

## Overview

The new schema supports multiple drivers while preserving all existing functionality for Max Verstappen's data. Your current web app will continue to work exactly the same way.

## Database Changes

### New Tables Structure:

1. **`drivers`** - Master list of all F1 drivers
2. **`driver_career_stats`** - Career statistics linked to drivers
3. **`driver_season_results`** - Season-by-season results linked to drivers  
4. **`driver_records`** - Records and achievements linked to drivers

### Backward Compatibility:

- Views created to maintain compatibility with old queries
- API functions updated with fallback logic
- Zero breaking changes to current functionality

## Migration Steps

### Step 1: Create New Schema

```bash
wrangler d1 execute maxdb --file=schema-multi-driver.sql --remote --yes
```

### Step 2: Migrate Existing Data

```bash
wrangler d1 execute maxdb --file=migrate-to-multi-driver.sql --remote --yes
```

### Step 3: Verify Migration

```bash
# Check Max Verstappen's data is preserved
wrangler d1 execute maxdb --command="SELECT * FROM max_verstappen_career;" --remote

# Check season count
wrangler d1 execute maxdb --command="SELECT COUNT(*) as seasons FROM max_verstappen_seasons;" --remote

# Check records count  
wrangler d1 execute maxdb --command="SELECT COUNT(*) as records FROM max_verstappen_records;" --remote
```

## New Capabilities

### Add New Drivers

```sql
-- Example: Adding Lewis Hamilton
INSERT INTO drivers (full_name, short_name, nationality, birth_date, debut_season, team_current, slug, bio_summary)
VALUES ('Lewis Hamilton', 'HAM', 'British', '1985-01-07', 2007, 'Mercedes', 'lewis-hamilton', 'Seven-time Formula 1 World Champion and Mercedes driver.');

-- Add his career stats
INSERT INTO driver_career_stats (driver_id, as_of_date, starts, wins, podiums, poles, fastest_laps, points, dnfs, championships, win_rate, podium_rate, pole_rate, dnf_rate, avg_points_per_start, is_current)
VALUES (2, '2024-12-31', 350, 103, 197, 104, 67, 4405.5, 25, 7, 0.294, 0.563, 0.297, 0.071, 12.59, TRUE);
```

### Query Multiple Drivers

```sql
-- Get all active drivers
SELECT * FROM drivers WHERE status = 'active';

-- Compare career stats
SELECT driver, wins, championships FROM current_career_stats ORDER BY wins DESC;

-- Season comparison
SELECT d.full_name, dsr.season, dsr.wins 
FROM driver_season_results dsr 
JOIN drivers d ON d.id = dsr.driver_id 
WHERE dsr.season = 2023 
ORDER BY dsr.wins DESC;
```

## API Usage

### Current API (Unchanged)

All existing API calls work exactly the same:

```javascript
// These still work perfectly for Max Verstappen
const career = await fetch('/api/stats').then(r => r.json());
const seasons = await fetch('/api/seasons').then(r => r.json());
const records = await fetch('/api/records').then(r => r.json());
```

### Future Multi-Driver API

When ready to support multiple drivers, you can extend the API:

```javascript
// Future capability (not implemented yet)
const hamiltonStats = await fetch('/api/stats?driver=lewis-hamilton').then(r => r.json());
const allDrivers = await fetch('/api/drivers').then(r => r.json());
```

## Database Functions

### Updated Functions (Backward Compatible)

```typescript
// Default behavior unchanged (returns Max Verstappen)
const maxStats = await getCareerStats(db);

// New capability
const hamiltonStats = await getCareerStats(db, 'lewis-hamilton');
const allDrivers = await getAllDrivers(db);
const driverInfo = await getDriverInfo(db, 'max-verstappen');
```

## Schema Benefits

### Scalability
- Support unlimited drivers
- Efficient queries with proper indexes
- Normalized data structure

### Flexibility
- Driver-specific records and achievements
- Team history tracking
- Season-by-season team changes

### Performance
- Optimized indexes for common queries
- Views for backward compatibility
- Efficient joins across tables

## Testing

### Verify Current Functionality

1. **Local Development**: No changes needed, still uses JSON files
2. **Production**: After migration, Max Verstappen data should work identically
3. **API Responses**: Should be identical to before migration

### Test Migration

```bash
# Before migration - record counts
wrangler d1 execute maxdb --command="SELECT COUNT(*) FROM career_stats;" --remote
wrangler d1 execute maxdb --command="SELECT COUNT(*) FROM season_results;" --remote  
wrangler d1 execute maxdb --command="SELECT COUNT(*) FROM records;" --remote

# After migration - verify same counts
wrangler d1 execute maxdb --command="SELECT COUNT(*) FROM driver_career_stats WHERE driver_id = 1;" --remote
wrangler d1 execute maxdb --command="SELECT COUNT(*) FROM driver_season_results WHERE driver_id = 1;" --remote
wrangler d1 execute maxdb --command="SELECT COUNT(*) FROM driver_records WHERE driver_id = 1;" --remote
```

## Rollback Plan

If needed, the old tables remain untouched during migration, so you can:

1. Keep using old table names in queries
2. Drop new tables if issues arise
3. Original data is preserved

## Next Steps

1. **Run Migration**: Execute the migration scripts
2. **Test Thoroughly**: Verify Max Verstappen data works perfectly
3. **Plan Multi-Driver UI**: Design how to handle driver selection in future
4. **Add New Drivers**: Use the new schema to add more F1 drivers
5. **Enhance API**: Add multi-driver endpoints when ready

The migration maintains 100% backward compatibility while opening the door for future multi-driver functionality!
