
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Code, Menu, User, Settings, Activity, BarChart } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface AppSidebarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const AppSidebar = ({ onToggleSidebar, sidebarOpen }: AppSidebarProps) => {
  const location = useLocation();
  const { theme, appName, userName } = useTheme();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <aside 
      className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"} border-r flex flex-col`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <div className={`flex items-center gap-2 ${sidebarOpen ? 'w-full' : 'hidden'}`}>
          <Code className="h-5 w-5 text-emerald-500" />
          <span className="font-medium">{appName}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hover:bg-zinc-200 dark:hover:bg-zinc-700">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${isActive("/dashboard") ? (theme === "dark" ? "bg-zinc-700" : "bg-zinc-200") : (theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-zinc-200")} ${sidebarOpen ? 'px-3' : 'justify-center'}`}
            >
              <Calendar className="h-5 w-5" />
              {sidebarOpen && <span>Contests</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/profile" 
              className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${isActive("/profile") ? (theme === "dark" ? "bg-zinc-700" : "bg-zinc-200") : (theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-zinc-200")} ${sidebarOpen ? 'px-3' : 'justify-center'}`}
            >
              <User className="h-5 w-5" />
              {sidebarOpen && <span>Profile</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/statistics" 
              className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${isActive("/statistics") ? (theme === "dark" ? "bg-zinc-700" : "bg-zinc-200") : (theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-zinc-200")} ${sidebarOpen ? 'px-3' : 'justify-center'}`}
            >
              <Activity className="h-5 w-5" />
              {sidebarOpen && <span>Statistics</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/settings" 
              className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${isActive("/settings") ? (theme === "dark" ? "bg-zinc-700" : "bg-zinc-200") : (theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-zinc-200")} ${sidebarOpen ? 'px-3' : 'justify-center'}`}
            >
              <Settings className="h-5 w-5" />
              {sidebarOpen && <span>Settings</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/ratings" 
              className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${isActive("/ratings") ? (theme === "dark" ? "bg-zinc-700" : "bg-zinc-200") : (theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-zinc-200")} ${sidebarOpen ? 'px-3' : 'justify-center'}`}
            >
              <BarChart className="h-5 w-5" />
              {sidebarOpen && <span>Ratings</span>}
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t mt-auto">
        <div className={`flex items-center gap-3 ${sidebarOpen ? 'w-full' : 'justify-center'}`}>
          <Avatar className="h-8 w-8 ring-2 ring-emerald-500/20">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {sidebarOpen && <span>{userName}</span>}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
export type { AppSidebarProps };
