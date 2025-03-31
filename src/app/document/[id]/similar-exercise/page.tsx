"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';

export default function SimilarExercisePage({ params }: { params: { id: string } }) {
  const documentId = typeof params === 'object' && params !== null ? params.id : '';
  const [similarExercise, setSimilarExercise] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Simuler le chargement d&apos;un exercice similaire depuis le localStorage
    // Dans une implémentation réelle, vous récupéreriez les données depuis Firestore
    const fetchSimilarExercise = async () => {
      try {
        setLoading(true);
        
        // Vérifier si l&apos;exercice similaire est déjà dans le localStorage
        const cachedExercise = localStorage.getItem(`similar_exercise_${documentId}`);
        
        if (cachedExercise) {
          setSimilarExercise(cachedExercise);
          setLoading(false);
          return;
        }
        
        // Si pas en cache, faire une requête à l&apos;API
        const response = await fetch('/api/ai/mock-similar-exercise', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId,
            text: "Exemple de texte mathématique pour générer un exercice similaire",
            mathExpressions: ["x^2 + 2x + 1 = (x + 1)^2"],
          }),
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de l\'exercice similaire');
        }
        
        const data = await response.json();
        
        if (data.success && data.similarExercise) {
          // Sauvegarder dans le localStorage pour les futures visites
          localStorage.setItem(`similar_exercise_${documentId}`, data.similarExercise);
          setSimilarExercise(data.similarExercise);
        } else {
          throw new Error('Format de réponse invalide');
        }
      } catch (err) {
        console.error("Error fetching similar exercise:", err);
        setError("Erreur lors du chargement de l'exercice similaire");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSimilarExercise();
  }, [documentId]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Génération de l&apos;exercice similaire en cours...</p>
            <p className="text-gray-500 text-sm mt-2">Cela peut prendre quelques instants</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !similarExercise) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-700 mb-2">{error || "Exercice similaire non disponible"}</h2>
            <p className="text-red-600 mb-4">L&apos;exercice similaire demandé n&apos;a pas pu être généré.</p>
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
          <h1 className="text-3xl font-bold">Exercice similaire</h1>
          <div className="flex space-x-4">
            <Button 
              variant="outline"
              onClick={() => {
                // Copier l'exercice similaire dans le presse-papier
                navigator.clipboard.writeText(similarExercise)
                  .then(() => {
                    alert("Exercice copié dans le presse-papier");
                  })
                  .catch(err => {
                    console.error("Erreur lors de la copie:", err);
                    alert("Impossible de copier l'exercice");
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
            <div className="prose prose-purple max-w-none">
              <ReactMarkdown>
                {similarExercise}
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
            onClick={() => router.push(`/document/${documentId}/correction`)}
          >
            Voir la correction
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
