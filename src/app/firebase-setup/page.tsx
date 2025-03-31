"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Step {
  title: string;
  description: string;
  instructions: string[];
}

interface Resource {
  title: string;
  url: string;
}

interface GuideData {
  title: string;
  steps: Step[];
  additionalResources: Resource[];
}

export default function FirebaseSetupPage() {
  const [guideData, setGuideData] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    async function fetchGuide() {
      try {
        const response = await fetch('/api/firebase/firebase-setup-guide');
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement du guide: ${response.statusText}`);
        }
        
        const data = await response.json();
        setGuideData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur s'est produite");
        console.error("Erreur lors du chargement du guide:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGuide();
  }, []);
  
  const nextStep = () => {
    if (guideData && activeStep < guideData.steps.length - 1) {
      setActiveStep(activeStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }
  
  if (!guideData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          Aucune donnée de guide disponible.
        </div>
      </div>
    );
  }
  
  const currentStep = guideData.steps[activeStep];
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">{guideData.title}</h1>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((activeStep + 1) / guideData.steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-500 mt-2 text-center">
          Étape {activeStep + 1} sur {guideData.steps.length}
        </div>
      </div>
      
      {/* Current step */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{currentStep.title}</h2>
        <p className="text-gray-600 mb-6">{currentStep.description}</p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="font-medium mb-3">Instructions:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            {currentStep.instructions.map((instruction, index) => (
              instruction.startsWith('```') ? (
                <pre key={index} className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-4 text-sm">
                  <code>{instruction.replace(/```/g, '').trim()}</code>
                </pre>
              ) : (
                <li key={index} className="text-gray-700">{instruction}</li>
              )
            ))}
          </ol>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={activeStep === 0}
          >
            Précédent
          </Button>
          
          <Button 
            onClick={nextStep}
            disabled={activeStep === guideData.steps.length - 1}
          >
            Suivant
          </Button>
        </div>
      </div>
      
      {/* Additional resources */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Ressources supplémentaires</h2>
        <ul className="space-y-2">
          {guideData.additionalResources.map((resource, index) => (
            <li key={index}>
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {resource.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
