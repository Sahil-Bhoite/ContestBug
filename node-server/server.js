const express = require('express');
const axios = require('axios');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;

// Mock user database (in production, use a real database like MongoDB)
const users = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: 'your-secret-key', // Replace with a secure key in production
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = Array.from(users.values()).find((u) => u.id === id);
  done(null, user || null);
});

// Configure Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      let user = Array.from(users.values()).find((u) => u.googleId === profile.id);
      if (!user) {
        const newUser = {
          id: profile.id,
          username: `google_${profile.id}`,
          googleId: profile.id,
          platforms: {},
        };
        users.set(newUser.username, newUser);
        return done(null, newUser);
      }
      return done(null, user);
    }
  )
);

// Configure GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      let user = Array.from(users.values()).find((u) => u.githubId === profile.id);
      if (!user) {
        const newUser = {
          id: profile.id,
          username: `github_${profile.id}`,
          githubId: profile.id,
          platforms: {},
        };
        users.set(newUser.username, newUser);
        return done(null, newUser);
      }
      return done(null, user);
    }
  )
);

// OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Coding Contests API',
    endpoints: {
      '/contests': 'Get all active contests from Codeforces, LeetCode, and CodeChef',
      '/users/codeforces/:handle': 'Get user info from Codeforces',
      '/users/leetcode/:username': 'Get user info from LeetCode',
      '/users/codechef/:username': 'Get user info from CodeChef',
      '/profile': 'Get logged-in user profile (requires authentication)',
      '/connect-platforms': 'POST platform usernames (requires authentication)',
    },
  });
});

// Contest Fetching Functions
async function fetchCodeforcesContests() {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    if (response.data.status !== 'OK') throw new Error('Failed to fetch Codeforces contests');
    return response.data.result
      .filter((contest) => contest.phase === 'BEFORE')
      .map((contest) => ({
        platform: 'Codeforces',
        name: contest.name,
        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
        duration: `${Math.floor(contest.durationSeconds / 3600)}h ${(contest.durationSeconds % 3600) / 60}m`,
        url: `https://codeforces.com/contests/${contest.id}`,
      }));
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error.message);
    return [];
  }
}

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
      `,
    };
    const response = await axios.post('https://leetcode.com/graphql', graphqlQuery, {
      headers: { 'Content-Type': 'application/json' },
    });
    const now = Date.now();
    return response.data.data.allContests
      .filter((contest) => contest.startTime * 1000 > now)
      .map((contest) => ({
        platform: 'LeetCode',
        name: contest.title,
        startTime: new Date(contest.startTime * 1000).toISOString(),
        duration: `${Math.floor(contest.duration / 3600)}h ${(contest.duration % 3600) / 60}m`,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
      }));
  } catch (error) {
    console.error('Error fetching LeetCode contests:', error.message);
    return [];
  }
}

async function fetchCodechefContests() {
  try {
    const response = await axios.get('https://www.codechef.com/api/list/contests/all');
    if (!response.data.future_contests) throw new Error('Failed to fetch CodeChef contests');
    return response.data.future_contests.map((contest) => ({
      platform: 'CodeChef',
      name: contest.contest_name,
      startTime: new Date(contest.contest_start_date).toISOString(),
      duration: calculateDuration(contest.contest_start_date, contest.contest_end_date),
      url: `https://www.codechef.com/${contest.contest_code}`,
    }));
  } catch (error) {
    console.error('Error fetching CodeChef contests:', error.message);
    return [];
  }
}

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationSeconds = (end - start) / 1000;
  return `${Math.floor(durationSeconds / 3600)}h ${(durationSeconds % 3600) / 60}m`;
}

// Contests Endpoint
app.get('/contests', async (req, res) => {
  try {
    const [codeforces, leetcode, codechef] = await Promise.all([
      fetchCodeforcesContests(),
      fetchLeetcodeContests(),
      fetchCodechefContests(),
    ]);
    const allContests = [...codeforces, ...leetcode, ...codechef].sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );
    res.json({ status: 'success', count: allContests.length, data: allContests });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// User Profile Fetching Functions
async function fetchCodeforcesUser(handle) {
  try {
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    if (response.data.status !== 'OK') throw new Error('Failed to fetch Codeforces user');
    const userData = response.data.result[0];
    const contestHistory = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
    return {
      handle: userData.handle,
      rating: userData.rating || 0,
      maxRating: userData.maxRating || 0,
      rank: userData.rank || 'unrated',
      contestCount: contestHistory.data.result.length,
    };
  } catch (error) {
    console.error('Error fetching Codeforces user:', error.message);
    return null;
  }
}

async function fetchLeetcodeUser(username) {
  try {
    const graphqlQuery = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum { difficulty count }
            }
            profile { ranking }
          }
        }
      `,
      variables: { username },
    };
    const response = await axios.post('https://leetcode.com/graphql', graphqlQuery, {
      headers: { 'Content-Type': 'application/json' },
    });
    const user = response.data.data.matchedUser;
    if (!user) throw new Error('User not found');
    return {
      username: user.username,
      ranking: user.profile.ranking || 0,
      totalSolved: user.submitStats.acSubmissionNum[0].count || 0,
      easySolved: user.submitStats.acSubmissionNum[1].count || 0,
      mediumSolved: user.submitStats.acSubmissionNum[2].count || 0,
      hardSolved: user.submitStats.acSubmissionNum[3].count || 0,
    };
  } catch (error) {
    console.error('Error fetching LeetCode user:', error.message);
    return null;
  }
}

async function fetchCodechefUser(username) {
  try {
    // Note: CodeChef API requires authentication. This is a placeholder.
    // You’ll need to obtain an API token from CodeChef and adjust the endpoint.
    const response = await axios.get(`https://api.codechef.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.CODECHEF_API_TOKEN}`,
      },
    });
    if (response.data.status !== 'OK') throw new Error('Failed to fetch CodeChef user');
    const userData = response.data.result.data;
    return {
      username: userData.username,
      rating: userData.rating || 0,
      highestRating: userData.highest_rating || 0,
      country: userData.country || 'N/A',
    };
  } catch (error) {
    console.error('Error fetching CodeChef user:', error.message);
    return null;
  }
}

// User Profile Endpoints
app.get('/users/codeforces/:handle', async (req, res) => {
  const data = await fetchCodeforcesUser(req.params.handle);
  if (data) res.json({ status: 'success', data });
  else res.status(500).json({ status: 'error', message: 'Failed to fetch user data' });
});

app.get('/users/leetcode/:username', async (req, res) => {
  const data = await fetchLeetcodeUser(req.params.username);
  if (data) res.json({ status: 'success', data });
  else res.status(500).json({ status: 'error', message: 'Failed to fetch user data' });
});

app.get('/users/codechef/:username', async (req, res) => {
  const data = await fetchCodechefUser(req.params.username);
  if (data) res.json({ status: 'success', data });
  else res.status(500).json({ status: 'error', message: 'Failed to fetch user data' });
});

// Authentication Middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ status: 'error', message: 'Unauthorized' });
}

// Connect Platforms Endpoint
app.post('/connect-platforms', ensureAuthenticated, (req, res) => {
  const { codeforces, leetcode, codechef } = req.body;
  const user = users.get(req.user.username);
  user.platforms = {
    codeforces: codeforces || user.platforms.codeforces,
    leetcode: leetcode || user.platforms.leetcode,
    codechef: codechef || user.platforms.codechef,
  };
  users.set(req.user.username, user);
  res.json({ status: 'success', message: 'Platforms updated' });
});

// Profile Endpoint
app.get('/profile', ensureAuthenticated, async (req, res) => {
  const user = req.user;
  const platforms = user.platforms || {};

  // Fetch user profile data
  const profileData = {};
  if (platforms.codeforces) profileData.codeforces = await fetchCodeforcesUser(platforms.codeforces);
  if (platforms.leetcode) profileData.leetcode = await fetchLeetcodeUser(platforms.leetcode);
  if (platforms.codechef) profileData.codechef = await fetchCodechefUser(platforms.codechef);

  // Fetch contest data
  const [codeforcesContests, leetcodeContests, codechefContests] = await Promise.all([
    fetchCodeforcesContests(),
    fetchLeetcodeContests(),
    fetchCodechefContests(),
  ]);
  const allContests = [...codeforcesContests, ...leetcodeContests, ...codechefContests].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );
  const upcomingContests = allContests.slice(0, 5); // Top 5 upcoming contests
  const recentContests = []; // Placeholder: implement logic to fetch user’s recent contests if available

  res.json({
    status: 'success',
    data: {
      username: user.username,
      platformConnections: {
        codeforces: platforms.codeforces || 'Not connected',
        leetcode: platforms.leetcode || 'Not connected',
        codechef: platforms.codechef || 'Not connected',
      },
      profiles: profileData,
      upcomingContests,
      recentContests,
    },
  });
});

// Signup and Login (for local auth, optional with OAuth)
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (users.has(username)) {
    return res.status(400).json({ status: 'error', message: 'User already exists' });
  }
  const newUser = { id: Date.now().toString(), username, password, platforms: {} };
  users.set(username, newUser);
  res.json({ status: 'success', message: 'User registered' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.get(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
  }
  req.login(user, (err) => {
    if (err) return res.status(500).json({ status: 'error', message: err.message });
    res.json({ status: 'success', message: 'Login successful' });
  });
});

// Dashboard Redirect (placeholder)
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.json({ status: 'success', message: 'Welcome to your dashboard', user: req.user.username });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});