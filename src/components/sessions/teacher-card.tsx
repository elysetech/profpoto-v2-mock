"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Teacher } from '@/lib/teacher-service';
import { BookingCalendar } from './booking-calendar';

interface TeacherCardProps {
  teacher: Teacher;
  onBookSession: (teacherId: string, startTime: string, endTime: string, topic?: string) => Promise<void>;
}

export function TeacherCard({ teacher, onBookSession }: TeacherCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleBookSession = async (startTime: string, endTime: string) => {
    if (!teacher.id) return;
    
    setIsSubmitting(true);
    try {
      await onBookSession(teacher.id, startTime, endTime, topic);
      setIsBookingOpen(false);
      setTopic('');
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className={!teacher.available ? "opacity-60" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <img 
              src={teacher.image || "https://randomuser.me/api/portraits/lego/1.jpg"} 
              alt={teacher.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-lg">{teacher.name}</h3>
            <p className="text-sm text-gray-500">{teacher.specialty}</p>
            {teacher.rating && (
              <div className="flex items-center mt-1">
                <div className="flex items-center text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm">{teacher.rating}</span>
                </div>
                {teacher.reviews && (
                  <>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{teacher.reviews} avis</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {teacher.bio && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">{teacher.bio}</p>
          </div>
        )}
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Disponibilité</span>
            <span className={teacher.available ? "text-green-600" : "text-red-600"}>
              {teacher.available ? "Disponible" : "Indisponible"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Durée de session</span>
            <span>1 heure</span>
          </div>
          {teacher.languages && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Langues</span>
              <span>{teacher.languages.join(', ')}</span>
            </div>
          )}
          {teacher.hourlyRate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tarif horaire</span>
              <span>{teacher.hourlyRate}€/h</span>
            </div>
          )}
        </div>
        
        {isBookingOpen ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium mb-1">
                Sujet de la session (optionnel)
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Équations du second degré"
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <BookingCalendar 
              teacher={teacher} 
              onBookSession={handleBookSession} 
            />
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsBookingOpen(false)}
                className="mr-2"
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {}}
            >
              Voir profil
            </Button>
            <Button 
              className="flex-1" 
              disabled={!teacher.available || isSubmitting}
              onClick={() => setIsBookingOpen(true)}
            >
              Réserver
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
