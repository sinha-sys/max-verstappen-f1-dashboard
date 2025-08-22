"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PredictionWithVotes } from "@/lib/types";
import { TrendingUp, Users, Calendar, Filter } from "lucide-react";
import predictionsData from "@/data/predictions.json";

// Generate a simple user identifier for anonymous voting
function getUserIdentifier(): string {
  if (typeof window === 'undefined') {
    // Return a temporary identifier during SSR
    return 'anon_ssr_' + Math.random().toString(36).substr(2, 9);
  }
  
  let identifier = localStorage.getItem('predictions_user_id');
  if (!identifier) {
    identifier = 'anon_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('predictions_user_id', identifier);
  }
  return identifier;
}

// Get votes from localStorage
function getVotesFromStorage(): Record<number, 'yes' | 'no'> {
  if (typeof window === 'undefined') return {};
  
  try {
    const votes = localStorage.getItem('prediction_votes');
    return votes ? JSON.parse(votes) : {};
  } catch {
    return {};
  }
}

// Save votes to localStorage
function saveVotesToStorage(votes: Record<number, 'yes' | 'no'>) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('prediction_votes', JSON.stringify(votes));
  } catch (error) {
    console.error('Failed to save votes to localStorage:', error);
  }
}

// Get vote counts from localStorage (community simulation)
function getVoteCountsFromStorage(): Record<number, { yes: number; no: number }> {
  if (typeof window === 'undefined') return {};
  
  try {
    const counts = localStorage.getItem('prediction_vote_counts');
    return counts ? JSON.parse(counts) : {};
  } catch {
    return {};
  }
}

// Save vote counts to localStorage
function saveVoteCountsToStorage(counts: Record<number, { yes: number; no: number }>) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('prediction_vote_counts', JSON.stringify(counts));
  } catch (error) {
    console.error('Failed to save vote counts to localStorage:', error);
  }
}



interface PredictionCardProps {
  prediction: PredictionWithVotes;
  onVote: (predictionId: number, vote: 'yes' | 'no') => void;
  isVoting: boolean;
}

function PredictionCard({ prediction, onVote, isVoting }: PredictionCardProps) {
  const { t } = useTranslation();
  
  const handleVote = (vote: 'yes' | 'no') => {
    onVote(prediction.id, vote);
  };

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-2">
              {prediction.title}
            </CardTitle>
            {prediction.description && (
              <p className="text-muted-foreground text-sm">
                {prediction.description}
              </p>
            )}
          </div>
          {prediction.category && (
            <Badge variant="secondary" className="shrink-0">
              {prediction.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Vote Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            variant={prediction.userVote === 'yes' ? 'default' : 'outline'}
            onClick={() => handleVote('yes')}
            disabled={isVoting}
            className="h-12 font-medium"
          >
            <div className="text-center">
              <div>Yes</div>
              <div className="text-xs opacity-80">
                {prediction.yesPercentage.toFixed(1)}%
              </div>
            </div>
          </Button>
          
          <Button
            variant={prediction.userVote === 'no' ? 'default' : 'outline'}
            onClick={() => handleVote('no')}
            disabled={isVoting}
            className="h-12 font-medium"
          >
            <div className="text-center">
              <div>No</div>
              <div className="text-xs opacity-80">
                {(100 - prediction.yesPercentage).toFixed(1)}%
              </div>
            </div>
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Yes: {prediction.yesVotes}</span>
            <span>No: {prediction.noVotes}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-2 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${prediction.yesPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{prediction.totalVotes} votes</span>
          </div>
          {prediction.userVote && (
            <div className="flex items-center gap-1">
              <span>You voted:</span>
              <Badge variant={prediction.userVote === 'yes' ? 'default' : 'secondary'} className="text-xs">
                {prediction.userVote.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PredictionsPage() {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState<PredictionWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingStates, setVotingStates] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadPredictions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPredictions = async () => {
    try {
      // Get base predictions data
      const basePredictions = predictionsData;
      
      // Get user votes and community vote counts from localStorage
      const userVotes = getVotesFromStorage();
      const voteCounts = getVoteCountsFromStorage();
      
      // Merge the data
      const predictionsWithVotes: PredictionWithVotes[] = basePredictions.map(prediction => {
        const counts = voteCounts[prediction.id] || { yes: prediction.yesVotes, no: prediction.noVotes };
        const total = counts.yes + counts.no;
        const yesPercentage = total > 0 ? (counts.yes / total) * 100 : 50;
        
        return {
          ...prediction,
          status: prediction.status as 'active' | 'closed' | 'resolved',
          expiresAt: prediction.expiresAt || undefined,
          yesVotes: counts.yes,
          noVotes: counts.no,
          totalVotes: total,
          yesPercentage,
          userVote: userVotes[prediction.id] || null
        };
      });
      
      setPredictions(predictionsWithVotes);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (predictionId: number, vote: 'yes' | 'no') => {
    setVotingStates(prev => new Set([...Array.from(prev), predictionId]));

    try {
      // Get current votes and counts
      const currentVotes = getVotesFromStorage();
      const currentCounts = getVoteCountsFromStorage();
      
      // Get current prediction data
      const prediction = predictions.find(p => p.id === predictionId);
      if (!prediction) return;
      
      // Check if user already voted with the same vote
      const previousVote = currentVotes[predictionId];
      if (previousVote && previousVote === vote) {
        alert('You have already voted for this prediction');
        return;
      }
      
      // Initialize counts if not exists
      if (!currentCounts[predictionId]) {
        currentCounts[predictionId] = { 
          yes: prediction.yesVotes, 
          no: prediction.noVotes 
        };
      }
      
      // If user had a previous vote, subtract it
      if (previousVote) {
        currentCounts[predictionId][previousVote]--;
      }
      
      // Add the new vote
      currentVotes[predictionId] = vote;
      currentCounts[predictionId][vote]++;
      
      // Save to localStorage
      saveVotesToStorage(currentVotes);
      saveVoteCountsToStorage(currentCounts);
      
      // Update UI
      await loadPredictions();
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setVotingStates(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(predictionId);
        return newSet;
      });
    }
  };

  const categories = Array.from(new Set(predictions.map(p => p.category).filter(Boolean))) as string[];
  const filteredPredictions = selectedCategory 
    ? predictions.filter(p => p.category === selectedCategory)
    : predictions;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">F1 Predictions</h1>
        </div>
        <p className="text-muted-foreground text-lg mb-6">
          Vote on Formula 1 predictions and see what the community thinks about upcoming events and outcomes.
        </p>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="h-8"
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="h-8"
              >
                {category}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Separator className="mb-8" />

      {/* Predictions Grid */}
      {filteredPredictions.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No predictions available</h3>
          <p className="text-muted-foreground">
            {selectedCategory 
              ? `No predictions found in the "${selectedCategory}" category.`
              : "Check back later for new predictions to vote on!"
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {filteredPredictions.map(prediction => (
            <PredictionCard
              key={prediction.id}
              prediction={prediction}
              onVote={handleVote}
              isVoting={votingStates.has(prediction.id)}
            />
          ))}
        </div>
      )}


    </div>
  );
}
