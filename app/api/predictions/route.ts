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

// In-memory storage for development/fallback
interface StoredPrediction {
  raceName: string;
  raceDate: string;
  prediction: boolean;
  userSession: string;
  timestamp: number;
}

// Simple in-memory storage as fallback
const predictions: StoredPrediction[] = [];

// Hybrid storage functions that work with both D1 and in-memory fallback
async function savePrediction(data: PredictionRequest): Promise<boolean> {
  try {
    // Try D1 first (in production/Cloudflare environment)
    const env = (globalThis as any).process?.env || {};
    const DB = env.DB || (globalThis as any).DB;
    
    if (DB) {
      console.log('Using D1 database for storage');
      const result = await DB.prepare(`
        INSERT OR REPLACE INTO race_predictions 
        (race_name, race_date, prediction, user_session, created_at) 
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(
        data.raceName, 
        data.raceDate, 
        data.prediction ? 1 : 0,
        data.userSession
      ).run();
      
      console.log('Saved prediction to D1:', data, 'Result:', result);
      return result.success;
    } else {
      // Fallback to in-memory storage
      console.log('Using in-memory storage fallback');
      const existingIndex = predictions.findIndex(
        p => p.raceName === data.raceName && 
             p.raceDate === data.raceDate && 
             p.userSession === data.userSession
      );
      
      if (existingIndex >= 0) {
        predictions[existingIndex] = { ...data, timestamp: Date.now() };
      } else {
        predictions.push({ ...data, timestamp: Date.now() });
      }
      
      console.log('Saved prediction to memory:', data);
      return true;
    }
  } catch (error) {
    console.error('Error saving prediction:', error);
    return false;
  }
}

async function getPredictionStats(raceName: string, raceDate: string): Promise<PredictionStats> {
  try {
    // Try D1 first
    const env = (globalThis as any).process?.env || {};
    const DB = env.DB || (globalThis as any).DB;
    
    if (DB) {
      console.log('Using D1 database for stats');
      const result = await DB.prepare(`
        SELECT 
          prediction,
          COUNT(*) as count
        FROM race_predictions 
        WHERE race_name = ? AND race_date = ? 
        GROUP BY prediction
      `).bind(raceName, raceDate).all();
      
      let yesVotes = 0;
      let noVotes = 0;
      
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
      
      return { totalVotes, yesVotes, noVotes, winProbability };
    } else {
      // Fallback to in-memory storage
      console.log('Using in-memory storage for stats');
      const racePredictions = predictions.filter(
        p => p.raceName === raceName && p.raceDate === raceDate
      );
      
      const yesVotes = racePredictions.filter(p => p.prediction === true).length;
      const noVotes = racePredictions.filter(p => p.prediction === false).length;
      const totalVotes = yesVotes + noVotes;
      const winProbability = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 50;
      
      console.log(`Memory Stats for ${raceName}: ${yesVotes} yes, ${noVotes} no, ${winProbability}% win probability`);
      
      return { totalVotes, yesVotes, noVotes, winProbability };
    }
  } catch (error) {
    console.error('Error getting prediction stats:', error);
    return { totalVotes: 0, yesVotes: 0, noVotes: 0, winProbability: 50 };
  }
}

async function checkUserVoted(raceName: string, raceDate: string, userSession: string): Promise<boolean | null> {
  try {
    // Try D1 first
    const env = (globalThis as any).process?.env || {};
    const DB = env.DB || (globalThis as any).DB;
    
    if (DB) {
      const result = await DB.prepare(`
        SELECT prediction 
        FROM race_predictions 
        WHERE race_name = ? AND race_date = ? AND user_session = ?
      `).bind(raceName, raceDate, userSession).first();
      
      if (result) {
        return result.prediction === 1;
      }
      return null;
    } else {
      // Fallback to in-memory storage
      const userPrediction = predictions.find(
        p => p.raceName === raceName && 
             p.raceDate === raceDate && 
             p.userSession === userSession
      );
      
      return userPrediction ? userPrediction.prediction : null;
    }
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
    
    console.log('Received prediction request:', body);
    
    // Save prediction (automatically detects D1 vs in-memory)
    const success = await savePrediction(body);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save prediction' },
        { status: 500 }
      );
    }
    
    // Get updated stats
    const stats = await getPredictionStats(body.raceName, body.raceDate);
    
    console.log('Returning prediction response:', { success: true, stats, userVote: body.prediction });
    
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
    
    console.log('Received stats request:', { raceName, raceDate, userSession });
    
    // Get stats (automatically detects D1 vs in-memory)
    const stats = await getPredictionStats(raceName, raceDate);
    
    // Check if user voted (if session provided)
    let userVote = null;
    if (userSession) {
      userVote = await checkUserVoted(raceName, raceDate, userSession);
    }
    
    console.log('Returning stats response:', { stats, userVote });
    
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
