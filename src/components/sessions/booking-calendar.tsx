"use client";

import { useState, useEffect } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Teacher } from '@/lib/teacher-service';

interface BookingCalendarProps {
  teacher: Teacher;
  onBookSession: (startTime: string, endTime: string) => void;
}

export function BookingCalendar({ teacher, onBookSession }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<{start: string, end: string}[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{start: string, end: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les créneaux disponibles lorsque la date change
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!teacher.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`/api/calendar/availability?teacherId=${teacher.id}&date=${formattedDate}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des disponibilités');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setAvailableSlots(data.availableSlots);
        } else {
          setError(data.message || 'Erreur lors de la récupération des disponibilités');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailableSlots();
  }, [selectedDate, teacher.id]);

  // Formater l'heure pour l'affichage
  const formatTime = (isoString: string) => {
    return format(parseISO(isoString), 'HH:mm', { locale: fr });
  };

  // Gérer la sélection d'un créneau
  const handleSlotSelection = (slot: {start: string, end: string}) => {
    setSelectedSlot(slot);
  };

  // Gérer la réservation d'une session
  const handleBooking = () => {
    if (selectedSlot) {
      onBookSession(selectedSlot.start, selectedSlot.end);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div>
          <h3 className="text-lg font-medium mb-2">Sélectionnez une date</h3>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => date && setSelectedDate(date)}
            minDate={new Date()}
            maxDate={addDays(new Date(), 30)}
            dateFormat="dd/MM/yyyy"
            locale={fr}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">Informations</h3>
          <div className="text-sm text-gray-600">
            <p>• Vous pouvez réserver jusqu&apos;à 30 jours à l&apos;avance</p>
            <p>• Les sessions durent 1 heure</p>
            <p>• Vous pouvez annuler jusqu&apos;à 24h avant la session</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Créneaux disponibles</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-4 text-center text-red-500">
              {error}
            </CardContent>
          </Card>
        ) : availableSlots.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-center">
              Aucun créneau disponible pour cette date. Veuillez sélectionner une autre date.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {availableSlots.map((slot, index) => (
              <Button
                key={index}
                variant={selectedSlot === slot ? "default" : "outline"}
                className={`py-6 ${selectedSlot === slot ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleSlotSelection(slot)}
              >
                {formatTime(slot.start)} - {formatTime(slot.end)}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {selectedSlot && (
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleBooking}
            className="px-6"
          >
            Réserver ce créneau
          </Button>
        </div>
      )}
    </div>
  );
}
