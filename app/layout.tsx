import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://maxverstapen.pages.dev'),
  title: {
    default: "Max Verstappen - Official Dutch F1 Driver | 4x World Champion | Red Bull Racing",
    template: "%s | Max Verstappen F1"
  },
  description: "Max Verstappen - Dutch Formula 1 World Champion (2021-2024) driving for Red Bull Racing. Explore career statistics, iconic quotes, team radio messages, and racing achievements from the youngest F1 race winner in history.",
  keywords: [
    // Primary Max Verstappen keywords
    "Max Verstappen",
    "Max Emilian Verstappen", 
    "Mad Max Verstappen",
    "Verstappen F1",
    "Max Verstappen 2024",
    "Max Verstappen 2025",
    
    // F1 Career & Achievements
    "Formula 1 World Champion",
    "F1 World Champion 2021 2022 2023 2024",
    "4x World Champion",
    "71 Grand Prix wins",
    "127 podium finishes",
    "48 pole positions",
    "youngest F1 race winner",
    "F1 records",
    "Formula 1 statistics",
    
    // Team & Nationality
    "Red Bull Racing",
    "Dutch F1 driver",
    "Netherlands Formula 1",
    "Dutch racing driver",
    "Holland F1",
    "RB20 driver",
    "Oracle Red Bull Racing",
    
    // Racing Content
    "Max Verstappen quotes",
    "F1 team radio messages",
    "Verstappen radio",
    "Simply lovely",
    "Haha simply lovely",
    "Max Verstappen sayings",
    "F1 driver quotes",
    "Formula 1 radio",
    
    // Season & Records
    "F1 2023 season",
    "F1 2024 season", 
    "F1 2025 season",
    "19 wins single season",
    "10 consecutive wins",
    "575 points season record",
    "86% win rate",
    "most dominant F1 season",
    
    // Racing Terms
    "Formula 1",
    "F1",
    "Grand Prix",
    "motorsport",
    "racing",
    "championship",
    "pole position",
    "fastest lap",
    "podium finish",
    "DRS",
    "team radio",
    
    // Popular Searches
    "Max Verstappen news",
    "Max Verstappen latest",
    "Max Verstappen today",
    "Verstappen wins",
    "F1 champion",
    "Red Bull F1",
    "Dutch Grand Prix"
  ],
  authors: [
    { name: "Max Verstappen Official", url: "https://maxverstapen.pages.dev" },
    { name: "Formula 1 Archive Team" }
  ],
  creator: "Max Verstappen F1 Archive",
  publisher: "Official Max Verstappen Hub",
  category: "Sports",
  classification: "Formula 1 Driver Profile",
  applicationName: "Max Verstappen F1 Hub",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Max Verstappen - Dutch F1 World Champion | Red Bull Racing Driver",
    description: "Official Max Verstappen hub featuring career statistics, iconic quotes, team radio messages from the 4x Formula 1 World Champion (2021-2024). 71 wins, 127 podiums, youngest race winner in F1 history.",
    type: "profile",
    siteName: "Max Verstappen Official Hub",
    locale: "en_US",
    alternateLocale: ["nl_NL", "de_DE", "fr_FR", "es_ES", "it_IT", "pt_BR", "ja_JP"],
    url: "https://maxverstapen.pages.dev",
    images: [
      {
        url: "/images/max-verstappen.jpg",
        width: 1200,
        height: 630,
        alt: "Max Verstappen - 4x Formula 1 World Champion - Red Bull Racing",
        type: "image/jpeg",
      },
      {
        url: "/images/max-verstappen.jpg", 
        width: 400,
        height: 400,
        alt: "Max Verstappen Profile Picture",
        type: "image/jpeg",
      }
    ],
    countryName: "Netherlands",
  },
  twitter: {
    card: "summary_large_image",
    site: "@redbullracing",
    creator: "@Max33Verstappen",
    title: "Max Verstappen - Dutch F1 World Champion | Red Bull Racing",
    description: "4x Formula 1 World Champion Max Verstappen. Career stats, quotes, radio messages from the Dutch Red Bull Racing driver. 71 wins, 127 podiums, F1 records.",
    images: {
      url: "/images/max-verstappen.jpg",
      alt: "Max Verstappen Formula 1 World Champion",
      width: 1200,
      height: 630,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    bingBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },
  verification: {
    google: "max-verstappen-f1-world-champion-verification",
    yandex: "max-verstappen-yandex-verification",
    yahoo: "max-verstappen-yahoo-verification",
    other: {
      "msvalidate.01": "max-verstappen-bing-verification",
      "facebook-domain-verification": "max-verstappen-facebook-verification"
    }
  },
  alternates: {
    canonical: "https://maxverstapen.pages.dev",
    languages: {
      "en-US": "https://maxverstapen.pages.dev",
      "nl-NL": "https://maxverstapen.pages.dev/nl",
      "de-DE": "https://maxverstapen.pages.dev/de",
    }
  },
  other: {
    "revisit-after": "1 days",
    "rating": "general",
    "distribution": "global",
    "coverage": "worldwide",
    "target": "all",
    "HandheldFriendly": "true",
    "MobileOptimized": "width",
    "apple-mobile-web-app-title": "Max Verstappen F1",
    "application-name": "Max Verstappen Hub",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#000000"
  }
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/max-verstappen.jpg" />
        <link rel="shortcut icon" href="/images/max-verstappen.jpg" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Max Verstappen F1" />
        <meta name="application-name" content="Max Verstappen Hub" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        <meta name="msapplication-starturl" content="/" />
        
        {/* Structured Data for AI Bots and Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://maxverstapen.pages.dev/#max-verstappen",
              "name": "Max Emilian Verstappen",
              "alternateName": ["Max Verstappen", "Mad Max", "MV33"],
              "description": "Dutch Formula 1 racing driver, 4-time World Champion (2021-2024), Red Bull Racing driver, youngest race winner in F1 history",
              "url": "https://maxverstapen.pages.dev",
              "image": {
                "@type": "ImageObject",
                "url": "https://maxverstapen.pages.dev/images/max-verstappen.jpg",
                "width": 400,
                "height": 400,
                "caption": "Max Verstappen Formula 1 World Champion"
              },
              "birthDate": "1997-09-30",
              "birthPlace": {
                "@type": "Place",
                "name": "Hasselt, Belgium",
                "addressCountry": "BE"
              },
              "nationality": {
                "@type": "Country",
                "name": "Netherlands",
                "alternateName": "Dutch"
              },
              "jobTitle": "Formula 1 Racing Driver",
              "worksFor": {
                "@type": "Organization",
                "name": "Oracle Red Bull Racing",
                "alternateName": "Red Bull Racing",
                "url": "https://www.redbullracing.com"
              },
              "sport": "Formula 1",
              "award": [
                "Formula 1 World Drivers' Championship 2021",
                "Formula 1 World Drivers' Championship 2022", 
                "Formula 1 World Drivers' Championship 2023",
                "Formula 1 World Drivers' Championship 2024",
                "Youngest Formula 1 Race Winner",
                "Most Wins in Single F1 Season (19 wins, 2023)",
                "Most Consecutive F1 Wins (10 wins, 2023)",
                "Most Points in Single F1 Season (575 points, 2023)"
              ],
              "knowsAbout": [
                "Formula 1 Racing",
                "Motorsport",
                "Red Bull Racing",
                "Grand Prix Racing",
                "Championship Racing",
                "Dutch Racing"
              ],
              "sameAs": [
                "https://www.formula1.com/en/drivers/max-verstappen.html",
                "https://twitter.com/Max33Verstappen",
                "https://www.instagram.com/maxverstappen1/",
                "https://en.wikipedia.org/wiki/Max_Verstappen"
              ],
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://maxverstapen.pages.dev"
              },
              "additionalProperty": [
                {
                  "@type": "PropertyValue",
                  "name": "Career Wins",
                  "value": "71"
                },
                {
                  "@type": "PropertyValue", 
                  "name": "Career Podiums",
                  "value": "127"
                },
                {
                  "@type": "PropertyValue",
                  "name": "Pole Positions", 
                  "value": "48"
                },
                {
                  "@type": "PropertyValue",
                  "name": "World Championships",
                  "value": "4"
                },
                {
                  "@type": "PropertyValue",
                  "name": "Racing Number",
                  "value": "33"
                }
              ]
            })
          }}
        />
        
        {/* Website Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://maxverstapen.pages.dev/#website",
              "url": "https://maxverstapen.pages.dev",
              "name": "Max Verstappen Official Hub",
              "description": "Official Max Verstappen Formula 1 driver hub featuring career statistics, quotes, radio messages, and achievements from the 4x World Champion",
              "publisher": {
                "@type": "Organization",
                "name": "Max Verstappen Official Hub"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://maxverstapen.pages.dev/?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "about": {
                "@type": "Person",
                "name": "Max Verstappen",
                "@id": "https://maxverstapen.pages.dev/#max-verstappen"
              },
              "mainEntity": {
                "@type": "Person",
                "name": "Max Verstappen",
                "@id": "https://maxverstapen.pages.dev/#max-verstappen"
              }
            })
          }}
        />

        {/* Sports Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              "name": "Formula 1",
              "alternateName": "F1",
              "sport": "Motor Racing",
              "description": "Formula One World Championship",
              "athlete": {
                "@type": "Person",
                "name": "Max Verstappen",
                "@id": "https://maxverstapen.pages.dev/#max-verstappen"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
