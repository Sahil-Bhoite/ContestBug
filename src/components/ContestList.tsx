
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, ExternalLink } from "lucide-react";
import { Contestbug } from "@/types/contestbug";
import { Badge } from "@/components/ui/badge";

interface ContestListProps {
  contestbugs: Contestbug[];
  loading: boolean;
  theme: "light" | "dark";
}

const ContestList = ({ contestbugs, loading, theme }: ContestListProps) => {
  if (loading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className={`p-6 ${theme === "dark" ? "bg-zinc-800/80 animate-pulse" : "bg-zinc-100/80 animate-pulse"} border-zinc-700/30 dark:border-zinc-700/30 backdrop-blur-sm transition-all duration-500`}>
            <div className="h-6 w-2/3 bg-zinc-700/20 dark:bg-zinc-700/40 rounded-md mb-4"></div>
            <div className="h-4 w-1/2 bg-zinc-700/20 dark:bg-zinc-700/40 rounded-md"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (contestbugs.length === 0) {
    return (
      <Card className={`p-8 text-center ${theme === "dark" ? "bg-zinc-800/80" : "bg-white/80"} backdrop-blur-sm border-zinc-700/30 dark:border-zinc-700/30 transition-all duration-300`}>
        <h3 className="text-lg font-medium mb-2">No contests found</h3>
        <p className={`${theme === "dark" ? "text-zinc-400" : "text-zinc-600"} mb-4`}>
          There are no upcoming contests matching your criteria.
        </p>
      </Card>
    );
  }

  // Function to format date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    }).format(date);
  };

  // Function to get platform-specific variant
  const getPlatformVariant = (platform: string) => {
    switch (platform) {
      case "Codeforces": return "codeforces";
      case "LeetCode": return "leetcode";
      case "CodeChef": return "codechef";
      default: return "default";
    }
  };

  // Group contests by date
  const groupedContestbugs: Record<string, Contestbug[]> = {};
  contestbugs.forEach(contestbug => {
    const date = new Date(contestbug.startTime).toDateString();
    if (!groupedContestbugs[date]) {
      groupedContestbugs[date] = [];
    }
    groupedContestbugs[date].push(contestbug);
  });

  return (
    <div className="space-y-8">
      {Object.entries(groupedContestbugs).map(([date, dateContestbugs]) => (
        <div key={date} className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Calendar className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
          </div>

          <div className="grid gap-4">
            {dateContestbugs.map(contestbug => {
              const platformStyle = getPlatformStyles(contestbug.platform);
              
              return (
                <Card 
                  key={`${contestbug.platform}-${contestbug.id}`}
                  className={`${theme === "dark" ? "bg-zinc-800/90 hover:bg-zinc-750" : "bg-white/90 hover:bg-zinc-50/90"} 
                    backdrop-blur-sm transition-all duration-300 hover-scale border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm hover:shadow-md`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge 
                          variant="outline" 
                          className={`mb-3 font-semibold ${platformStyle.badgeClass}`}
                        >
                          {contestbug.platform}
                        </Badge>
                        <h3 className="text-lg font-medium mb-3">{contestbug.name}</h3>
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div>
                            <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"} mb-1`}>
                              Start time
                            </p>
                            <p className="text-sm font-medium">
                              {formatDate(contestbug.startTime)}
                            </p>
                          </div>
                          <div>
                            <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"} mb-1`}>
                              Duration
                            </p>
                            <p className="text-sm font-medium">
                              {contestbug.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant={platformStyle.buttonVariant as any}
                          size="sm" 
                          asChild
                          className="ml-2 transition-all duration-200 hover:shadow-md"
                        >
                          <a href={contestbug.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-medium">
                            Open <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function for platform-specific styles
const getPlatformStyles = (platform: string) => {
  switch (platform) {
    case "Codeforces":
      return {
        badgeClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/30",
        buttonVariant: "codeforces"
      };
    case "LeetCode":
      return {
        badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30",
        buttonVariant: "leetcode"
      };
    case "CodeChef":
      return {
        badgeClass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/30",
        buttonVariant: "codechef"
      };
    default:
      return {
        badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30",
        buttonVariant: "default"
      };
  }
};

export default ContestList;
