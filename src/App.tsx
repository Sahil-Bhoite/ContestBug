
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import OnboardingModal from "./components/OnboardingModal";
import AppSidebar from "./components/AppSidebar";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const { onboardingComplete, setOnboardingComplete, theme } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only show onboarding on protected routes
    const isProtectedRoute = 
      location.pathname !== "/" && 
      location.pathname !== "/login" && 
      location.pathname !== "/signup";

    if (isProtectedRoute && !onboardingComplete) {
      setShowOnboarding(true);
    }
  }, [location.pathname, onboardingComplete]);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    setShowOnboarding(false);
    
    // If user was trying to access the root path, redirect to dashboard
    if (location.pathname === "/") {
      navigate("/dashboard");
    }
  };

  // Hide sidebar on public routes
  const isPublicRoute = 
    location.pathname === "/" || 
    location.pathname === "/login" || 
    location.pathname === "/signup";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <OnboardingModal 
        open={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />
      <div className={`min-h-screen flex ${theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}`}>
        {!isPublicRoute && (
          <AppSidebar 
            onToggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        )}
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
