import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Max Verstappen Career Timeline | F1 Journey & Milestones",
  description: "Interactive timeline of Max Verstappen's Formula 1 career highlights, championships, records, and key moments from 2015 to present.",
  keywords: [
    "Max Verstappen timeline",
    "F1 career timeline", 
    "Formula 1 milestones",
    "Max Verstappen journey",
    "F1 career highlights",
    "Racing career timeline",
    "Formula 1 achievements",
    "Max Verstappen history"
  ],
  openGraph: {
    title: "Max Verstappen Career Timeline | F1 Journey & Milestones",
    description: "Interactive timeline of Max Verstappen's Formula 1 career highlights, championships, records, and key moments from 2015 to present.",
    type: "article",
  },
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
