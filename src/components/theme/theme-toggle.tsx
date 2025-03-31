"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    toggleTheme: (theme: string) => void;
  }
}

export function ThemeToggle() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Function to set theme using the global function and update local state
  const setTheme = (newTheme: "light" | "dark") => {
    // Use the global function if available
    if (typeof window !== "undefined" && window.toggleTheme) {
      window.toggleTheme(newTheme);
    } else {
      // Fallback if global function is not available
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
      localStorage.setItem("theme", newTheme);
    }
    
    // Update state
    setThemeState(newTheme);
  };

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    
    // Check current theme from document class
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1">
        {/* Light mode button */}
        <button
          onClick={() => setTheme("light")}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            theme === "light" 
              ? "bg-white text-blue-600 shadow-sm" 
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          aria-label="Mode clair"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            <span>Clair</span>
          </div>
        </button>
        
        {/* Dark mode button */}
        <button
          onClick={() => setTheme("dark")}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            theme === "dark" 
              ? "bg-gray-700 text-blue-400 shadow-sm" 
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          aria-label="Mode sombre"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span>Sombre</span>
          </div>
        </button>
      </div>
    </div>
  );
}
