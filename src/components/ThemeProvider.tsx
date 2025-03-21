
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  appName: string;
  onboardingComplete: boolean;
  setOnboardingComplete: (value: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) return savedTheme;
    
    // Check user's system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
    
    return "dark"; // Default to dark theme for consistency
  });

  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() => {
    return localStorage.getItem("onboardingComplete") === "true";
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("userName") || "User";
  });

  const appName = "ContestBug";

  useEffect(() => {
    // Update the HTML class for CSS
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Save in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // Save onboarding status in localStorage
    localStorage.setItem("onboardingComplete", onboardingComplete.toString());
  }, [onboardingComplete]);

  useEffect(() => {
    // Save userName in localStorage
    localStorage.setItem("userName", userName);
  }, [userName]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme, 
      appName, 
      onboardingComplete, 
      setOnboardingComplete,
      userName,
      setUserName
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
