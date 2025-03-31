"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentUpload } from "@/components/document/document-upload";
import { OcrResult } from "@/lib/ocr";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  
  const handleUploadComplete = (result: OcrResult, documentUrl: string, docId: string) => {
    setOcrResult(result);
    setDocumentId(docId);
    setUploadComplete(true);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Importer un document</h1>
        
        <div className="max-w-3xl mx-auto">
          {!uploadComplete ? (
            <Card>
              <CardHeader>
                <CardTitle>Importer une leçon ou un exercice</CardTitle>
                <CardDescription>
                  Importez votre document pour obtenir de l&apos;aide instantanément
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <DocumentUpload onUploadComplete={handleUploadComplete} />
                
                <p className="text-xs text-gray-500 text-center">
                  En important un document, vous acceptez nos <a href="/terms" className="text-blue-600 hover:underline">conditions d&apos;utilisation</a> et notre <a href="/privacy" className="text-blue-600 hover:underline">politique de confidentialité</a>.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Document importé avec succès</CardTitle>
                <CardDescription>
                  Votre document a été analysé et est prêt à être utilisé
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Analyse OCR réussie</span>
                  </div>
                  <p className="text-sm">
                    Confiance de l&apos;analyse: {ocrResult ? Math.round(ocrResult.confidence * 100) : 0}%
                  </p>
                </div>
                
                {ocrResult && ocrResult.mathExpressions && ocrResult.mathExpressions.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Expressions mathématiques détectées:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {ocrResult.mathExpressions.slice(0, 3).map((expr, index) => (
                        <li key={index} className="text-gray-700">{expr}</li>
                      ))}
                      {ocrResult.mathExpressions.length > 3 && (
                        <li className="text-gray-500 italic">Et {ocrResult.mathExpressions.length - 3} autres expressions...</li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {documentId && (
                    <Link href={`/document/${documentId}`} className="flex-1">
                      <Button className="w-full">
                        Voir le document
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setUploadComplete(false)}
                  >
                    Importer un autre document
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
