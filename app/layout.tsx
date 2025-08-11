import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://maxverstapen.pages.dev'),
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
    "Championship",
    "Formula 1 2024",
    "F1 season results",
    "Grand Prix wins",
    "Pole positions",
    "Fastest laps",
    "World Championship",
    "Racing statistics",
    "Motorsport data"
  ],
  authors: [{ name: "F1 Stats Team" }],
  creator: "F1 Stats Dashboard",
  publisher: "Max Verstappen Stats",
  category: "Sports",
  classification: "Formula 1 Statistics",
  openGraph: {
    title: "Max Verstappen – Career Stats, Biography & Records | Formula 1 World Champion",
    description: "Explore Max Verstappen's complete Formula 1 profile — from his record-breaking debut at 17 to four consecutive World Championships. View updated career statistics, season results, and F1 records.",
    type: "profile",
    siteName: "Max Verstappen Stats",
    locale: "en_US",
    images: [
      {
        url: "/images/max-verstappen.jpg",
        width: 400,
        height: 400,
        alt: "Max Verstappen Formula 1 World Champion",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Max Verstappen – Career Stats, Biography & Records | Formula 1 World Champion",
    description: "Explore Max Verstappen's complete Formula 1 profile — from his record-breaking debut at 17 to four consecutive World Championships.",
    images: ["/images/max-verstappen.jpg"],
    creator: "@F1Stats",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Replace with actual verification code when available
  },
  alternates: {
    canonical: "https://maxverstapen.pages.dev",
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/images/max-verstappen.jpg" />
        <link rel="apple-touch-icon" href="/images/max-verstappen.jpg" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Navigation />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
