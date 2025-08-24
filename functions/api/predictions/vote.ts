// Cloudflare Function for voting on predictions
export async function onRequestPost(context: any): Promise<Response> {
  try {
    const { request, env } = context;
    const db = env.DB; // D1 database binding
    
    const body = await request.json();
    const { predictionId, vote, userName, userEmail } = body;

    // Validate input
    if (!predictionId || !vote || !userName || !userEmail) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: predictionId, vote, userName, userEmail'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    if (!['yes', 'no'].includes(vote)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid vote value. Must be "yes" or "no"'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email format'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    if (!db) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database not available'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Check if prediction exists and is active
    const predictionStmt = db.prepare(`
      SELECT status FROM predictions WHERE id = ?
    `);
    
    const prediction = await predictionStmt.bind(predictionId).first();
    
    if (!prediction) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Prediction not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
    
    if (prediction.status !== 'active') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Prediction is not active'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
    
    // Check if user has already voted (by email)
    const existingVoteStmt = db.prepare(`
      SELECT vote FROM prediction_votes WHERE prediction_id = ? AND user_email = ?
    `);
    
    const existingVote = await existingVoteStmt.bind(predictionId, userEmail).first();
    
    if (existingVote) {
      // User has already voted - check if it's the same vote
      if (existingVote.vote === vote) {
        return new Response(JSON.stringify({
          success: false,
          error: 'You have already voted for this prediction'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }
      
      // Update existing vote
      const updateStmt = db.prepare(`
        UPDATE prediction_votes 
        SET vote = ?, user_name = ?, created_at = CURRENT_TIMESTAMP 
        WHERE prediction_id = ? AND user_email = ?
      `);
      
      const result = await updateStmt.bind(vote, userName, predictionId, userEmail).run();
      
      if (!result.success) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to update vote'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }
    } else {
      // Insert new vote
      const userIdentifier = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      
      const insertStmt = db.prepare(`
        INSERT INTO prediction_votes (prediction_id, user_identifier, user_name, user_email, vote, created_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      
      const result = await insertStmt.bind(predictionId, userIdentifier, userName, userEmail, vote).run();
      
      if (!result.success) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to submit vote'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }
    }
    
    // Get updated prediction data
    const updatedStmt = db.prepare(`
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
      WHERE id = ?
    `);
    
    const updatedResult = await updatedStmt.bind(predictionId).first();
    
    if (!updatedResult) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to get updated prediction data'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
    
    const updatedPrediction = {
      id: updatedResult.id,
      title: updatedResult.title,
      description: updatedResult.description,
      category: updatedResult.category,
      status: updatedResult.status,
      resolution: updatedResult.resolution,
      createdAt: updatedResult.created_at,
      updatedAt: updatedResult.updated_at,
      expiresAt: updatedResult.expires_at,
      yesVotes: updatedResult.yes_votes,
      noVotes: updatedResult.no_votes,
      totalVotes: updatedResult.total_votes,
      yesPercentage: updatedResult.yes_percentage,
      userVote: vote
    };

    return new Response(JSON.stringify({
      success: true,
      data: updatedPrediction
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to submit vote'
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
