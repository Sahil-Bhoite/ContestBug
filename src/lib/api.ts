
import { toast } from "sonner";
import { backendApi } from "./backend";

  // Type definitions for contestbug and user data
export interface Contestbug {
  id: string;
  name: string;
  platform: "Codeforces" | "LeetCode" | "CodeChef";
  startTime: string;
  duration: string;
  url: string;
}

export interface UserPlatform {
  platform: "Codeforces" | "LeetCode" | "CodeChef";
  username: string;
  rating: number;
  rank?: string;
  contests: number;
  solved: number;
  connected: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  platforms: UserPlatform[];
  settings: {
    emailNotifications: boolean;
    contestReminders: boolean;
    darkMode: boolean;
    publicProfile: boolean;
  };
}

// Simulated API endpoint handlers
class APIClient {

  // Simulate network delay
  private async delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // API methods
  async getContests(): Promise<Contestbug[]> {
    try {
      // Try to get contests from the backend
      const backendContests = await backendApi.getAllContests();
      
      if (backendContests.length > 0) {
        // Map backend contests to our format
        return backendContests.map(contest => ({
          id: `${contest.platform}-${Date.now()}`,
          name: contest.name,
          platform: contest.platform,
          startTime: contest.startTime,
          duration: contest.duration,
          url: contest.url,
        }));
      }
    } catch (error) {
      console.error("Error fetching contests from backend:", error);
      // Don't show toast here, as it's distracting on initial load
      // Just use fallback data silently
    }
    return []; // Return an empty array if no contests are fetched
  }

  async getUserProfile(): Promise<UserProfile> {
    // Simulate fetching user profile data
    await this.delay();
    // Fetch user profile data from backend
    const response = await backendApi.getUserProfile();
    return response;
  }

  async connectPlatform(platform: string, username: string): Promise<boolean> {
    // Simulate connecting a platform
    await this.delay();
    return true;
  }

  async disconnectPlatform(platform: string): Promise<boolean> {
    // Simulate disconnecting a platform
    await this.delay();
    return true;
  }

  async updateUserSettings(settings: { publicProfile: boolean; contestReminders: boolean }): Promise<boolean> {
    // Simulate updating user settings
    await this.delay();
    return true;
  }

  async getRatingData(platform: string): Promise<{ date: string; rating: number }[]> {
    // Simulate fetching rating data
    await this.delay();
    // Fetch rating data from backend
    const response = await backendApi.getRatingData(platform);
    return response;
  }
}

// Create singleton instance
export const api = new APIClient();
