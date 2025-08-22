import { NextRequest, NextResponse } from 'next/server';
import { 
  getDatabase, 
  submitVote, 
  getAllPredictions,
  getAllPredictionsFromJSON
} from '@/lib/database';

export const dynamic = 'force-dynamic';

// In-memory storage for development fallback
const devVotes = new Map();
const devVoteCounts = new Map();

// Initialize vote counts from JSON data
function initializeVoteCounts() {
  if (devVoteCounts.size === 0) {
    // This will be loaded from the JSON file
    const initialPredictions = [
      { id: 1, yesVotes: 42, noVotes: 158 },
      { id: 2, yesVotes: 167, noVotes: 33 },
      { id: 3, yesVotes: 124, noVotes: 76 },
      { id: 4, yesVotes: 89, noVotes: 111 },
      { id: 5, yesVotes: 134, noVotes: 66 }
    ];
    
    initialPredictions.forEach(pred => {
      devVoteCounts.set(pred.id, { yes: pred.yesVotes, no: pred.noVotes });
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { predictionId, vote, userIdentifier } = body;

    // Validate input
    if (!predictionId || !vote || !userIdentifier) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['yes', 'no'].includes(vote)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vote value' },
        { status: 400 }
      );
    }

    // Try to use database
    try {
      const db = getDatabase();
      await submitVote(db, predictionId, vote, userIdentifier);
      
      // Get updated predictions data with vote counts
      const updatedPredictions = await getAllPredictions(db, userIdentifier);
      const updatedPrediction = updatedPredictions.find(p => p.id === predictionId);
      
      return NextResponse.json({
        success: true,
        data: updatedPrediction
      });
    } catch (error) {
      // Fallback to in-memory storage for development
      console.log('Falling back to in-memory storage:', error);
      
      // Initialize vote counts
      initializeVoteCounts();
      
      // Check if prediction exists
      const predictions = await getAllPredictionsFromJSON();
      const prediction = predictions.find(p => p.id === predictionId);
      
      if (!prediction) {
        return NextResponse.json(
          { success: false, error: 'Prediction not found' },
          { status: 404 }
        );
      }

      // Store vote in memory
      if (!devVotes.has(userIdentifier)) {
        devVotes.set(userIdentifier, new Map());
      }
      
      const userVotesMap = devVotes.get(userIdentifier);
      const previousVote = userVotesMap.get(predictionId);
      
      // Check if user already voted with the same vote
      if (previousVote && previousVote === vote) {
        return NextResponse.json(
          { success: false, error: 'You have already voted for this prediction' },
          { status: 400 }
        );
      }
      
      // Get current vote counts
      const currentCounts = devVoteCounts.get(predictionId);
      
      // If changing vote, subtract previous vote
      if (previousVote) {
        if (previousVote === 'yes') currentCounts.yes--;
        else currentCounts.no--;
      }
      
      // Add new vote
      if (vote === 'yes') currentCounts.yes++;
      else currentCounts.no++;
      
      // Update user vote
      userVotesMap.set(predictionId, vote);
      
      // Calculate new percentages
      const totalVotes = currentCounts.yes + currentCounts.no;
      const yesPercentage = totalVotes > 0 ? (currentCounts.yes / totalVotes) * 100 : 50;
      
      return NextResponse.json({
        success: true,
        data: {
          ...prediction,
          status: prediction.status,
          expiresAt: prediction.expiresAt || undefined,
          yesVotes: currentCounts.yes,
          noVotes: currentCounts.no,
          totalVotes,
          yesPercentage,
          userVote: vote
        }
      });
    }
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit vote' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const predictionId = parseInt(searchParams.get('predictionId') || '');
    const userIdentifier = searchParams.get('userIdentifier');

    if (isNaN(predictionId) || !userIdentifier) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Try to use database
    try {
      const db = getDatabase();
      const predictions = await getAllPredictions(db, userIdentifier);
      const prediction = predictions.find(p => p.id === predictionId);
      
      if (!prediction) {
        return NextResponse.json(
          { success: false, error: 'Prediction not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: { vote: prediction.userVote }
      });
    } catch (error) {
      // Fallback to in-memory storage for development
      console.log('Falling back to in-memory storage:', error);
      
      const userVote = devVotes.get(userIdentifier)?.get(predictionId) || null;
      
      return NextResponse.json({
        success: true,
        data: { vote: userVote }
      });
    }
  } catch (error) {
    console.error('Error fetching vote:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch vote' 
      },
      { status: 500 }
    );
  }
}