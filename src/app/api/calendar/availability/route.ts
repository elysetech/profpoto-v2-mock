import { NextResponse } from 'next/server';
import { getTeacherById } from '@/lib/teacher-service';
import { getMockAvailableTimeSlots } from '@/lib/mock-calendar';

/**
 * Route API pour récupérer les disponibilités d'un professeur
 * GET /api/calendar/availability?teacherId=xxx&date=YYYY-MM-DD
 */
export async function GET(request: Request) {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const date = searchParams.get('date');
    
    if (!teacherId || !date) {
      return NextResponse.json(
        { success: false, message: "Paramètres manquants: teacherId et date sont requis" },
        { status: 400 }
      );
    }
    
    // Valider le format de la date (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { success: false, message: "Format de date invalide. Utilisez le format YYYY-MM-DD" },
        { status: 400 }
      );
    }
    
    // Récupérer les informations du professeur
    const teacher = await getTeacherById(teacherId);
    
    if (!teacher || !teacher.calendarId) {
      return NextResponse.json(
        { success: false, message: "Professeur non trouvé ou calendrier non configuré" },
        { status: 404 }
      );
    }
    
    // Récupérer les créneaux disponibles (version mock pour éviter les problèmes avec Google Calendar)
    const workHourStart = teacher.workHours?.start || '09:00';
    const workHourEnd = teacher.workHours?.end || '18:00';
    
    const availableSlots = await getMockAvailableTimeSlots(
      date,
      workHourStart,
      workHourEnd,
      60 // Durée d'un créneau en minutes
    );
    
    return NextResponse.json({
      success: true,
      teacherId,
      date,
      availableSlots
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des disponibilités:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de la récupération des disponibilités: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
