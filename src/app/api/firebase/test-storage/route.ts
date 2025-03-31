import { NextResponse } from 'next/server';
import { testFirebaseStorage } from '@/lib/firebase-admin';

/**
 * Route API pour tester l'upload vers Firebase Storage
 * GET /api/firebase/test-storage
 */
export async function GET() {
  try {
    console.log("Test d'upload vers Firebase Storage via Admin SDK...");
    
    // Utiliser la fonction de test du module firebase-admin
    const result = await testFirebaseStorage();
    
    if (!result.success) {
      console.error("Erreur lors du test d'upload:", result.message);
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
    
    console.log("Test d'upload réussi, URL:", result.downloadUrl);
    
    return NextResponse.json({ 
      success: true, 
      message: "Test d'upload vers Firebase Storage réussi",
      downloadUrl: result.downloadUrl,
      fileName: result.fileName
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors du test d'upload vers Firebase Storage:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors du test d'upload vers Firebase Storage: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      },
      { status: 500 }
    );
  }
}
