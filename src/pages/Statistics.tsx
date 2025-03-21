
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ContestStats } from "@/components/ContestStats";
import { RatingChart } from "@/components/RatingChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Moon, Sun, Activity, Award, Link2Off, LogIn, CheckCircle2 } from "lucide-react";
import { api, UserPlatform } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";

const Statistics = () => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState("User Name");
  const [platforms, setPlatforms] = useState<UserPlatform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form fields
  const [codeforcesUsername, setCodeforcesUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [codechefUsername, setCodechefUsername] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const userProfile = await api.getUserProfile();
        setName(userProfile.name);
        setPlatforms(userProfile.platforms);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [toast]);

  const connectPlatform = async (platform: "Codeforces" | "LeetCode" | "CodeChef", username: string) => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: `Please enter your ${platform} username.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = await api.connectPlatform(platform, username);
      
      if (success) {
        // Refresh user data
        const userProfile = await api.getUserProfile();
        setPlatforms(userProfile.platforms);
        
        // Clear the input field
        switch (platform) {
          case "Codeforces":
            setCodeforcesUsername("");
            break;
          case "LeetCode":
            setLeetcodeUsername("");
            break;
          case "CodeChef":
            setCodechefUsername("");
            break;
        }
      }
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect your ${platform} account. Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  const disconnectPlatform = async (platform: "Codeforces" | "LeetCode" | "CodeChef") => {
    try {
      const success = await api.disconnectPlatform(platform);
      
      if (success) {
        // Refresh user data
        const userProfile = await api.getUserProfile();
        setPlatforms(userProfile.platforms);
      }
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
      toast({
        title: "Disconnection Failed",
        description: `Failed to disconnect your ${platform} account. Please try again.`,
        variant: "destructive",
      });
    }
  };

  // Prepare data for the rating chart based on the platform
  const getRatingDataForPlatform = async (platform: string) => {
    try {
      const ratingData = await api.getRatingData(platform);
      return ratingData;
    } catch (error) {
      console.error(`Error fetching rating data for ${platform}:`, error);
      toast({
        title: "Error",
        description: `Failed to load rating data for ${platform}`,
        variant: "destructive",
      });
      return [];
    }
  };

  // Get the platform object by name
  const getPlatform = (platformName: "Codeforces" | "LeetCode" | "CodeChef") => {
    return platforms.find(p => p.platform === platformName);
  };

  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      <header className={`border-b ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"} p-4 sticky top-0 z-10 backdrop-blur-sm bg-background/80`}>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">Statistics</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <div className="p-6 flex-1">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "border-zinc-200 bg-white shadow-sm"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" />
                Connect Platforms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Codeforces */}
              <div className={`p-4 rounded-lg border transition-all ${theme === "dark" ? "bg-zinc-700/50 border-zinc-600" : "bg-white border-zinc-200"}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Award className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Codeforces</h3>
                      <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                        Connect your Codeforces account
                      </p>
                    </div>
                  </div>
                  {getPlatform("Codeforces")?.connected && (
                    <div className="flex items-center text-emerald-500 text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Connected
                    </div>
                  )}
                </div>
                
                {getPlatform("Codeforces")?.connected ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`}>
                        {getPlatform("Codeforces")?.username}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => disconnectPlatform("Codeforces")}
                      className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30"
                    >
                      <Link2Off className="h-4 w-4 mr-1" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input 
                        placeholder="Your Codeforces username" 
                        value={codeforcesUsername}
                        onChange={(e) => setCodeforcesUsername(e.target.value)}
                        className={theme === "dark" ? "bg-zinc-700 border-zinc-600" : ""}
                      />
                    </div>
                    <Button 
                      onClick={() => connectPlatform("Codeforces", codeforcesUsername)}
                      className="whitespace-nowrap bg-red-600 hover:bg-red-700"
                    >
                      <LogIn className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  </div>
                )}
              </div>
              
              {/* LeetCode */}
              <div className={`p-4 rounded-lg border transition-all ${theme === "dark" ? "bg-zinc-700/50 border-zinc-600" : "bg-white border-zinc-200"}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Award className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">LeetCode</h3>
                      <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                        Connect your LeetCode account
                      </p>
                    </div>
                  </div>
                  {getPlatform("LeetCode")?.connected && (
                    <div className="flex items-center text-emerald-500 text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Connected
                    </div>
                  )}
                </div>
                
                {getPlatform("LeetCode")?.connected ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`}>
                        {getPlatform("LeetCode")?.username}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => disconnectPlatform("LeetCode")}
                      className="text-yellow-500 border-yellow-200 hover:bg-yellow-50 dark:border-yellow-800 dark:hover:bg-yellow-900/30"
                    >
                      <Link2Off className="h-4 w-4 mr-1" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input 
                        placeholder="Your LeetCode username" 
                        value={leetcodeUsername}
                        onChange={(e) => setLeetcodeUsername(e.target.value)}
                        className={theme === "dark" ? "bg-zinc-700 border-zinc-600" : ""}
                      />
                    </div>
                    <Button 
                      onClick={() => connectPlatform("LeetCode", leetcodeUsername)}
                      className="whitespace-nowrap bg-yellow-600 hover:bg-yellow-700"
                    >
                      <LogIn className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  </div>
                )}
              </div>
              
              {/* CodeChef */}
              <div className={`p-4 rounded-lg border transition-all ${theme === "dark" ? "bg-zinc-700/50 border-zinc-600" : "bg-white border-zinc-200"}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Award className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">CodeChef</h3>
                      <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                        Connect your CodeChef account
                      </p>
                    </div>
                  </div>
                  {getPlatform("CodeChef")?.connected && (
                    <div className="flex items-center text-emerald-500 text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Connected
                    </div>
                  )}
                </div>
                
                {getPlatform("CodeChef")?.connected ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`}>
                        {getPlatform("CodeChef")?.username}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => disconnectPlatform("CodeChef")}
                      className="text-green-500 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/30"
                    >
                      <Link2Off className="h-4 w-4 mr-1" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input 
                        placeholder="Your CodeChef username" 
                        value={codechefUsername}
                        onChange={(e) => setCodechefUsername(e.target.value)}
                        className={theme === "dark" ? "bg-zinc-700 border-zinc-600" : ""}
                      />
                    </div>
                    <Button 
                      onClick={() => connectPlatform("CodeChef", codechefUsername)}
                      className="whitespace-nowrap bg-green-600 hover:bg-green-700"
                    >
                      <LogIn className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContestStats theme={theme} />
            <RatingChart 
              data={getRatingDataForPlatform("Codeforces")} 
              theme={theme} 
              platform="Codeforces" 
            />
          </div>
          
          <div className={`p-6 rounded-lg border transition-all duration-200 ${theme === "dark" ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-200 bg-white shadow-md"}`}>
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              Participation Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-zinc-700/50" : "bg-zinc-50"}`}>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Contests</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-zinc-700/50" : "bg-zinc-50"}`}>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Best Rank</p>
                <p className="text-2xl font-bold">128</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-zinc-700/50" : "bg-zinc-50"}`}>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Problems Solved</p>
                <p className="text-2xl font-bold">198</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Statistics;
