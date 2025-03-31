import { NextResponse } from 'next/server';

/**
 * Route API pour vérifier si la clé API OpenAI est correctement chargée
 * GET /api/ai/check-api-key
 */
export async function GET() {
  try {
    console.log("Vérification de la clé API OpenAI...");
    
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Vérifier si la clé est définie
    if (!apiKey) {
      console.error("Clé API OpenAI non définie dans les variables d'environnement");
      return NextResponse.json({
        success: false,
        message: "Clé API OpenAI non définie dans les variables d'environnement",
        envVars: Object.keys(process.env).filter(key => !key.includes('KEY') && !key.includes('SECRET')),
      });
    }
    
    // Vérifier si la clé commence par "sk-"
    if (!apiKey.startsWith('sk-')) {
      console.error("Format de clé API OpenAI invalide");
      return NextResponse.json({
        success: false,
        message: "Format de clé API OpenAI invalide. La clé doit commencer par 'sk-'",
        keyPrefix: apiKey.substring(0, 5) + '...',
      });
    }
    
    // Vérifier la longueur de la clé
    if (apiKey.length < 30) {
      console.error("Longueur de clé API OpenAI insuffisante");
      return NextResponse.json({
        success: false,
        message: "Longueur de clé API OpenAI insuffisante",
        keyLength: apiKey.length,
      });
    }
    
    console.log("Clé API OpenAI correctement chargée");
    
    return NextResponse.json({
      success: true,
      message: "Clé API OpenAI correctement chargée",
      keyLength: apiKey.length,
      keyPrefix: apiKey.substring(0, 5) + '...',
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de la vérification de la clé API OpenAI:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de la vérification de la clé API OpenAI: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
