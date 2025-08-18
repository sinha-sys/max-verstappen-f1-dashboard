"use client";

import { useEffect, useState } from "react";
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
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nextRace || !timeRemaining) {
    return (
      <Card className="bg-gradient-to-r from-muted/50 to-muted/30">
        <CardContent className="p-6 text-center">
          <Flag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-muted-foreground">Season Complete</h3>
          <p className="text-sm text-muted-foreground">No more races scheduled for 2025</p>
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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className={`h-5 w-5 ${isRaceSoon ? 'text-red-500' : 'text-primary'}`} />
          Next Race
          {isRaceToday && (
            <Badge variant="destructive" className="ml-2 animate-pulse">
              TODAY
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Race Info */}
        <div>
          <h3 className="font-semibold text-lg">{nextRace.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{nextRace.location}</span>
            <span className="mx-1">•</span>
            <span>Round {nextRace.round}</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-background/50 rounded-lg p-2">
            <div className={`text-2xl font-bold ${isRaceSoon ? 'text-red-500' : 'text-primary'}`}>
              {timeRemaining.days}
            </div>
            <div className="text-xs text-muted-foreground">Days</div>
          </div>
          <div className="bg-background/50 rounded-lg p-2">
            <div className={`text-2xl font-bold ${isRaceSoon ? 'text-red-500' : 'text-primary'}`}>
              {timeRemaining.hours}
            </div>
            <div className="text-xs text-muted-foreground">Hours</div>
          </div>
          <div className="bg-background/50 rounded-lg p-2">
            <div className={`text-2xl font-bold ${isRaceSoon ? 'text-red-500' : 'text-primary'}`}>
              {timeRemaining.minutes}
            </div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <div className="bg-background/50 rounded-lg p-2">
            <div className={`text-2xl font-bold ${isRaceSoon ? 'text-red-500' : 'text-primary'}`}>
              {timeRemaining.seconds}
            </div>
            <div className="text-xs text-muted-foreground">Seconds</div>
          </div>
        </div>

        {/* Local Time */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">Your local time:</p>
          <p className="text-sm font-medium">{formatLocalTime(nextRace)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
