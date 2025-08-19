"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Generate or get user session ID
  useEffect(() => {
    try {
      let sessionId = localStorage.getItem('race-predictor-session');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('race-predictor-session', sessionId);
      }
      setUserSession(sessionId);
    } catch (error) {
      console.error('Race Predictor: Error initializing session:', error);
      setError('Failed to initialize user session');
    }
  }, []);

  // Load prediction stats
  const loadPredictionStats = useCallback(async (raceName: string, raceDate: string, sessionId?: string) => {
    try {
      const sessionParam = sessionId ? `&userSession=${encodeURIComponent(sessionId)}` : '';
      const url = `/api/predictions?raceName=${encodeURIComponent(raceName)}&raceDate=${encodeURIComponent(raceDate)}${sessionParam}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data: PredictionResponse = await response.json();
        setStats(data.stats);
        if (sessionId && data.userVote !== undefined) {
          setUserVote(data.userVote);
        }
        setError(null);
      } else {
        console.error('Race Predictor: Failed to load stats:', response.status, response.statusText);
        setError(`Failed to load prediction stats: ${response.status}`);
      }
    } catch (error) {
      console.error('Race Predictor: Error loading prediction stats:', error);
      setError('Network error loading prediction stats');
    }
  }, []);

  // Find next race
  useEffect(() => {
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
          
          // Load stats for the race
          await loadPredictionStats(next.name, next.date, userSession);
        } else {
          setError('No upcoming races found');
        }
      } catch (error) {
        console.error('Race Predictor: Error fetching next race:', error);
        setError('Failed to fetch race data');
      } finally {
        setLoading(false);
      }
    };

    fetchNextRace();
  }, [userSession, loadPredictionStats]);

  const handleVote = async (prediction: boolean) => {
    if (!nextRace) {
      setError('No race available for voting');
      return;
    }
    
    if (voting) {
      return;
    }
    
    if (!userSession) {
      setError('User session not initialized');
      return;
    }
    
    setVoting(true);
    setError(null);
    
    try {
      const payload = {
        raceName: nextRace.name,
        raceDate: nextRace.date,
        prediction,
        userSession,
      };
      
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const data: { success: boolean; stats: PredictionStats; userVote: boolean } = await response.json();
        setStats(data.stats);
        setUserVote(data.userVote);
        setError(null);
      } else {
        const errorData = await response.text();
        console.error('Race Predictor: Failed to submit vote:', response.status, errorData);
        setError(`Failed to submit vote: ${response.status}`);
      }
    } catch (error) {
      console.error('Race Predictor: Error submitting vote:', error);
      setError('Network error submitting vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading || !nextRace) {
    return (
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading race data...</span>
              </>
            ) : (
              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  {error || 'No upcoming races'}
                </span>
                {error && (
                  <div className="mt-2 text-xs text-red-500">
                    Check browser console for details
                  </div>
                )}
              </div>
            )}
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

          {/* Voting Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => handleVote(true)}
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
              onClick={() => handleVote(false)}
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

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <div className="text-sm text-red-600">{error}</div>
              <div className="text-xs text-red-500 mt-1">Check browser console for details</div>
            </div>
          )}

          {/* Community Statistics - Always Show */}
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
                <span>{t('predictor.totalVotes', { count: stats?.totalVotes || 0 })}</span>
              </div>
              
              {/* Vote breakdown */}
              <div className="flex justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3 text-green-600" />
                  <span>{stats?.yesVotes || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown className="h-3 w-3 text-red-600" />
                  <span>{stats?.noVotes || 0}</span>
                </div>
              </div>
              
              {/* User's vote indicator */}
              {hasVoted && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span>{t('predictor.yourVote')}</span>
                    {userVote ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{t('predictor.yes')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <ThumbsDown className="h-3 w-3" />
                        <span>{t('predictor.no')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
