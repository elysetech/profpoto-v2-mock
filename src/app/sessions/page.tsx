"use client";

import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { getAvailableTeachers, Session, Teacher } from '@/lib/teacher-service';
import { TeacherCard } from '@/components/sessions/teacher-card';
import { SessionCard } from '@/components/sessions/session-card';
import { auth } from '@/lib/firebase';

export default function SessionsPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sessions, setSessions] = useState<(Session & { teacher?: Partial<Teacher> | null })[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(auth.currentUser);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        router.push('/login');
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  // Charger les professeurs disponibles
  useEffect(() => {
    const fetchTeachers = async () => {
      if (!user) return;
      
      setIsLoadingTeachers(true);
      try {
        const teachersData = await getAvailableTeachers();
        setTeachers(teachersData);
      } catch (error) {
        console.error('Erreur lors du chargement des professeurs:', error);
        setError('Impossible de charger les professeurs disponibles');
      } finally {
        setIsLoadingTeachers(false);
      }
    };
    
    fetchTeachers();
  }, [user]);

  // Charger les sessions de l'utilisateur
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      
      setIsLoadingSessions(true);
      try {
        const response = await fetch('/api/sessions/list');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des sessions');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setSessions(data.sessions);
        } else {
          throw new Error(data.message || 'Erreur lors de la récupération des sessions');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des sessions:', error);
        setError('Impossible de charger vos sessions');
      } finally {
        setIsLoadingSessions(false);
      }
    };
    
    fetchSessions();
  }, [user]);

  // Réserver une session avec un professeur
  const handleBookSession = async (teacherId: string, startTime: string, endTime: string, topic?: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      const response = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId,
          startTime,
          endTime,
          topic
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la réservation de la session');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Recharger les sessions après la réservation
        const sessionsResponse = await fetch('/api/sessions/list');
        const sessionsData = await sessionsResponse.json();
        
        if (sessionsData.success) {
          setSessions(sessionsData.sessions);
        }
        
        // Afficher un message de succès
        alert('Session réservée avec succès !');
      } else {
        throw new Error(data.message || 'Erreur lors de la réservation de la session');
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la réservation de la session');
    }
  };

  // Annuler une session
  const handleCancelSession = async (sessionId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      const response = await fetch('/api/sessions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'annulation de la session');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour l'état local pour refléter l'annulation
        setSessions(prevSessions => 
          prevSessions.map(session => 
            session.id === sessionId 
              ? { ...session, status: 'cancelled' } 
              : session
          )
        );
        
        // Afficher un message de succès
        alert('Session annulée avec succès !');
      } else {
        throw new Error(data.message || 'Erreur lors de l\'annulation de la session');
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      throw error;
    }
  };

  // Filtrer les sessions à venir
  const upcomingSessions = sessions.filter(session => 
    session.status !== 'cancelled' && session.status !== 'completed'
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sessions avec professeurs</h1>
          <Link href="/dashboard">
            <Button variant="outline">Retour au tableau de bord</Button>
          </Link>
        </div>

        {/* Afficher un message d'erreur si nécessaire */}
        {error && (
          <Card className="mb-8 bg-red-50">
            <CardContent className="p-4 text-red-600">
              {error}
            </CardContent>
          </Card>
        )}

        {/* Sessions à venir */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Sessions à venir</h2>
          
          {isLoadingSessions ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : upcomingSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions.map((session) => (
                <SessionCard 
                  key={session.id} 
                  session={session} 
                  onCancelSession={handleCancelSession} 
                />
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Aucune session à venir</h3>
                <p className="text-gray-500 mb-4">
                  Réservez une session avec un professeur qualifié pour un accompagnement personnalisé.
                </p>
              </div>
            </Card>
          )}
        </section>

        {/* Professeurs disponibles */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Professeurs disponibles</h2>
          
          {isLoadingTeachers ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : teachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <TeacherCard 
                  key={teacher.id} 
                  teacher={teacher} 
                  onBookSession={handleBookSession} 
                />
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Aucun professeur disponible</h3>
                <p className="text-gray-500 mb-4">
                  Aucun professeur n&apos;est disponible pour le moment. Veuillez réessayer plus tard.
                </p>
              </div>
            </Card>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
