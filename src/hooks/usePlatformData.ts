
import { useState, useEffect } from 'react';
import { backendApi } from '@/lib/backend';
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
        
        const userData = await backendApi.getUserStats(platform, username);
        
        if (platform === 'codeforces') {
          // Process Codeforces data
          const ratingHistory = userData.contestHistory
            ? userData.contestHistory.map((contestbug: any) => ({
                contestName: contestbug.contestName,
                rating: contestbug.newRating,
                date: new Date(contestbug.timeSeconds * 1000).toISOString(),
                change: contestbug.ratingChange
              }))
            : [];
            
          ratingHistory.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          let bestRank = Number.MAX_VALUE;
          userData.contestHistory?.forEach((contestbug: any) => {
            if (contestbug.rank < bestRank) bestRank = contestbug.rank;
          });
          
          setData({
            platform,
            username: userData.handle,
            rating: userData.rating || 0,
            rank: userData.rank || 'Unrated',
            solved: userData.submissionsCount || 0,
            totalContests: userData.contestHistory?.length || 0,
            bestRank: bestRank === Number.MAX_VALUE ? undefined : bestRank,
            ratingHistory,
            isLoading: false,
            error: null
          });
        } else if (platform === 'leetcode') {
          // Process LeetCode data
          setData({
            platform,
            username: userData.username,
            rating: userData.starRating || 0,
            rank: userData.ranking ? `Rank ${userData.ranking}` : 'Unrated',
            solved: userData.totalSolved || 0,
            totalContests: 0, // LeetCode API doesn't provide contest count
            isLoading: false,
            error: null
          });
        } else {
          throw new Error(`Platform ${platform} not supported yet`);
        }
      } catch (error) {
        console.error(`Error fetching ${platform} data for ${username}:`, error);
        let errorMessage = 'Failed to load data';
        
        // Handle network errors more gracefully
        if (error instanceof Error) {
          if (error.message.includes('Network Error')) {
            errorMessage = 'Network error - Are you connected to the internet? Is the server running?';
          } else {
            errorMessage = error.message;
          }
        }
        
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));
        
        // Don't show toast for network errors to avoid flooding the user
        if (!error.toString().includes('Network Error')) {
          toast.error(`Failed to load ${platform} data: ${errorMessage}`);
        }
      }
    };

    fetchData();
  }, [platform, username]);

  return data;
};
