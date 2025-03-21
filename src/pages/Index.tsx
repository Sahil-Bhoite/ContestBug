
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Code, Calendar, Award, BookOpen, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

const Index = () => {
  const { theme, toggleTheme, appName } = useTheme();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard?prompt=true");
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}`}>
      {/* Navigation */}
      <header className={`border-b ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"} py-4 px-6 md:px-12 sticky top-0 z-10 backdrop-blur-sm bg-background/80`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-emerald-500" />
            <h1 className="text-xl font-medium">{appName}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            <Button asChild variant="outline" className="text-foreground">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center gap-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent pb-1 animate-fade-in">
              All your coding contests in one place
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-80">
              Track upcoming contests from Codeforces, LeetCode, and CodeChef. 
              Never miss a competition again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleGetStarted}>
                Get started 
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button asChild variant="outline" size="lg" className="text-foreground">
                <Link to="/contests">
                  Explore contests
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`py-16 ${theme === "dark" ? "bg-zinc-800" : "bg-zinc-50"} px-6 md:px-12`}>
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            Everything you need to stay on top of coding competitions
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-900 border-zinc-700" : "border-zinc-200"}`}>
              <CardHeader>
                <Calendar className="h-8 w-8 mb-2 text-emerald-500" />
                <CardTitle>Contest Calendar</CardTitle>
                <CardDescription>
                  View all upcoming contests in a clean, organized timeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                  Filter by platform, difficulty, or duration. Set reminders for contests you're interested in.
                </p>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-900 border-zinc-700" : "border-zinc-200"}`}>
              <CardHeader>
                <BookOpen className="h-8 w-8 mb-2 text-emerald-500" />
                <CardTitle>Platform Integration</CardTitle>
                <CardDescription>
                  Connect your Codeforces, LeetCode and CodeChef accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                  Manage all your competitive programming platforms from a single dashboard.
                </p>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-zinc-900 border-zinc-700" : "border-zinc-200"}`}>
              <CardHeader>
                <Award className="h-8 w-8 mb-2 text-emerald-500" />
                <CardTitle>Statistics & Progress</CardTitle>
                <CardDescription>
                  Track your performance across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                  Visualize your growth with elegant charts and detailed statistics for each platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`mt-auto py-8 border-t ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"} px-6 md:px-12`}>
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-70">
              © {new Date().getFullYear()} {appName}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                Terms
              </a>
              <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                Privacy
              </a>
              <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
