"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, TrendingUp, Users } from "lucide-react";
import { getRacesClient, type Race } from "@/lib/fetchers";

interface PredictionStats {
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  winProbability: number;
}

interface PredictionResponse {
  stats: PredictionStats;
  userVote: boolean | null;
}

export function RacePredictor() {
  const [nextRace, setNextRace] = useState<Race | null>(null);
  const [stats, setStats] = useState<PredictionStats | null>(null);
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [userSession, setUserSession] = useState<string>("");
  const { t } = useTranslation();

  // Generate or get user session ID
  useEffect(() => {
    let sessionId = localStorage.getItem('race-predictor-session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('race-predictor-session', sessionId);
    }
    setUserSession(sessionId);
  }, []);

  // Find next race
  useEffect(() => {
    const loadPredictionStats = async (raceName: string, raceDate: string) => {
      try {
        const url = `/api/predictions?raceName=${encodeURIComponent(raceName)}&raceDate=${encodeURIComponent(raceDate)}&userSession=${encodeURIComponent(userSession)}`;
        console.log('Loading prediction stats from:', url);
        
        const response = await fetch(url);
        console.log('Stats response status:', response.status);
        
        if (response.ok) {
          const data: PredictionResponse = await response.json();
          console.log('Stats response data:', data);
          setStats(data.stats);
          setUserVote(data.userVote);
        } else {
          const errorData = await response.text();
          console.error('Failed to load stats:', response.status, errorData);
        }
      } catch (error) {
        console.error('Error loading prediction stats:', error);
      }
    };

    const fetchNextRace = async () => {
      try {
        console.log('Fetching races...');
        const races = await getRacesClient();
        console.log('Fetched races:', races.length, 'races');
        
        const now = new Date();
        console.log('Current time:', now.toISOString());
        
        const upcomingRaces = races.filter(race => {
          const raceDateTime = new Date(`${race.date}T${race.startTimeGMT}Z`);
          console.log(`Race ${race.name}: ${race.date}T${race.startTimeGMT}Z -> ${raceDateTime.toISOString()} (upcoming: ${raceDateTime > now})`);
          return raceDateTime > now;
        });
        
        console.log('Upcoming races:', upcomingRaces.length);
        
        if (upcomingRaces.length > 0) {
          const next = upcomingRaces[0];
          console.log('Next race:', next);
          setNextRace(next);
          
          // Load existing stats
          if (userSession) {
            console.log('Loading prediction stats for:', next.name);
            await loadPredictionStats(next.name, next.date);
          }
        } else {
          console.log('No upcoming races found');
        }
      } catch (error) {
        console.error('Error fetching next race:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userSession) {
      fetchNextRace();
    }
  }, [userSession]);

  const handleVote = async (prediction: boolean) => {
    if (!nextRace || voting || !userSession) {
      console.log('Vote blocked:', { nextRace: !!nextRace, voting, userSession: !!userSession });
      return;
    }
    
    console.log('Submitting vote:', { raceName: nextRace.name, raceDate: nextRace.date, prediction, userSession });
    setVoting(true);
    
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raceName: nextRace.name,
          raceDate: nextRace.date,
          prediction,
          userSession,
        }),
      });
      
      console.log('Vote response status:', response.status);
      
      if (response.ok) {
        const data: { success: boolean; stats: PredictionStats; userVote: boolean } = await response.json();
        console.log('Vote response data:', data);
        setStats(data.stats);
        setUserVote(data.userVote);
      } else {
        const errorData = await response.text();
        console.error('Failed to submit vote:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setVoting(false);
    }
  };

  if (loading || !nextRace) {
    console.log('RacePredictor loading state:', { loading, nextRace: !!nextRace, userSession: !!userSession });
    return (
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">
              {loading ? 'Loading race data...' : 'No upcoming races'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasVoted = userVote !== null;
  const winProbability = stats?.winProbability ?? 50;

  console.log('RacePredictor render state:', {
    nextRace: nextRace?.name,
    userSession: userSession?.substring(0, 20) + '...',
    userVote,
    hasVoted,
    voting,
    stats,
    winProbability
  });

  return (
    <Card className="bg-gradient-to-r from-green-500/5 to-blue-500/5 border-green-500/20">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="text-center">
            <h3 className="font-semibold text-sm sm:text-base flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              {t('predictor.title')}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {t('predictor.subtitle', { race: nextRace.name })}
            </p>
          </div>

          {/* Voting Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => {
                console.log('YES button clicked!');
                alert('YES button clicked! Check console for details.');
                handleVote(true);
              }}
              disabled={voting}
              size="sm"
              className={`flex items-center gap-2 ${
                userVote === true 
                  ? 'bg-green-600 hover:bg-green-700 text-white ring-2 ring-green-300' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('predictor.yes')}</span>
              {userVote === true && <span className="text-xs">✓</span>}
            </Button>
            <Button
              onClick={() => {
                console.log('NO button clicked!');
                alert('NO button clicked! Check console for details.');
                handleVote(false);
              }}
              disabled={voting}
              size="sm"
              variant="destructive"
              className={`flex items-center gap-2 ${
                userVote === false 
                  ? 'ring-2 ring-red-300' 
                  : ''
              }`}
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="hidden sm:inline">{t('predictor.no')}</span>
              {userVote === false && <span className="text-xs">✓</span>}
            </Button>
          </div>

          {/* Results */}
          {hasVoted && stats && (
            <div className="text-center space-y-2">
              {/* Win Probability */}
              <div className="bg-background/50 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{t('predictor.winProbability')}</span>
                </div>
                <div className="text-3xl font-bold text-primary">{winProbability}%</div>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2">
                  <Users className="h-3 w-3" />
                  <span>{t('predictor.totalVotes', { count: stats.totalVotes })}</span>
                </div>
                
                {/* Vote breakdown */}
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3 text-green-600" />
                    <span>{stats.yesVotes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsDown className="h-3 w-3 text-red-600" />
                    <span>{stats.noVotes}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
