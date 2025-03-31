"use client";

import { ReactNode, useState, useEffect } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { Sidebar } from "./sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [user, loading] = useAuthState(auth);
  const showSidebar = user && !loading;
  const [headerVisible, setHeaderVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Effet pour gérer l'affichage du header et footer en fonction du scroll
  useEffect(() => {
    if (!user) {
      // Si l'utilisateur n'est pas connecté, toujours afficher le header et footer
      setHeaderVisible(true);
      setFooterVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si l'utilisateur survole le haut ou le bas de la page, afficher les éléments
      if (isHovering) {
        setHeaderVisible(true);
        setFooterVisible(true);
      } else {
        // Sinon, cacher les éléments lors du défilement vers le bas
        if (currentScrollY > lastScrollY) {
          setHeaderVisible(false);
          setFooterVisible(false);
        } else {
          // Afficher lors du défilement vers le haut
          setHeaderVisible(true);
          setFooterVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, lastScrollY, isHovering]);

  // Gestionnaires pour le survol
  const handleHeaderHoverEnter = () => setIsHovering(true);
  const handleHeaderHoverLeave = () => setIsHovering(false);
  const handleFooterHoverEnter = () => setIsHovering(true);
  const handleFooterHoverLeave = () => setIsHovering(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header avec transition d'opacité */}
      <div 
        className={`transition-all duration-300 ${user ? (headerVisible ? 'opacity-100' : 'opacity-0 pointer-events-none hover:opacity-100 hover:pointer-events-auto') : 'opacity-100'}`}
        onMouseEnter={handleHeaderHoverEnter}
        onMouseLeave={handleHeaderHoverLeave}
      >
        <Header />
      </div>
      
      <div className="flex flex-grow">
        {showSidebar && <Sidebar />}
        <main className={`flex-grow ${showSidebar ? "ml-16" : ""} transition-colors duration-200`}>
          {children}
        </main>
      </div>
      
      {/* Footer avec transition d'opacité */}
      <div 
        className={`transition-all duration-300 ${user ? (footerVisible ? 'opacity-100' : 'opacity-0 pointer-events-none hover:opacity-100 hover:pointer-events-auto') : 'opacity-100'}`}
        onMouseEnter={handleFooterHoverEnter}
        onMouseLeave={handleFooterHoverLeave}
      >
        <Footer />
      </div>
    </div>
  );
}
