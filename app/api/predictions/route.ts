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

// Cloudflare D1 Database Functions
async function savePrediction(data: PredictionRequest, env: any): Promise<boolean> {
  try {
    // Use INSERT OR REPLACE to handle both new votes and vote updates
    const result = await env.DB.prepare(`
      INSERT OR REPLACE INTO race_predictions 
      (race_name, race_date, prediction, user_session, created_at) 
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      data.raceName, 
      data.raceDate, 
      data.prediction ? 1 : 0, // Convert boolean to integer for SQLite
      data.userSession
    ).run();
    
    console.log('Saved prediction to D1:', data, 'Result:', result);
    return result.success;
  } catch (error) {
    console.error('Error saving prediction to D1:', error);
    return false;
  }
}

async function getPredictionStats(raceName: string, raceDate: string, env: any): Promise<PredictionStats> {
  try {
    // Get vote counts grouped by prediction
    const result = await env.DB.prepare(`
      SELECT 
        prediction,
        COUNT(*) as count
      FROM race_predictions 
      WHERE race_name = ? AND race_date = ? 
      GROUP BY prediction
    `).bind(raceName, raceDate).all();
    
    let yesVotes = 0;
    let noVotes = 0;
    
    // Process results (SQLite stores booleans as 0/1)
    if (result.results) {
      for (const row of result.results) {
        if (row.prediction === 1) {
          yesVotes = row.count;
        } else if (row.prediction === 0) {
          noVotes = row.count;
        }
      }
    }
    
    const totalVotes = yesVotes + noVotes;
    const winProbability = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 50;
    
    console.log(`D1 Stats for ${raceName}: ${yesVotes} yes, ${noVotes} no, ${winProbability}% win probability`);
    
    return {
      totalVotes,
      yesVotes,
      noVotes,
      winProbability
    };
  } catch (error) {
    console.error('Error getting prediction stats from D1:', error);
    return {
      totalVotes: 0,
      yesVotes: 0,
      noVotes: 0,
      winProbability: 50
    };
  }
}

async function checkUserVoted(raceName: string, raceDate: string, userSession: string, env: any): Promise<boolean | null> {
  try {
    const result = await env.DB.prepare(`
      SELECT prediction 
      FROM race_predictions 
      WHERE race_name = ? AND race_date = ? AND user_session = ?
    `).bind(raceName, raceDate, userSession).first();
    
    if (result) {
      // Convert SQLite integer back to boolean
      return result.prediction === 1;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking user vote in D1:', error);
    return null;
  }
}

// POST - Submit a prediction
export async function POST(request: NextRequest, { env }: { env: any }) {
  try {
    const body: PredictionRequest = await request.json();
    
    // Validate input
    if (!body.raceName || !body.raceDate || typeof body.prediction !== 'boolean' || !body.userSession) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Save prediction to D1 database (will update if user already voted)
    const success = await savePrediction(body, env);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save prediction' },
        { status: 500 }
      );
    }
    
    // Get updated stats from D1
    const stats = await getPredictionStats(body.raceName, body.raceDate, env);
    
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
export async function GET(request: NextRequest, { env }: { env: any }) {
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
    
    // Get stats from D1
    const stats = await getPredictionStats(raceName, raceDate, env);
    
    // Check if user voted (if session provided)
    let userVote = null;
    if (userSession) {
      userVote = await checkUserVoted(raceName, raceDate, userSession, env);
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
