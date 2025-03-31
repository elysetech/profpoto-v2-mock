"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";

interface DocumentData {
  userId: string;
  fileName: string;
  fileType: string;
  documentType: "lesson" | "exercise";
  fileUrl: string;
  text: string;
  mathExpressions?: string[];
  tables?: Array<{
    headers: string[];
    rows: string[][];
  }>;
  createdAt: Timestamp;
}

export default function DocumentPage({ params }: { params: { id: string } }) {
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
          setDocument(docSnap.data() as DocumentData);
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
            <p className="text-gray-600">Chargement du document...</p>
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
            <p className="text-red-600 mb-4">Le document demandé n&apos;a pas pu être chargé.</p>
            <Link href="/dashboard">
              <Button>Retour au tableau de bord</Button>
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
          <h1 className="text-3xl font-bold">Document #{documentId}</h1>
          <Link href="/dashboard">
            <Button variant="outline">Retour au tableau de bord</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {document.fileName}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({document.fileType === 'image' ? 'Image' : 'PDF'})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gray-100 rounded-lg p-4 min-h-[300px] flex items-center justify-center overflow-hidden">
                  {document.fileUrl ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <img 
                        src={document.fileUrl} 
                        alt={document.fileName}
                        className="max-w-full max-h-[300px] object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500">
                        Aperçu non disponible
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* OCR Text */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Texte extrait (OCR)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                    {document.text || "Aucun texte extrait"}
                  </pre>
                </div>
              </CardContent>
            </Card>
            
            {/* Math Expressions */}
            {document.mathExpressions && document.mathExpressions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Expressions mathématiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                    <ul className="space-y-2">
                      {document.mathExpressions.map((expr, index) => (
                        <li key={index} className="p-2 bg-blue-50 rounded border border-blue-100">
                          <code className="text-blue-800">{expr}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Tables */}
            {document.tables && document.tables.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tableaux détectés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {document.tables.map((table, tableIndex) => (
                      <div key={tableIndex} className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              {table.headers.map((header, headerIndex) => (
                                <th key={headerIndex} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.rows.map((row, rowIndex) => (
                              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="px-4 py-2 text-sm text-gray-700 border-b">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Action Buttons */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Options disponibles</h2>
            
            {document.documentType === "lesson" ? (
              // Lesson Options
              <div className="space-y-4">
                <Card className="overflow-hidden">
                  <div className="bg-blue-100 p-4 border-b border-blue-200">
                    <h3 className="font-medium text-blue-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      Explication
                    </h3>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Obtenez une explication claire et simplifiée du contenu de la leçon.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/ai/explain', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              documentId: documentId,
                              text: document.text,
                              mathExpressions: document.mathExpressions,
                            }),
                          });
                          
                          if (!response.ok) {
                            throw new Error('Erreur lors de la génération de l\'explication');
                          }
                          
                          // Redirect to the result page
                          window.location.href = `/document/${documentId}/explanation`;
                        } catch (error) {
                          console.error('Error generating explanation:', error);
                          alert('Une erreur est survenue lors de la génération de l\'explication');
                        }
                      }}
                    >
                      Générer une explication
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="bg-green-100 p-4 border-b border-green-200">
                    <h3 className="font-medium text-green-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                        <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                      </svg>
                      Fiche récapitulative
                    </h3>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Créez une synthèse avec les formules et concepts clés de la leçon.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/ai/summary', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              documentId: documentId,
                              text: document.text,
                              mathExpressions: document.mathExpressions,
                            }),
                          });
                          
                          if (!response.ok) {
                            throw new Error('Erreur lors de la création de la fiche');
                          }
                          
                          // Redirect to the result page
                          window.location.href = `/document/${documentId}/summary`;
                        } catch (error) {
                          console.error('Error creating summary:', error);
                          alert('Une erreur est survenue lors de la création de la fiche');
                        }
                      }}
                    >
                      Créer une fiche
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="bg-purple-100 p-4 border-b border-purple-200">
                    <h3 className="font-medium text-purple-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Quiz
                    </h3>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Testez votre compréhension avec un quiz de 5 questions sur la leçon.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/ai/quiz', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              documentId: documentId,
                              text: document.text,
                              mathExpressions: document.mathExpressions,
                            }),
                          });
                          
                          if (!response.ok) {
                            throw new Error('Erreur lors de la génération du quiz');
                          }
                          
                          // Redirect to the result page
                          window.location.href = `/document/${documentId}/quiz`;
                        } catch (error) {
                          console.error('Error generating quiz:', error);
                          alert('Une erreur est survenue lors de la génération du quiz');
                        }
                      }}
                    >
                      Générer un quiz
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="bg-amber-100 p-4 border-b border-amber-200">
                    <h3 className="font-medium text-amber-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                      </svg>
                      Discuter
                    </h3>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Posez des questions spécifiques sur cette leçon à notre IA.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        window.location.href = `/chat?documentId=${documentId}`;
                      }}
                    >
                      Démarrer une discussion
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Exercise Options
              <div className="space-y-4">
                <Card className="overflow-hidden">
                  <div className="bg-green-50 p-4 border-b border-green-100">
                    <h3 className="font-medium text-green-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Correction
                    </h3>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Obtenez une solution détaillée avec les étapes de résolution.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/ai/correction', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              documentId: documentId,
                              text: document.text,
                              mathExpressions: document.mathExpressions,
                            }),
                          });
                          
                          if (!response.ok) {
                            throw new Error('Erreur lors de la génération de la correction');
                          }
                          
                          // Redirect to the result page
                          window.location.href = `/document/${documentId}/correction`;
                        } catch (error) {
                          console.error('Error generating correction:', error);
                          alert('Une erreur est survenue lors de la génération de la correction');
                        }
                      }}
                    >
                      Voir la correction
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="bg-blue-50 p-4 border-b border-blue-100">
                    <h3 className="font-medium text-blue-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      Explication
                    </h3>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Découvrez les concepts de la leçon nécessaires pour résoudre cet exercice.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/ai/exercise-explanation', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              documentId: documentId,
                              text: document.text,
                              mathExpressions: document.mathExpressions,
                            }),
                          });
                          
                          if (!response.ok) {
                            throw new Error('Erreur lors de la génération de l\'explication');
                          }
                          
                          // Redirect to the result page
                          window.location.href = `/document/${documentId}/exercise-explanation`;
                        } catch (error) {
                          console.error('Error generating explanation:', error);
                          alert('Une erreur est survenue lors de la génération de l\'explication');
                        }
                      }}
                    >
                      Voir l&apos;explication
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="bg-purple-50 p-4 border-b border-purple-100">
                    <h3 className="font-medium text-purple-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Exercice similaire
                    </h3>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Générez un nouvel exercice du même type pour vous entraîner.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/ai/similar-exercise', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              documentId: documentId,
                              text: document.text,
                              mathExpressions: document.mathExpressions,
                            }),
                          });
                          
                          if (!response.ok) {
                            throw new Error('Erreur lors de la génération de l\'exercice similaire');
                          }
                          
                          // Redirect to the result page
                          window.location.href = `/document/${documentId}/similar-exercise`;
                        } catch (error) {
                          console.error('Error generating similar exercise:', error);
                          alert('Une erreur est survenue lors de la génération de l\'exercice similaire');
                        }
                      }}
                    >
                      Générer un exercice
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="bg-amber-50 p-4 border-b border-amber-100">
                    <h3 className="font-medium text-amber-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                      </svg>
                      Discuter
                    </h3>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Posez des questions spécifiques sur cet exercice à notre IA.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        window.location.href = `/chat?documentId=${documentId}`;
                      }}
                    >
                      Démarrer une discussion
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
