
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Mail, Calendar, Download, Shield, Moon, Globe, Clock, Lock, BellOff, CloudOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserSettingsProps {
  theme: "light" | "dark";
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  contestReminders: boolean;
  setContestReminders: (value: boolean) => void;
}

export const UserSettings = ({ 
  theme, 
  emailNotifications, 
  setEmailNotifications,
  contestReminders,
  setContestReminders
}: UserSettingsProps) => {
  const { toast } = useToast();
  const [pushNotifications, setPushNotifications] = useState(false);
  const [remindBeforeHours, setRemindBeforeHours] = useState(24);
  const [darkModeSystem, setDarkModeSystem] = useState(false);
  const [dataExport, setDataExport] = useState(false);
  const [autoLoginEnabled, setAutoLoginEnabled] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [contestLanguage, setContestLanguage] = useState("en");
  const [offlineMode, setOfflineMode] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200 shadow-sm"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-500" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how you want to be notified about contests and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="email-notifications">Email Notifications</Label>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                Receive contest reminders and updates via email
              </p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="push-notifications">Push Notifications</Label>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                Receive browser push notifications for important updates
              </p>
            </div>
            <Switch 
              id="push-notifications" 
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="contest-reminders">Contest Reminders</Label>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                Get reminded about upcoming contests
              </p>
            </div>
            <Switch 
              id="contest-reminders" 
              checked={contestReminders}
              onCheckedChange={setContestReminders}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="dnd-mode">Do Not Disturb</Label>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                Silence all notifications during specified hours
              </p>
            </div>
            <Switch 
              id="dnd-mode" 
              checked={doNotDisturb}
              onCheckedChange={setDoNotDisturb}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          {contestReminders && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base" htmlFor="remind-before">Remind Me Before</Label>
                <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                  How many hours before a contest should we remind you
                </p>
              </div>
              <Select 
                value={remindBeforeHours.toString()} 
                onValueChange={(value) => setRemindBeforeHours(Number(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">2 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200 shadow-sm"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-500" />
            Regional Settings
          </CardTitle>
          <CardDescription>
            Adjust language and region-specific settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="contest-language">Contest Language</Label>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                Preferred language for contest descriptions
              </p>
            </div>
            <Select 
              value={contestLanguage} 
              onValueChange={setContestLanguage}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="jp">Japanese</SelectItem>
                <SelectItem value="cn">Chinese</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="offline-mode">Offline Mode</Label>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                Cache contests for offline access
              </p>
            </div>
            <Switch 
              id="offline-mode" 
              checked={offlineMode}
              onCheckedChange={setOfflineMode}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200 shadow-sm"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Manage your data and privacy preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="data-export">Data Export</Label>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                Enable one-click data export of your contest history and ratings
              </p>
            </div>
            <Switch 
              id="data-export" 
              checked={dataExport}
              onCheckedChange={setDataExport}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="dark-mode-system">Use System Theme</Label>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                Automatically switch between light and dark mode based on system preferences
              </p>
            </div>
            <Switch 
              id="dark-mode-system" 
              checked={darkModeSystem}
              onCheckedChange={setDarkModeSystem}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="auto-login">Auto Login</Label>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                Stay logged in between sessions
              </p>
            </div>
            <Switch 
              id="auto-login" 
              checked={autoLoginEnabled}
              onCheckedChange={setAutoLoginEnabled}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="two-factor">Two-Factor Authentication</Label>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch 
              id="two-factor" 
              checked={twoFactorAuth}
              onCheckedChange={setTwoFactorAuth}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={handleSaveSettings}
              className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 hover:shadow-md w-full sm:w-auto"
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200 shadow-sm"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-emerald-500" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download your contest history and ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline"
              className="transition-all duration-200 hover:shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              Export as CSV
            </Button>
            <Button 
              variant="outline"
              className="transition-all duration-200 hover:shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              Export as JSON
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
