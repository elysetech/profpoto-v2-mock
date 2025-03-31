/**
 * Service OCR (Optical Character Recognition)
 * 
 * Ce service permet d'extraire du texte à partir d'images et de documents PDF.
 * Il utilise l'API OpenAI pour l'analyse des images et l'extraction de texte.
 */

// Cache pour stocker les résultats d'OCR
const ocrCache = new Map<string, OcrResult>();

/**
 * Types de documents supportés
 */
export type DocumentType = 'image' | 'pdf';

/**
 * Options pour l'extraction de texte
 */
export interface OcrOptions {
  language?: 'french' | 'english' | 'auto';
  enhanceQuality?: boolean;
  extractMath?: boolean;
  extractTables?: boolean;
  extractDiagrams?: boolean;
  useCache?: boolean;
}

/**
 * Résultat de l'extraction OCR
 */
export interface OcrResult {
  text: string;
  confidence: number;
  language: string;
  mathExpressions?: string[];
  tables?: Array<{
    headers: string[];
    rows: string[][];
  }>;
  diagrams?: string[];
  processingTimeMs: number;
  pageCount?: number;
  fromCache?: boolean;
}

/**
 * Extrait du texte à partir d'une image ou d'un document PDF
 * 
 * @param file Fichier image ou PDF
 * @param type Type de document ('image' ou 'pdf')
 * @param options Options d'extraction
 * @returns Résultat de l'extraction OCR
 */
export async function extractTextFromDocument(
  file: File,
  type: DocumentType,
  options: OcrOptions = {}
): Promise<OcrResult> {
  console.log("🔍 OCR: Début du traitement", { fileName: file.name, fileType: file.type, fileSize: `${(file.size / 1024).toFixed(2)} KB` });
  
  try {
    // Vérifier si la clé API OpenAI est configurée
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("🔍 OCR: Erreur - Clé API OpenAI non définie");
      throw new Error('OPENAI_API_KEY is not defined');
    }
    
    console.log("🔍 OCR: Clé API OpenAI trouvée, longueur:", apiKey.length);
    
    // Préparer les options
    const defaultOptions: OcrOptions = {
      language: 'french',
      enhanceQuality: true,
      extractMath: true,
      extractTables: true,
      extractDiagrams: false,
      useCache: true,
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    console.log("🔍 OCR: Options configurées:", { ...mergedOptions, apiKey: "***" });
    
    // Générer une clé de cache basée sur le contenu du fichier et les options
    const cacheKey = await generateCacheKey(file, type, mergedOptions);
    
    // Vérifier si le résultat est déjà en cache
    if (mergedOptions.useCache && ocrCache.has(cacheKey)) {
      console.log("🔍 OCR: Résultat trouvé en cache");
      const cachedResult = ocrCache.get(cacheKey)!;
      return { ...cachedResult, fromCache: true };
    }
    
    // Mesurer le temps de traitement
    const startTime = Date.now();
    
    // Optimiser le fichier avant traitement
    console.log("🔍 OCR: Optimisation du fichier...");
    const optimizedFile = await optimizeFile(file, type);
    console.log("🔍 OCR: Fichier optimisé", { 
      originalSize: `${(file.size / 1024).toFixed(2)} KB`, 
      optimizedSize: `${(optimizedFile.size / 1024).toFixed(2)} KB` 
    });
    
    // Traiter différemment selon le type de document
    console.log(`🔍 OCR: Traitement du document de type ${type}...`);
    let result: OcrResult;
    if (type === 'pdf') {
      result = await processPdfDocument(optimizedFile, mergedOptions, apiKey, startTime);
    } else {
      result = await processImageDocument(optimizedFile, mergedOptions, apiKey, startTime);
    }
    
    console.log("🔍 OCR: Traitement terminé", { 
      textLength: result.text.length,
      processingTimeMs: result.processingTimeMs,
      mathExpressions: result.mathExpressions?.length || 0,
      tables: result.tables?.length || 0
    });
    
    // Mettre en cache le résultat
    if (mergedOptions.useCache) {
      ocrCache.set(cacheKey, result);
      console.log("🔍 OCR: Résultat mis en cache");
    }
    
    return result;
  } catch (error) {
    console.error('🔍 OCR: Erreur critique dans le traitement OCR:', error);
    throw error;
  }
}

/**
 * Optimise un fichier avant traitement
 * 
 * @param file Fichier à optimiser
 * @param type Type de document
 * @returns Fichier optimisé
 */
async function optimizeFile(file: File, type: DocumentType): Promise<File> {
  // Pour les PDFs, on ne fait pas d'optimisation pour l'instant
  if (type === 'pdf') {
    return file;
  }
  
  // Pour les images, on réduit la taille si nécessaire
  try {
    // Si l'image est trop grande, on la redimensionne
    if (file.size > 1 * 1024 * 1024) { // Plus de 1MB
      const img = await createImageBitmap(file);
      
      // Calculer les nouvelles dimensions (max 1500px)
      const maxDimension = 1500;
      let width = img.width;
      let height = img.height;
      
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round(height * (maxDimension / width));
          width = maxDimension;
        } else {
          width = Math.round(width * (maxDimension / height));
          height = maxDimension;
        }
      }
      
      // Créer un canvas pour redimensionner l'image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // Dessiner l'image redimensionnée
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convertir en blob avec une qualité réduite
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b!),
          'image/jpeg',
          0.85 // Qualité de 85%
        );
      });
      
      // Créer un nouveau fichier
      return new File([blob], file.name, { type: 'image/jpeg' });
    }
  } catch (error) {
    console.error('Error optimizing image:', error);
  }
  
  // Si l'optimisation échoue, retourner le fichier original
  return file;
}

/**
 * Génère une clé de cache basée sur le contenu du fichier et les options
 * 
 * @param file Fichier
 * @param type Type de document
 * @param options Options d'extraction
 * @returns Clé de cache
 */
async function generateCacheKey(file: File, type: DocumentType, options: OcrOptions): Promise<string> {
  // Utiliser le nom du fichier, sa taille, sa date de modification et un hash des options
  const fileInfo = `${file.name}-${file.size}-${file.lastModified}`;
  const optionsHash = JSON.stringify(options);
  return `${type}-${fileInfo}-${optionsHash}`;
}

/**
 * Traite un document PDF
 * 
 * @param file Fichier PDF
 * @param options Options d'extraction
 * @param apiKey Clé API OpenAI
 * @param startTime Heure de début du traitement
 * @returns Résultat de l'extraction OCR
 */
async function processPdfDocument(
  file: File, 
  options: OcrOptions, 
  apiKey: string,
  startTime: number
): Promise<OcrResult> {
  try {
    // Pour les PDFs, utiliser directement l'API OpenAI avec le modèle le plus récent
    // Selon la documentation OpenAI, gpt-4-vision-preview est optimisé pour les PDFs
    
    // Convertir le fichier en base64
    const base64Data = await fileToBase64(file);
    
    // Construire un prompt très simple et direct pour l'API
    const prompt = "Extrais tout le texte de ce PDF, y compris les formules mathématiques et les tableaux. Réponds uniquement avec le contenu extrait, sans commentaires.";
    
    console.log("Envoi du PDF à l'API OpenAI...");
    
    // Appeler l'API OpenAI avec des paramètres optimisés
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
            content: "Tu es un assistant spécialisé dans l'extraction de texte à partir de documents. Extrais tout le texte visible, y compris les formules mathématiques et les tableaux. Réponds uniquement avec le contenu extrait, sans commentaires ni explications."
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${base64Data}`,
                  detail: "auto" // Laisser l'API choisir le niveau de détail optimal
                },
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0, // Réduire la créativité pour une extraction plus précise
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("Erreur API OpenAI:", error);
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }
    
    console.log("Réponse reçue de l'API OpenAI");
    const result = await response.json();
    const processingTimeMs = Date.now() - startTime;
    
    // Extraire le texte brut de la réponse
    const extractedText = result.choices[0].message.content;
    
    // Créer un résultat OCR simplifié
    const ocrResult: OcrResult = {
      text: extractedText,
      confidence: 0.9, // Valeur arbitraire élevée pour GPT-4
      language: options.language === 'french' ? 'french' : 'english',
      processingTimeMs,
      pageCount: estimatePdfPageCount(file.size, extractedText.length),
    };
    
    // Extraire les expressions mathématiques si demandé
    if (options.extractMath) {
      ocrResult.mathExpressions = extractMathExpressions(extractedText);
    }
    
    // Extraire les tableaux si demandé
    if (options.extractTables) {
      ocrResult.tables = extractTables(extractedText);
    }
    
    return ocrResult;
  } catch (error: unknown) {
    console.error("Erreur lors du traitement du PDF:", error);
    
    if (error instanceof Error) {
      throw new Error(`Erreur lors du traitement du PDF: ${error.message}`);
    }
    
    throw error;
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

/**
 * Traite une image
 * 
 * @param file Fichier image
 * @param options Options d'extraction
 * @param apiKey Clé API OpenAI
 * @param startTime Heure de début du traitement
 * @returns Résultat de l'extraction OCR
 */
async function processImageDocument(
  file: File, 
  options: OcrOptions, 
  apiKey: string,
  startTime: number
): Promise<OcrResult> {
  try {
    // Optimiser l'image avant de l'envoyer
    const optimizedFile = await optimizeImageForOCR(file);
    
    // Convertir le fichier en base64
    const base64Data = await fileToBase64(optimizedFile);
    
    // Construire un prompt simple et direct
    const prompt = "Extrais tout le texte visible de cette image, y compris les formules mathématiques et les tableaux.";
    
    console.log("Envoi de l'image à l'API OpenAI...");
    
    // Appeler l'API OpenAI avec des paramètres optimisés
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
                  url: `data:image/jpeg;base64,${base64Data}`,
                  detail: "auto" // Laisser l'API choisir le niveau de détail optimal
                },
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0, // Réduire la créativité pour une extraction plus précise
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("Erreur API OpenAI:", error);
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }
    
    console.log("Réponse reçue de l'API OpenAI");
    const result = await response.json();
    const processingTimeMs = Date.now() - startTime;
    
    // Extraire le texte brut de la réponse
    const extractedText = result.choices[0].message.content;
    
    // Créer un résultat OCR simplifié
    const ocrResult: OcrResult = {
      text: extractedText,
      confidence: 0.9, // Valeur arbitraire élevée pour GPT-4
      language: options.language === 'french' ? 'french' : 'english',
      processingTimeMs,
    };
    
    // Extraire les expressions mathématiques si demandé
    if (options.extractMath) {
      ocrResult.mathExpressions = extractMathExpressions(extractedText);
    }
    
    // Extraire les tableaux si demandé
    if (options.extractTables) {
      ocrResult.tables = extractTables(extractedText);
    }
    
    return ocrResult;
  } catch (error: unknown) {
    console.error("Erreur lors du traitement de l'image:", error);
    
    if (error instanceof Error) {
      throw new Error(`Erreur lors du traitement de l'image: ${error.message}`);
    }
    
    throw error;
  }
}

/**
 * Optimise une image pour l'OCR
 */
async function optimizeImageForOCR(file: File): Promise<File> {
  // Si l'image est déjà petite, la retourner telle quelle
  if (file.size < 500 * 1024) { // Moins de 500KB
    return file;
  }
  
  try {
    const img = await createImageBitmap(file);
    
    // Calculer les dimensions optimales (max 1500px de large)
    const maxWidth = 1500;
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
      height = Math.round(height * (maxWidth / width));
      width = maxWidth;
    }
    
    // Créer un canvas pour redimensionner l'image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    // Dessiner l'image redimensionnée
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0, width, height);
    
    // Convertir en blob avec une qualité optimisée pour l'OCR
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b!),
        'image/jpeg',
        0.92 // Qualité de 92% - bon équilibre entre taille et qualité pour l'OCR
      );
    });
    
    // Créer un nouveau fichier
    return new File([blob], file.name, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error optimizing image for OCR:', error);
    return file; // En cas d'erreur, retourner l'image originale
  }
}

/**
 * Estime le nombre de pages d'un PDF basé sur sa taille et la longueur du texte extrait
 * 
 * @param fileSize Taille du fichier en octets
 * @param textLength Longueur du texte extrait
 * @returns Nombre estimé de pages
 */
function estimatePdfPageCount(fileSize: number, textLength: number): number {
  // Estimation basique basée sur la taille du fichier
  // Un PDF typique fait environ 100KB par page
  const sizeEstimate = Math.max(1, Math.round(fileSize / (100 * 1024)));
  
  // Estimation basée sur la longueur du texte
  // Une page contient environ 2000 caractères
  const textEstimate = Math.max(1, Math.round(textLength / 2000));
  
  // Prendre la moyenne des deux estimations
  return Math.round((sizeEstimate + textEstimate) / 2);
}

/**
 * Convertit un fichier en chaîne base64
 * 
 * @param file Fichier à convertir
 * @returns Chaîne base64
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Extraire la partie base64 de la chaîne data URL
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
}

// Les fonctions buildOcrPrompt et parseOcrResponse ont été supprimées car elles ne sont plus utilisées
// dans la nouvelle implémentation qui utilise directement l'API OpenAI avec des prompts simplifiés
