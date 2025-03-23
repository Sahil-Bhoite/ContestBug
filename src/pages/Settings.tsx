
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UserSettings } from "@/components/UserSettings";
import { Moon, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Make the props optional with default values
interface SettingsProps {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

const Settings = ({ sidebarOpen, onToggleSidebar }: SettingsProps) => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [contestReminders, setContestReminders] = useState(true);

  return (
    <main className={`flex-1 flex flex-col overflow-y-auto ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <header className={`border-b ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"} p-4 sticky top-0 z-10 backdrop-blur-sm bg-background/80`}>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">Settings</h1>
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
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy & Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6 animate-in fade-in">
              <UserSettings 
                theme={theme}
                emailNotifications={emailNotifications}
                setEmailNotifications={setEmailNotifications}
                contestReminders={contestReminders}
                setContestReminders={setContestReminders}
              />
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6 animate-in fade-in">
              <div className="space-y-6">
                <div className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-md ${theme === "dark" ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-200 bg-white shadow-sm"}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium">Theme Settings</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${theme === "light" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-zinc-300 dark:border-zinc-700"}`}
                      onClick={() => {
                        toggleTheme();
                        if (theme === "dark") {
                          document.documentElement.classList.remove("dark");
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Sun className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">Light Mode</span>
                      </div>
                      <div className="h-24 rounded-md bg-white border border-zinc-200"></div>
                    </div>
                    
                    <div 
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${theme === "dark" ? "border-emerald-500 bg-zinc-800" : "border-zinc-300"}`}
                      onClick={() => {
                        toggleTheme();
                        if (theme === "light") {
                          document.documentElement.classList.add("dark");
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Moon className="h-5 w-5 text-indigo-400" />
                        <span className="font-medium">Dark Mode</span>
                      </div>
                      <div className="h-24 rounded-md bg-zinc-900 border border-zinc-700"></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 animate-in fade-in">
              <UserSettings 
                theme={theme}
                emailNotifications={emailNotifications}
                setEmailNotifications={setEmailNotifications}
                contestReminders={contestReminders}
                setContestReminders={setContestReminders}
              />
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6 animate-in fade-in">
              <div className="space-y-6">
                <div className={`p-6 rounded-lg border transition-all duration-200 ${theme === "dark" ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-200 bg-white shadow-sm"}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium">Data Management</h3>
                  </div>
                  <div className="space-y-4">
                    <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                      Download your data or delete your account permanently.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline"
                        className="transition-all duration-200 hover:shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        onClick={() => {
                          toast({
                            title: "Data export initiated",
                            description: "Your data is being prepared for download.",
                          });
                        }}
                      >
                        Export All Data
                      </Button>
                      <Button 
                        variant="destructive"
                        className="transition-all duration-200"
                        onClick={() => {
                          toast({
                            title: "Account deletion requested",
                            description: "Please check your email to confirm account deletion.",
                          });
                        }}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default Settings;
export type { SettingsProps };
