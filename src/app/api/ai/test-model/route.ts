import { NextResponse } from 'next/server';

/**
 * Route API pour tester un modèle OpenAI spécifique
 * GET /api/ai/test-model?model=gpt-4o-mini
 */
export async function GET(request: Request) {
  try {
    // Récupérer le modèle à tester depuis les paramètres de requête
    const url = new URL(request.url);
    const model = url.searchParams.get('model') || 'gpt-4o-mini';
    
    console.log(`Test du modèle OpenAI: ${model}...`);
    
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé API OpenAI non définie");
      return NextResponse.json(
        { success: false, message: "Clé API OpenAI non définie" },
        { status: 500 }
      );
    }
    
    // Faire une requête simple à l'API OpenAI pour tester le modèle
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: "Tu es un assistant utile et concis."
          },
          {
            role: 'user',
            content: "Réponds simplement 'Test réussi!' pour vérifier que tu fonctionnes correctement."
          }
        ],
        max_tokens: 50,
        temperature: 0,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error(`Erreur API OpenAI avec le modèle ${model}:`, error);
      
      // Vérifier si l'erreur est liée au modèle
      if (error.error?.message?.includes('model')) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Le modèle "${model}" n'est pas disponible ou n'est pas accessible avec votre clé API.`,
            error: error.error?.message,
            suggestion: "Essayez un autre modèle comme 'gpt-4' ou 'gpt-3.5-turbo'."
          },
          { status: 400 }
        );
      }
      
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
    const responseText = result.choices[0].message.content;
    
    console.log(`Test du modèle ${model} réussi, réponse:`, responseText);
    
    return NextResponse.json({ 
      success: true, 
      message: `Test du modèle ${model} réussi`,
      model: model,
      response: responseText,
      usage: result.usage
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors du test du modèle OpenAI:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors du test du modèle OpenAI: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
