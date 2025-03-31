"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { DocumentType, OcrResult } from "@/lib/ocr";
import { storage, db, auth } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendSlackNotification } from "@/lib/slack";
import { useAuthState } from "react-firebase-hooks/auth";

interface DocumentUploadProps {
  onUploadComplete?: (result: OcrResult, documentUrl: string, documentId: string) => void;
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentType, setDocumentType] = useState<"lesson" | "exercise">("exercise");
  const [error, setError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user] = useAuthState(auth);
  
  // Handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Seuls les images et les fichiers PDF sont acceptés");
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("La taille du fichier ne doit pas dépasser 10MB");
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    
    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, just show an icon
      setFilePreview("pdf");
    }
  };
  
  // Test direct de l'API OpenAI
  const testOpenAIAPI = async () => {
    try {
      console.log("Test de l'API OpenAI...");
      
      // Récupérer la clé API depuis le serveur
      const response = await fetch('/api/ai/test-api', {
        method: 'GET',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur API OpenAI: ${error.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Résultat du test API OpenAI:", result);
      
      return result.success;
    } catch (error: unknown) {
      console.error("Erreur lors du test API OpenAI:", error);
      return false;
    }
  };
  
  // Test de la connexion à Firebase
  const testFirebaseConnection = async () => {
    try {
      console.log("Test de la connexion à Firebase...");
      
      const response = await fetch('/api/firebase/test-connection', {
        method: 'GET',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur Firebase: ${error.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Résultat du test Firebase:", result);
      
      return result.success;
    } catch (error: unknown) {
      console.error("Erreur lors du test Firebase:", error);
      return false;
    }
  };
  
  // Test de l'upload vers Firebase Storage
  const testFirebaseStorage = async () => {
    try {
      console.log("Test de l'upload vers Firebase Storage...");
      setError(null);
      
      const response = await fetch('/api/firebase/test-storage', {
        method: 'GET',
      });
      
      const result = await response.json();
      console.log("Résultat du test Storage:", result);
      
      if (!response.ok || !result.success) {
        setError(`Erreur Firebase Storage: ${result.message || response.statusText}`);
        return false;
      }
      
      setError(`Test réussi! Un fichier a été uploadé avec succès. URL: ${result.downloadUrl}`);
      return true;
    } catch (error: unknown) {
      console.error("Erreur lors du test Storage:", error);
      setError(`Erreur lors du test Storage: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
      return false;
    }
  };
  
  // Vérification des règles de sécurité Firebase Storage
  const checkStorageRules = async () => {
    try {
      console.log("Vérification des règles de sécurité Firebase Storage...");
      setError(null);
      
      const response = await fetch('/api/firebase/check-storage-rules', {
        method: 'GET',
      });
      
      const result = await response.json();
      console.log("Résultat de la vérification des règles:", result);
      
      if (!response.ok || !result.success) {
        // Afficher l'erreur et la solution
        setError(`Erreur: ${result.message}\n\nSolution: ${result.solution || "Aucune solution disponible."}`);
        return false;
      }
      
      setError(`Vérification réussie! Les règles de sécurité Firebase Storage semblent correctement configurées.\n\nRecommandations:\n${result.recommendations.join('\n')}`);
      return true;
    } catch (error: unknown) {
      console.error("Erreur lors de la vérification des règles:", error);
      setError(`Erreur lors de la vérification des règles: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
      return false;
    }
  };
  
  // Process the file (upload and direct analysis with gpt-4o)
  const processFile = async () => {
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier");
      return;
    }
    
    if (!user) {
      setError("Vous devez être connecté pour importer un document");
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(10);
      
      console.log("Début du traitement du fichier:", selectedFile.name, "Type:", selectedFile.type);
      
      // Vérifier si l'API OpenAI est accessible
      console.log("Vérification de l'API OpenAI...");
      const apiTest = await testOpenAIAPI();
      if (!apiTest) {
        throw new Error("Impossible de se connecter à l'API OpenAI. Veuillez vérifier votre connexion internet et réessayer.");
      }
      
      // Vérifier si Firebase est accessible
      console.log("Vérification de la connexion à Firebase...");
      const firebaseTest = await testFirebaseConnection();
      if (!firebaseTest) {
        throw new Error("Impossible de se connecter à Firebase. Veuillez vérifier votre connexion internet et réessayer.");
      }
      
      const fileType: DocumentType = selectedFile.type.startsWith("image/") ? "image" : "pdf";
      console.log("Type de document détecté:", fileType);
      
      // Step 1: Upload file to Firebase Storage
      console.log("Étape 1: Upload vers Firebase Storage...");
      const storageRef = ref(storage, `documents/${user.uid}/${Date.now()}_${selectedFile.name}`);
      
      try {
        await uploadBytes(storageRef, selectedFile);
        console.log("Upload réussi");
        
        const downloadUrl = await getDownloadURL(storageRef);
        console.log("URL de téléchargement obtenue:", downloadUrl.substring(0, 50) + "...");
        
        setUploadProgress(30);
        
        // Step 2: Analyze with gpt-4o directly
        console.log("Étape 2: Analyse directe avec gpt-4o...");
        console.time("AI Analysis");
        
        // Utiliser la nouvelle route API pour analyser l'image directement
        const analysisResponse = await fetch('/api/ai/analyze-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: downloadUrl,
            prompt: `Extrais tout le texte visible de cette ${fileType === 'image' ? 'image' : 'document PDF'}, y compris les formules mathématiques et les tableaux.`
          }),
        });
        
        if (!analysisResponse.ok) {
          const error = await analysisResponse.json();
          throw new Error(`Erreur lors de l'analyse avec gpt-4o: ${error.message || analysisResponse.statusText}`);
        }
        
        const analysisResult = await analysisResponse.json();
        console.timeEnd("AI Analysis");
        
        // Créer un résultat OCR à partir de l'analyse
        const ocrResult: OcrResult = {
          text: analysisResult.text,
          confidence: 0.9, // Valeur arbitraire élevée pour GPT-4o
          language: 'french',
          mathExpressions: analysisResult.mathExpressions || [],
          tables: analysisResult.tables || [],
          processingTimeMs: 0, // Non disponible
        };
        
        console.log("Analyse terminée, texte extrait:", ocrResult.text.substring(0, 100) + "...");
        console.log("Expressions mathématiques trouvées:", ocrResult.mathExpressions?.length || 0);
        console.log("Tableaux trouvés:", ocrResult.tables?.length || 0);
        
        setUploadProgress(80);
        
        // Step 3: Save document metadata to Firestore
        console.log("Étape 3: Sauvegarde dans Firestore...");
        const docRef = await addDoc(collection(db, "documents"), {
          userId: user.uid,
          fileName: selectedFile.name,
          fileType: fileType,
          documentType: documentType,
          fileUrl: downloadUrl,
          text: ocrResult.text,
          mathExpressions: ocrResult.mathExpressions || [],
          tables: ocrResult.tables || [],
          createdAt: serverTimestamp(),
          analyzedWith: "gpt-4o", // Indiquer que l'analyse a été faite avec gpt-4o
        });
        
        console.log("Document sauvegardé avec ID:", docRef.id);
        
        // Step 4: Send notification to Slack
        console.log("Étape 4: Notification Slack...");
        await sendSlackNotification("new_document", {
          userName: user.displayName || user.email,
          documentType: documentType,
          fileType: fileType,
        });
        
        console.log("Traitement terminé avec succès");
        setUploadProgress(100);
        
        // Reset state
        setSelectedFile(null);
        setFilePreview(null);
        
        // Call the callback if provided
        if (onUploadComplete) {
          onUploadComplete(ocrResult, downloadUrl, docRef.id);
        }
      } catch (uploadError: unknown) {
        console.error("Erreur lors de l'upload ou de l'analyse:", uploadError);
        throw new Error(`Erreur lors du traitement: ${uploadError instanceof Error ? uploadError.message : "Erreur inconnue"}`);
      }
      
    } catch (error: unknown) {
      console.error("Document upload error:", error);
      setError(`Une erreur s'est produite: ${error instanceof Error ? error.message : "Erreur inconnue"}. Veuillez réessayer.`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Cancel upload
  const cancelUpload = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setError(null);
  };
  
  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">Importer un document</h3>
          <p className="text-gray-500 mb-4">
            Importez un fichier PDF ou une image depuis votre appareil
          </p>
          
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Étape 1:</span> Sélectionnez un fichier à analyser
              </p>
            </div>
            
            {!filePreview ? (
              <div className="flex items-center justify-center">
                <label htmlFor="file-upload" className="w-full">
                  <Button 
                    className="w-full" 
                    id="file-upload-button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? "Traitement en cours..." : "Sélectionner un fichier"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Étape 2:</span> Vérifiez l&apos;aperçu et choisissez le type de document ci-dessous
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 max-w-md mx-auto">
                  {filePreview === "pdf" ? (
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        <path d="M8 10a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      </svg>
                      <span className="ml-2 text-sm font-medium">{selectedFile?.name}</span>
                    </div>
                  ) : (
                    <img 
                      src={filePreview} 
                      alt="Aperçu du document" 
                      className="max-h-64 mx-auto object-contain"
                    />
                  )}
                </div>
                
                <div className="text-center mt-6 mb-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Étape 3:</span> Cliquez sur &quot;Analyser le document&quot; pour lancer le traitement
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700" 
                    onClick={processFile}
                    disabled={isUploading}
                  >
                    {isUploading ? "Traitement en cours..." : "Analyser le document"}
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={cancelUpload}
                    disabled={isUploading}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Document Type Selection */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Type de document</h3>
        <p className="text-gray-500 mb-6">
          Sélectionnez le type de document que vous importez pour obtenir l&apos;aide la plus adaptée
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`border rounded-lg p-4 cursor-pointer ${
              documentType === "lesson" 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setDocumentType("lesson")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="lesson"
                name="documentType"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                checked={documentType === "lesson"}
                onChange={() => setDocumentType("lesson")}
              />
              <label htmlFor="lesson" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                Leçon
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500 pl-7">
              Contenu théorique, définitions, formules, théorèmes, etc.
            </p>
            
            {documentType === "lesson" && (
              <div className="mt-4 pl-7 space-y-2">
                <p className="text-sm font-medium text-blue-700">Options pour les leçons:</p>
                <div className="grid grid-cols-1 gap-2">
                  <button className="text-left text-sm px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300">
                    Créer une fiche de révision
                  </button>
                  <button className="text-left text-sm px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300">
                    Extraire les points fondamentaux
                  </button>
                  <button className="text-left text-sm px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300">
                    Générer des exercices d&apos;application
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer ${
              documentType === "exercise" 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setDocumentType("exercise")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="exercise"
                name="documentType"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                checked={documentType === "exercise"}
                onChange={() => setDocumentType("exercise")}
              />
              <label htmlFor="exercise" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                Exercice
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500 pl-7">
              Problèmes à résoudre, questions, applications pratiques, etc.
            </p>
            
            {documentType === "exercise" && (
              <div className="mt-4 pl-7 space-y-2">
                <p className="text-sm font-medium text-blue-700">Options pour les exercices:</p>
                <div className="grid grid-cols-1 gap-2">
                  <button className="text-left text-sm px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300">
                    Obtenir des indices
                  </button>
                  <button className="text-left text-sm px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300">
                    Voir un exercice similaire
                  </button>
                  <button className="text-left text-sm px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300">
                    Résoudre l&apos;exercice étape par étape
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* File format information */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
        <h4 className="font-medium mb-1">Formats acceptés</h4>
        <ul className="list-disc list-inside text-sm">
          <li>Images: JPG, PNG, GIF, etc.</li>
          <li>Documents: PDF</li>
          <li>Taille maximale: 10MB</li>
        </ul>
      </div>
      
      {/* Diagnostic tools */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Outils de diagnostic</h3>
        <p className="text-gray-500 mb-4">
          Si vous rencontrez des problèmes, utilisez ces outils pour diagnostiquer la cause.
        </p>
        
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Firebase Storage</h4>
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              onClick={testFirebaseStorage}
              className="w-full"
            >
              Tester l&apos;upload vers Firebase Storage
            </Button>
            
            <Button 
              variant="outline" 
              onClick={checkStorageRules}
              className="w-full"
            >
              Vérifier les règles de sécurité Firebase
            </Button>
            
            <a href="/api/firebase/update-storage-rules" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                className="w-full bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
              >
                Obtenir les règles de sécurité recommandées
              </Button>
            </a>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">OpenAI API</h4>
          <div className="flex flex-col space-y-2">
            <a href="/api/ai/check-api-key" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                className="w-full"
              >
                Vérifier la clé API OpenAI
              </Button>
            </a>
            
            <a href="/api/ai/test-model?model=gpt-4o-mini" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                className="w-full"
              >
                Tester le modèle gpt-4o-mini
              </Button>
            </a>
            
            <a href="/api/ai/test-model?model=gpt-4o" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                className="w-full"
              >
                Tester le modèle gpt-4o
              </Button>
            </a>
            
            <a href="/api/ai/test-vision" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                className="w-full bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
              >
                Tester l&apos;API Vision avec une image
              </Button>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium mb-2">Guides</h4>
          <div className="flex flex-col space-y-2">
            <a href="/firebase-setup" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                className="w-full bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                Guide de configuration Firebase
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {/* Upload progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Traitement en cours...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-center">
            {uploadProgress < 30 && "Téléchargement du fichier..."}
            {uploadProgress >= 30 && uploadProgress < 80 && "Analyse du contenu avec l'IA..."}
            {uploadProgress >= 80 && "Finalisation du traitement..."}
          </div>
        </div>
      )}
    </div>
  );
}
