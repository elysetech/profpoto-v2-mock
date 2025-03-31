import { google } from 'googleapis';

// Clé API Google Calendar
const API_KEY = 'AIzaSyCz35T9dr0dHxOFVoki9sSfqYnMPInpmDs';

// Initialiser le client Google Calendar avec la clé API
const calendar = google.calendar({
  version: 'v3',
  auth: API_KEY
});

/**
 * Récupère les événements d'un calendrier Google
 * @param calendarId ID du calendrier à consulter
 * @param timeMin Date de début (ISO string)
 * @param timeMax Date de fin (ISO string)
 * @returns Liste des événements
 */
export async function getCalendarEvents(
  calendarId: string,
  timeMin: string,
  timeMax: string
) {
  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    throw error;
  }
}

/**
 * Vérifie la disponibilité d'un créneau horaire
 * @param calendarId ID du calendrier à consulter
 * @param startTime Heure de début (ISO string)
 * @param endTime Heure de fin (ISO string)
 * @returns true si le créneau est disponible, false sinon
 */
export async function checkTimeSlotAvailability(
  calendarId: string,
  startTime: string,
  endTime: string
) {
  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime,
        timeMax: endTime,
        items: [{ id: calendarId }]
      }
    });

    const busySlots = response.data.calendars?.[calendarId]?.busy || [];
    return busySlots.length === 0; // Disponible si aucun créneau occupé
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error);
    throw error;
  }
}

/**
 * Récupère les créneaux disponibles pour un calendrier sur une période donnée
 * @param calendarId ID du calendrier à consulter
 * @param date Date pour laquelle chercher des créneaux (YYYY-MM-DD)
 * @param workHourStart Heure de début de la journée de travail (HH:MM)
 * @param workHourEnd Heure de fin de la journée de travail (HH:MM)
 * @param slotDuration Durée d'un créneau en minutes
 * @returns Liste des créneaux disponibles au format ISO string
 */
export async function getAvailableTimeSlots(
  calendarId: string,
  date: string,
  workHourStart: string = '09:00',
  workHourEnd: string = '18:00',
  slotDuration: number = 60
) {
  try {
    // Construire les dates de début et de fin pour la journée
    const timeMin = `${date}T${workHourStart}:00`;
    const timeMax = `${date}T${workHourEnd}:00`;
    
    // Récupérer les événements existants
    const events = await getCalendarEvents(calendarId, timeMin, timeMax);
    
    // Convertir les événements en périodes occupées
    const busySlots = events.map(event => ({
      start: new Date(event.start?.dateTime || event.start?.date || ''),
      end: new Date(event.end?.dateTime || event.end?.date || '')
    }));
    
    // Générer tous les créneaux possibles pour la journée
    const allSlots = [];
    const startTime = new Date(`${date}T${workHourStart}:00`);
    const endTime = new Date(`${date}T${workHourEnd}:00`);
    
    let currentSlotStart = new Date(startTime);
    
    while (currentSlotStart < endTime) {
      const currentSlotEnd = new Date(currentSlotStart);
      currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + slotDuration);
      
      if (currentSlotEnd <= endTime) {
        allSlots.push({
          start: new Date(currentSlotStart),
          end: new Date(currentSlotEnd)
        });
      }
      
      currentSlotStart = new Date(currentSlotEnd);
    }
    
    // Filtrer les créneaux disponibles (ceux qui ne chevauchent pas les périodes occupées)
    const availableSlots = allSlots.filter(slot => {
      return !busySlots.some(busySlot => {
        return (
          (slot.start >= busySlot.start && slot.start < busySlot.end) ||
          (slot.end > busySlot.start && slot.end <= busySlot.end) ||
          (slot.start <= busySlot.start && slot.end >= busySlot.end)
        );
      });
    });
    
    // Convertir les créneaux en format ISO string
    return availableSlots.map(slot => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux disponibles:', error);
    throw error;
  }
}
