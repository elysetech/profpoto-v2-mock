import { NextResponse } from 'next/server';
import { updateSessionStatus, getSessionDetails } from '@/lib/teacher-service';
import { auth } from '@/lib/firebase';

/**
 * Route API pour annuler une session
 * POST /api/sessions/cancel
 * Body: { sessionId: string }
 */
export async function POST(request: Request) {
  try {
    // Vérifier que l'utilisateur est connecté
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Vous devez être connecté pour annuler une session" },
        { status: 401 }
      );
    }
    
    // Récupérer les données du corps de la requête
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "ID de session manquant" },
        { status: 400 }
      );
    }
    
    // Récupérer les détails de la session
    const sessionDetails = await getSessionDetails(sessionId);
    
    if (!sessionDetails) {
      return NextResponse.json(
        { success: false, message: "Session non trouvée" },
        { status: 404 }
      );
    }
    
    // Vérifier que l'utilisateur est bien l'étudiant de cette session
    if (sessionDetails.session.studentId !== currentUser.uid) {
      return NextResponse.json(
        { success: false, message: "Vous n'êtes pas autorisé à annuler cette session" },
        { status: 403 }
      );
    }
    
    // Vérifier que la session n'est pas déjà annulée ou terminée
    if (sessionDetails.session.status === 'cancelled' || sessionDetails.session.status === 'completed') {
      return NextResponse.json(
        { 
          success: false, 
          message: `Impossible d'annuler une session déjà ${sessionDetails.session.status === 'cancelled' ? 'annulée' : 'terminée'}` 
        },
        { status: 400 }
      );
    }
    
    // Mettre à jour le statut de la session
    await updateSessionStatus(sessionId, 'cancelled');
    
    return NextResponse.json({
      success: true,
      message: "Session annulée avec succès"
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de l'annulation de la session:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de l'annulation de la session: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
