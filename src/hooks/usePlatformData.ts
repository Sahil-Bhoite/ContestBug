import { useState, useEffect } from 'react';
import { backendApi, CodeforcesUserData, LeetCodeUserData } from '@/lib/backend';
import { toast } from 'sonner';

export interface PlatformData {
  platform: 'codeforces' | 'leetcode' | 'codechef';
  username: string;
  rating: number;
  rank: string;
  solved: number;
  totalContests: number;
  bestRank?: number;
  ratingHistory?: Array<{
    contestName?: string;
    rating: number;
    date: string;
    change?: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

const defaultPlatformData: Record<string, PlatformData> = {
  codeforces: {
    platform: 'codeforces',
    username: '',
    rating: 0,
    rank: 'Unrated',
    solved: 0,
    totalContests: 0,
    isLoading: false,
    error: null
  },
  leetcode: {
    platform: 'leetcode',
    username: '',
    rating: 0,
    rank: 'Unrated',
    solved: 0,
    totalContests: 0,
    isLoading: false,
    error: null
  },
  codechef: {
    platform: 'codechef',
    username: '',
    rating: 0,
    rank: 'Unrated',
    solved: 0,
    totalContests: 0,
    isLoading: false,
    error: null
  }
};

export const usePlatformData = (platform: 'codeforces' | 'leetcode' | 'codechef', username: string) => {
  const [data, setData] = useState<PlatformData>({
    ...defaultPlatformData[platform],
    username,
    isLoading: Boolean(username),
    error: username ? null : 'No username provided',
  });

  useEffect(() => {
    if (!username) {
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'No username provided'
      }));
      return;
    }

    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));
        
        const userData = await backendApi.getUserStats(platform, username) as CodeforcesUserData | LeetCodeUserData | { username: string; rating: number; rank: string; solved: number; totalContests: number; };

        const isCodeforcesUserData = (data: any): data is CodeforcesUserData => 'handle' in data;
        const isLeetCodeUserData = (data: any): data is LeetCodeUserData => 'username' in data && 'starRating' in data;
        const isCodeChefUserData = (data: any): data is { username: string; rating: number; rank: string; solved: number; totalContests: number; } => 'username' in data && 'rating' in data;

        if (platform === 'codeforces' && isCodeforcesUserData(userData)) {
          const ratingHistory = userData.contestHistory
            ? userData.contestHistory.map((contest: { contestName: string; newRating: number; timeSeconds: number; ratingChange: number; rank: number; }) => ({
                contestName: contest.contestName,
                rating: contest.newRating,
                date: new Date(contest.timeSeconds * 1000).toISOString(),
                change: contest.ratingChange
              }))
            : [];
          
          ratingHistory.sort((a: { date: string; }, b: { date: string; }) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          let bestRank = Number.MAX_VALUE;
          userData.contestHistory?.forEach((contest: any) => {
            if (contest.rank < bestRank) bestRank = contest.rank;
          });
          
          setData({
            platform,
            username: userData.handle || username,
            rating: userData.rating || 0,
            rank: userData.rank || 'Unrated',
            solved: userData.submissionsCount || 0, // Note: Should be solved problems, adjust backend if needed
            totalContests: userData.contestHistory?.length || 0,
            bestRank: bestRank === Number.MAX_VALUE ? undefined : bestRank,
            ratingHistory,
            isLoading: false,
            error: null
          });
        } else if (platform === 'leetcode' && isLeetCodeUserData(userData)) {
          setData({
            platform,
            username: userData.username || username,
            rating: userData.starRating || 0, // Adjust if backend uses different field
            rank: userData.ranking ? `Rank ${userData.ranking}` : 'Unrated',
            solved: userData.totalSolved || 0,
            totalContests: 0,
            isLoading: false,
            error: null
          });
        } else if (platform === 'codechef' && isCodeChefUserData(userData)) {
          setData({
            platform,
            username: userData.username || username,
            rating: userData.rating || 0,
            rank: userData.rank || 'Unrated',
            solved: userData.solved || 0,
            totalContests: userData.totalContests || 0,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error(`Error fetching ${platform} data for ${username}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
        
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));
        
        if (!errorMessage.includes('Network Error')) {
          toast.error(`Failed to load ${platform} data: ${errorMessage}`);
        }
      }
    };

    fetchData();
  }, [platform, username]);

  return data;
};
