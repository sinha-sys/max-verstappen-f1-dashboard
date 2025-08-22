import { NextRequest, NextResponse } from 'next/server';
import { 
  getDatabase, 
  getAllPredictions, 
  getAllPredictionsFromJSON
} from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userIdentifier = searchParams.get('userIdentifier');
    
    // Try to get database instance
    let predictions;
    try {
      const db = getDatabase();
      predictions = await getAllPredictions(db, userIdentifier || undefined);
    } catch (error) {
      // Fallback to JSON data for development
      console.log('Falling back to JSON data:', error);
      predictions = await getAllPredictionsFromJSON();
    }

    return NextResponse.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch predictions' 
      },
      { status: 500 }
    );
  }
}
