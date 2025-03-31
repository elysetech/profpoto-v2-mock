"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface DocumentData {
  userId: string;
  fileName: string;
  fileType: string;
  documentType: "lesson" | "exercise";
  fileUrl: string;
  text: string;
  explanation?: string;
  explanationGeneratedAt?: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function ExplanationPage({ params }: { params: { id: string } }) {
  const documentId = params.id;
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchDocument() {
      try {
        const docRef = doc(db, "documents", documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as DocumentData;
          
          if (!data.explanation) {
            setError("L&apos;explication n&apos;a pas encore été générée pour ce document");
          }
          
          setDocument(data);
        } else {
          setError("Document non trouvé");
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Erreur lors du chargement du document");
      } finally {
        setLoading(false);
      }
    }
    
    fetchDocument();
  }, [documentId]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de l&apos;explication...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !document) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-700 mb-2">{error || "Document non disponible"}</h2>
            <p className="text-red-600 mb-4">L&apos;explication demandée n&apos;a pas pu être chargée.</p>
            <Link href={`/document/${documentId}`}>
              <Button>Retour au document</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Explication</h1>
          <Link href={`/document/${documentId}`}>
            <Button variant="outline">Retour au document</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Explication du document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                {document.explanation ? (
                  <div dangerouslySetInnerHTML={{ __html: document.explanation.replace(/\n/g, '<br />') }} />
                ) : (
                  <p className="text-gray-500">Aucune explication disponible pour ce document.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Link href={`/document/${documentId}`}>
              <Button variant="outline">Retour au document</Button>
            </Link>
            
            <div className="flex space-x-4">
              <Link href={`/document/${documentId}/summary`}>
                <Button variant="outline">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                    <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  Voir la fiche récapitulative
                </Button>
              </Link>
              
              <Link href={`/document/${documentId}/quiz`}>
                <Button>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Faire le quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
