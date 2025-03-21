
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS
app.use(cors());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Coding Contests API',
    endpoints: {
      '/contests': 'Get all active contests from Codeforces, LeetCode, and CodeChef',
      '/contests/codeforces': 'Get active Codeforces contests',
      '/contests/leetcode': 'Get active LeetCode contests',
      '/contests/codechef': 'Get active CodeChef contests',
      '/users/codeforces/:handle': 'Get user information from Codeforces'
    }
  });
});

// Helper function to fetch Codeforces contests
async function fetchCodeforcesContests() {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch Codeforces contests');
    }
    
    // Filter only active contests (phase === "BEFORE")
    const activeContests = response.data.result
      .filter(contest => contest.phase === 'BEFORE')
      .map(contest => ({
        platform: 'Codeforces',
        name: contest.name,
        startTimeUnix: contest.startTimeSeconds,
        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
        durationSeconds: contest.durationSeconds,
        duration: `${Math.floor(contest.durationSeconds / 3600)} hours ${(contest.durationSeconds % 3600) / 60} minutes`,
        url: `https://codeforces.com/contests/${contest.id}`,
        rating: Math.floor(Math.random() * 1000) + 1000, // Mock rating
        rank: "Expert", // Mock rank
        contests: Math.floor(Math.random() * 100), // Mock contests count
        solved: Math.floor(Math.random() * 500) // Mock solved problems
      }));
    
    return activeContests;
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error.message);
    return [];
  }
}

// Helper function to fetch LeetCode contests
async function fetchLeetcodeContests() {
  try {
    const graphqlQuery = {
      query: `
        query getContestList {
          allContests {
            title
            startTime
            duration
            titleSlug
          }
        }
      `
    };
    
    const response = await axios.post('https://leetcode.com/graphql', graphqlQuery, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const allContests = response.data.data.allContests;
    const now = Date.now();
    
    // Filter only active contests (start time is in the future)
    const activeContests = allContests
      .filter(contest => contest.startTime * 1000 > now)
      .map(contest => ({
        platform: 'LeetCode',
        name: contest.title,
        startTimeUnix: contest.startTime,
        startTime: new Date(contest.startTime * 1000).toISOString(),
        durationSeconds: contest.duration,
        duration: `${Math.floor(contest.duration / 3600)} hours ${(contest.duration % 3600) / 60} minutes`,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
        rating: Math.floor(Math.random() * 1000) + 1000, // Mock rating
        rank: "Guardian", // Mock rank
        contests: Math.floor(Math.random() * 100), // Mock contests count
        solved: Math.floor(Math.random() * 500) // Mock solved problems
      }));
    
    return activeContests;
  } catch (error) {
    console.error('Error fetching LeetCode contests:', error.message);
    return [];
  }
}

// Helper function to fetch CodeChef contests
async function fetchCodechefContests() {
  try {
    const response = await axios.get('https://www.codechef.com/api/list/contests/all');
    
    if (!response.data || !response.data.future_contests) {
      throw new Error('Failed to fetch CodeChef contests');
    }
    
    const activeContests = response.data.future_contests.map(contest => ({
      platform: 'CodeChef',
      name: contest.contest_name,
      code: contest.contest_code,
      startTimeUnix: Math.floor(new Date(contest.contest_start_date).getTime() / 1000),
      startTime: new Date(contest.contest_start_date).toISOString(),
      endTime: new Date(contest.contest_end_date).toISOString(),
      duration: calculateDuration(contest.contest_start_date, contest.contest_end_date),
      url: `https://www.codechef.com/${contest.contest_code}`,
      rating: Math.floor(Math.random() * 1000) + 1000, // Mock rating
      rank: "6★", // Mock rank
      contests: Math.floor(Math.random() * 100), // Mock contests count
      solved: Math.floor(Math.random() * 500) // Mock solved problems
    }));
    
    return activeContests;
  } catch (error) {
    console.error('Error fetching CodeChef contests:', error.message);
    return [];
  }
}

// Helper function to calculate duration between two dates
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationSeconds = Math.floor((end - start) / 1000);
  
  return `${Math.floor(durationSeconds / 3600)} hours ${(durationSeconds % 3600) / 60} minutes`;
}

// Endpoint to get all active contests
app.get('/contests', async (req, res) => {
  try {
    const [codeforces, leetcode, codechef] = await Promise.all([
      fetchCodeforcesContests(),
      fetchLeetcodeContests(),
      fetchCodechefContests()
    ]);
    
    const allContests = [...codeforces, ...leetcode, ...codechef].sort((a, b) => a.startTimeUnix - b.startTimeUnix);
    
    res.json({
      status: 'success',
      count: allContests.length,
      data: allContests
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Platform-specific contest endpoints
app.get('/contests/codeforces', async (req, res) => {
  try {
    const contests = await fetchCodeforcesContests();
    
    res.json({
      status: 'success',
      count: contests.length,
      data: contests
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.get('/contests/leetcode', async (req, res) => {
  try {
    const contests = await fetchLeetcodeContests();
    
    res.json({
      status: 'success',
      count: contests.length,
      data: contests
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.get('/contests/codechef', async (req, res) => {
  try {
    const contests = await fetchCodechefContests();
    
    res.json({
      status: 'success',
      count: contests.length,
      data: contests
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// New endpoint to get user data from Codeforces
app.get('/users/codeforces/:handle', async (req, res) => {
  try {
    const handle = req.params.handle;
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch Codeforces user info');
    }
    
    const userData = response.data.result[0];
    
    // Get user's contest history
    const contestHistoryResponse = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const contestHistory = contestHistoryResponse.data.result || [];
    
    // Get the user's submissions count
    const submissionsResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1`);
    const submissionsCount = submissionsResponse.data.result ? submissionsResponse.data.result.length : 0;
    
    res.json({
      status: 'success',
      data: {
        handle: userData.handle,
        rating: userData.rating || 0,
        maxRating: userData.maxRating || 0,
        rank: userData.rank || 'unrated',
        maxRank: userData.maxRank || 'unrated',
        contribution: userData.contribution || 0,
        registrationTimeSeconds: userData.registrationTimeSeconds,
        lastOnlineTimeSeconds: userData.lastOnlineTimeSeconds,
        friendOfCount: userData.friendOfCount || 0,
        titlePhoto: userData.titlePhoto,
        submissionsCount: submissionsCount,
        contestHistory: contestHistory.map(contest => ({
          contestId: contest.contestId,
          contestName: contest.contestName,
          rank: contest.rank,
          oldRating: contest.oldRating,
          newRating: contest.newRating,
          ratingChange: contest.newRating - contest.oldRating,
          timeSeconds: contest.ratingUpdateTimeSeconds
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching Codeforces user info:', error.message);
    res.status(500).json({
      status: 'error',
      message: `Failed to fetch data for ${req.params.handle}: ${error.message}`
    });
  }
});

// New endpoint to get LeetCode user data
app.get('/users/leetcode/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const graphqlQuery = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            profile {
              reputation
              ranking
              starRating
            }
          }
        }
      `,
      variables: { username }
    };
    
    const response = await axios.post('https://leetcode.com/graphql', graphqlQuery, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data.data.matchedUser) {
      throw new Error('User not found');
    }
    
    const user = response.data.data.matchedUser;
    
    res.json({
      status: 'success',
      data: {
        username: user.username,
        ranking: user.profile.ranking || 0,
        reputation: user.profile.reputation || 0,
        starRating: user.profile.starRating || 0,
        totalSolved: user.submitStats?.acSubmissionNum?.[0]?.count || 0,
        totalSubmissions: user.submitStats?.acSubmissionNum?.[0]?.submissions || 0,
        easySolved: user.submitStats?.acSubmissionNum?.[1]?.count || 0,
        mediumSolved: user.submitStats?.acSubmissionNum?.[2]?.count || 0,
        hardSolved: user.submitStats?.acSubmissionNum?.[3]?.count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching LeetCode user info:', error.message);
    res.status(500).json({
      status: 'error',
      message: `Failed to fetch data for ${req.params.username}: ${error.message}`
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
