import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "F1 Win Rate Leaders | Top 10 Drivers by Career Win Percentage",
  description: "Discover the top 10 Formula 1 drivers by career win percentage. From Fangio's dominance to modern legends like Verstappen and Hamilton.",
  openGraph: {
    title: "F1 Win Rate Leaders | Top 10 Drivers by Career Win Percentage",
    description: "Discover the top 10 Formula 1 drivers by career win percentage. From Fangio's dominance to modern legends like Verstappen and Hamilton.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "F1 Win Rate Leaders | Top 10 Drivers by Career Win Percentage",
    description: "Discover the top 10 Formula 1 drivers by career win percentage. From Fangio's dominance to modern legends like Verstappen and Hamilton.",
  },
};

export default function WinRateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
