import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Profpoto - Accompagnement personnalisé en mathématiques",
  description: "Profpoto propose un accompagnement personnalisé en mathématiques pour les élèves du collège et du lycée, combinant intelligence artificielle et professeurs qualifiés.",
  keywords: ["mathématiques", "soutien scolaire", "collège", "lycée", "IA", "professeurs"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                // Check if there's a saved theme preference
                const savedTheme = localStorage.getItem('theme');
                
                if (savedTheme) {
                  // Apply saved theme
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(savedTheme);
                } else {
                  // Default to light mode if no preference
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  localStorage.setItem('theme', 'light');
                }
              } catch (e) {
                console.error('Error applying theme:', e);
                document.documentElement.classList.add('light');
              }
            })();

            // Define global theme toggle function
            window.toggleTheme = function(theme) {
              if (theme === 'light' || theme === 'dark') {
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
                localStorage.setItem('theme', theme);
                console.log('Theme switched to:', theme);
              } else {
                console.error('Invalid theme:', theme);
              }
            };
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
