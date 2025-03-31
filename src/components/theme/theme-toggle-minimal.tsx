"use client";

import { useState, useEffect } from "react";

export function ThemeToggleMinimal() {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    try {
      // Use the global function if available
      if (typeof window !== "undefined" && window.toggleTheme) {
        window.toggleTheme(newTheme);
      } else {
        // Fallback if global function is not available
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
        localStorage.setItem("theme", newTheme);
      }
      
      // Update state
      setCurrentTheme(newTheme);
      console.log("Theme toggled to:", newTheme);
    } catch (error) {
      console.error("Error toggling theme:", error);
    }
  };
  
  // Initialize theme from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      // Force light mode by default
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      
      // Check if there's a saved theme preference
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      
      if (savedTheme === "dark") {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        setCurrentTheme("dark");
      } else {
        // Default to light mode
        localStorage.setItem("theme", "light");
        setCurrentTheme("light");
      }
      
      setMounted(true);
    } catch (error) {
      console.error("Error initializing theme:", error);
      setMounted(true);
    }
  }, []);
  
  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={currentTheme === "light" ? "Passer au mode sombre" : "Passer au mode clair"}
    >
      {currentTheme === "light" ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
