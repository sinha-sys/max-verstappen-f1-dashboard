import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Max Verstappen Season Results | F1 Performance by Year",
  description: "Complete season-by-season F1 results for Max Verstappen. Interactive table with wins, podiums, poles, and championship standings 2015-2024.",
  openGraph: {
    title: "Max Verstappen Season Results | F1 Performance by Year",
    description: "Complete season-by-season F1 results for Max Verstappen. Interactive table with wins, podiums, poles, and championship standings 2015-2024.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Max Verstappen Season Results | F1 Performance by Year",
    description: "Complete season-by-season F1 results for Max Verstappen. Interactive table with wins, podiums, poles, and championship standings 2015-2024.",
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
