import { NextResponse } from 'next/server';

/**
 * Route API pour analyser une image déjà uploadée avec le modèle gpt-4o
 * POST /api/ai/analyze-image
 * 
 * Body: {
 *   imageUrl: string, // URL de l'image à analyser
 *   prompt?: string   // Prompt optionnel pour guider l'analyse
 * }
 */
export async function POST(request: Request) {
  try {
    // Récupérer les paramètres de la requête
    const body = await request.json();
    const { imageUrl, prompt = "Extrais tout le texte visible de cette image, y compris les formules mathématiques et les tableaux." } = body;
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "URL de l'image non fournie" },
        { status: 400 }
      );
    }
    
    console.log(`Analyse de l'image: ${imageUrl}`);
    
    // Récupérer la clé API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé API OpenAI non définie");
      return NextResponse.json(
        { success: false, message: "Clé API OpenAI non définie" },
        { status: 500 }
      );
    }
    
    // Appeler l'API OpenAI avec le modèle gpt-4o
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: "Tu es un assistant spécialisé dans l'extraction de texte à partir d'images. Extrais tout le texte visible, y compris les formules mathématiques et les tableaux. Réponds uniquement avec le contenu extrait, sans commentaires ni explications."
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: "high" // high, low, or auto
                }
              }
            ]
          }
        ],
        max_tokens: 4096,
        temperature: 0, // Réduire la créativité pour une extraction plus précise
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
    const extractedText = result.choices[0].message.content;
    
    console.log("Analyse réussie, texte extrait:", extractedText.substring(0, 100) + "...");
    
    // Extraire les expressions mathématiques
    const mathExpressions = extractMathExpressions(extractedText);
    
    // Extraire les tableaux
    const tables = extractTables(extractedText);
    
    return NextResponse.json({
      success: true,
      text: extractedText,
      mathExpressions: mathExpressions,
      tables: tables,
      model: 'gpt-4o',
      usage: result.usage
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de l'analyse de l'image:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de l'analyse de l'image: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}

/**
 * Extrait les expressions mathématiques d'un texte
 */
function extractMathExpressions(text: string): string[] {
  // Recherche des expressions entre $ ou $$
  const singleDollarRegex = /\$(.*?)\$/g;
  const doubleDollarRegex = /\$\$(.*?)\$\$/g;
  
  const mathExpressions: string[] = [];
  
  // Extraire les expressions entre $
  let match;
  while ((match = singleDollarRegex.exec(text)) !== null) {
    if (match[1].trim().length > 0) {
      mathExpressions.push(match[1].trim());
    }
  }
  
  // Extraire les expressions entre $$
  while ((match = doubleDollarRegex.exec(text)) !== null) {
    if (match[1].trim().length > 0) {
      mathExpressions.push(match[1].trim());
    }
  }
  
  return mathExpressions;
}

/**
 * Extrait les tableaux d'un texte
 */
function extractTables(text: string): Array<{ headers: string[]; rows: string[][] }> {
  // Recherche simplifiée des tableaux (à améliorer selon les besoins)
  const tableRegex = /\|(.+)\|\n\|([-:]+\|)+\n((?:\|.+\|\n)+)/g;
  
  const tables: Array<{ headers: string[]; rows: string[][] }> = [];
  
  let match;
  while ((match = tableRegex.exec(text)) !== null) {
    try {
      // Extraire les en-têtes
      const headerLine = match[1];
      const headers = headerLine.split('|').map(h => h.trim()).filter(h => h.length > 0);
      
      // Extraire les lignes
      const rowsText = match[3];
      const rowLines = rowsText.trim().split('\n');
      const rows = rowLines.map(line => {
        return line.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0);
      });
      
      tables.push({ headers, rows });
    } catch (e) {
      console.error("Erreur lors de l'extraction d'un tableau:", e);
    }
  }
  
  return tables;
}
