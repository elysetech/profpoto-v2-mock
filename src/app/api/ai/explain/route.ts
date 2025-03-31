import { NextResponse } from 'next/server';

/**
 * Route API pour générer une explication avec OpenAI
 * POST /api/ai/explain
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
    
    console.log(`Génération d'une explication pour le document ${documentId}...`);
    
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé API OpenAI non définie");
      return NextResponse.json(
        { success: false, message: "Clé API OpenAI non définie" },
        { status: 500 }
      );
    }
    
    // Construire le prompt pour l'explication
    let prompt = "Tu es ProfPoto AI, un assistant pédagogique spécialisé en mathématiques. ";
    prompt += "Ta tâche est d'expliquer de manière claire et pédagogique le contenu mathématique suivant. ";
    prompt += "Décompose les concepts complexes en éléments plus simples et fournit des explications adaptées à un élève de collège ou lycée. ";
    prompt += "Utilise un format Markdown pour structurer ta réponse avec des titres, sous-titres, listes et formules mathématiques. ";
    
    // Ajouter le texte du document
    prompt += "\n\nTexte à expliquer:\n" + text;
    
    // Ajouter les expressions mathématiques si disponibles
    if (mathExpressions && mathExpressions.length > 0) {
      prompt += "\n\nExpressions mathématiques identifiées dans le texte:\n";
      mathExpressions.forEach((expr: string, index: number) => {
        prompt += `${index + 1}. ${expr}\n`;
      });
    }
    
    prompt += "\n\nFournis une explication détaillée et pédagogique du contenu mathématique ci-dessus, en veillant à clarifier tous les concepts importants.";
    
    // Faire une requête à l'API OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Utiliser gpt-4o pour une meilleure qualité d'explication
        messages: [
          {
            role: 'system',
            content: 'Tu es un professeur de mathématiques expert qui explique des concepts mathématiques de manière claire et pédagogique.'
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
    const explanation = result.choices[0].message.content;
    
    console.log("Explication générée avec succès");
    
    return NextResponse.json({ 
      success: true, 
      explanation,
      documentId,
      usage: result.usage
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de la génération de l'explication:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de la génération de l'explication: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
