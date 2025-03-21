
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Code } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

const OnboardingModal = ({ open, onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [codeforcesUsername, setCodeforcesUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [codechefUsername, setCodechefUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        toast.error("Please enter your name to continue");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      handleComplete();
    }
  };

  const handleComplete = async () => {
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
      }
      
      // Mark onboarding as complete
      localStorage.setItem("onboardingComplete", "true");
      localStorage.setItem("userName", name);
      
      toast.success("Welcome to ContestBug! Your profile is ready.");
      onComplete();
    } catch (error) {
      console.error("Error during onboarding:", error);
      toast.error("There was an error setting up your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            {step === 1 ? (
              <Code className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
            ) : (
              <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
            )}
          </div>
          <DialogTitle className="text-center text-xl mt-4">
            {step === 1 ? "Welcome to ContestBug" : "Connect Your Platforms"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 1 
              ? "Let's set up your profile to get started with tracking your competitive programming journey."
              : "Link your accounts to see your ratings and track your progress across platforms."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your name"
                  className="focus-visible:ring-emerald-500/20"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
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
                  placeholder="Optional"
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
                  placeholder="Optional"
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
                  placeholder="Optional"
                  className="focus-visible:ring-emerald-500/20"
                />
              </div>
              
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                You can connect or update these platforms later in your profile settings.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          {step === 2 && (
            <Button 
              variant="outline" 
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back
            </Button>
          )}
          <Button 
            variant="emerald" 
            onClick={handleNext}
            className="min-w-24"
            disabled={loading}
          >
            {loading ? "Processing..." : step === 1 ? "Next" : "Complete Setup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
