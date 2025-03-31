import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Route API pour tester l'API Vision d'OpenAI avec un exemple simple
 * GET /api/ai/test-vision
 */
export async function GET() {
  try {
    console.log("Test de l'API Vision d'OpenAI...");
    
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé API OpenAI non définie");
      return NextResponse.json(
        { success: false, message: "Clé API OpenAI non définie" },
        { status: 500 }
      );
    }
    
    // Chemin vers une image de test (utiliser une image du dossier public)
    const imagePath = path.join(process.cwd(), 'public', 'next.svg');
    
    // Vérifier si l'image existe
    if (!fs.existsSync(imagePath)) {
      console.error("Image de test non trouvée:", imagePath);
      return NextResponse.json(
        { success: false, message: "Image de test non trouvée" },
        { status: 500 }
      );
    }
    
    // Lire l'image et la convertir en base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Construire la requête selon la documentation officielle d'OpenAI
    // https://platform.openai.com/docs/guides/vision
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Utiliser gpt-4o pour les images
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Que représente cette image?" },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/svg+xml;base64,${base64Image}`,
                  detail: "high" // high, low, or auto
                }
              }
            ]
          }
        ],
        max_tokens: 300
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("Erreur API OpenAI:", error);
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Erreur API OpenAI: ${error.error?.message || response.statusText}`,
          status: response.status,
          error: error
        },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    const responseText = result.choices[0].message.content;
    
    console.log("Test de l'API Vision réussi, réponse:", responseText);
    
    // Maintenant, tester avec gpt-4o-mini
    console.log("Test avec gpt-4o-mini...");
    
    const response2 = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Utiliser gpt-4o-mini
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Que représente cette image?" },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/svg+xml;base64,${base64Image}`,
                  detail: "high" // high, low, or auto
                }
              }
            ]
          }
        ],
        max_tokens: 300
      }),
    });
    
    let result2;
    let responseText2;
    
    if (!response2.ok) {
      const error = await response2.json();
      console.error("Erreur API OpenAI avec gpt-4o-mini:", error);
      responseText2 = `Erreur: ${error.error?.message || response2.statusText}`;
    } else {
      result2 = await response2.json();
      responseText2 = result2.choices[0].message.content;
      console.log("Test avec gpt-4o-mini réussi, réponse:", responseText2);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Test de l'API Vision réussi",
      gpt4VisionResponse: responseText,
      gpt4oMiniResponse: responseText2,
      documentation: "https://platform.openai.com/docs/guides/vision",
      recommendation: "Pour l'analyse d'images, utilisez le modèle gpt-4o qui est le successeur de gpt-4-vision-preview et prend en charge l'analyse d'images."
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors du test de l'API Vision:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors du test de l'API Vision: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
