"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { Records } from "@/components/dashboard/Records";
import { getRecordsClient } from "@/lib/fetchers";
import type { RecordItem } from "@/lib/types";
import Script from "next/script";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchRecords = async () => {
      try {
        const recordsData = await getRecordsClient();
        setRecords(recordsData);
      } catch (error) {
        console.error("Failed to load records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            {!mounted ? t('loading.initializing') : t('loading.loadingProfile')}
          </p>
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
              {t('header.title')}
            </h1>
            <p className="text-lg text-muted-foreground" itemProp="description">
              {t('profile.title')}
            </p>
          </div>

          {/* Profile Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <User className="h-6 w-6 text-primary" />
                {t('profile.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 sm:space-y-8">
                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4">{t('profile.aboutTitle')}</h2>
                  <div className="space-y-4">
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {t('profile.aboutText1')}
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {t('profile.aboutText2')}
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">{t('profile.careerHighlights')}</h3>
                  <ul className="text-base text-muted-foreground space-y-2 list-disc list-inside">
                    <li>{t('profile.highlight1')}</li>
                    <li>{t('profile.highlight2')}</li>
                    <li>{t('profile.highlight3')}</li>
                    <li>{t('profile.highlight4')}</li>
                    <li>{t('profile.highlight5')}</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">{t('profile.drivingStyle')}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t('profile.drivingStyleText')}
                  </p>
                </section>

                <section>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">{t('profile.personalLife')}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t('profile.personalLifeText')}
                  </p>
                </section>

                <section className="border-t pt-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">{t('profile.quickFacts')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">{t('profile.born')}</span>
                        <span className="text-muted-foreground ml-2">{t('profile.bornValue')}</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('profile.nationality')}</span>
                        <span className="text-muted-foreground ml-2">{t('profile.nationalityValue')}</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('profile.team')}</span>
                        <span className="text-muted-foreground ml-2">{t('profile.teamValue')}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">{t('profile.debut')}</span>
                        <span className="text-muted-foreground ml-2">{t('profile.debutValue')}</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('profile.carNumber')}</span>
                        <span className="text-muted-foreground ml-2">{t('profile.carNumberValue')}</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('profile.championshipsCount')}</span>
                        <span className="text-muted-foreground ml-2">{t('profile.championshipsValue')}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>

          {/* Career Records & Achievements */}
          <div className="mt-8">
            <Records records={records} />
          </div>
        </main>
      </div>
    </>
  );
}
