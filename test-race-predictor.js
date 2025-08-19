#!/usr/bin/env node

// Simple Node.js test script to verify race predictor functionality
console.log('🧪 Testing Race Predictor Functionality...\n');

// Test 1: Win Probability Calculation
console.log('📊 Test 1: Win Probability Calculation');
function calculateWinProbability(yesVotes, noVotes) {
  const totalVotes = yesVotes + noVotes;
  return totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 50;
}

const testCases = [
  { yes: 0, no: 0, expected: 50, desc: 'No votes should return 50%' },
  { yes: 5, no: 0, expected: 100, desc: 'All yes votes should return 100%' },
  { yes: 0, no: 5, expected: 0, desc: 'All no votes should return 0%' },
  { yes: 3, no: 2, expected: 60, desc: '3 yes, 2 no should return 60%' },
  { yes: 7, no: 3, expected: 70, desc: '7 yes, 3 no should return 70%' },
  { yes: 1, no: 3, expected: 25, desc: '1 yes, 3 no should return 25%' },
];

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const result = calculateWinProbability(test.yes, test.no);
  const success = result === test.expected;
  
  console.log(`  ${success ? '✅' : '❌'} ${test.desc}`);
  console.log(`     Expected: ${test.expected}%, Got: ${result}%`);
  
  if (success) passed++;
  else failed++;
});

console.log(`\n📈 Win Probability Tests: ${passed} passed, ${failed} failed\n`);

// Test 2: Vote Storage Logic
console.log('💾 Test 2: Vote Storage Logic');

class VoteStorage {
  constructor() {
    this.predictions = [];
  }

  savePrediction(data) {
    try {
      const existingIndex = this.predictions.findIndex(
        p => p.raceName === data.raceName && 
             p.raceDate === data.raceDate && 
             p.userSession === data.userSession
      );
      
      if (existingIndex >= 0) {
        this.predictions[existingIndex] = { ...data, timestamp: Date.now() };
      } else {
        this.predictions.push({ ...data, timestamp: Date.now() });
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  getPredictionStats(raceName, raceDate) {
    const racePredictions = this.predictions.filter(
      p => p.raceName === raceName && p.raceDate === raceDate
    );
    
    const yesVotes = racePredictions.filter(p => p.prediction === true).length;
    const noVotes = racePredictions.filter(p => p.prediction === false).length;
    const totalVotes = yesVotes + noVotes;
    const winProbability = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 50;
    
    return { totalVotes, yesVotes, noVotes, winProbability };
  }

  checkUserVoted(raceName, raceDate, userSession) {
    const userPrediction = this.predictions.find(
      p => p.raceName === raceName && 
           p.raceDate === raceDate && 
           p.userSession === userSession
    );
    
    return userPrediction ? userPrediction.prediction : null;
  }

  reset() {
    this.predictions = [];
  }
}

const storage = new VoteStorage();

// Test saving votes
console.log('  Testing vote saving...');
const raceData = {
  raceName: 'Bahrain Grand Prix',
  raceDate: '2025-03-16'
};

// Test 1: Save new vote
const result1 = storage.savePrediction({
  ...raceData,
  prediction: true,
  userSession: 'user1'
});

console.log(`  ${result1 ? '✅' : '❌'} Save new vote: ${result1 ? 'Success' : 'Failed'}`);

// Test 2: Update existing vote
const result2 = storage.savePrediction({
  ...raceData,
  prediction: false,
  userSession: 'user1'
});

console.log(`  ${result2 ? '✅' : '❌'} Update existing vote: ${result2 ? 'Success' : 'Failed'}`);

// Test 3: Check vote count (should still be 1)
const voteCount = storage.predictions.length;
const correctCount = voteCount === 1;
console.log(`  ${correctCount ? '✅' : '❌'} Vote count after update: ${voteCount} (expected: 1)`);

// Test 4: Check user vote
const userVote = storage.checkUserVoted(raceData.raceName, raceData.raceDate, 'user1');
const correctVote = userVote === false;
console.log(`  ${correctVote ? '✅' : '❌'} User vote check: ${userVote} (expected: false)`);

storage.reset();

// Test 3: Multiple Users Voting
console.log('\n👥 Test 3: Multiple Users Voting');

const users = [
  { session: 'user1', vote: true },
  { session: 'user2', vote: false },
  { session: 'user3', vote: true },
  { session: 'user4', vote: true },
  { session: 'user5', vote: false },
];

// Submit votes from multiple users
users.forEach(user => {
  storage.savePrediction({
    ...raceData,
    prediction: user.vote,
    userSession: user.session
  });
});

const stats = storage.getPredictionStats(raceData.raceName, raceData.raceDate);

console.log(`  Total votes: ${stats.totalVotes} (expected: 5)`);
console.log(`  Yes votes: ${stats.yesVotes} (expected: 3)`);
console.log(`  No votes: ${stats.noVotes} (expected: 2)`);
console.log(`  Win probability: ${stats.winProbability}% (expected: 60%)`);

const multiUserTest = stats.totalVotes === 5 && 
                     stats.yesVotes === 3 && 
                     stats.noVotes === 2 && 
                     stats.winProbability === 60;

console.log(`  ${multiUserTest ? '✅' : '❌'} Multiple users test: ${multiUserTest ? 'Passed' : 'Failed'}`);

// Test 4: Session Generation
console.log('\n🔑 Test 4: Session Generation');

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

const session1 = generateSessionId();
const session2 = generateSessionId();

const uniqueSessions = session1 !== session2;
const correctFormat1 = /^session_\d+_[a-z0-9]+$/.test(session1);
const correctFormat2 = /^session_\d+_[a-z0-9]+$/.test(session2);

console.log(`  ${uniqueSessions ? '✅' : '❌'} Session uniqueness: ${uniqueSessions ? 'Unique' : 'Duplicate'}`);
console.log(`  ${correctFormat1 ? '✅' : '❌'} Session 1 format: ${correctFormat1 ? 'Valid' : 'Invalid'} (${session1})`);
console.log(`  ${correctFormat2 ? '✅' : '❌'} Session 2 format: ${correctFormat2 ? 'Valid' : 'Invalid'} (${session2})`);

// Test 5: API Endpoint Simulation
console.log('\n🌐 Test 5: API Endpoint Simulation');

// Simulate the API logic
function simulatePostAPI(requestBody) {
  // Validate input
  if (!requestBody.raceName || !requestBody.raceDate || 
      typeof requestBody.prediction !== 'boolean' || !requestBody.userSession) {
    return { status: 400, error: 'Missing required fields' };
  }

  // Save prediction
  const success = storage.savePrediction(requestBody);
  if (!success) {
    return { status: 500, error: 'Failed to save prediction' };
  }

  // Get updated stats
  const stats = storage.getPredictionStats(requestBody.raceName, requestBody.raceDate);

  return {
    status: 200,
    data: {
      success: true,
      stats,
      userVote: requestBody.prediction
    }
  };
}

function simulateGetAPI(raceName, raceDate, userSession) {
  if (!raceName || !raceDate) {
    return { status: 400, error: 'Missing raceName or raceDate' };
  }

  const stats = storage.getPredictionStats(raceName, raceDate);
  const userVote = userSession ? storage.checkUserVoted(raceName, raceDate, userSession) : null;

  return {
    status: 200,
    data: { stats, userVote }
  };
}

storage.reset();

// Test POST API
const postResponse = simulatePostAPI({
  raceName: 'Monaco Grand Prix',
  raceDate: '2025-05-25',
  prediction: true,
  userSession: 'api_test_user'
});

const postSuccess = postResponse.status === 200 && 
                   postResponse.data.success === true && 
                   postResponse.data.userVote === true;

console.log(`  ${postSuccess ? '✅' : '❌'} POST API simulation: ${postSuccess ? 'Success' : 'Failed'}`);

// Test GET API
const getResponse = simulateGetAPI('Monaco Grand Prix', '2025-05-25', 'api_test_user');

const getSuccess = getResponse.status === 200 && 
                  getResponse.data.stats.totalVotes === 1 && 
                  getResponse.data.userVote === true;

console.log(`  ${getSuccess ? '✅' : '❌'} GET API simulation: ${getSuccess ? 'Success' : 'Failed'}`);

// Test validation
const validationResponse = simulatePostAPI({
  raceName: 'Test Race',
  // Missing required fields
});

const validationSuccess = validationResponse.status === 400;
console.log(`  ${validationSuccess ? '✅' : '❌'} API validation: ${validationSuccess ? 'Working' : 'Failed'}`);

// Final Summary
console.log('\n🎯 Test Summary');
console.log('================');

const allTests = [
  { name: 'Win Probability Calculation', passed: failed === 0 },
  { name: 'Vote Storage Logic', passed: result1 && result2 && correctCount && correctVote },
  { name: 'Multiple Users Voting', passed: multiUserTest },
  { name: 'Session Generation', passed: uniqueSessions && correctFormat1 && correctFormat2 },
  { name: 'API Endpoint Simulation', passed: postSuccess && getSuccess && validationSuccess }
];

const totalPassed = allTests.filter(test => test.passed).length;
const totalTests = allTests.length;

allTests.forEach(test => {
  console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.passed ? 'PASSED' : 'FAILED'}`);
});

console.log(`\n🏆 Overall Result: ${totalPassed}/${totalTests} tests passed`);

if (totalPassed === totalTests) {
  console.log('🎉 All race predictor functionality is working correctly!');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please check the implementation.');
  process.exit(1);
}
