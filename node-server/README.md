
# ContestBug API Server

This is the backend API server for ContestBug, providing real-time data about competitive programming contests from Codeforces, LeetCode, and CodeChef.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Navigate to the server directory:
```
cd node-server
```

2. Install dependencies:
```
npm install
```

3. Start the server:
```
npm start
```

The server will start on port 4000 by default. You can change this by setting the PORT environment variable.

## API Endpoints

- `GET /` - API information and available endpoints
- `GET /contests` - Get all active contests from all platforms
- `GET /contests/codeforces` - Get active Codeforces contests
- `GET /contests/leetcode` - Get active LeetCode contests
- `GET /contests/codechef` - Get active CodeChef contests
- `GET /users/codeforces/:handle` - Get user information from Codeforces

## Response Format

All endpoints return data in the following format:

```json
{
  "status": "success",
  "count": 10,
  "data": [
    // Array of items or single object
  ]
}
```

Or in case of an error:

```json
{
  "status": "error",
  "message": "Error description"
}
```

## Running in Production

For production deployment, you should:

1. Set appropriate CORS settings in the server.js file
2. Use a process manager like PM2 to run the server
3. Set up SSL if you're exposing this API directly

Example PM2 start command:
```
pm2 start server.js --name contest-api
```
