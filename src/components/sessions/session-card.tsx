"use client";

import { useState } from 'react';
import { format, parseISO, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Session, Teacher } from '@/lib/teacher-service';

interface SessionCardProps {
  session: Session & { teacher?: Partial<Teacher> | null };
  onCancelSession: (sessionId: string) => Promise<void>;
}

export function SessionCard({ session, onCancelSession }: SessionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formater la date et l'heure pour l'affichage
  const formatDateTime = (isoString: string) => {
    const date = parseISO(isoString);
    return format(date, 'EEEE d MMMM yyyy à HH:mm', { locale: fr });
  };
  
  // Vérifier si la session est à venir
  const isUpcoming = session.startTime ? isAfter(parseISO(session.startTime), new Date()) : false;
  
  // Vérifier si la session est annulable (24h avant)
  const isCancellable = isUpcoming && session.status !== 'cancelled';
  
  // Gérer l'annulation d'une session
  const handleCancelSession = async () => {
    if (!session.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onCancelSession(session.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'annulation de la session');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Déterminer le statut à afficher
  const getStatusDisplay = () => {
    switch (session.status) {
      case 'pending':
        return { text: 'En attente de confirmation', color: 'text-yellow-600' };
      case 'confirmed':
        return { text: 'Confirmée', color: 'text-green-600' };
      case 'cancelled':
        return { text: 'Annulée', color: 'text-red-600' };
      case 'completed':
        return { text: 'Terminée', color: 'text-blue-600' };
      default:
        return { text: 'Statut inconnu', color: 'text-gray-600' };
    }
  };
  
  const statusDisplay = getStatusDisplay();
  
  return (
    <Card className={session.status === 'cancelled' ? "opacity-60" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          {session.teacher?.image && (
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img 
                src={session.teacher.image} 
                alt={session.teacher.name || 'Professeur'} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h3 className="font-medium">{session.teacher?.name || 'Professeur'}</h3>
            <p className="text-sm text-gray-500">{session.teacher?.specialty || 'Mathématiques'}</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Statut</span>
            <span className={statusDisplay.color}>{statusDisplay.text}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Date et heure</span>
            <span>{session.startTime ? formatDateTime(session.startTime) : 'Non défini'}</span>
          </div>
          
          {session.topic && (
            <div className="flex justify-between">
              <span className="text-gray-500">Sujet</span>
              <span>{session.topic}</span>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
            {error}
          </div>
        )}
        
        <div className="flex gap-2">
          {isCancellable && (
            <Button 
              variant="outline" 
              className="flex-1 text-red-600 hover:bg-red-50"
              onClick={handleCancelSession}
              disabled={isLoading}
            >
              {isLoading ? 'Annulation...' : 'Annuler'}
            </Button>
          )}
          
          {isUpcoming && session.status !== 'cancelled' && (
            <Button className="flex-1">
              Rejoindre
            </Button>
          )}
          
          {!isUpcoming && session.status === 'completed' && (
            <Button variant="outline" className="flex-1">
              Voir le résumé
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
