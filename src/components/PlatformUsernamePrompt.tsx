
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";

interface PlatformUsernamePromptProps {
  open: boolean;
  onClose: () => void;
}

const PlatformUsernamePrompt = ({ open, onClose }: PlatformUsernamePromptProps) => {
  const [codeforcesUsername, setCodeforcesUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [codechefUsername, setCodechefUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { setOnboardingComplete } = useTheme();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Connect platforms if usernames provided
      const platformsToConnect = [];
      
      if (codeforcesUsername.trim()) {
        platformsToConnect.push(api.connectPlatform("Codeforces", codeforcesUsername.trim()));
      }
      
      if (leetcodeUsername.trim()) {
        platformsToConnect.push(api.connectPlatform("LeetCode", leetcodeUsername.trim()));
      }
      
      if (codechefUsername.trim()) {
        platformsToConnect.push(api.connectPlatform("CodeChef", codechefUsername.trim()));
      }
      
      // Wait for all connection promises to complete
      if (platformsToConnect.length > 0) {
        await Promise.all(platformsToConnect);
        toast.success("Platform connections saved successfully!");
      }
      
      // Mark onboarding as complete
      setOnboardingComplete(true);
      onClose();
      
    } catch (error) {
      console.error("Error saving platform connections:", error);
      toast.error("There was an error saving your platform connections. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setOnboardingComplete(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
          </div>
          <DialogTitle className="text-center text-xl mt-4">
            Connect Your Coding Profiles
          </DialogTitle>
          <DialogDescription className="text-center">
            Link your competitive programming accounts to track your progress and stay updated on contests.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="codeforces" className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-[8px] font-bold">CF</span>
              </div>
              Codeforces Username
            </Label>
            <Input 
              id="codeforces" 
              value={codeforcesUsername} 
              onChange={(e) => setCodeforcesUsername(e.target.value)} 
              placeholder="Enter your Codeforces username"
              className="focus-visible:ring-emerald-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="leetcode" className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-[8px] font-bold">LC</span>
              </div>
              LeetCode Username
            </Label>
            <Input 
              id="leetcode" 
              value={leetcodeUsername} 
              onChange={(e) => setLeetcodeUsername(e.target.value)} 
              placeholder="Enter your LeetCode username"
              className="focus-visible:ring-emerald-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="codechef" className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-[8px] font-bold">CC</span>
              </div>
              CodeChef Username
            </Label>
            <Input 
              id="codechef" 
              value={codechefUsername} 
              onChange={(e) => setCodechefUsername(e.target.value)} 
              placeholder="Enter your CodeChef username"
              className="focus-visible:ring-emerald-500/20"
            />
          </div>
          
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            You can connect or update these platforms later in your profile settings.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSkip}
            disabled={loading}
          >
            Skip for now
          </Button>
          <Button 
            variant="emerald" 
            onClick={handleSubmit}
            className="min-w-24"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save connections"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlatformUsernamePrompt;
