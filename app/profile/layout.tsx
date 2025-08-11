import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Max Verstappen Profile | F1 Biography & Career Highlights",
  description: "Discover Max Verstappen's F1 journey from youngest debut at 17 to 4-time World Champion. Biography, career highlights, and personal insights.",
  openGraph: {
    title: "Max Verstappen Profile | F1 Biography & Career Highlights",
    description: "Discover Max Verstappen's F1 journey from youngest debut at 17 to 4-time World Champion. Biography, career highlights, and personal insights.",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Max Verstappen Profile | F1 Biography & Career Highlights",
    description: "Discover Max Verstappen's F1 journey from youngest debut at 17 to 4-time World Champion. Biography, career highlights, and personal insights.",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
