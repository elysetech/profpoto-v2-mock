// Imports non utilisés supprimés pour éviter les avertissements ESLint

/**
 * Génère des créneaux disponibles fictifs pour un professeur
 * @param date Date pour laquelle générer des créneaux (YYYY-MM-DD)
 * @param workHourStart Heure de début de la journée de travail (HH:MM)
 * @param workHourEnd Heure de fin de la journée de travail (HH:MM)
 * @param slotDuration Durée d'un créneau en minutes
 * @returns Liste des créneaux disponibles au format ISO string
 */
export function getMockAvailableTimeSlots(
  date: string,
  workHourStart: string = '09:00',
  workHourEnd: string = '18:00',
  slotDuration: number = 60
): {start: string, end: string}[] {
  // Construire les dates de début et de fin pour la journée
  const startTime = new Date(`${date}T${workHourStart}:00`);
  const endTime = new Date(`${date}T${workHourEnd}:00`);
  
  // Générer tous les créneaux possibles pour la journée
  const allSlots = [];
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
  
  // Simuler des créneaux occupés (par exemple, 30% des créneaux sont occupés)
  const availableSlots = allSlots.filter(() => Math.random() > 0.3);
  
  // Convertir les créneaux en format ISO string
  return availableSlots.map(slot => ({
    start: slot.start.toISOString(),
    end: slot.end.toISOString()
  }));
}

/**
 * Vérifie si un créneau est disponible (simulation)
 * @param startTime Heure de début (ISO string)
 * @param endTime Heure de fin (ISO string)
 * @returns true si le créneau est disponible, false sinon
 */
export function checkMockTimeSlotAvailability(
  _startTime: string,  // Préfixé avec _ pour indiquer qu'il n'est pas utilisé
  _endTime: string     // Préfixé avec _ pour indiquer qu'il n'est pas utilisé
): boolean {
  // Simuler une disponibilité aléatoire (80% de chance d'être disponible)
  return Math.random() > 0.2;
}

export default {
  getMockAvailableTimeSlots,
  checkMockTimeSlotAvailability
};
