
import axios, { AxiosError } from "axios";
import { UserProfile } from "../types/userProfile";

// Constants
const API_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://your-production-api-url.com"  // Change this to your actual production API URL
  : "http://localhost:4000";  

// Types
export interface Contestbug {
  platform: "Codeforces" | "LeetCode" | "CodeChef";
  name: string;
  startTimeUnix: number;
  startTime: string;
  duration: string;
  url: string;
  code?: string;
  endTime?: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  count?: number;
  data?: T;
  message?: string;
}

export interface CodeforcesUserData {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contribution: number;
  submissionsCount: number;
  contestHistory: Array<{
    contestId: number;
    contestName: string;
    rank: number;
    oldRating: number;
    newRating: number;
    ratingChange: number;
    timeSeconds: number;
  }>;
}

export interface LeetCodeUserData {
  username: string;
  ranking: number;
  reputation: number;
  starRating: number;
  totalSolved: number;
  totalSubmissions: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

const handleApiError = (error: unknown, context: string) => {
  console.error(`Error in ${context}:`, error);
  
  // Network or timeout error
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (!axiosError.response) {
      // Network error (server not reachable)
      console.error('Network error - server unreachable:', axiosError);
      throw new Error('Network Error');
    }
    
    // Server error with response
    if (axiosError.response) {
      const status = axiosError.response.status;
      
      // Specific status code handling
      if (status === 404) {
        throw new Error('Resource not found');
      } else if (status === 401 || status === 403) {
        throw new Error('Authentication error');
      } else if (status >= 500) {
        throw new Error('Server error - please try again later');
      }
      
      // If error has a message in the response data, use it
      if (axiosError.response.data && (axiosError.response.data as any).message) {
        throw new Error((axiosError.response.data as any).message);
      }
    }
  }
  
  // If we reach here, it's another type of error
  throw error;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


  // API client class
class BackendAPI {
  // Fetch rating data
  async getRatingData(platform: string): Promise<{ date: string; rating: number }[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ date: string; rating: number }[]>>(`/ratings/${platform}`);
      if (response.data.status === "success" && response.data.data) {
        return response.data.data;
      }
      throw new Error(`Failed to fetch rating data for ${platform}`);
    } catch (error) {
      return handleApiError(error, `fetching rating data for ${platform}`);
    }
  }
  // Fetch user profile data
  async getUserProfile(platform: "codeforces" | "leetcode", username: string): Promise<UserProfile> {
    try {
      const endpoint = platform === "codeforces" ? `/users/codeforces/${username}` : `/users/leetcode/${username}`;
      const response = await apiClient.get<ApiResponse<UserProfile>>(endpoint);
      if (response.data.status === "success" && response.data.data) {
        return response.data.data;
      }
      throw new Error(`Failed to fetch user profile for ${username} on ${platform}`);
    } catch (error) {
      return handleApiError(error, `fetching user profile for ${username} on ${platform}`);
    }
  }
  // Get all contests from all platforms
  async getAllContests(): Promise<Contestbug[]> {
    try {
      const response = await apiClient.get<ApiResponse<Contestbug[]>>('/contests');
      
      if (response.data.status === "success" && response.data.data) {
        return response.data.data;
      }
      
      return []; // Return empty array instead of throwing
    } catch (error) {
      console.error("Error fetching all contests:", error);
      
      // If the server is unavailable, return an empty array instead of throwing
      return [];
    }
  }

  // Get contests from a specific platform
  async getPlatformContests(platform: "codeforces" | "leetcode" | "codechef"): Promise<Contestbug[]> {
    try {
      const response = await apiClient.get<ApiResponse<Contestbug[]>>(`/contests/${platform}`);
      
      if (response.data.status === "success" && response.data.data) {
        return response.data.data;
      }
      
      return []; // Return empty array instead of throwing
    } catch (error) {
      console.error(`Error fetching ${platform} contests:`, error);
      
      // If the server is unavailable, return an empty array instead of throwing
      return [];
    }
  }

  // Get user statistics from Codeforces
  async getCodeforcesUser(username: string): Promise<CodeforcesUserData> {
    try {
      const response = await apiClient.get<ApiResponse<CodeforcesUserData>>(`/users/codeforces/${username}`);
      
      if (response.data.status === "success" && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(`Failed to fetch user stats for ${username} on Codeforces`);
    } catch (error) {
      return handleApiError(error, `fetching user stats for ${username} on Codeforces`);
    }
  }

  // Get user statistics from LeetCode
  async getLeetCodeUser(username: string): Promise<LeetCodeUserData> {
    try {
      const response = await apiClient.get<ApiResponse<LeetCodeUserData>>(`/users/leetcode/${username}`);
      
      if (response.data.status === "success" && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(`Failed to fetch user stats for ${username} on LeetCode`);
    } catch (error) {
      return handleApiError(error, `fetching user stats for ${username} on LeetCode`);
    }
  }

  // Generic method to get user statistics from any platform
  async getUserStats(platform: "codeforces" | "leetcode" | "codechef", username: string): Promise<CodeforcesUserData | LeetCodeUserData | unknown> {
    try {
      if (!username || username.trim() === '') {
        throw new Error("Username is required");
      }
      
      switch (platform) {
        case "codeforces":
          return await this.getCodeforcesUser(username);
        case "leetcode":
          return await this.getLeetCodeUser(username);
        case "codechef":
          return await this.getCodeChefUser(username);
        default:
          throw new Error(`Unknown platform: ${platform}`);
      }
    } catch (error) {
      return handleApiError(error, `fetching user stats for ${username} on ${platform}`);
    }
  }

  // Get user statistics from CodeChef
  async getCodeChefUser(username: string): Promise<unknown> {
    try {
      // Implement the API call to fetch CodeChef user data
      const response = await apiClient.get<ApiResponse<unknown>>(`/users/codechef/${username}`);
      
      if (response.data.status === "success" && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(`Failed to fetch user stats for ${username} on CodeChef`);
    } catch (error) {
      return handleApiError(error, `fetching user stats for ${username} on CodeChef`);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/');
      return response.status === 200;
    } catch (error) {
      console.error("API health check failed:", error);
      return false;
    }
  }
  
  // Set a different base URL for testing or other environments
  setBaseUrl(url: string) {
    apiClient.defaults.baseURL = url;
  }
}

// Create and export a singleton instance
export const backendApi = new BackendAPI();
