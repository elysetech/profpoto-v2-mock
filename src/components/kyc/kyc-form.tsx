"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";

interface FormData {
  step: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  idType: string;
  idNumber: string;
  idExpiry: string;
  idFrontImage: File | null;
  idBackImage: File | null;
  selfieImage: File | null;
  acceptTerms: boolean;
}

export function KycForm() {
  const [formData, setFormData] = useState<FormData>({
    step: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    idType: "",
    idNumber: "",
    idExpiry: "",
    idFrontImage: null,
    idBackImage: null,
    selfieImage: null,
    acceptTerms: false,
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    setFormData((prev) => ({
      ...prev,
      step: prev.step + 1,
    }));
  };

  const prevStep = () => {
    setFormData((prev) => ({
      ...prev,
      step: prev.step - 1,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    // Show success message or redirect
    nextStep();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData(field, e.target.files[0]);
    }
  };

  const renderStep = () => {
    switch (formData.step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => updateFormData("birthDate", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end">
              <AnimatedButton 
                onClick={nextStep} 
                className="mt-4"
                hoverText="Étape suivante"
              >
                Continuer
              </AnimatedButton>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Adresse</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => updateFormData("postalCode", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
              <select
                value={formData.country}
                onChange={(e) => updateFormData("country", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Canada">Canada</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep} className="mt-4">
                Retour
              </Button>
              <AnimatedButton 
                onClick={nextStep} 
                className="mt-4"
                hoverText="Étape suivante"
              >
                Continuer
              </AnimatedButton>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Pièce d&apos;identité</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de pièce d&apos;identité</label>
              <select
                value={formData.idType}
                onChange={(e) => updateFormData("idType", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="passport">Passeport</option>
                <option value="id_card">Carte d&apos;identité</option>
                <option value="driving_license">Permis de conduire</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de document</label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => updateFormData("idNumber", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;expiration</label>
              <input
                type="date"
                value={formData.idExpiry}
                onChange={(e) => updateFormData("idExpiry", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep} className="mt-4">
                Retour
              </Button>
              <AnimatedButton 
                onClick={nextStep} 
                className="mt-4"
                hoverText="Étape suivante"
              >
                Continuer
              </AnimatedButton>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Téléchargement des documents</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recto de la pièce d&apos;identité</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "idFrontImage")}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {formData.idFrontImage && (
                <p className="text-sm text-green-600 mt-1">
                  Fichier sélectionné: {formData.idFrontImage.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verso de la pièce d&apos;identité</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "idBackImage")}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {formData.idBackImage && (
                <p className="text-sm text-green-600 mt-1">
                  Fichier sélectionné: {formData.idBackImage.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selfie avec la pièce d&apos;identité</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "selfieImage")}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {formData.selfieImage && (
                <p className="text-sm text-green-600 mt-1">
                  Fichier sélectionné: {formData.selfieImage.name}
                </p>
              )}
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => updateFormData("acceptTerms", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité
              </label>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep} className="mt-4">
                Retour
              </Button>
              <AnimatedButton 
                onClick={handleSubmit} 
                className="mt-4"
                disabled={!formData.acceptTerms}
                hoverText="Finaliser"
              >
                Soumettre
              </AnimatedButton>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Vérification soumise avec succès !</h2>
            <p className="text-gray-600 mb-6">
              Nous avons bien reçu vos informations. Votre dossier est en cours de vérification.
              Vous recevrez une notification par email une fois la vérification terminée.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Retour à l&apos;accueil
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formData.step >= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {formData.step > step ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className="text-xs mt-1 text-gray-500">
                {step === 1 && "Informations"}
                {step === 2 && "Adresse"}
                {step === 3 && "Identité"}
                {step === 4 && "Documents"}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-1 bg-blue-600 transition-all duration-300"
              style={{ width: `${((formData.step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      <form>{renderStep()}</form>
    </div>
  );
}
