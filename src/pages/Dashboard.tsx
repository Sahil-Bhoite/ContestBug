
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Filter, Moon, Search, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import ContestList from "@/components/ContestList";
import { Contestbug } from "@/types/contestbug";
import { useTheme } from "@/components/ThemeProvider";
import { api } from "@/lib/api";
import { useLocation } from "react-router-dom";
import PlatformUsernamePrompt from "@/components/PlatformUsernamePrompt";

const Dashboard = () => {
  const { theme, toggleTheme, onboardingComplete } = useTheme();
  const [contestbugs, setContestbugs] = useState<Contestbug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const location = useLocation();

  // Check if we should show the platform prompt whenever location changes or onboarding status changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const shouldPrompt = queryParams.get("prompt") === "true";
    
    if (shouldPrompt || !onboardingComplete) {
      setShowPrompt(true);
    }
  }, [location.search, onboardingComplete]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch contests
        const contestbugsData = await api.getContests();
        setContestbugs(contestbugsData);
        
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter contestbugs based on search query
  const filteredContestbugs = contestbugs.filter(contestbug =>
    contestbug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contestbug.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClosePrompt = () => {
    setShowPrompt(false);
    // Clean up query parameter
    const newUrl = window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  };

  return (
    <main className="flex-1 flex flex-col">
      <PlatformUsernamePrompt open={showPrompt} onClose={handleClosePrompt} />
      
      <header className={`border-b ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"} p-4 sticky top-0 z-10 backdrop-blur-sm bg-background/80`}>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">Dashboard</h1>
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
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold">Upcoming Contests</h2>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search contests..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

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
            
            <div className="mt-6">
              <TabsContent value="all">
                <ContestList 
                  contestbugs={filteredContestbugs} 
                  loading={loading} 
                  theme={theme}
                />
              </TabsContent>

              <TabsContent value="codeforces">
                <ContestList 
                  contestbugs={filteredContestbugs.filter(c => c.platform === "Codeforces")} 
                  loading={loading} 
                  theme={theme}
                />
              </TabsContent>

              <TabsContent value="leetcode">
                <ContestList 
                  contestbugs={filteredContestbugs.filter(c => c.platform === "LeetCode")} 
                  loading={loading} 
                  theme={theme}
                />
              </TabsContent>

              <TabsContent value="codechef">
                <ContestList 
                  contestbugs={filteredContestbugs.filter(c => c.platform === "CodeChef")} 
                  loading={loading} 
                  theme={theme}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
