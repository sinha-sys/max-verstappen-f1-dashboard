"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Flag, MapPin } from "lucide-react";
import { getRacesClient, type Race } from "@/lib/fetchers";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function RaceCountdown() {
  const [races, setRaces] = useState<Race[]>([]);
  const [nextRace, setNextRace] = useState<Race | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchRaces = async () => {
      try {
        const racesData = await getRacesClient();
        setRaces(racesData);
      } catch (error) {
        console.error("Failed to load races:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, [mounted]);

  useEffect(() => {
    if (!mounted || loading || races.length === 0) return;

    const findNextRace = () => {
      const now = new Date();
      
      for (const race of races) {
        // Create race datetime in GMT
        const raceDateTime = new Date(`${race.date}T${race.startTimeGMT}:00.000Z`);
        
        if (raceDateTime > now) {
          return race;
        }
      }
      
      return null; // No more races this season
    };

    const calculateTimeRemaining = (race: Race): TimeRemaining => {
      const now = new Date();
      const raceDateTime = new Date(`${race.date}T${race.startTimeGMT}:00.000Z`);
      const diff = raceDateTime.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    const updateCountdown = () => {
      const race = findNextRace();
      setNextRace(race);
      
      if (race) {
        setTimeRemaining(calculateTimeRemaining(race));
      } else {
        setTimeRemaining(null);
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [mounted, loading, races]);

  const formatLocalTime = (race: Race) => {
    const raceDateTime = new Date(`${race.date}T${race.startTimeGMT}:00.000Z`);
    return raceDateTime.toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (!mounted || loading) {
    return (
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="animate-pulse">
                <div className="h-5 w-5 bg-muted rounded"></div>
              </div>
              <div className="animate-pulse text-center">
                <div className="h-4 bg-muted rounded w-32 mb-1"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="animate-pulse text-center">
                <div className="h-6 w-8 bg-muted rounded mb-1"></div>
                <div className="h-3 w-8 bg-muted rounded"></div>
              </div>
              <div className="animate-pulse text-center">
                <div className="h-6 w-8 bg-muted rounded mb-1"></div>
                <div className="h-3 w-8 bg-muted rounded"></div>
              </div>
              <div className="animate-pulse text-center">
                <div className="h-6 w-8 bg-muted rounded mb-1"></div>
                <div className="h-3 w-8 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nextRace || !timeRemaining) {
    return (
      <Card className="bg-gradient-to-r from-muted/50 to-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-3">
            <Flag className="h-5 w-5 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-semibold text-muted-foreground">{t('countdown.seasonComplete')}</h3>
              <p className="text-sm text-muted-foreground">{t('countdown.noMoreRaces')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isRaceSoon = timeRemaining.days === 0 && timeRemaining.hours < 6;
  const isRaceToday = timeRemaining.days === 0;

  return (
    <Card className={`transition-all duration-300 ${
      isRaceSoon 
        ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30 shadow-lg' 
        : 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-6 sm:gap-8">
          {/* Race Info - Left Side */}
          <div className="flex items-center gap-3">
            <Clock className={`h-5 w-5 flex-shrink-0 ${isRaceSoon ? 'text-red-500' : 'text-primary'}`} />
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="font-semibold text-sm sm:text-base">{nextRace.name}</h3>
                {isRaceToday && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    {t('countdown.today')}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span>{nextRace.location}</span>
                <span className="mx-1">•</span>
                <span className="whitespace-nowrap">Round {nextRace.round}</span>
              </div>
            </div>
          </div>

          {/* Countdown - Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-center">
              <div className={`text-lg sm:text-xl font-bold leading-none ${isRaceSoon ? 'text-red-500' : 'text-primary'}`}>
                {timeRemaining.days}
              </div>
              <div className="text-xs text-muted-foreground">{t('countdown.days')}</div>
            </div>
            <div className="text-muted-foreground">:</div>
            <div className="text-center">
              <div className={`text-lg sm:text-xl font-bold leading-none ${isRaceSoon ? 'text-red-500' : 'text-primary'}`}>
                {String(timeRemaining.hours).padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground">{t('countdown.hours')}</div>
            </div>
            <div className="text-muted-foreground">:</div>
            <div className="text-center">
              <div className={`text-lg sm:text-xl font-bold leading-none ${isRaceSoon ? 'text-red-500' : 'text-primary'}`}>
                {String(timeRemaining.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground">{t('countdown.minutes')}</div>
            </div>
            <div className="text-center hidden sm:block">
              <div className={`text-lg sm:text-xl font-bold leading-none ${isRaceSoon ? 'text-red-500' : 'text-primary'}`}>
                {String(timeRemaining.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground">{t('countdown.seconds')}</div>
            </div>
          </div>
        </div>

        {/* Local Time - Compact Bottom Row */}
        <div className="mt-2 pt-2 border-t text-center">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">{formatLocalTime(nextRace)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
