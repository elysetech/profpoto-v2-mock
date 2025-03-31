import { MainLayout } from "@/components/layout/main-layout";
import { KycForm } from "@/components/kyc/kyc-form";

export default function KycPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Vérification d&apos;identité</h1>
          <p className="text-gray-600 mb-8 text-center">
            Pour garantir la sécurité de notre plateforme, nous avons besoin de vérifier votre identité.
            Veuillez compléter le formulaire ci-dessous.
          </p>
          
          <KycForm />
        </div>
      </div>
    </MainLayout>
  );
}
