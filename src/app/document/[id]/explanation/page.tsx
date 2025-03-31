"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';

export default function ExplanationPage({ params }: { params: { id: string } }) {
  const documentId = typeof params === 'object' && params !== null ? params.id : '';
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Simuler le chargement d'une explication depuis le localStorage
    // Dans une implémentation réelle, vous récupéreriez les données depuis Firestore
    const fetchExplanation = async () => {
      try {
        setLoading(true);
        
        // Vérifier si l'explication est déjà dans le localStorage
        const cachedExplanation = localStorage.getItem(`explanation_${documentId}`);
        
        if (cachedExplanation) {
          setExplanation(cachedExplanation);
          setLoading(false);
          return;
        }
        
        // Si pas en cache, faire une requête à l'API
        const response = await fetch('/api/ai/mock-explain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId,
            text: "Exemple de texte mathématique pour générer une explication",
            mathExpressions: ["x^2 + 2x + 1 = (x + 1)^2"],
          }),
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de l\'explication');
        }
        
        const data = await response.json();
        
        if (data.success && data.explanation) {
          // Sauvegarder dans le localStorage pour les futures visites
          localStorage.setItem(`explanation_${documentId}`, data.explanation);
          setExplanation(data.explanation);
        } else {
          throw new Error('Format de réponse invalide');
        }
      } catch (err) {
        console.error("Error fetching explanation:", err);
        setError("Erreur lors du chargement de l'explication");
      } finally {
        setLoading(false);
      }
    };
    
    fetchExplanation();
  }, [documentId]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Génération de l'explication en cours...</p>
            <p className="text-gray-500 text-sm mt-2">Cela peut prendre quelques instants</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !explanation) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-700 mb-2">{error || "Explication non disponible"}</h2>
            <p className="text-red-600 mb-4">L&apos;explication demandée n&apos;a pas pu être générée.</p>
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
          <div className="flex space-x-4">
            <Button 
              variant="outline"
              onClick={() => {
                // Copier l'explication dans le presse-papier
                navigator.clipboard.writeText(explanation)
                  .then(() => {
                    alert("Explication copiée dans le presse-papier");
                  })
                  .catch(err => {
                    console.error("Erreur lors de la copie:", err);
                    alert("Impossible de copier l'explication");
                  });
              }}
            >
              Copier
            </Button>
            <Link href={`/document/${documentId}`}>
              <Button variant="outline">Retour au document</Button>
            </Link>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="prose prose-blue max-w-none">
              <ReactMarkdown>
                {explanation}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline"
            onClick={() => router.push(`/document/${documentId}`)}
          >
            Retour au document
          </Button>
          
          <Button 
            onClick={() => router.push(`/document/${documentId}/quiz`)}
          >
            Générer un quiz
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
