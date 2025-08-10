/**
 * Format utilities for the F1 dashboard
 */

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDecimal(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPoints(value: number): string {
  // Show decimal only if it's not a whole number
  return value % 1 === 0 ? formatNumber(value) : formatDecimal(value, 1);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatOrdinal(num: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = num % 100;
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

export function calculateWinRate(wins: number, starts: number): number {
  return starts > 0 ? wins / starts : 0;
}

export function calculatePodiumRate(podiums: number, starts: number): number {
  return starts > 0 ? podiums / starts : 0;
}

export function calculatePoleRate(poles: number, starts: number): number {
  return starts > 0 ? poles / starts : 0;
}

export function calculateDnfRate(dnfs: number, starts: number): number {
  return starts > 0 ? dnfs / starts : 0;
}

export function calculateAvgPointsPerStart(points: number, starts: number): number {
  return starts > 0 ? points / starts : 0;
}

// Chart color palette for consistent theming
export const chartColors = {
  primary: "#1e40af", // Blue
  secondary: "#dc2626", // Red
  accent: "#059669", // Green
  warning: "#d97706", // Orange
  muted: "#6b7280", // Gray
  success: "#16a34a", // Light green
  info: "#0ea5e9", // Light blue
  purple: "#9333ea", // Purple
} as const;
