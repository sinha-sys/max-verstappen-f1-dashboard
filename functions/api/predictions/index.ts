// Cloudflare Function for getting predictions
export async function onRequestGet(context: any): Promise<Response> {
  try {
    const { env } = context;
    const db = env.DB; // D1 database binding
    
    if (!db) {
      // Fallback data for development/testing
      const fallbackData = [
        {
          id: 1,
          title: "Will Max Verstappen leave Red Bull before the end of 2025?",
          description: "Max has been with Red Bull Racing since 2016. Will he switch teams before the 2025 season concludes?",
          category: "Driver Transfer",
          status: "active",
          resolution: null,
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-01-01T00:00:00Z",
          expiresAt: null,
          yesVotes: 42,
          noVotes: 158,
          totalVotes: 200,
          yesPercentage: 21.0,
          userVote: null
        },
        {
          id: 2,
          title: "Will Lewis Hamilton win a race in 2025?",
          description: "After moving to Ferrari, will Hamilton manage to secure at least one victory in the 2025 season?",
          category: "Race Results",
          status: "active",
          resolution: null,
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-01-01T00:00:00Z",
          expiresAt: null,
          yesVotes: 167,
          noVotes: 33,
          totalVotes: 200,
          yesPercentage: 83.5,
          userVote: null
        },
        {
          id: 3,
          title: "Will there be more than 5 different race winners in 2025?",
          description: "Formula 1 has seen increased competition. Will we see diversity in race winners this season?",
          category: "Season Outcomes",
          status: "active",
          resolution: null,
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-01-01T00:00:00Z",
          expiresAt: null,
          yesVotes: 124,
          noVotes: 76,
          totalVotes: 200,
          yesPercentage: 62.0,
          userVote: null
        },
        {
          id: 4,
          title: "Will any driver score their first F1 win in 2025?",
          description: "Will we see a breakthrough victory for a driver who has never won before?",
          category: "Race Results",
          status: "active",
          resolution: null,
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-01-01T00:00:00Z",
          expiresAt: null,
          yesVotes: 89,
          noVotes: 111,
          totalVotes: 200,
          yesPercentage: 44.5,
          userVote: null
        },
        {
          id: 5,
          title: "Will Red Bull win the Constructors Championship in 2025?",
          description: "Red Bull has dominated recent seasons. Will they continue their streak in 2025?",
          category: "Season Outcomes",
          status: "active",
          resolution: null,
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-01-01T00:00:00Z",
          expiresAt: null,
          yesVotes: 134,
          noVotes: 66,
          totalVotes: 200,
          yesPercentage: 67.0,
          userVote: null
        }
      ];
      
      return new Response(JSON.stringify({
        success: true,
        data: fallbackData
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Get predictions with vote counts from database
    const stmt = db.prepare(`
      SELECT 
        id,
        title,
        description,
        category,
        status,
        resolution,
        created_at,
        updated_at,
        expires_at,
        yes_votes,
        no_votes,
        total_votes,
        yes_percentage
      FROM prediction_vote_summary
      WHERE status = 'active'
      ORDER BY created_at DESC
    `);
    
    const result = await stmt.all();
    const predictions = result.results || [];
    
    const formattedPredictions = predictions.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      status: p.status,
      resolution: p.resolution,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      expiresAt: p.expires_at,
      yesVotes: p.yes_votes,
      noVotes: p.no_votes,
      totalVotes: p.total_votes,
      yesPercentage: p.yes_percentage,
      userVote: null
    }));

    return new Response(JSON.stringify({
      success: true,
      data: formattedPredictions
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch predictions'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
