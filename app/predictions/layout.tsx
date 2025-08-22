import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "F1 Predictions | Vote on Formula 1 Outcomes",
  description: "Vote on Formula 1 predictions and see what the community thinks about driver transfers, race results, and season outcomes.",
  keywords: [
    "F1 predictions",
    "Formula 1 voting", 
    "F1 community",
    "driver predictions",
    "race predictions",
    "F1 polls",
    "Formula 1 2025",
    "Red Bull Racing",
    "Max Verstappen predictions"
  ]
};

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
