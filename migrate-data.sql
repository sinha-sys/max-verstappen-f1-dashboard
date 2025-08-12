-- Migration script to populate D1 database with existing JSON data

-- Insert career stats (based on max.json)
INSERT OR REPLACE INTO career_stats (
    id, driver, as_of_date, starts, wins, podiums, poles, fastest_laps, 
    points, dnfs, championships, win_rate, podium_rate, pole_rate, 
    dnf_rate, avg_points_per_start
) VALUES (
    1, 'Max Verstappen', '2025-08-09', 223, 65, 117, 44, 34, 
    3210.5, 33, 4, 0.2915, 0.5247, 0.1973, 0.148, 14.40
);

-- Insert season results (based on seasons.json)
INSERT OR REPLACE INTO season_results (season, starts, wins, podiums, poles, fastest_laps, points, rank) VALUES
(2015, 19, 0, 2, 0, 0, 49, NULL),
(2016, 21, 1, 7, 0, 0, 204, NULL),
(2017, 20, 2, 4, 0, 2, 168, NULL),
(2018, 21, 2, 11, 0, 2, 249, NULL),
(2019, 21, 3, 9, 2, 3, 278, NULL),
(2020, 17, 2, 11, 1, 3, 214, NULL),
(2021, 22, 10, 18, 10, 6, 395.5, 1),
(2022, 22, 15, 17, 7, 5, 454, 1),
(2023, 22, 19, 21, 13, 9, 575, 1),
(2024, 25, 9, 14, 9, 4, 437, 1);

-- Insert records (based on records.json)
INSERT OR REPLACE INTO records (category, value, note) VALUES
('World Championships', '4 (2021–2024)', NULL),
('Single-season wins', '19 (2023)', 'F1 record'),
('Most points in a season', '575 (2023)', NULL),
('Consecutive wins', '10 (2023)', NULL),
('Youngest F1 driver', '17 years, 166 days', NULL),
('Youngest race winner', '18 years, 228 days', NULL),
('Youngest pole position', '19 years, 44 days', NULL),
('Sprint wins', '11', 'Most in F1 history'),
('Double header wins', '8 weekends (2023)', 'Most consecutive weekend sweeps');
