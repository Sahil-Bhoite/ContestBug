
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Code, Menu, User, Settings, Activity, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CandidateRatings from "@/components/CandidateRatings";
import { useTheme } from "@/components/ThemeProvider";

const Ratings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, appName } = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`min-h-screen flex ${theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}`}>
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"} border-r flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className={`flex items-center gap-2 ${sidebarOpen ? 'w-full' : 'hidden'}`}>
            <Code className="h-5 w-5 text-emerald-500" />
            <span className="font-medium">{appName}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-zinc-200 dark:hover:bg-zinc-700">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-zinc-200"} ${sidebarOpen ? 'px-3' : 'justify-center'}`}
              >
                <Calendar className="h-5 w-5" />
                {sidebarOpen && <span>Contests</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-zinc-200"} ${sidebarOpen ? 'px-3' : 'justify-center'}`}
              >
                <User className="h-5 w-5" />
                {sidebarOpen && <span>Profile</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/ratings" 
                className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${theme === "dark" ? "bg-zinc-700" : "bg-zinc-200"} ${sidebarOpen ? 'px-3' : 'justify-center'}`}
              >
                <Trophy className="h-5 w-5" />
                {sidebarOpen && <span>Ratings</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/stats" 
                className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-zinc-200"} ${sidebarOpen ? 'px-3' : 'justify-center'}`}
              >
                <Activity className="h-5 w-5" />
                {sidebarOpen && <span>Statistics</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-zinc-200"} ${sidebarOpen ? 'px-3' : 'justify-center'}`}
              >
                <Settings className="h-5 w-5" />
                {sidebarOpen && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t mt-auto">
          <div className={`flex items-center gap-3 ${sidebarOpen ? 'w-full' : 'justify-center'}`}>
            <Avatar className="h-8 w-8 ring-2 ring-emerald-500/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">U</AvatarFallback>
            </Avatar>
            {sidebarOpen && <span>User Name</span>}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className={`border-b ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"} p-4 sticky top-0 z-10 backdrop-blur-sm bg-background/80`}>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-medium">Top Performers</h1>
          </div>
        </header>

        <div className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-emerald-500" />
                Leaderboard
              </h2>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                View the top performers across different competitive programming platforms
              </p>
            </div>

            <CandidateRatings theme={theme} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ratings;
