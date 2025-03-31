import { NextResponse } from 'next/server';

/**
 * Route API pour générer une correction d'exercice avec OpenAI
 * POST /api/ai/correction
 * Body: { documentId: string, text: string, mathExpressions: string[] }
 */
export async function POST(request: Request) {
  try {
    // Récupérer les données du corps de la requête
    const { documentId, text, mathExpressions } = await request.json();
    
    if (!documentId || !text) {
      return NextResponse.json(
        { success: false, message: "Données invalides ou manquantes" },
        { status: 400 }
      );
    }
    
    console.log(`Génération d'une correction pour le document ${documentId}...`);
    
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé API OpenAI non définie");
      return NextResponse.json(
        { success: false, message: "Clé API OpenAI non définie" },
        { status: 500 }
      );
    }
    
    // Construire le prompt pour la correction
    let prompt = "Tu es ProfPoto AI, un assistant pédagogique spécialisé en mathématiques. ";
    prompt += "Ta tâche est de fournir une correction détaillée et pédagogique pour l'exercice mathématique suivant. ";
    prompt += "Explique chaque étape de résolution de manière claire et précise, en détaillant le raisonnement mathématique. ";
    prompt += "Utilise un format Markdown pour structurer ta réponse avec des titres, sous-titres, listes et formules mathématiques. ";
    prompt += "Adapte ton explication pour un élève de collège ou lycée. ";
    
    // Ajouter le texte du document
    prompt += "\n\nTexte de l'exercice:\n" + text;
    
    // Ajouter les expressions mathématiques si disponibles
    if (mathExpressions && mathExpressions.length > 0) {
      prompt += "\n\nExpressions mathématiques identifiées dans l'exercice:\n";
      mathExpressions.forEach((expr: string, index: number) => {
        prompt += `${index + 1}. ${expr}\n`;
      });
    }
    
    prompt += "\n\nFournis une correction complète et détaillée de cet exercice, en expliquant chaque étape du raisonnement.";
    
    // Faire une requête à l'API OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Utiliser gpt-4o pour une meilleure qualité de correction
        messages: [
          {
            role: 'system',
            content: 'Tu es un professeur de mathématiques expert qui fournit des corrections détaillées et pédagogiques.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
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
    const correction = result.choices[0].message.content;
    
    console.log("Correction générée avec succès");
    
    return NextResponse.json({ 
      success: true, 
      correction,
      documentId,
      usage: result.usage
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de la génération de la correction:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de la génération de la correction: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
