import { NextResponse } from 'next/server';
import { createSession, getTeacherById } from '@/lib/teacher-service';
import { auth } from '@/lib/firebase';

/**
 * Route API pour créer une nouvelle session avec un professeur
 * POST /api/sessions/create
 * Body: { teacherId: string, startTime: string, endTime: string, topic?: string }
 */
export async function POST(request: Request) {
  try {
    // Vérifier que l'utilisateur est connecté
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Vous devez être connecté pour réserver une session" },
        { status: 401 }
      );
    }
    
    // Récupérer les données du corps de la requête
    const { teacherId, startTime, endTime, topic } = await request.json();
    
    if (!teacherId || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: "Données invalides ou manquantes" },
        { status: 400 }
      );
    }
    
    // Vérifier que le professeur existe
    const teacher = await getTeacherById(teacherId);
    
    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Professeur non trouvé" },
        { status: 404 }
      );
    }
    
    // Vérifier que le professeur est disponible
    if (teacher.available === false) {
      return NextResponse.json(
        { success: false, message: "Ce professeur n'est pas disponible actuellement" },
        { status: 400 }
      );
    }
    
    // Créer la session
    const sessionId = await createSession({
      teacherId,
      studentId: currentUser.uid,
      startTime,
      endTime,
      topic,
      status: 'pending'
    });
    
    return NextResponse.json({
      success: true,
      sessionId,
      message: "Session réservée avec succès"
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de la création de la session:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de la création de la session: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
