"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DocumentUpload } from "@/components/document/document-upload";
import { OcrResult } from "@/lib/ocr";

export default function DashboardPage() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  const handleUploadComplete = (result: OcrResult, documentUrl: string, docId: string) => {
    // Hide the upload form and show a success message
    setShowUploadForm(false);
    
    // Redirect to the document page
    window.location.href = `/document/${docId}`;
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
        
        {/* Upload Section */}
        <section className="mb-12">
          {!showUploadForm ? (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Importer un document</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Importez une leçon ou un exercice de mathématiques pour obtenir de l&apos;aide instantanément.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => setShowUploadForm(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Importer un document
                </Button>
                <Link href="/upload">
                  <Button variant="outline" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Options avancées
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Importer un document</CardTitle>
                <CardDescription>
                  Importez votre document pour obtenir de l&apos;aide instantanément
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentUpload onUploadComplete={handleUploadComplete} />
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowUploadForm(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
        
        {/* Recent Documents */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Documents récents</h2>
            <Link href="/documents" className="text-blue-600 hover:underline">
              Voir tous
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Empty state */}
            <Card className="col-span-full text-center p-8">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Aucun document récent</h3>
                <p className="text-gray-500 mb-4">
                  Importez votre premier document pour commencer à recevoir de l&apos;aide.
                </p>
                <Button onClick={() => setShowUploadForm(true)}>
                  Importer un document
                </Button>
              </div>
            </Card>
          </div>
        </section>
        
        {/* Upcoming Sessions */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Sessions à venir</h2>
            <Link href="/sessions" className="text-blue-600 hover:underline">
              Réserver une session
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Empty state */}
            <Card className="col-span-full text-center p-8">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Aucune session à venir</h3>
                <p className="text-gray-500 mb-4">
                  Réservez une session avec un professeur qualifié pour un accompagnement personnalisé.
                </p>
                <Button>Réserver une session</Button>
              </div>
            </Card>
          </div>
        </section>
        
        {/* Subscription Status */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Votre abonnement</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Essai gratuit</CardTitle>
              <CardDescription>
                Votre essai gratuit expire dans 7 jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Documents importés</span>
                  <span className="font-medium">0 / 5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full w-0"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sessions avec professeur</span>
                  <span className="font-medium">0 / 1</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full w-0"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Questions IA</span>
                  <span className="font-medium">0 / 5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full w-0"></div>
                </div>
                
                <div className="pt-4">
                  <Link href="/pricing">
                    <Button 
                      className="w-full"
                      onClick={() => {
                        // Redirect to Stripe checkout
                        window.location.href = "/api/checkout/create-subscription?plan=standard";
                      }}
                    >
                      Passer à un abonnement payant
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Payment Prompt */}
        <section className="mt-12">
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-800">Débloquez toutes les fonctionnalités</CardTitle>
              <CardDescription className="text-blue-600">
                Choisissez un abonnement ou achetez des cours individuels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Abonnement mensuel</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Accès illimité à toutes les fonctionnalités avec des sessions de professeur incluses
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        window.location.href = "/pricing";
                      }}
                    >
                      Voir les abonnements
                    </Button>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Cours individuels</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Réservez des sessions ponctuelles avec nos professeurs qualifiés
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        window.location.href = "/sessions";
                      }}
                    >
                      Réserver un cours
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-100 p-4 rounded-lg text-sm text-blue-800">
                  <p className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Votre carte bancaire sera nécessaire pour finaliser votre abonnement ou réserver un cours individuel. Vous pouvez annuler à tout moment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
}
