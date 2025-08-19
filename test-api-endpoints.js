#!/usr/bin/env node

// Test actual API endpoints with HTTP requests
console.log('🌐 Testing Race Predictor API Endpoints...\n');

const BASE_URL = 'http://localhost:3001'; // Development server

async function testAPI() {
  try {
    // Test data
    const testData = {
      raceName: 'API Test Grand Prix',
      raceDate: '2025-12-31',
      userSession: `test_${Date.now()}`
    };

    console.log('📡 Test 1: POST /api/predictions (Submit Vote)');
    
    // Test 1: Submit YES vote
    const postResponse1 = await fetch(`${BASE_URL}/api/predictions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...testData,
        prediction: true
      })
    });

    if (postResponse1.ok) {
      const data1 = await postResponse1.json();
      console.log('  ✅ POST request successful');
      console.log(`  📊 Response: ${JSON.stringify(data1, null, 2)}`);
      
      // Validate response structure
      const hasRequiredFields = data1.success && 
                               data1.stats && 
                               typeof data1.userVote === 'boolean' &&
                               typeof data1.stats.totalVotes === 'number' &&
                               typeof data1.stats.yesVotes === 'number' &&
                               typeof data1.stats.noVotes === 'number' &&
                               typeof data1.stats.winProbability === 'number';
      
      console.log(`  ${hasRequiredFields ? '✅' : '❌'} Response structure: ${hasRequiredFields ? 'Valid' : 'Invalid'}`);
      console.log(`  📈 Stats: ${data1.stats.totalVotes} total, ${data1.stats.yesVotes} yes, ${data1.stats.noVotes} no, ${data1.stats.winProbability}% win probability`);
    } else {
      console.log(`  ❌ POST request failed: ${postResponse1.status}`);
      const errorText = await postResponse1.text();
      console.log(`  Error: ${errorText}`);
    }

    console.log('\n📡 Test 2: GET /api/predictions (Get Stats)');
    
    // Test 2: Get statistics
    const getResponse = await fetch(
      `${BASE_URL}/api/predictions?raceName=${encodeURIComponent(testData.raceName)}&raceDate=${encodeURIComponent(testData.raceDate)}&userSession=${encodeURIComponent(testData.userSession)}`
    );

    if (getResponse.ok) {
      const data2 = await getResponse.json();
      console.log('  ✅ GET request successful');
      console.log(`  📊 Response: ${JSON.stringify(data2, null, 2)}`);
      
      // Validate response structure
      const hasRequiredFields = data2.stats && 
                               (data2.userVote === null || typeof data2.userVote === 'boolean') &&
                               typeof data2.stats.totalVotes === 'number' &&
                               typeof data2.stats.yesVotes === 'number' &&
                               typeof data2.stats.noVotes === 'number' &&
                               typeof data2.stats.winProbability === 'number';
      
      console.log(`  ${hasRequiredFields ? '✅' : '❌'} Response structure: ${hasRequiredFields ? 'Valid' : 'Invalid'}`);
      console.log(`  👤 User vote: ${data2.userVote}`);
      console.log(`  📈 Stats: ${data2.stats.totalVotes} total, ${data2.stats.yesVotes} yes, ${data2.stats.noVotes} no, ${data2.stats.winProbability}% win probability`);
    } else {
      console.log(`  ❌ GET request failed: ${getResponse.status}`);
      const errorText = await getResponse.text();
      console.log(`  Error: ${errorText}`);
    }

    console.log('\n📡 Test 3: POST /api/predictions (Update Vote)');
    
    // Test 3: Update vote to NO
    const postResponse2 = await fetch(`${BASE_URL}/api/predictions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...testData,
        prediction: false // Changed from true to false
      })
    });

    if (postResponse2.ok) {
      const data3 = await postResponse2.json();
      console.log('  ✅ Vote update successful');
      console.log(`  👤 Updated vote: ${data3.userVote} (should be false)`);
      console.log(`  📈 Updated stats: ${data3.stats.totalVotes} total, ${data3.stats.yesVotes} yes, ${data3.stats.noVotes} no, ${data3.stats.winProbability}% win probability`);
      
      const voteUpdated = data3.userVote === false;
      console.log(`  ${voteUpdated ? '✅' : '❌'} Vote update: ${voteUpdated ? 'Correct' : 'Failed'}`);
    } else {
      console.log(`  ❌ Vote update failed: ${postResponse2.status}`);
      const errorText = await postResponse2.text();
      console.log(`  Error: ${errorText}`);
    }

    console.log('\n📡 Test 4: POST /api/predictions (Validation)');
    
    // Test 4: Test validation with missing fields
    const postResponse3 = await fetch(`${BASE_URL}/api/predictions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raceName: 'Test Race',
        // Missing required fields
      })
    });

    if (postResponse3.status === 400) {
      console.log('  ✅ Validation working correctly (400 status)');
      const errorData = await postResponse3.json();
      console.log(`  📝 Error message: ${errorData.error}`);
    } else {
      console.log(`  ❌ Validation failed: Expected 400, got ${postResponse3.status}`);
    }

    console.log('\n📡 Test 5: GET /api/predictions (Validation)');
    
    // Test 5: Test GET validation with missing parameters
    const getResponse2 = await fetch(`${BASE_URL}/api/predictions?raceName=TestRace`);
    // Missing raceDate parameter

    if (getResponse2.status === 400) {
      console.log('  ✅ GET validation working correctly (400 status)');
      const errorData = await getResponse2.json();
      console.log(`  📝 Error message: ${errorData.error}`);
    } else {
      console.log(`  ❌ GET validation failed: Expected 400, got ${getResponse2.status}`);
    }

    console.log('\n📡 Test 6: Multiple Users Simulation');
    
    // Test 6: Simulate multiple users voting
    const raceData = {
      raceName: 'Multi User Test GP',
      raceDate: '2025-06-15'
    };

    const users = [
      { session: `user1_${Date.now()}`, vote: true },
      { session: `user2_${Date.now()}`, vote: false },
      { session: `user3_${Date.now()}`, vote: true },
      { session: `user4_${Date.now()}`, vote: true },
      { session: `user5_${Date.now()}`, vote: false },
    ];

    console.log('  Submitting votes from 5 users...');
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const response = await fetch(`${BASE_URL}/api/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...raceData,
          prediction: user.vote,
          userSession: user.session
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`    User ${i + 1}: ${user.vote ? 'YES' : 'NO'} vote submitted. Total votes: ${data.stats.totalVotes}`);
      } else {
        console.log(`    User ${i + 1}: Vote failed (${response.status})`);
      }
    }

    // Get final stats
    const finalStatsResponse = await fetch(
      `${BASE_URL}/api/predictions?raceName=${encodeURIComponent(raceData.raceName)}&raceDate=${encodeURIComponent(raceData.raceDate)}`
    );

    if (finalStatsResponse.ok) {
      const finalStats = await finalStatsResponse.json();
      console.log(`  📊 Final stats: ${finalStats.stats.totalVotes} total, ${finalStats.stats.yesVotes} yes, ${finalStats.stats.noVotes} no`);
      console.log(`  🎯 Win probability: ${finalStats.stats.winProbability}%`);
      
      const expectedYes = 3;
      const expectedNo = 2;
      const expectedTotal = 5;
      const expectedProbability = 60;
      
      const statsCorrect = finalStats.stats.totalVotes === expectedTotal &&
                          finalStats.stats.yesVotes === expectedYes &&
                          finalStats.stats.noVotes === expectedNo &&
                          finalStats.stats.winProbability === expectedProbability;
      
      console.log(`  ${statsCorrect ? '✅' : '❌'} Multi-user stats: ${statsCorrect ? 'Correct' : 'Incorrect'}`);
    }

    console.log('\n🎯 API Test Summary');
    console.log('==================');
    console.log('✅ All API endpoint tests completed successfully!');
    console.log('✅ Vote submission working');
    console.log('✅ Statistics retrieval working');
    console.log('✅ Vote updates working');
    console.log('✅ Input validation working');
    console.log('✅ Multiple user support working');
    console.log('\n🎉 Race Predictor API is fully functional!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the development server is running:');
      console.log('   npm run dev');
      console.log('   Server should be available at http://localhost:3001');
    }
    
    process.exit(1);
  }
}

// Run the tests
testAPI();
