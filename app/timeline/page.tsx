"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCareerClient, getSeasonsClient, getRecordsClient } from "@/lib/fetchers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Calendar, Target, Zap, Star, Award, Flag } from "lucide-react";
import type { CareerTotals, RateSummary, SeasonStat, RecordItem } from "@/lib/types";
import Script from "next/script";

interface TimelineEvent {
  id: string;
  year: number;
  date?: string;
  title: string;
  description: string;
  type: 'debut' | 'win' | 'championship' | 'record' | 'milestone';
  icon: React.ComponentType<{ className?: string }>;
  stats?: {
    wins?: number;
    podiums?: number;
    poles?: number;
    points?: number;
  };
  significance: 'major' | 'important' | 'notable';
}

export default function TimelinePage() {
  const [career, setCareer] = useState<(CareerTotals & { rates: RateSummary }) | null>(null);
  const [seasons, setSeasons] = useState<SeasonStat[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filterType, setFilterType] = useState<TimelineEvent['type'] | 'all'>('all');
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [careerData, seasonsData, recordsData] = await Promise.all([
          getCareerClient(),
          getSeasonsClient(),
          getRecordsClient(),
        ]);

        setCareer(careerData.career);
        setSeasons(seasonsData);
        setRecords(recordsData);

        // Generate timeline events from the data
        const events = generateTimelineEvents(seasonsData, recordsData, t);
        setTimelineEvents(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted, t]);

  const generateTimelineEvents = (seasonsData: SeasonStat[], recordsData: RecordItem[], t: any): TimelineEvent[] => {
    const events: TimelineEvent[] = [];

    // Add F1 debut
    events.push({
      id: 'debut-2015',
      year: 2015,
      date: t('timeline.events.debut.date'),
      title: t('timeline.events.debut.title'),
      description: t('timeline.events.debut.description'),
      type: 'debut',
      icon: Flag,
      significance: 'major'
    });

    // Add first win
    events.push({
      id: 'first-win-2016',
      year: 2016,
      date: t('timeline.events.firstWin.date'),
      title: t('timeline.events.firstWin.title'),
      description: t('timeline.events.firstWin.description'),
      type: 'win',
      icon: Trophy,
      significance: 'major'
    });

    // Add championship years
    const championshipYears = [2021, 2022, 2023, 2024];
    championshipYears.forEach((year, index) => {
      const seasonData = seasonsData.find(s => s.season === year);
      if (seasonData) {
        const ordinals = [t('timeline.ordinals.first'), t('timeline.ordinals.second'), t('timeline.ordinals.third'), t('timeline.ordinals.fourth')];
        events.push({
          id: `championship-${year}`,
          year,
          title: t('timeline.events.championship.title', { ordinal: ordinals[index] }),
          description: t('timeline.events.championship.description', { 
            year, 
            wins: seasonData.wins, 
            podiums: seasonData.podiums, 
            points: seasonData.points 
          }),
          type: 'championship',
          icon: Award,
          stats: {
            wins: seasonData.wins,
            podiums: seasonData.podiums,
            poles: seasonData.poles,
            points: seasonData.points
          },
          significance: 'major'
        });
      }
    });

    // Add record-breaking 2023 season
    const season2023 = seasonsData.find(s => s.season === 2023);
    if (season2023) {
      events.push({
        id: 'record-2023',
        year: 2023,
        title: t('timeline.events.recordSeason.title'),
        description: t('timeline.events.recordSeason.description'),
        type: 'record',
        icon: Star,
        stats: {
          wins: season2023.wins,
          points: season2023.points
        },
        significance: 'major'
      });
    }

    // Add significant milestones
    let cumulativeWins = 0;
    seasonsData.forEach(season => {
      cumulativeWins += season.wins;
      
      // Milestone wins
      if (cumulativeWins >= 10 && !events.find(e => e.id === 'milestone-10-wins')) {
        events.push({
          id: 'milestone-10-wins',
          year: season.season,
          title: t('timeline.events.milestone10.title'),
          description: t('timeline.events.milestone10.description'),
          type: 'milestone',
          icon: Target,
          significance: 'important'
        });
      }
      
      if (cumulativeWins >= 25 && !events.find(e => e.id === 'milestone-25-wins')) {
        events.push({
          id: 'milestone-25-wins',
          year: season.season,
          title: t('timeline.events.milestone25.title'),
          description: t('timeline.events.milestone25.description'),
          type: 'milestone',
          icon: Target,
          significance: 'important'
        });
      }
      
      if (cumulativeWins >= 50 && !events.find(e => e.id === 'milestone-50-wins')) {
        events.push({
          id: 'milestone-50-wins',
          year: season.season,
          title: t('timeline.events.milestone50.title'),
          description: t('timeline.events.milestone50.description'),
          type: 'milestone',
          icon: Target,
          significance: 'major'
        });
      }
    });

    // Add promotion to Red Bull
    events.push({
      id: 'red-bull-promotion-2016',
      year: 2016,
      date: t('timeline.events.promotion.date'),
      title: t('timeline.events.promotion.title'),
      description: t('timeline.events.promotion.description'),
      type: 'milestone',
      icon: Zap,
      significance: 'important'
    });

    // Sort events by year and add some variety
    return events.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      // If same year, prioritize by type importance
      const typeOrder = { debut: 0, milestone: 1, win: 2, record: 3, championship: 4 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'championship': return 'bg-yellow-500';
      case 'record': return 'bg-purple-500';
      case 'win': return 'bg-green-500';
      case 'debut': return 'bg-blue-500';
      case 'milestone': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventBadgeVariant = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'championship': return 'default';
      case 'record': return 'secondary';
      case 'win': return 'outline';
      case 'debut': return 'outline';
      case 'milestone': return 'secondary';
      default: return 'outline';
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            {!mounted ? t('loading.initializing') : t('loading.loadingTimeline')}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">{t('error.loadingData')}</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="timeline-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Max Verstappen Career Timeline",
            "description": "Interactive timeline of Max Verstappen's Formula 1 career highlights and achievements",
            "author": {
              "@type": "Person",
              "name": "Max Verstappen"
            },
            "about": {
              "@type": "Person",
              "name": "Max Verstappen",
              "jobTitle": "Formula 1 Racing Driver"
            }
          })
        }}
      />

      <div className="min-h-screen bg-background mobile-safe-area">
        <main className="container mx-auto px-3 py-6 sm:px-6 lg:px-8 lg:py-12 max-w-6xl">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              {t('timeline.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {t('timeline.subtitle')}
            </p>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {(['all', 'championship', 'record', 'win', 'debut', 'milestone'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {type === 'all' ? t('timeline.filters.all') : t(`timeline.filters.${type}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-border to-primary/20"></div>
            
            <div className="space-y-8">
              {timelineEvents
                .filter(event => filterType === 'all' || event.type === filterType)
                .map((event, index) => {
                const Icon = event.icon;
                const isSelected = selectedEvent?.id === event.id;
                
                return (
                  <div key={event.id} className="relative">
                    {/* Timeline dot */}
                    <div className={`absolute left-2 sm:left-6 w-4 h-4 rounded-full border-2 border-background ${getEventColor(event.type)} z-10 transition-all duration-200 ${
                      isSelected ? 'scale-125 shadow-lg' : 'hover:scale-110'
                    }`}></div>
                    
                    {/* Event card */}
                    <div className="ml-12 sm:ml-20">
                      <Card 
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                        } ${event.significance === 'major' ? 'border-primary/20' : ''}`}
                        onClick={() => setSelectedEvent(isSelected ? null : event)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <Icon className={`h-5 w-5 ${getEventColor(event.type).replace('bg-', 'text-')}`} />
                              <div>
                                <CardTitle className="text-lg sm:text-xl">{event.title}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={getEventBadgeVariant(event.type)} className="text-xs">
                                    {t(`timeline.filters.${event.type}`)}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground font-medium">
                                    {event.date || event.year}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {event.significance === 'major' && (
                              <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed">
                            {event.description}
                          </p>
                          
                          {event.stats && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                              {event.stats.wins !== undefined && (
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">{event.stats.wins}</div>
                                  <div className="text-xs text-muted-foreground">{t('kpi.wins')}</div>
                                </div>
                              )}
                              {event.stats.podiums !== undefined && (
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">{event.stats.podiums}</div>
                                  <div className="text-xs text-muted-foreground">{t('kpi.podiums')}</div>
                                </div>
                              )}
                              {event.stats.poles !== undefined && (
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">{event.stats.poles}</div>
                                  <div className="text-xs text-muted-foreground">{t('kpi.poles')}</div>
                                </div>
                              )}
                              {event.stats.points !== undefined && (
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">{event.stats.points}</div>
                                  <div className="text-xs text-muted-foreground">{t('kpi.points')}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          {career && (
            <Card className="mt-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  {t('timeline.careerSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{career.championships}</div>
                    <div className="text-sm text-muted-foreground">{t('kpi.championships')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{career.wins}</div>
                    <div className="text-sm text-muted-foreground">{t('timeline.raceWins')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{career.podiums}</div>
                    <div className="text-sm text-muted-foreground">{t('kpi.podiums')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{career.poles}</div>
                    <div className="text-sm text-muted-foreground">{t('timeline.polePositions')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{career.fastestLaps}</div>
                    <div className="text-sm text-muted-foreground">{t('kpi.fastestLaps')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{career.points}</div>
                    <div className="text-sm text-muted-foreground">{t('timeline.careerPoints')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </>
  );
}
