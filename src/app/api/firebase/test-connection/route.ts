import { NextResponse } from 'next/server';
import { testFirebaseConnection } from '@/lib/firebase';

/**
 * Route API pour tester la connexion à Firebase
 * GET /api/firebase/test-connection
 */
export async function GET() {
  try {
    console.log("Test de connexion à Firebase...");
    
    // Tester la connexion à Firebase
    const result = await testFirebaseConnection();
    
    if (!result.success) {
      console.error("Erreur de connexion à Firebase:", result.message);
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
    
    console.log("Connexion à Firebase réussie");
    
    return NextResponse.json({ 
      success: true, 
      message: "Connexion à Firebase réussie"
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors du test de connexion à Firebase:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors du test de connexion à Firebase: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
