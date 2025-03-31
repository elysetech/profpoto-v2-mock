import { NextResponse } from 'next/server';

/**
 * Route API pour générer un exercice similaire avec OpenAI
 * POST /api/ai/similar-exercise
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
    
    console.log(`Génération d'un exercice similaire pour le document ${documentId}...`);
    
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé API OpenAI non définie");
      return NextResponse.json(
        { success: false, message: "Clé API OpenAI non définie" },
        { status: 500 }
      );
    }
    
    // Construire le prompt pour l'exercice similaire
    let prompt = "Tu es ProfPoto AI, un assistant pédagogique spécialisé en mathématiques. ";
    prompt += "Ta tâche est de générer un nouvel exercice similaire à l'exercice mathématique suivant, mais avec des valeurs et des données différentes. ";
    prompt += "L'exercice doit tester les mêmes concepts et avoir un niveau de difficulté équivalent. ";
    prompt += "Utilise un format Markdown pour structurer l'exercice avec des titres, sous-titres, listes et formules mathématiques. ";
    prompt += "Adapte la difficulté pour un élève de collège ou lycée. ";
    
    // Ajouter le texte du document
    prompt += "\n\nTexte de l'exercice original:\n" + text;
    
    // Ajouter les expressions mathématiques si disponibles
    if (mathExpressions && mathExpressions.length > 0) {
      prompt += "\n\nExpressions mathématiques identifiées dans l'exercice original:\n";
      mathExpressions.forEach((expr: string, index: number) => {
        prompt += `${index + 1}. ${expr}\n`;
      });
    }
    
    prompt += "\n\nGénère un nouvel exercice similaire, avec des valeurs différentes mais testant les mêmes concepts mathématiques. Inclus également la correction détaillée de ce nouvel exercice.";
    
    // Faire une requête à l'API OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Utiliser gpt-4o pour une meilleure qualité d'exercice
        messages: [
          {
            role: 'system',
            content: 'Tu es un professeur de mathématiques expert qui crée des exercices pédagogiques similaires à des exercices existants.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
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
    const similarExercise = result.choices[0].message.content;
    
    console.log("Exercice similaire généré avec succès");
    
    return NextResponse.json({ 
      success: true, 
      similarExercise,
      documentId,
      usage: result.usage
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de la génération de l'exercice similaire:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de la génération de l'exercice similaire: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
