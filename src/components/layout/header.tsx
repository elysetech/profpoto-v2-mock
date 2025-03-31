"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { ThemeToggleMinimal } from "@/components/theme/theme-toggle-minimal";

export function Header() {
  const [user, loading] = useAuthState(auth);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 fixed top-0 left-0 right-0 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary dark:text-blue-400">
          Profpoto
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 font-medium">
            Accueil
          </Link>
          <Link href="/pricing" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 font-medium">
            Tarifs
          </Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 font-medium">
            À propos
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
        {/* Theme toggle */}
        <div className="mr-4">
          <ThemeToggleMinimal />
        </div>
          
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button variant="ghost" className="dark:text-gray-200 dark:hover:bg-gray-800">Tableau de bord</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => auth.signOut()}
                    className="dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <Button variant="ghost" className="dark:text-gray-200 dark:hover:bg-gray-800">Connexion</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="dark:bg-blue-600 dark:hover:bg-blue-700">S&apos;inscrire</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
