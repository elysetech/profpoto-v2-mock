import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';

/**
 * Route API pour mettre à jour les règles de sécurité Firebase Storage
 * GET /api/firebase/update-storage-rules
 */
export async function GET() {
  try {
    console.log("Mise à jour des règles de sécurité Firebase Storage...");
    
    // Obtenir le bucket
    const bucket = adminStorage.bucket();
    
    // Vérifier si le bucket existe
    const [exists] = await bucket.exists();
    if (!exists) {
      throw new Error("Le bucket de stockage n'existe pas");
    }
    
    // Obtenir les métadonnées du bucket pour vérifier les règles actuelles
    const [metadata] = await bucket.getMetadata();
    console.log("Métadonnées du bucket:", JSON.stringify(metadata, null, 2));
    
    // Recommandations pour les règles de sécurité
    const recommendedRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Permettre l'accès en lecture/écriture pour tous les utilisateurs authentifiés
      allow read, write: if request.auth != null;
    }
  }
}
`;
    
    return NextResponse.json({
      success: true,
      message: "Voici les règles de sécurité recommandées pour Firebase Storage",
      currentBucket: metadata.name,
      recommendedRules: recommendedRules,
      instructions: [
        "1. Allez sur la console Firebase: https://console.firebase.google.com/",
        "2. Sélectionnez votre projet: profpotomvp-d1669",
        "3. Dans le menu de gauche, cliquez sur 'Storage'",
        "4. Cliquez sur l'onglet 'Règles'",
        "5. Remplacez les règles actuelles par les règles recommandées ci-dessus",
        "6. Cliquez sur 'Publier'"
      ]
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de la mise à jour des règles de sécurité:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de la mise à jour des règles de sécurité: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        solution: "Vérifiez la console Firebase pour plus de détails sur l'erreur. Assurez-vous que votre projet Firebase est correctement configuré et que vous avez les autorisations nécessaires."
      },
      { status: 500 }
    );
  }
}
