"use client";

import { useEffect, useState } from "react";

export function ThemeToggleDirect() {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  
  // Function to set theme
  const setTheme = (theme: "light" | "dark") => {
    // Remove both classes
    document.documentElement.classList.remove("light", "dark");
    
    // Add the selected theme class
    document.documentElement.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Update state
    setCurrentTheme(theme);
    
    console.log("Theme set to:", theme);
  };
  
  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("dark");
    }
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1">
        {/* Light mode button */}
        <button
          onClick={() => setTheme("light")}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            currentTheme === "light" 
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
            currentTheme === "dark" 
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
