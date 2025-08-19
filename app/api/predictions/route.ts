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

// Mock database functions (replace with actual D1 database calls in production)
async function savePrediction(data: PredictionRequest): Promise<boolean> {
  try {
    // In production, this would use Cloudflare D1:
    // const result = await env.DB.prepare(
    //   "INSERT OR IGNORE INTO race_predictions (race_name, race_date, prediction, user_session) VALUES (?, ?, ?, ?)"
    // ).bind(data.raceName, data.raceDate, data.prediction, data.userSession).run();
    
    // For now, simulate success
    console.log('Saving prediction:', data);
    return true;
  } catch (error) {
    console.error('Error saving prediction:', error);
    return false;
  }
}

async function getPredictionStats(raceName: string, raceDate: string): Promise<PredictionStats> {
  try {
    // In production, this would use Cloudflare D1:
    // const result = await env.DB.prepare(
    //   "SELECT prediction, COUNT(*) as count FROM race_predictions WHERE race_name = ? AND race_date = ? GROUP BY prediction"
    // ).bind(raceName, raceDate).all();
    
    // For now, return mock data
    const mockYesVotes = Math.floor(Math.random() * 100) + 50;
    const mockNoVotes = Math.floor(Math.random() * 50) + 20;
    const totalVotes = mockYesVotes + mockNoVotes;
    const winProbability = totalVotes > 0 ? Math.round((mockYesVotes / totalVotes) * 100) : 50;
    
    return {
      totalVotes,
      yesVotes: mockYesVotes,
      noVotes: mockNoVotes,
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
    // In production, this would use Cloudflare D1:
    // const result = await env.DB.prepare(
    //   "SELECT prediction FROM race_predictions WHERE race_name = ? AND race_date = ? AND user_session = ?"
    // ).bind(raceName, raceDate, userSession).first();
    
    // For now, return null (no vote found)
    return null;
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
    
    // Check if user already voted
    const existingVote = await checkUserVoted(body.raceName, body.raceDate, body.userSession);
    if (existingVote !== null) {
      return NextResponse.json(
        { error: 'User has already voted for this race' },
        { status: 409 }
      );
    }
    
    // Save prediction
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
