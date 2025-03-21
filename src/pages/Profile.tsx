
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Code2, Coffee, FileCode, LineChart, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/components/ThemeProvider";
import { ContestStats } from "@/components/ContestStats";
import { RatingChart } from "@/components/RatingChart";
import { PlatformConnector } from "@/components/PlatformConnector";
import { toast } from "sonner";
import { usePlatformData } from '@/hooks/usePlatformData';
import { api } from "@/lib/api";

const Profile = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  
  // Get data for connected platforms from the API
  const codeforcesData = usePlatformData('codeforces', userProfile?.platforms?.find(p => p.platform === "Codeforces")?.username || '');
  const leetcodeData = usePlatformData('leetcode', userProfile?.platforms?.find(p => p.platform === "LeetCode")?.username || '');
  const codechefData = usePlatformData('codechef', userProfile?.platforms?.find(p => p.platform === "CodeChef")?.username || '');
  
  // Load user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const profileData = await api.getUserProfile();
        setUserProfile(profileData);
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  // Transform Codeforces rating history for the chart
  const ratingChartData = codeforcesData.ratingHistory?.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short' }),
    rating: entry.rating
  })) || [];
  
  // Combine platform data
  const platformsData = [
    {
      platform: "Codeforces",
      username: codeforcesData.username || userProfile?.platforms?.find(p => p.platform === "Codeforces")?.username,
      rating: codeforcesData.rating || 0,
      rank: codeforcesData.rank || 'Unrated',
      contests: codeforcesData.totalContests || 0,
      solved: codeforcesData.solved || 0,
      connected: !codeforcesData.error && codeforcesData.username !== '',
    },
    {
      platform: "LeetCode",
      username: leetcodeData.username || userProfile?.platforms?.find(p => p.platform === "LeetCode")?.username,
      rating: leetcodeData.rating || 0,
      rank: leetcodeData.rank || 'Unrated',
      contests: leetcodeData.totalContests || 0,
      solved: leetcodeData.solved || 0,
      connected: !leetcodeData.error && leetcodeData.username !== '',
    },
    {
      platform: "CodeChef",
      username: codechefData.username || userProfile?.platforms?.find(p => p.platform === "CodeChef")?.username,
      rating: codechefData.rating || 0,
      rank: codechefData.rank || 'Unrated',
      contests: codechefData.totalContests || 0,
      solved: codechefData.solved || 0,
      connected: !codechefData.error && codechefData.username !== '',
    }
  ];

  if (isLoading) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <p>Loading profile data...</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="flex-1">
      <header className={`border-b ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"} p-4 sticky top-0 z-10 backdrop-blur-sm bg-background/80`}>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">My Profile</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className={`overflow-hidden ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
                <div className={`p-6 border-b ${theme === "dark" ? "border-zinc-700" : "border-zinc-200"}`}>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-3">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback>{userProfile?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{userProfile?.name || "User"}</h2>
                    <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                      @{userProfile?.username || "username"}
                    </p>
                    <p className="mt-3 text-sm">{userProfile?.bio || "No bio provided"}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-medium mb-3">Platform Ratings</h3>
                  <div className="space-y-4">
                    {platformsData.map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PlatformIcon platform={platform.platform} />
                          <div>
                            <p className="text-sm font-medium">{platform.platform}</p>
                            <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                              {platform.connected ? platform.username : "Not connected"}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getBadgeVariant(platform.platform)} className="font-medium">
                          {platform.connected ? `${platform.rating} (${platform.rank})` : "N/A"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start mb-6 bg-transparent border-b">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ratings" 
                    className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent"
                  >
                    Ratings & History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="connections" 
                    className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent"
                  >
                    Platform Connections
                  </TabsTrigger>
                  <TabsTrigger 
                    value="achievements" 
                    className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent"
                  >
                    Achievements
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-0">
                  <div className="space-y-6">
                    <ContestStats theme={theme} />
                    <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <LineChart className="h-5 w-5 text-blue-500" />
                          Recent Progress
                        </CardTitle>
                        <CardDescription>
                          Your performance across platforms in the past 30 days
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {platformsData.map((platform) => (
                            <div key={platform.platform}>
                              <div className="flex justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <PlatformIcon platform={platform.platform} size={16} />
                                  <p className="text-sm font-medium">{platform.platform}</p>
                                </div>
                                <p className="text-sm font-medium">
                                  {platform.connected ? `${platform.solved} problems solved` : "Not connected"}
                                </p>
                              </div>
                              <Progress 
                                value={platform.connected ? (platform.solved / 100) * 100 : 0} 
                                className={`h-2 ${getPlatformProgressColor(platform.platform)}`} 
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="ratings" className="mt-0">
                  <Card className={`transition-all duration-200 ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
                    <CardHeader>
                      <CardTitle>Rating History</CardTitle>
                      <CardDescription>
                        Your competitive programming rating over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {codeforcesData.isLoading ? (
                        <div className="flex justify-center items-center h-64">
                          <p>Loading rating data...</p>
                        </div>
                      ) : codeforcesData.error ? (
                        <div className="flex justify-center items-center h-64 text-center">
                          <div>
                            <p className="mb-2">Failed to load rating data: {codeforcesData.error}</p>
                            <p className="text-sm text-muted-foreground">
                              Connect your Codeforces account in the Platform Connections tab to see your rating history.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <RatingChart 
                          data={ratingChartData}
                          currentRating={codeforcesData.rating}
                          tier={codeforcesData.rank}
                          theme={theme}
                          platform="Codeforces"
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="connections" className="mt-0">
                  <PlatformConnector theme={theme} />
                </TabsContent>
                
                <TabsContent value="achievements" className="mt-0">
                  <Card className={`h-96 flex items-center justify-center ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
                    <div className="text-center p-6">
                      <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">Achievements Coming Soon</h3>
                      <p className={`max-w-md ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                        We're working on tracking your achievements across competitive programming platforms.
                        Check back soon!
                      </p>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

function getBadgeVariant(platform: string): "default" | "outline" | "secondary" | "destructive" {
  switch (platform) {
    case "Codeforces": return "destructive";
    case "LeetCode": return "default";
    case "CodeChef": return "secondary";
    default: return "outline";
  }
}

function getPlatformProgressColor(platform: string): string {
  switch (platform) {
    case "Codeforces": return "bg-red-500";
    case "LeetCode": return "bg-yellow-500";
    case "CodeChef": return "bg-green-500";
    default: return "bg-blue-500";
  }
}

function PlatformIcon({ platform, size = 20 }: { platform: string, size?: number }) {
  switch (platform) {
    case "Codeforces":
      return <Code2 className="text-red-500" style={{ width: size, height: size }} />;
    case "LeetCode":
      return <FileCode className="text-yellow-500" style={{ width: size, height: size }} />;
    case "CodeChef":
      return <Coffee className="text-green-500" style={{ width: size, height: size }} />;
    default:
      return <Code className="text-blue-500" style={{ width: size, height: size }} />;
  }
}

export default Profile;
