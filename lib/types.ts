export type CareerTotals = {
  driver: "Max Verstappen";
  asOfDate: string; // ISO date when stats were last updated
  starts: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  points: number;
  dnfs: number;
  championships: number;
};

export type RateSummary = {
  winRate: number; // 0..1
  podiumRate: number; // 0..1
  poleRate: number; // 0..1
  dnfRate: number; // 0..1
  avgPointsPerStart: number;
};

export type SeasonStat = {
  season: number;
  starts: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  points: number;
  rank?: number; // championship position if known
};

export type SprintStat = {
  season: number;
  sprints: number;
  sprintWins: number;
  sprintPodiums: number;
};

export type RecordItem = {
  category: string; // e.g., "Single-season wins"
  value: string; // e.g., "19 (2023)"
  note?: string; // short context
};

export type DashboardData = {
  career: CareerTotals & { rates: RateSummary };
  seasons: SeasonStat[];
  sprints?: SprintStat[];
  records: RecordItem[];
};

// Additional utility types for UI components
export type ChartDataPoint = {
  season: number;
  value: number;
  label?: string;
};

export type FilterState = {
  yearRange: [number, number];
};

export type KPIItem = {
  label: string;
  value: number | string;
  icon: string;
  description?: string;
};
