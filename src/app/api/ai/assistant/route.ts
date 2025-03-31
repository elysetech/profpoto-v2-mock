import { NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * Route API pour interagir avec l'API Assistants d'OpenAI
 * POST /api/ai/assistant
 * Body: { 
 *   threadId?: string, 
 *   assistantId: string, 
 *   message: string,
 *   documentId?: string
 * }
 */
export async function POST(request: Request) {
  try {
    // Récupérer les données du corps de la requête
    const { threadId, assistantId, message } = await request.json();
    
    if (!assistantId) {
      return NextResponse.json(
        { success: false, message: "ID d'assistant manquant" },
        { status: 400 }
      );
    }
    
    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message manquant" },
        { status: 400 }
      );
    }
    
    console.log(`Traitement de la requête assistant avec assistantId: ${assistantId}`);
    
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé API OpenAI non définie");
      return NextResponse.json(
        { success: false, message: "Clé API OpenAI non définie" },
        { status: 500 }
      );
    }
    
    // Initialiser le client OpenAI
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Créer un nouveau thread ou utiliser un existant
    let thread;
    if (threadId) {
      // Récupérer le thread existant
      thread = await openai.beta.threads.retrieve(threadId);
    } else {
      // Créer un nouveau thread
      thread = await openai.beta.threads.create();
    }
    
    // Ajouter le message au thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });
    
    // Exécuter l'assistant sur le thread
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });
    
    // Attendre que l'exécution soit terminée
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    // Attendre que l'exécution soit terminée (avec un délai maximum de 60 secondes)
    const startTime = Date.now();
    const maxWaitTime = 60000; // 60 secondes
    
    while (runStatus.status !== "completed" && runStatus.status !== "failed" && Date.now() - startTime < maxWaitTime) {
      // Attendre 1 seconde avant de vérifier à nouveau
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    
    if (runStatus.status === "failed") {
      console.error("Échec de l'exécution de l'assistant:", runStatus.last_error);
      return NextResponse.json(
        { 
          success: false, 
          message: `Échec de l'exécution de l'assistant: ${runStatus.last_error?.message || "Erreur inconnue"}` 
        },
        { status: 500 }
      );
    }
    
    if (runStatus.status !== "completed") {
      console.error("L'exécution de l'assistant a pris trop de temps");
      return NextResponse.json(
        { success: false, message: "L'exécution de l'assistant a pris trop de temps" },
        { status: 504 }
      );
    }
    
    // Récupérer les messages du thread
    const messages = await openai.beta.threads.messages.list(thread.id);
    
    // Récupérer la dernière réponse de l'assistant
    const assistantMessages = messages.data.filter(msg => msg.role === "assistant");
    
    if (assistantMessages.length === 0) {
      return NextResponse.json(
        { success: false, message: "Aucune réponse de l'assistant" },
        { status: 500 }
      );
    }
    
    // Récupérer le contenu du dernier message de l'assistant
    const lastAssistantMessage = assistantMessages[0];
    let assistantResponse = "";
    
    // Extraire le texte du message (peut contenir plusieurs parties)
    for (const content of lastAssistantMessage.content) {
      if (content.type === "text") {
        assistantResponse += content.text.value;
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      threadId: thread.id,
      message: assistantResponse,
      messageId: lastAssistantMessage.id
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors du traitement de la requête assistant:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors du traitement de la requête assistant: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}

/**
 * Route API pour récupérer l'historique des messages d'un thread
 * GET /api/ai/assistant?threadId=xxx
 */
export async function GET(request: Request) {
  try {
    // Récupérer le threadId depuis les paramètres de requête
    const url = new URL(request.url);
    const threadId = url.searchParams.get('threadId');
    
    if (!threadId) {
      return NextResponse.json(
        { success: false, message: "ID de thread manquant" },
        { status: 400 }
      );
    }
    
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé API OpenAI non définie");
      return NextResponse.json(
        { success: false, message: "Clé API OpenAI non définie" },
        { status: 500 }
      );
    }
    
    // Initialiser le client OpenAI
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Récupérer les messages du thread
    const messages = await openai.beta.threads.messages.list(threadId);
    
    // Formater les messages pour les renvoyer
    const formattedMessages = messages.data.map(msg => {
      let content = "";
      
      // Extraire le texte du message (peut contenir plusieurs parties)
      for (const contentPart of msg.content) {
        if (contentPart.type === "text") {
          content += contentPart.text.value;
        }
      }
      
      return {
        id: msg.id,
        role: msg.role,
        content: content,
        createdAt: msg.created_at
      };
    });
    
    return NextResponse.json({ 
      success: true, 
      messages: formattedMessages
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des messages:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de la récupération des messages: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
