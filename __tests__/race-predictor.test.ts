import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { POST, GET } from '@/app/api/predictions/route';

// Mock fetch for testing
global.fetch = vi.fn();

// Mock globalThis for D1 database simulation
const mockDB = {
  prepare: vi.fn(() => ({
    bind: vi.fn(() => ({
      run: vi.fn(() => ({ success: true })),
      all: vi.fn(() => ({ results: [] })),
      first: vi.fn(() => null)
    }))
  }))
};

// Test data
const testRaceData = {
  raceName: "Bahrain Grand Prix",
  raceDate: "2025-03-16",
  userSession: "test_session_123"
};

const createMockRequest = (method: string, body?: any, searchParams?: URLSearchParams) => {
  const url = searchParams 
    ? `http://localhost:3000/api/predictions?${searchParams.toString()}`
    : 'http://localhost:3000/api/predictions';
    
  return new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { 'Content-Type': 'application/json' } : undefined
  });
};

describe('Race Predictor API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset global DB mock
    (globalThis as any).DB = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/predictions - Vote Submission', () => {
    it('should successfully submit a YES vote with in-memory storage', async () => {
      const request = createMockRequest('POST', {
        ...testRaceData,
        prediction: true
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.userVote).toBe(true);
      expect(data.stats).toHaveProperty('totalVotes');
      expect(data.stats).toHaveProperty('yesVotes');
      expect(data.stats).toHaveProperty('noVotes');
      expect(data.stats).toHaveProperty('winProbability');
    });

    it('should successfully submit a NO vote with in-memory storage', async () => {
      const request = createMockRequest('POST', {
        ...testRaceData,
        prediction: false
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.userVote).toBe(false);
      expect(data.stats.totalVotes).toBeGreaterThanOrEqual(1);
    });

    it('should validate required fields', async () => {
      const request = createMockRequest('POST', {
        raceName: testRaceData.raceName,
        // Missing raceDate, prediction, userSession
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should handle vote updates (changing vote)', async () => {
      const userSession = 'update_test_session';
      
      // First vote: YES
      const firstRequest = createMockRequest('POST', {
        ...testRaceData,
        prediction: true,
        userSession
      });

      const firstResponse = await POST(firstRequest);
      const firstData = await firstResponse.json();

      expect(firstResponse.status).toBe(200);
      expect(firstData.userVote).toBe(true);

      // Second vote: NO (update)
      const secondRequest = createMockRequest('POST', {
        ...testRaceData,
        prediction: false,
        userSession
      });

      const secondResponse = await POST(secondRequest);
      const secondData = await secondResponse.json();

      expect(secondResponse.status).toBe(200);
      expect(secondData.userVote).toBe(false);
    });

    it('should work with D1 database when available', async () => {
      // Mock D1 database
      (globalThis as any).DB = mockDB;
      
      mockDB.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          run: vi.fn().mockResolvedValue({ success: true }),
          all: vi.fn().mockResolvedValue({ 
            results: [
              { prediction: 1, count: 3 },
              { prediction: 0, count: 2 }
            ]
          }),
          first: vi.fn().mockResolvedValue(null)
        })
      });

      const request = createMockRequest('POST', {
        ...testRaceData,
        prediction: true
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.stats.yesVotes).toBe(3);
      expect(data.stats.noVotes).toBe(2);
      expect(data.stats.totalVotes).toBe(5);
      expect(data.stats.winProbability).toBe(60); // 3/5 = 60%
    });
  });

  describe('GET /api/predictions - Statistics Retrieval', () => {
    it('should return statistics for a race', async () => {
      const searchParams = new URLSearchParams({
        raceName: testRaceData.raceName,
        raceDate: testRaceData.raceDate,
        userSession: testRaceData.userSession
      });

      const request = createMockRequest('GET', undefined, searchParams);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('stats');
      expect(data).toHaveProperty('userVote');
      expect(data.stats).toHaveProperty('totalVotes');
      expect(data.stats).toHaveProperty('yesVotes');
      expect(data.stats).toHaveProperty('noVotes');
      expect(data.stats).toHaveProperty('winProbability');
    });

    it('should validate required parameters', async () => {
      const searchParams = new URLSearchParams({
        raceName: testRaceData.raceName,
        // Missing raceDate
      });

      const request = createMockRequest('GET', undefined, searchParams);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing raceName or raceDate');
    });

    it('should return user vote when session provided', async () => {
      // First submit a vote
      const voteRequest = createMockRequest('POST', {
        ...testRaceData,
        prediction: true
      });
      await POST(voteRequest);

      // Then get stats
      const searchParams = new URLSearchParams({
        raceName: testRaceData.raceName,
        raceDate: testRaceData.raceDate,
        userSession: testRaceData.userSession
      });

      const statsRequest = createMockRequest('GET', undefined, searchParams);
      const response = await GET(statsRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.userVote).toBe(true);
    });

    it('should work with D1 database when available', async () => {
      // Mock D1 database
      (globalThis as any).DB = mockDB;
      
      mockDB.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          all: vi.fn().mockResolvedValue({ 
            results: [
              { prediction: 1, count: 7 },
              { prediction: 0, count: 3 }
            ]
          }),
          first: vi.fn().mockResolvedValue({ prediction: 1 })
        })
      });

      const searchParams = new URLSearchParams({
        raceName: testRaceData.raceName,
        raceDate: testRaceData.raceDate,
        userSession: testRaceData.userSession
      });

      const request = createMockRequest('GET', undefined, searchParams);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.stats.yesVotes).toBe(7);
      expect(data.stats.noVotes).toBe(3);
      expect(data.stats.totalVotes).toBe(10);
      expect(data.stats.winProbability).toBe(70); // 7/10 = 70%
      expect(data.userVote).toBe(true);
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate win probability correctly', async () => {
      const testCases = [
        { yes: 0, no: 0, expected: 50 }, // No votes = 50%
        { yes: 1, no: 0, expected: 100 }, // All yes = 100%
        { yes: 0, no: 1, expected: 0 }, // All no = 0%
        { yes: 3, no: 2, expected: 60 }, // 3/5 = 60%
        { yes: 7, no: 3, expected: 70 }, // 7/10 = 70%
        { yes: 1, no: 3, expected: 25 }, // 1/4 = 25%
      ];

      for (const testCase of testCases) {
        // Mock D1 to return specific vote counts
        (globalThis as any).DB = mockDB;
        
        const results = [];
        if (testCase.yes > 0) results.push({ prediction: 1, count: testCase.yes });
        if (testCase.no > 0) results.push({ prediction: 0, count: testCase.no });

        mockDB.prepare.mockReturnValue({
          bind: vi.fn().mockReturnValue({
            all: vi.fn().mockResolvedValue({ results }),
            first: vi.fn().mockResolvedValue(null)
          })
        });

        const searchParams = new URLSearchParams({
          raceName: testRaceData.raceName,
          raceDate: testRaceData.raceDate
        });

        const request = createMockRequest('GET', undefined, searchParams);
        const response = await GET(request);
        const data = await response.json();

        expect(data.stats.yesVotes).toBe(testCase.yes);
        expect(data.stats.noVotes).toBe(testCase.no);
        expect(data.stats.totalVotes).toBe(testCase.yes + testCase.no);
        expect(data.stats.winProbability).toBe(testCase.expected);
      }
    });
  });

  describe('Multiple Users Voting', () => {
    it('should handle multiple users voting on the same race', async () => {
      const users = [
        { session: 'user1', vote: true },
        { session: 'user2', vote: false },
        { session: 'user3', vote: true },
        { session: 'user4', vote: true },
        { session: 'user5', vote: false },
      ];

      // Submit votes from multiple users
      for (const user of users) {
        const request = createMockRequest('POST', {
          ...testRaceData,
          prediction: user.vote,
          userSession: user.session
        });

        const response = await POST(request);
        expect(response.status).toBe(200);
      }

      // Get final statistics
      const searchParams = new URLSearchParams({
        raceName: testRaceData.raceName,
        raceDate: testRaceData.raceDate
      });

      const statsRequest = createMockRequest('GET', undefined, searchParams);
      const response = await GET(statsRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.stats.totalVotes).toBe(5);
      expect(data.stats.yesVotes).toBe(3);
      expect(data.stats.noVotes).toBe(2);
      expect(data.stats.winProbability).toBe(60); // 3/5 = 60%
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON in POST request', async () => {
      const request = new NextRequest('http://localhost:3000/api/predictions', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });

    it('should handle database errors gracefully', async () => {
      // Mock D1 database with error
      (globalThis as any).DB = {
        prepare: vi.fn(() => ({
          bind: vi.fn(() => ({
            run: vi.fn(() => { throw new Error('Database error'); }),
            all: vi.fn(() => { throw new Error('Database error'); }),
            first: vi.fn(() => { throw new Error('Database error'); })
          }))
        }))
      };

      const request = createMockRequest('POST', {
        ...testRaceData,
        prediction: true
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });
  });
});
