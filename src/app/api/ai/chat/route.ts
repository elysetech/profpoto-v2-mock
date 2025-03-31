import { NextResponse } from 'next/server';

/**
 * Route API pour le chat avec OpenAI
 * POST /api/ai/chat
 * Body: { messages: [{ role: 'user', content: 'Hello' }] }
 */
export async function POST(request: Request) {
  try {
    // Récupérer les messages du corps de la requête
    const { messages, documentId } = await request.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, message: "Messages invalides ou manquants" },
        { status: 400 }
      );
    }
    
    console.log(`Traitement de la requête chat avec ${messages.length} messages...`);
    
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé API OpenAI non définie");
      return NextResponse.json(
        { success: false, message: "Clé API OpenAI non définie" },
        { status: 500 }
      );
    }
    
    // Construire le système prompt en fonction du contexte
    let systemPrompt = "Tu es ProfPoto AI, un assistant pédagogique spécialisé en mathématiques. ";
    systemPrompt += "Tu aides les élèves à comprendre les concepts mathématiques, à résoudre des problèmes et à préparer leurs examens. ";
    systemPrompt += "Tu es patient, encourageant et tu expliques les concepts de manière claire et accessible. ";
    systemPrompt += "Tu peux fournir des explications étape par étape, des exemples concrets et des astuces pour mémoriser les formules. ";
    systemPrompt += "Tu adaptes ton niveau d'explication en fonction de l'âge et du niveau de l'élève. ";
    
    if (documentId) {
      systemPrompt += "L'élève t'a partagé un document. Aide-le à comprendre ce document et à répondre à ses questions à ce sujet. ";
    }
    
    systemPrompt += "Réponds toujours en français.";
    
    // Préparer les messages pour l'API OpenAI
    const apiMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages
    ];
    
    // Faire une requête à l'API OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Utiliser gpt-4o-mini par défaut (plus rapide et moins cher)
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1000,
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
    const assistantMessage = result.choices[0].message.content;
    
    console.log("Réponse générée avec succès");
    
    return NextResponse.json({ 
      success: true, 
      message: assistantMessage,
      usage: result.usage
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors du traitement de la requête chat:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors du traitement de la requête chat: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
