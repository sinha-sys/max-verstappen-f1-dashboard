import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Max Verstappen – Career Stats, Biography & Records | Formula 1 World Champion",
  description: "Explore Max Verstappen's complete Formula 1 profile — from his record-breaking debut at 17 to four consecutive World Championships. View updated career statistics, season results, and F1 records.",
  keywords: [
    "Max Verstappen", 
    "Formula 1", 
    "F1", 
    "Red Bull Racing", 
    "F1 World Champion", 
    "F1 driver stats", 
    "Dutch racing driver", 
    "Max Verstappen records",
    "F1 statistics",
    "Racing",
    "Championship"
  ],
  authors: [{ name: "F1 Stats Team" }],
  openGraph: {
    title: "Max Verstappen – Career Stats, Biography & Records | Formula 1 World Champion",
    description: "Explore Max Verstappen's complete Formula 1 profile — from his record-breaking debut at 17 to four consecutive World Championships. View updated career statistics, season results, and F1 records.",
    type: "profile",
    siteName: "Max Verstappen Stats",
  },
  twitter: {
    card: "summary_large_image",
    title: "Max Verstappen – Career Stats, Biography & Records | Formula 1 World Champion",
    description: "Explore Max Verstappen's complete Formula 1 profile — from his record-breaking debut at 17 to four consecutive World Championships.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
