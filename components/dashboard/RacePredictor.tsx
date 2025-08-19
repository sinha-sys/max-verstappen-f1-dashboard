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
        const response = await fetch(
          `/api/predictions?raceName=${encodeURIComponent(raceName)}&raceDate=${encodeURIComponent(raceDate)}&userSession=${encodeURIComponent(userSession)}`
        );
        
        if (response.ok) {
          const data: PredictionResponse = await response.json();
          setStats(data.stats);
          setUserVote(data.userVote);
        }
      } catch (error) {
        console.error('Error loading prediction stats:', error);
      }
    };

    const fetchNextRace = async () => {
      try {
        const races = await getRacesClient();
        const now = new Date();
        
        const upcomingRaces = races.filter(race => {
          const raceDateTime = new Date(`${race.date}T${race.startTimeGMT}Z`);
          return raceDateTime > now;
        });
        
        if (upcomingRaces.length > 0) {
          const next = upcomingRaces[0];
          setNextRace(next);
          
          // Load existing stats
          if (userSession) {
            await loadPredictionStats(next.name, next.date);
          }
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
    if (!nextRace || voting || userVote !== null) return;
    
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
      
      if (response.ok) {
        const data: { stats: PredictionStats; userVote: boolean } = await response.json();
        setStats(data.stats);
        setUserVote(data.userVote);
      } else if (response.status === 409) {
        // User already voted - reload stats
        const response = await fetch(
          `/api/predictions?raceName=${encodeURIComponent(nextRace.name)}&raceDate=${encodeURIComponent(nextRace.date)}&userSession=${encodeURIComponent(userSession)}`
        );
        if (response.ok) {
          const data: PredictionResponse = await response.json();
          setStats(data.stats);
          setUserVote(data.userVote);
        }
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setVoting(false);
    }
  };

  if (loading || !nextRace) {
    return (
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasVoted = userVote !== null;
  const winProbability = stats?.winProbability ?? 50;

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

          {/* Voting Buttons or Results */}
          {!hasVoted ? (
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => handleVote(true)}
                disabled={voting}
                size="sm"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="hidden sm:inline">{t('predictor.yes')}</span>
              </Button>
              <Button
                onClick={() => handleVote(false)}
                disabled={voting}
                size="sm"
                variant="destructive"
                className="flex items-center gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                <span className="hidden sm:inline">{t('predictor.no')}</span>
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-2">
              {/* User's vote */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">{t('predictor.yourVote')}</span>
                {userVote ? (
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                ) : (
                  <ThumbsDown className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm font-medium">
                  {userVote ? t('predictor.yes') : t('predictor.no')}
                </span>
              </div>
              
              {/* Win Probability */}
              <div className="bg-background/50 rounded-lg p-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <span className="text-sm font-medium">{t('predictor.winProbability')}</span>
                </div>
                <div className="text-2xl font-bold text-primary">{winProbability}%</div>
                {stats && (
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                    <Users className="h-3 w-3" />
                    <span>{t('predictor.totalVotes', { count: stats.totalVotes })}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
