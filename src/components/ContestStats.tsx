
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Calendar, Clock, Medal, Trophy, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface ContestStatsProps {
  theme: "light" | "dark";
}

export const ContestStats = ({ theme }: ContestStatsProps) => {
  const [recentContests, setRecentContests] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      const contests = await api.getContests();
      // Assuming contests are sorted by date, split them into recent and upcoming
      const now = new Date();
      const recent = contests.filter(contest => new Date(contest.startTime) < now);
      const upcoming = contests.filter(contest => new Date(contest.startTime) >= now);
      setRecentContests(recent);
      setUpcomingContests(upcoming);
    };

    fetchContests();
  }, []);
  
  // Get platform badge style
  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "Codeforces":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "LeetCode":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "CodeChef":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };
  
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-emerald-500" />
          Contest Activity
        </CardTitle>
        <CardDescription>
          Track your recent and upcoming contest participation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="recent">Recent Contests</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Contests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="animate-in fade-in">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contest</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Solved</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentContests.map((contest) => (
                    <TableRow key={contest.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 transition-colors">
                      <TableCell className="font-medium">{contest.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPlatformBadge(contest.platform)}`}>
                          {contest.platform}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(contest.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{contest.rank}</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">/ {contest.total}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{contest.solved}</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">/ {contest.total_problems}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="animate-in fade-in">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contest</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingContests.map((contest) => (
                    <TableRow key={contest.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 transition-colors">
                      <TableCell className="font-medium">{contest.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPlatformBadge(contest.platform)}`}>
                          {contest.platform}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(contest.date).toLocaleDateString()}</TableCell>
                      <TableCell>{contest.time}</TableCell>
                      <TableCell>{contest.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
