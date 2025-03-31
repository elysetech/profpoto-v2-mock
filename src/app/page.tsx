import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { MainLayout } from "@/components/layout/main-layout";
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                Accompagnement <span className="text-blue-600 dark:text-blue-400">personnalisé</span> en mathématiques
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                Profpoto combine intelligence artificielle et professeurs qualifiés pour aider les élèves du collège et du lycée à comprendre leurs leçons et réussir leurs exercices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <AnimatedButton 
                    size="lg" 
                    className="w-full sm:w-auto"
                    variant="primary"
                    hoverText="C&apos;est parti !"
                  >
                    Commencer gratuitement
                  </AnimatedButton>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-300 text-blue-700 hover:bg-blue-50">
                    Voir les tarifs
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-80">
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 rounded-lg transform rotate-3"></div>
                <div className="absolute inset-0 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-900 rounded-lg shadow-lg flex items-center justify-center p-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">Exemple de correction</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-left">
                      <p className="text-gray-700 dark:text-gray-300 mb-2">Résoudre : 2x + 3 = 7</p>
                      <div className="border-l-4 border-green-500 pl-3 mt-4">
                        <p className="text-gray-800 dark:text-gray-200">2x + 3 = 7</p>
                        <p className="text-gray-800 dark:text-gray-200">2x = 7 - 3</p>
                        <p className="text-gray-800 dark:text-gray-200">2x = 4</p>
                        <p className="text-gray-800 dark:text-gray-200">x = 4/2 = 2</p>
                        <p className="font-semibold text-green-700 dark:text-green-400 mt-2">Solution : x = 2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">Comment Profpoto vous aide</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Découvrez comment Profpoto révolutionne le soutien scolaire en mathématiques avec des outils innovants.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">Import de Documents</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Importez vos leçons et exercices par photo ou PDF. Notre technologie OCR avancée extrait le texte avec une précision supérieure à 95%.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">IA Pédagogique 24/7</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Notre système génère des fiches récapitulatives, des quiz et des exercices similaires adaptés à votre niveau scolaire.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">Professeurs qualifiés</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Réservez des sessions en direct avec des professeurs qualifiés dans un système de calendrier intuitif avec des créneaux de 30min ou 1h.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Comment ça marche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-md">1</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Inscrivez-vous</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Créez votre compte en quelques clics et choisissez votre niveau scolaire.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-md">2</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Importez vos documents</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Prenez en photo ou téléchargez vos leçons et exercices de mathématiques.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-md">3</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Obtenez de l&apos;aide</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Recevez des explications, corrections ou fiches récapitulatives instantanément.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-md">4</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Réservez un professeur</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pour un accompagnement plus approfondi, réservez une session avec un professeur qualifié.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discord Community Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-blue-50 dark:bg-gray-800 rounded-lg p-6 border border-blue-100 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/5 mb-4 md:mb-0 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="#5865F2">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
              </div>
              <div className="md:w-4/5 md:pl-6">
                <h3 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-400">Rejoignez notre communauté Discord</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                  Échangez avec d&apos;autres élèves, posez vos questions et participez à des sessions d&apos;étude collaboratives.
                </p>
                <a 
                  href="https://discord.gg/profpoto" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  <span className="mr-1">Rejoindre</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Ce que nos élèves disent</h2>
          
          <div className="max-w-4xl mx-auto">
            <TestimonialCarousel 
              testimonials={[
                {
                  id: 1,
                  name: "Sophie Martin",
                  role: "Élève de Terminale",
                  content: "Grâce à Profpoto, j'ai pu comprendre les concepts mathématiques qui me posaient problème. Les explications sont claires et adaptées à mon niveau. J'ai gagné 3 points à mon dernier contrôle !",
                  image: "https://randomuser.me/api/portraits/women/32.jpg"
                },
                {
                  id: 2,
                  name: "Thomas Dubois",
                  role: "Élève de 3ème",
                  content: "Les professeurs sont très patients et prennent le temps d'expliquer. L'application est facile à utiliser et je peux obtenir de l'aide à tout moment. Mes parents sont ravis de mes progrès !",
                  image: "https://randomuser.me/api/portraits/men/45.jpg"
                },
                {
                  id: 3,
                  name: "Emma Petit",
                  role: "Élève de 1ère",
                  content: "J'étais très stressée par les mathématiques avant de découvrir Profpoto. Maintenant, je me sens beaucoup plus confiante et je comprends mieux les exercices. Merci pour votre aide !",
                  image: "https://randomuser.me/api/portraits/women/65.jpg"
                }
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 rounded-xl p-8 md:p-12 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-6">Prêt à améliorer vos résultats en mathématiques ?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Rejoignez Profpoto dès aujourd&apos;hui et bénéficiez d&apos;un accompagnement personnalisé pour réussir en mathématiques.
            </p>
            <Link href="/register">
              <AnimatedButton 
                size="lg" 
                variant="white"
                className="shadow-lg text-blue-700 bg-white border-2 border-white"
                hoverText="Rejoignez-nous !"
              >
                Commencer gratuitement
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
