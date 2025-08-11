"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import Script from "next/script";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="profile-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Max Verstappen",
            "description": "Formula 1 World Champion and Red Bull Racing driver",
            "nationality": "Dutch",
            "birthDate": "1997-09-30",
            "birthPlace": "Hasselt, Belgium",
            "profession": "Formula 1 Racing Driver",
            "team": "Red Bull Racing",
            "awards": [
              "Formula 1 World Champion 2021",
              "Formula 1 World Champion 2022", 
              "Formula 1 World Champion 2023",
              "Formula 1 World Champion 2024"
            ]
          })
        }}
      />

      <div className="min-h-screen bg-background mobile-safe-area">
        <main className="container mx-auto px-3 py-6 sm:px-6 lg:px-8 lg:py-12 max-w-4xl" itemScope itemType="https://schema.org/Person">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" itemProp="name">
              Max Verstappen
            </h1>
            <p className="text-lg text-muted-foreground" itemProp="description">
              Formula 1 World Champion & Driver Profile
            </p>
          </div>

          {/* Profile Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <User className="h-6 w-6 text-primary" />
                Driver Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 sm:space-y-8">
                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4">About Max Verstappen</h2>
                  <div className="space-y-4">
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Max Emilian Verstappen is a Dutch Formula 1 driver for <strong>Red Bull Racing</strong>, 
                      widely recognized as one of the most dominant competitors in modern motorsport. Born on 
                      September 30, 1997, in Hasselt, Belgium, Verstappen made history in 2015 as the{" "}
                      <strong>youngest driver ever to start an F1 Grand Prix</strong> at just 17 years old.
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Since his mid-season promotion to Red Bull Racing in 2016 — where he won his debut race 
                      at the Spanish Grand Prix — Verstappen has rewritten Formula 1&apos;s record books. His 
                      aggressive yet controlled driving style, exceptional racecraft, and consistency have earned 
                      him <strong>four consecutive World Championships (2021–2024)</strong> and a place among 
                      the sport&apos;s greats.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Career Highlights</h3>
                  <ul className="text-base text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Formula 1 debut in 2015 with Toro Rosso at age 17.</li>
                    <li>Youngest race winner in F1 history – 2016 Spanish Grand Prix.</li>
                    <li>Four-time World Champion (2021, 2022, 2023, 2024).</li>
                    <li>Holds single-season records for most wins (19 in 2023) and most points (575 in 2023).</li>
                    <li>Leader in sprint race victories and multiple consecutive win streaks.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Driving Style & Strengths</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Verstappen is known for his fearless overtaking, precision under pressure, and adaptability 
                    to varying track conditions. His ability to manage tyres while maintaining pace, combined 
                    with top-tier qualifying speed, makes him one of the most complete drivers in the history 
                    of Formula 1.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Personal Life & Interests</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Away from the circuit, Verstappen is an avid sim racer, often competing in online endurance 
                    events. He has a large global fanbase, significant social media presence, and plays a major 
                    role in Red Bull&apos;s brand identity in motorsport. Known for his straightforward personality 
                    and competitive spirit, he continues to push the boundaries of what&apos;s possible in Formula 1.
                  </p>
                </section>

                <section className="border-t pt-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Quick Facts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Born:</span>
                        <span className="text-muted-foreground ml-2">September 30, 1997</span>
                      </div>
                      <div>
                        <span className="font-medium">Nationality:</span>
                        <span className="text-muted-foreground ml-2">Dutch</span>
                      </div>
                      <div>
                        <span className="font-medium">Team:</span>
                        <span className="text-muted-foreground ml-2">Red Bull Racing</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">F1 Debut:</span>
                        <span className="text-muted-foreground ml-2">2015 Australian Grand Prix</span>
                      </div>
                      <div>
                        <span className="font-medium">Car Number:</span>
                        <span className="text-muted-foreground ml-2">1 (World Champion)</span>
                      </div>
                      <div>
                        <span className="font-medium">Championships:</span>
                        <span className="text-muted-foreground ml-2">4 (2021, 2022, 2023, 2024)</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
