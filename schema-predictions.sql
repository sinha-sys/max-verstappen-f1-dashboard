-- Predictions Feature Schema
-- This extends the existing database with prediction voting functionality

-- Predictions table - stores the questions/predictions users can vote on
CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT, -- e.g., 'Driver Transfer', 'Race Results', 'Season Outcomes'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'closed', 'resolved'
    resolution TEXT, -- 'yes', 'no', or NULL if not resolved
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME, -- Optional expiration date
    created_by TEXT -- Could be used for admin tracking
);

-- Votes table - stores individual user votes with user details
CREATE TABLE IF NOT EXISTS prediction_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prediction_id INTEGER NOT NULL,
    user_identifier TEXT NOT NULL, -- Generated unique identifier for the user
    user_name TEXT NOT NULL, -- User's provided name
    user_email TEXT NOT NULL, -- User's provided email
    vote TEXT NOT NULL CHECK (vote IN ('yes', 'no')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prediction_id) REFERENCES predictions(id) ON DELETE CASCADE,
    UNIQUE(prediction_id, user_email) -- One vote per email per prediction
);

-- Vote summary view for easy access to vote counts
CREATE VIEW IF NOT EXISTS prediction_vote_summary AS
SELECT 
    p.id,
    p.title,
    p.description,
    p.category,
    p.status,
    p.resolution,
    p.created_at,
    p.updated_at,
    p.expires_at,
    COALESCE(yes_votes.count, 0) AS yes_votes,
    COALESCE(no_votes.count, 0) AS no_votes,
    COALESCE(yes_votes.count, 0) + COALESCE(no_votes.count, 0) AS total_votes,
    CASE 
        WHEN COALESCE(yes_votes.count, 0) + COALESCE(no_votes.count, 0) = 0 THEN 50.0
        ELSE ROUND((COALESCE(yes_votes.count, 0) * 100.0) / (COALESCE(yes_votes.count, 0) + COALESCE(no_votes.count, 0)), 1)
    END AS yes_percentage
FROM predictions p
LEFT JOIN (
    SELECT prediction_id, COUNT(*) as count
    FROM prediction_votes 
    WHERE vote = 'yes' 
    GROUP BY prediction_id
) yes_votes ON p.id = yes_votes.prediction_id
LEFT JOIN (
    SELECT prediction_id, COUNT(*) as count
    FROM prediction_votes 
    WHERE vote = 'no' 
    GROUP BY prediction_id
) no_votes ON p.id = no_votes.prediction_id;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_predictions_status ON predictions(status);
CREATE INDEX IF NOT EXISTS idx_predictions_category ON predictions(category);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at);
CREATE INDEX IF NOT EXISTS idx_prediction_votes_prediction_id ON prediction_votes(prediction_id);
CREATE INDEX IF NOT EXISTS idx_prediction_votes_user_identifier ON prediction_votes(user_identifier);

-- Insert some sample predictions
INSERT OR IGNORE INTO predictions (id, title, description, category, status) VALUES 
(1, 'Will Max Verstappen leave Red Bull before the end of 2025?', 'Max has been with Red Bull Racing since 2016. Will he switch teams before the 2025 season concludes?', 'Driver Transfer', 'active'),
(2, 'Will Lewis Hamilton win a race in 2025?', 'After moving to Ferrari, will Hamilton manage to secure at least one victory in the 2025 season?', 'Race Results', 'active'),
(3, 'Will there be more than 5 different race winners in 2025?', 'Formula 1 has seen increased competition. Will we see diversity in race winners this season?', 'Season Outcomes', 'active'),
(4, 'Will any driver score their first F1 win in 2025?', 'Will we see a breakthrough victory for a driver who has never won before?', 'Race Results', 'active'),
(5, 'Will Red Bull win the Constructors Championship in 2025?', 'Red Bull has dominated recent seasons. Will they continue their streak in 2025?', 'Season Outcomes', 'active');
