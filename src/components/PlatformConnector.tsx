
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Link, Link2Off, LogIn, Award, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { backendApi } from "@/lib/backend";

interface PlatformConnectorProps {
  theme?: "light" | "dark";
}

export const PlatformConnector = ({ theme = "dark" }: PlatformConnectorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [platformData, setPlatformData] = useState({
    Codeforces: { connected: false, username: "" },
    LeetCode: { connected: false, username: "" },
    CodeChef: { connected: false, username: "" }
  });
  
  const [codeforcesUsername, setCodeforcesUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [codechefUsername, setCodechefUsername] = useState("");
  
  const [connectingPlatform, setConnectingPlatform] = useState("");
  const [disconnectingPlatform, setDisconnectingPlatform] = useState("");
  
  const [publicProfile, setPublicProfile] = useState(true);
  const [shareRatings, setShareRatings] = useState(true);
  
  // Load user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const profileData = await api.getUserProfile();
        
        if (profileData && profileData.platforms) {
          const platforms = {
            Codeforces: { 
              connected: profileData.platforms.find(p => p.platform === "Codeforces")?.connected || false,
              username: profileData.platforms.find(p => p.platform === "Codeforces")?.username || ""
            },
            LeetCode: { 
              connected: profileData.platforms.find(p => p.platform === "LeetCode")?.connected || false,
              username: profileData.platforms.find(p => p.platform === "LeetCode")?.username || ""
            },
            CodeChef: { 
              connected: profileData.platforms.find(p => p.platform === "CodeChef")?.connected || false,
              username: profileData.platforms.find(p => p.platform === "CodeChef")?.username || ""
            }
          };
          
          setPlatformData(platforms);
          
          // Set initial values for input fields if not connected
          if (!platforms.Codeforces.connected) setCodeforcesUsername(platforms.Codeforces.username || "");
          if (!platforms.LeetCode.connected) setLeetcodeUsername(platforms.LeetCode.username || "");
          if (!platforms.CodeChef.connected) setCodechefUsername(platforms.CodeChef.username || "");
          
          // Set user settings
          setPublicProfile(profileData.settings?.publicProfile || true);
          setShareRatings(profileData.settings?.contestReminders || true);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  type Platform = 'Codeforces' | 'LeetCode' | 'CodeChef';

  const connectPlatform = async (platform: Platform, username: string) => {
    if (!username.trim()) {
      toast.error(`Please enter your ${platform} username.`);
      return;
    }
    
    setConnectingPlatform(platform);
    
    try {
      // First validate that the user exists on the platform
      const platformLower = platform.toLowerCase() as 'codeforces' | 'leetcode' | 'codechef';
      await backendApi.getUserStats(platformLower, username.trim());
      
      // If validation succeeds, connect the platform
      const success = await api.connectPlatform(platform as any, username.trim());
      
      if (success) {
        toast.success(`Your ${platform} account has been connected successfully.`);
        
        // Update platform data
        setPlatformData(prev => ({
          ...prev,
          [platform]: {
            connected: true,
            username: username.trim()
          }
        }));
      } else {
        toast.error(`Failed to connect your ${platform} account.`);
      }
    } catch (error) {
      console.error(`Error connecting ${platform} account:`, error);
      let errorMessage = `Failed to connect your ${platform} account.`;
      
      if (error instanceof Error) {
        if (error.message.includes('Network Error')) {
          errorMessage = `Network error when connecting to ${platform}. Please check your internet connection and try again.`;
        } else if (error.message.includes('not found') || error.message.includes('404')) {
          errorMessage = `User '${username}' not found on ${platform}. Please check the username and try again.`;
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setConnectingPlatform("");
    }
  };
  
  const disconnectPlatform = async (platform: Platform) => {
    setDisconnectingPlatform(platform);
    
    try {
      const success = await api.disconnectPlatform(platform as any);
      
      if (success) {
        toast.success(`Your ${platform} account has been disconnected.`);
        
        // Update platform data
        setPlatformData(prev => ({
          ...prev,
          [platform]: {
            connected: false,
            username: ""
          }
        }));
        
        // Reset input field
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
      } else {
        toast.error(`Failed to disconnect your ${platform} account.`);
      }
    } catch (error) {
      console.error(`Error disconnecting ${platform} account:`, error);
      toast.error(`Failed to disconnect your ${platform} account.`);
    } finally {
      setDisconnectingPlatform("");
    }
  };
  
  const saveSettings = async () => {
    try {
      await api.updateUserSettings({
        publicProfile,
        contestReminders: shareRatings
      });
      
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className={`transition-all duration-200 ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "border-zinc-200 bg-white shadow-sm"}`}>
          <CardContent className="p-10 flex justify-center">
            <p>Loading platform connections...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "border-zinc-200 bg-white shadow-sm"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-emerald-500" />
            Connect Platforms
          </CardTitle>
          <CardDescription>
            Link your competitive programming accounts to track all your contests in one place
          </CardDescription>
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
              {platformData.Codeforces.connected && (
                <div className="flex items-center text-emerald-500 text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Connected
                </div>
              )}
            </div>
            
            {platformData.Codeforces.connected ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`}>
                    {platformData.Codeforces.username}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => disconnectPlatform("Codeforces")}
                  disabled={disconnectingPlatform === "Codeforces"}
                  className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30"
                >
                  {disconnectingPlatform === "Codeforces" ? (
                    "Disconnecting..."
                  ) : (
                    <>
                      <Link2Off className="h-4 w-4 mr-1" />
                      Disconnect
                    </>
                  )}
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
                  variant="codeforces"
                  className="whitespace-nowrap"
                  disabled={connectingPlatform === "Codeforces"}
                >
                  {connectingPlatform === "Codeforces" ? (
                    "Connecting..."
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-1" />
                      Connect
                    </>
                  )}
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
              {platformData.LeetCode.connected && (
                <div className="flex items-center text-emerald-500 text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Connected
                </div>
              )}
            </div>
            
            {platformData.LeetCode.connected ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`}>
                    {platformData.LeetCode.username}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => disconnectPlatform("LeetCode")}
                  disabled={disconnectingPlatform === "LeetCode"}
                  className="text-yellow-500 border-yellow-200 hover:bg-yellow-50 dark:border-yellow-800 dark:hover:bg-yellow-900/30"
                >
                  {disconnectingPlatform === "LeetCode" ? (
                    "Disconnecting..."
                  ) : (
                    <>
                      <Link2Off className="h-4 w-4 mr-1" />
                      Disconnect
                    </>
                  )}
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
                  variant="leetcode"
                  className="whitespace-nowrap"
                  disabled={connectingPlatform === "LeetCode"}
                >
                  {connectingPlatform === "LeetCode" ? (
                    "Connecting..."
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-1" />
                      Connect
                    </>
                  )}
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
              {platformData.CodeChef.connected && (
                <div className="flex items-center text-emerald-500 text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Connected
                </div>
              )}
            </div>
            
            {platformData.CodeChef.connected ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`}>
                    {platformData.CodeChef.username}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => disconnectPlatform("CodeChef")}
                  disabled={disconnectingPlatform === "CodeChef"}
                  className="text-green-500 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/30"
                >
                  {disconnectingPlatform === "CodeChef" ? (
                    "Disconnecting..."
                  ) : (
                    <>
                      <Link2Off className="h-4 w-4 mr-1" />
                      Disconnect
                    </>
                  )}
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
                  variant="codechef"
                  className="whitespace-nowrap"
                  disabled={connectingPlatform === "CodeChef"}
                >
                  {connectingPlatform === "CodeChef" ? (
                    "Connecting..."
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-1" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          
          <div className={`p-4 rounded-lg border transition-all ${theme === "dark" ? "bg-zinc-700/50 border-zinc-600" : "bg-zinc-50 border-zinc-200"}`}>
            <h3 className="font-medium mb-3">Sharing Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-profile">Public Profile</Label>
                  <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                    Allow other users to view your profile
                  </p>
                </div>
                <Switch 
                  id="public-profile"
                  checked={publicProfile}
                  onCheckedChange={setPublicProfile}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="share-ratings">Share Ratings</Label>
                  <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                    Show your ratings and contestbug history publicly
                  </p>
                </div>
                <Switch 
                  id="share-ratings"
                  checked={shareRatings}
                  onCheckedChange={setShareRatings}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
              
              <div className="pt-2">
                <Button
                  onClick={saveSettings}
                  className="w-full"
                  variant="default"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
