import { NextResponse } from 'next/server';

/**
 * Route API pour tester la connexion à l'API OpenAI
 * GET /api/ai/test-api
 */
export async function GET() {
  try {
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé API OpenAI non définie");
      return NextResponse.json(
        { success: false, message: "Clé API OpenAI non définie" },
        { status: 500 }
      );
    }
    
    console.log("Test de connexion à l'API OpenAI...");
    console.log("Longueur de la clé API:", apiKey.length);
    
    // Faire une requête simple à l'API OpenAI pour vérifier la connexion
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("Erreur API OpenAI:", error);
      return NextResponse.json(
        { 
          success: false, 
          message: `Erreur API OpenAI: ${error.error?.message || response.statusText}`,
          status: response.status
        },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    console.log("Connexion à l'API OpenAI réussie, modèles disponibles:", result.data.length);
    
    return NextResponse.json({ 
      success: true, 
      message: "Connexion à l'API OpenAI réussie",
      modelsCount: result.data.length
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors du test de l'API OpenAI:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors du test de l'API OpenAI: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
