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
