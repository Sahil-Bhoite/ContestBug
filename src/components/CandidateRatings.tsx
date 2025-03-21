
import { useState, useEffect } from "react";
import { backendApi } from "@/lib/backend";
import { Contestbug } from "@/types/contestbug";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trophy, Award, Star, ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CandidateRating {
  id: string;
  name: string;
  username: string;
  platform: "Codeforces" | "LeetCode" | "CodeChef";
  rating: number;
  rank: string;
  contests: number;
  solved: number;
  avatar?: string;
}

interface CandidateRatingsProps {
  theme: "light" | "dark";
}

const CandidateRatings = ({ theme }: CandidateRatingsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const [candidateData, setCandidateData] = useState<CandidateRating[]>([]);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const usernames = ["CodeMaster2023", "AnotherUser"]; // Example usernames
        const userDataPromises = usernames.map(username => 
          backendApi.getUserStats("codeforces", username)
        );
        const userResults = await Promise.all(userDataPromises);
        const allUsers = userResults.map((user, index) => ({
          id: String(index + 1),
          name: user.handle,
          username: user.handle,
          platform: "Codeforces" as "Codeforces" | "LeetCode" | "CodeChef",
          rating: user.rating,
          rank: user.rank,
          contests: user.contestHistory.length,
          solved: user.submissionsCount,
        }));
        setCandidateData(allUsers);
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    };

    fetchCandidateData();
  }, []);

  // Filter candidates based on search query
  const filteredCandidates = candidateData.filter(candidate => 
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    candidate.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get platform-specific styling
  const getPlatformStyles = (platform: string) => {
    switch (platform) {
      case "Codeforces":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-600 dark:text-red-400",
          border: "border-red-200 dark:border-red-800/30",
          badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
        };
      case "LeetCode":
        return {
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-600 dark:text-amber-400", 
          border: "border-amber-200 dark:border-amber-800/30",
          badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
        };
      case "CodeChef":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-600 dark:text-green-400",
          border: "border-green-200 dark:border-green-800/30",
          badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
        };
      default:
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-800/30",
          badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
        };
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-emerald-500" />
              Top Performers
            </CardTitle>
            <CardDescription>
              Rankings of the best competitive programmers
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search candidates..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-transparent border-b">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent"
            >
              All Platforms
            </TabsTrigger>
            <TabsTrigger 
              value="codeforces"
              className="data-[state=active]:border-red-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent text-red-600"
            >
              Codeforces
            </TabsTrigger>
            <TabsTrigger 
              value="leetcode"
              className="data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent text-amber-600"
            >
              LeetCode
            </TabsTrigger>
            <TabsTrigger 
              value="codechef"
              className="data-[state=active]:border-green-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent text-green-600"
            >
              CodeChef
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="animate-in fade-in">
            <div className="space-y-4">
              {filteredCandidates.map(candidate => {
                const styles = getPlatformStyles(candidate.platform);
                return (
                  <div 
                    key={candidate.id} 
                    className={`p-4 rounded-lg border ${theme === "dark" ? "border-zinc-700 hover:bg-zinc-750" : "hover:bg-zinc-50"} transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-background ring-emerald-500/20">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback className={`${styles.bg} ${styles.text}`}>
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-muted-foreground">@{candidate.username}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 ml-0 md:ml-auto">
                        <Badge variant="outline" className={styles.badge} children={candidate.platform} />
                        
                        <div className="flex items-center gap-1.5 text-sm">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{candidate.rating}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-sm">
                          <Trophy className="h-4 w-4 text-emerald-500" />
                          <span className="font-medium">{candidate.rank}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-sm">
                          <Award className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">{candidate.solved} solved</span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`${styles.text} hover:${styles.bg}`}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="sr-only">View profile</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="codeforces" className="animate-in fade-in">
            <div className="space-y-4">
              {filteredCandidates
                .filter(c => c.platform === "Codeforces")
                .map(candidate => {
                  const styles = getPlatformStyles(candidate.platform);
                  return (
                    <div 
                      key={candidate.id} 
                      className={`p-4 rounded-lg border ${theme === "dark" ? "border-zinc-700 hover:bg-zinc-750" : "hover:bg-zinc-50"} transition-all duration-200 hover:shadow-md`}
                    >
                      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-background ring-emerald-500/20">
                            <AvatarImage src={candidate.avatar} />
                            <AvatarFallback className={`${styles.bg} ${styles.text}`}>
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-muted-foreground">@{candidate.username}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 ml-0 md:ml-auto">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{candidate.rating}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-sm">
                            <Trophy className="h-4 w-4 text-emerald-500" />
                            <span className="font-medium">{candidate.rank}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-sm">
                            <Award className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">{candidate.solved} solved</span>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${styles.text} hover:${styles.bg}`}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">View profile</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </TabsContent>
          
          <TabsContent value="leetcode" className="animate-in fade-in">
            <div className="space-y-4">
              {filteredCandidates
                .filter(c => c.platform === "LeetCode")
                .map(candidate => {
                  const styles = getPlatformStyles(candidate.platform);
                  return (
                    <div 
                      key={candidate.id} 
                      className={`p-4 rounded-lg border ${theme === "dark" ? "border-zinc-700 hover:bg-zinc-750" : "hover:bg-zinc-50"} transition-all duration-200 hover:shadow-md`}
                    >
                      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-background ring-emerald-500/20">
                            <AvatarImage src={candidate.avatar} />
                            <AvatarFallback className={`${styles.bg} ${styles.text}`}>
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-muted-foreground">@{candidate.username}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 ml-0 md:ml-auto">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{candidate.rating}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-sm">
                            <Trophy className="h-4 w-4 text-emerald-500" />
                            <span className="font-medium">{candidate.rank}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-sm">
                            <Award className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">{candidate.solved} solved</span>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${styles.text} hover:${styles.bg}`}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">View profile</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </TabsContent>
          
          <TabsContent value="codechef" className="animate-in fade-in">
            <div className="space-y-4">
              {filteredCandidates
                .filter(c => c.platform === "CodeChef")
                .map(candidate => {
                  const styles = getPlatformStyles(candidate.platform);
                  return (
                    <div 
                      key={candidate.id} 
                      className={`p-4 rounded-lg border ${theme === "dark" ? "border-zinc-700 hover:bg-zinc-750" : "hover:bg-zinc-50"} transition-all duration-200 hover:shadow-md`}
                    >
                      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-background ring-emerald-500/20">
                            <AvatarImage src={candidate.avatar} />
                            <AvatarFallback className={`${styles.bg} ${styles.text}`}>
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-muted-foreground">@{candidate.username}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 ml-0 md:ml-auto">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{candidate.rating}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-sm">
                            <Trophy className="h-4 w-4 text-emerald-500" />
                            <span className="font-medium">{candidate.rank}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-sm">
                            <Award className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">{candidate.solved} solved</span>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${styles.text} hover:${styles.bg}`}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">View profile</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CandidateRatings;
