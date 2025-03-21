export interface Contestbug {
  platform: "Codeforces" | "LeetCode" | "CodeChef";
  name: string;
  startTimeUnix: number;
  startTime: string;
  duration: string;
  url: string;
  code?: string;
  endTime?: string;
  username: string;
  rating: number;
  rank: string;
  contests: number;
  solved: number;
}
