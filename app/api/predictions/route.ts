import { NextRequest, NextResponse } from "next/server";

// Types
interface PredictionRequest {
  raceName: string;
  raceDate: string;
  prediction: boolean;
  userSession: string;
}

interface PredictionStats {
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  winProbability: number;
}

// In-memory storage for demo purposes (replace with actual D1 database in production)
interface StoredPrediction {
  raceName: string;
  raceDate: string;
  prediction: boolean;
  userSession: string;
  timestamp: number;
}

// Simple in-memory storage
const predictions: StoredPrediction[] = [];

async function savePrediction(data: PredictionRequest): Promise<boolean> {
  try {
    // Check if user already voted for this race
    const existingIndex = predictions.findIndex(
      p => p.raceName === data.raceName && 
           p.raceDate === data.raceDate && 
           p.userSession === data.userSession
    );
    
    if (existingIndex >= 0) {
      // Update existing vote
      predictions[existingIndex] = {
        ...data,
        timestamp: Date.now()
      };
    } else {
      // Add new vote
      predictions.push({
        ...data,
        timestamp: Date.now()
      });
    }
    
    console.log('Saved prediction:', data);
    console.log('Total predictions stored:', predictions.length);
    return true;
  } catch (error) {
    console.error('Error saving prediction:', error);
    return false;
  }
}

async function getPredictionStats(raceName: string, raceDate: string): Promise<PredictionStats> {
  try {
    // Filter predictions for this specific race
    const racePredictions = predictions.filter(
      p => p.raceName === raceName && p.raceDate === raceDate
    );
    
    const yesVotes = racePredictions.filter(p => p.prediction === true).length;
    const noVotes = racePredictions.filter(p => p.prediction === false).length;
    const totalVotes = yesVotes + noVotes;
    const winProbability = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 50;
    
    console.log(`Stats for ${raceName}: ${yesVotes} yes, ${noVotes} no, ${winProbability}% win probability`);
    
    return {
      totalVotes,
      yesVotes,
      noVotes,
      winProbability
    };
  } catch (error) {
    console.error('Error getting prediction stats:', error);
    return {
      totalVotes: 0,
      yesVotes: 0,
      noVotes: 0,
      winProbability: 50
    };
  }
}

async function checkUserVoted(raceName: string, raceDate: string, userSession: string): Promise<boolean | null> {
  try {
    const userPrediction = predictions.find(
      p => p.raceName === raceName && 
           p.raceDate === raceDate && 
           p.userSession === userSession
    );
    
    return userPrediction ? userPrediction.prediction : null;
  } catch (error) {
    console.error('Error checking user vote:', error);
    return null;
  }
}

// POST - Submit a prediction
export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json();
    
    // Validate input
    if (!body.raceName || !body.raceDate || typeof body.prediction !== 'boolean' || !body.userSession) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Save prediction (will update if user already voted)
    const success = await savePrediction(body);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save prediction' },
        { status: 500 }
      );
    }
    
    // Get updated stats
    const stats = await getPredictionStats(body.raceName, body.raceDate);
    
    return NextResponse.json({
      success: true,
      stats,
      userVote: body.prediction
    });
    
  } catch (error) {
    console.error('Error in POST /api/predictions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get prediction stats for a race
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raceName = searchParams.get('raceName');
    const raceDate = searchParams.get('raceDate');
    const userSession = searchParams.get('userSession');
    
    if (!raceName || !raceDate) {
      return NextResponse.json(
        { error: 'Missing raceName or raceDate' },
        { status: 400 }
      );
    }
    
    // Get stats
    const stats = await getPredictionStats(raceName, raceDate);
    
    // Check if user voted (if session provided)
    let userVote = null;
    if (userSession) {
      userVote = await checkUserVoted(raceName, raceDate, userSession);
    }
    
    return NextResponse.json({
      stats,
      userVote
    });
    
  } catch (error) {
    console.error('Error in GET /api/predictions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
