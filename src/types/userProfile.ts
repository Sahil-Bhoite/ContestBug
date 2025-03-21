import { UserPlatform } from "../lib/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio: string;
  username: string;
  platforms: UserPlatform[];
  settings: {
    emailNotifications: boolean;
    contestReminders: boolean;
    darkMode: boolean;
    publicProfile: boolean;
  };
}
