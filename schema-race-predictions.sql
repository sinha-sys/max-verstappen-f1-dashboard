-- Race Predictions Schema
-- Table to store user predictions for upcoming races

CREATE TABLE IF NOT EXISTS race_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    race_name TEXT NOT NULL,
    race_date TEXT NOT NULL,
    prediction BOOLEAN NOT NULL, -- TRUE for yes/win, FALSE for no/lose
    user_session TEXT NOT NULL, -- Session identifier to prevent duplicate votes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(race_name, race_date, user_session) -- Prevent duplicate votes per session per race
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_race_predictions_race ON race_predictions(race_name, race_date);
CREATE INDEX IF NOT EXISTS idx_race_predictions_session ON race_predictions(user_session);
