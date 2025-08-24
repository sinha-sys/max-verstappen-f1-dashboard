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
import { VoteModal } from "@/components/VoteModal";

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
function getVotesFromStorage(): Record<string, 'yes' | 'no'> {
  if (typeof window === 'undefined') return {};
  
  try {
    const votes = localStorage.getItem('prediction_votes');
    return votes ? JSON.parse(votes) : {};
  } catch {
    return {};
  }
}

// Save votes to localStorage
function saveVotesToStorage(votes: Record<string, 'yes' | 'no'>) {
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
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingVote, setPendingVote] = useState<{
    predictionId: number;
    vote: 'yes' | 'no';
    predictionTitle: string;
  } | null>(null);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);

  useEffect(() => {
    loadPredictions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPredictions = async () => {
    try {
      // Try to fetch from API first, fallback to local data
      try {
        const response = await fetch('/api/predictions');
        const data = await response.json();
        
        if (data.success) {
          setPredictions(data.data);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using fallback data');
      }
      
      // Fallback to local data with localStorage for development
      const basePredictions = predictionsData;
      const userVotes = getVotesFromStorage();
      const voteCounts = getVoteCountsFromStorage();
      
      const predictionsWithVotes: PredictionWithVotes[] = basePredictions.map(prediction => {
        const counts = voteCounts[prediction.id] || { yes: prediction.yesVotes, no: prediction.noVotes };
        const total = counts.yes + counts.no;
        const yesPercentage = total > 0 ? (counts.yes / total) * 100 : 50;
        
        // For fallback, we can't determine user vote without email, so set to null
        return {
          ...prediction,
          status: prediction.status as 'active' | 'closed' | 'resolved',
          expiresAt: prediction.expiresAt || undefined,
          yesVotes: counts.yes,
          noVotes: counts.no,
          totalVotes: total,
          yesPercentage,
          userVote: null
        };
      });
      
      setPredictions(predictionsWithVotes);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (predictionId: number, vote: 'yes' | 'no') => {
    const prediction = predictions.find(p => p.id === predictionId);
    if (!prediction) return;
    
    // Set pending vote and open modal
    setPendingVote({
      predictionId,
      vote,
      predictionTitle: prediction.title
    });
    setIsModalOpen(true);
  };

  const handleConfirmVote = async (userName: string, userEmail: string) => {
    if (!pendingVote) return;
    
    setIsSubmittingVote(true);
    
    try {
      // Try to submit to API first
      try {
        const response = await fetch('/api/predictions/vote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            predictionId: pendingVote.predictionId,
            vote: pendingVote.vote,
            userName,
            userEmail,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          // Update the specific prediction in state
          setPredictions(prev => 
            prev.map(p => 
              p.id === pendingVote.predictionId 
                ? data.data
                : p
            )
          );
          
          // Close modal and reset state
          setIsModalOpen(false);
          setPendingVote(null);
          return;
        } else {
          throw new Error(data.error || 'Failed to submit vote');
        }
      } catch (apiError) {
        console.log('API not available, using localStorage fallback');
        
        // Fallback to localStorage for development
        const currentVotes = getVotesFromStorage();
        const currentCounts = getVoteCountsFromStorage();
        
        const prediction = predictions.find(p => p.id === pendingVote.predictionId);
        if (!prediction) return;
        
        // Check if user already voted with the same vote (using email as key)
        const emailKey = `${pendingVote.predictionId}_${userEmail}`;
        const previousVote = currentVotes[emailKey];
        if (previousVote && previousVote === pendingVote.vote) {
          alert('You have already voted for this prediction');
          return;
        }
        
        // Initialize counts if not exists
        if (!currentCounts[pendingVote.predictionId]) {
          currentCounts[pendingVote.predictionId] = { 
            yes: prediction.yesVotes, 
            no: prediction.noVotes 
          };
        }
        
        // If user had a previous vote, subtract it
        if (previousVote) {
          currentCounts[pendingVote.predictionId][previousVote]--;
        }
        
        // Add the new vote
        currentVotes[emailKey] = pendingVote.vote;
        currentCounts[pendingVote.predictionId][pendingVote.vote]++;
        
        // Save to localStorage
        saveVotesToStorage(currentVotes);
        saveVoteCountsToStorage(currentCounts);
        
        // Update UI
        await loadPredictions();
      }
      
      // Close modal and reset state
      setIsModalOpen(false);
      setPendingVote(null);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit vote. Please try again.');
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmittingVote) {
      setIsModalOpen(false);
      setPendingVote(null);
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

      {/* Vote Confirmation Modal */}
      {pendingVote && (
        <VoteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmVote}
          predictionTitle={pendingVote.predictionTitle}
          vote={pendingVote.vote}
          isSubmitting={isSubmittingVote}
        />
      )}
    </div>
  );
}
