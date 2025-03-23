
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/ThemeProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { appName } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // This would be replaced with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Login successful",
        description: `Welcome back to ${appName}!`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
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
            <Code className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-medium">{appName}</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Log in to your account
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 transition-all duration-200 shadow-sm hover:shadow-md">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Log in</CardTitle>
              <CardDescription>
                Don't have an account? <Link to="/signup" className="text-emerald-600 dark:text-emerald-500 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Sign up</Link>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="user@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-emerald-600 dark:text-emerald-500 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                />
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <a href="/auth/google" className="w-full inline-block text-center bg-blue-500 text-white py-2 rounded">
                  Log in with Google
                </a>
                <a href="/auth/github" className="w-full inline-block text-center bg-gray-800 text-white py-2 rounded">
                  Log in with GitHub
                </a>
              </div>
            </CardContent>

            <CardFooter>
              <div className="button-wrap">
                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all"
                  disabled={loading}
                >
                  <span>{loading ? "Logging in..." : "Log in"}</span>
                </button>
                <div className="button-shadow"></div>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          By continuing, you agree to our <a href="#" className="text-emerald-600 dark:text-emerald-500 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Terms of Service</a> and <a href="#" className="text-emerald-600 dark:text-emerald-500 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default Login;
