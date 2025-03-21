
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // This would be replaced with actual registration logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account created",
        description: "Welcome to Contestbug! You can now log in.",
      });
      
      navigate("/login");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Code className="h-6 w-6" />
            <span className="text-xl font-medium">Contestbug</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Create an account
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Sign up to track all your coding contests in one place
          </p>
        </div>

        <Card>
          <form onSubmit={handleSignup}>
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>
                Already have an account? <Link to="/login" className="text-primary underline underline-offset-4">Log in</Link>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input 
                  id="name" 
                  placeholder="" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="user@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Must be at least 8 characters with a number and a special character
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          By signing up, you agree to our <a href="#" className="underline underline-offset-4">Terms of Service</a> and <a href="#" className="underline underline-offset-4">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default Signup;
