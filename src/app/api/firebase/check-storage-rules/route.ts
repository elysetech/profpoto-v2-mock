import { NextResponse } from 'next/server';
import { checkStorageRules } from '@/lib/firebase-admin';

/**
 * Route API pour vérifier les règles de sécurité Firebase Storage
 * GET /api/firebase/check-storage-rules
 */
export async function GET() {
  try {
    console.log("Vérification des règles de sécurité Firebase Storage via Admin SDK...");
    
    // Utiliser la fonction de vérification du module firebase-admin
    const result = await checkStorageRules();
    
    if (!result.success) {
      console.error("Erreur lors de la vérification des règles:", result.message);
      return NextResponse.json({
        success: false,
        message: result.message,
        solution: result.solution
      }, { status: 500 });
    }
    
    console.log("Vérification des règles réussie, bucket:", result.bucketName);
    
    return NextResponse.json({
      success: true,
      message: "Les règles de sécurité Firebase Storage semblent correctement configurées.",
      bucketName: result.bucketName,
      isPublic: result.isPublic,
      recommendations: result.recommendations
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de la vérification des règles de sécurité:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de la vérification des règles de sécurité: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        solution: "Vérifiez la console Firebase pour plus de détails sur l'erreur. Assurez-vous que votre projet Firebase est correctement configuré et que vous avez les autorisations nécessaires."
      },
      { status: 500 }
    );
  }
}
