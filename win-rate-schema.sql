-- Win Rate table for F1 drivers career statistics
CREATE TABLE IF NOT EXISTS f1_drivers_win_rate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rank INTEGER NOT NULL,
    driver_name TEXT NOT NULL,
    starts INTEGER NOT NULL,
    wins INTEGER NOT NULL,
    win_percentage REAL NOT NULL,
    era TEXT, -- For grouping drivers by era (e.g., "1950s", "Modern", etc.)
    notes TEXT, -- Additional context or special notes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert the top 10 F1 drivers by win percentage
INSERT OR REPLACE INTO f1_drivers_win_rate (rank, driver_name, starts, wins, win_percentage, era, notes) VALUES
(1, 'Juan Manuel Fangio', 51, 24, 47.06, '1950s', 'Reigns supreme in win percentage—almost one win for every two races'),
(2, 'Alberto Ascari', 32, 13, 40.62, '1950s', 'Exceptionally efficient win rate from mid-20th century era'),
(3, 'Jim Clark', 72, 25, 34.72, '1960s', 'Shine with exceptionally efficient win rates from mid-20th century era'),
(4, 'Michael Schumacher', 306, 91, 29.74, 'Modern', 'Remains in the elite with nearly 30% win rate'),
(5, 'Max Verstappen', 218, 65, 29.82, 'Current', 'Among modern drivers, leads the pack with consistent performance'),
(6, 'Lewis Hamilton', 365, 105, 28.77, 'Modern', 'Among modern drivers, showcasing consistent performance across vastly more races'),
(7, 'Jackie Stewart', 99, 27, 27.27, '1970s', 'All-time great whose percentage reflects both skill and era-specific race calendars'),
(8, 'Alain Prost', 199, 51, 25.63, '1980s', 'All-time great whose percentage reflects both skill and era-specific race calendars'),
(9, 'Ayrton Senna', 161, 41, 25.47, '1980s-1990s', 'All-time great whose percentage reflects both skill and era-specific race calendars'),
(10, 'Stirling Moss', 66, 16, 24.24, '1950s-1960s', 'All-time great whose percentage reflects both skill and era-specific race calendars');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_win_rate_rank ON f1_drivers_win_rate(rank);
CREATE INDEX IF NOT EXISTS idx_win_rate_percentage ON f1_drivers_win_rate(win_percentage DESC);
