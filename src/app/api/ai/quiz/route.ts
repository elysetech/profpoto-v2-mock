import { NextResponse } from 'next/server';

/**
 * Route API pour générer un quiz avec OpenAI
 * POST /api/ai/quiz
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
    
    console.log(`Génération d'un quiz pour le document ${documentId}...`);
    
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé API OpenAI non définie");
      return NextResponse.json(
        { success: false, message: "Clé API OpenAI non définie" },
        { status: 500 }
      );
    }
    
    // Construire le prompt pour le quiz
    let prompt = "Tu es ProfPoto AI, un assistant pédagogique spécialisé en mathématiques. ";
    prompt += "Ta tâche est de créer un quiz de 5 questions à choix multiples basé sur le contenu mathématique suivant. ";
    prompt += "Chaque question doit avoir 4 options de réponse, dont une seule est correcte. ";
    prompt += "Pour chaque question, fournis également une explication détaillée de la réponse correcte. ";
    prompt += "Utilise un format Markdown pour structurer ton quiz avec des titres, sous-titres et formules mathématiques. ";
    prompt += "Adapte la difficulté des questions pour un élève de collège ou lycée. ";
    
    // Ajouter le texte du document
    prompt += "\n\nTexte du document:\n" + text;
    
    // Ajouter les expressions mathématiques si disponibles
    if (mathExpressions && mathExpressions.length > 0) {
      prompt += "\n\nExpressions mathématiques identifiées dans le document:\n";
      mathExpressions.forEach((expr: string, index: number) => {
        prompt += `${index + 1}. ${expr}\n`;
      });
    }
    
    prompt += "\n\nCrée un quiz de 5 questions à choix multiples avec 4 options par question. Pour chaque question, indique clairement la réponse correcte et fournis une explication détaillée.";
    
    // Faire une requête à l'API OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Utiliser gpt-4o pour une meilleure qualité de quiz
        messages: [
          {
            role: 'system',
            content: 'Tu es un professeur de mathématiques expert qui crée des quiz pédagogiques pour tester la compréhension des élèves.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
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
    const quiz = result.choices[0].message.content;
    
    console.log("Quiz généré avec succès");
    
    return NextResponse.json({ 
      success: true, 
      quiz,
      documentId,
      usage: result.usage
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de la génération du quiz:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de la génération du quiz: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
