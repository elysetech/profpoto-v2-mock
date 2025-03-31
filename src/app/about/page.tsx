import { MainLayout } from "@/components/layout/main-layout";
import { TeamMember } from "@/components/about/team-member";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">À propos de Profpoto</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg mb-6">
                Fondé par Elysé Rasoloarivony, Profpoto réunit des étudiants et ingénieurs passionnés qui proposent un accompagnement mathématique adapté à tous les niveaux.
              </p>
              
              <p className="text-lg mb-6">
                Profpoto est le &quot;poto&quot; des collégiens et lycéens, un allié pour surmonter les défis des mathématiques et progresser sereinement.
              </p>
              
              <p className="text-lg mb-6">
                Notre approche unique combine intelligence artificielle et expertise de professeurs qualifiés pour un soutien personnalisé qui répond aux besoins de chaque élève.
              </p>
              
              <p className="text-lg">
                Rejoignez-nous et découvrez comment les mathématiques deviennent accessibles et passionnantes avec le bon accompagnement !
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-8 border border-blue-100 dark:border-blue-800 mb-16">
            <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Notre mission</h2>
            <p className="text-lg text-center dark:text-gray-200">
              Rendre les mathématiques accessibles à tous les élèves en proposant un accompagnement personnalisé, innovant et efficace.
            </p>
          </div>
          
          {/* Team Section */}
          <h2 className="text-3xl font-bold mb-10 text-center">Notre équipe</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <TeamMember 
              name="Elysé Rasoloarivony"
              role="Fondateur & CEO"
              description="Ingénieur en IA et passionné d'éducation, Elysé a fondé Profpoto pour rendre l'apprentissage des mathématiques accessible à tous."
              image="https://randomuser.me/api/portraits/men/1.jpg"
            />
            
            <TeamMember 
              name="Marie Dupont"
              role="Responsable Pédagogique"
              description="Ancienne professeure agrégée de mathématiques, Marie supervise la qualité pédagogique de tous les contenus et formations."
              image="https://randomuser.me/api/portraits/women/2.jpg"
            />
            
            <TeamMember 
              name="Thomas Laurent"
              role="Lead Developer"
              description="Expert en développement web et mobile, Thomas conçoit les interfaces intuitives qui rendent l'apprentissage fluide et agréable."
              image="https://randomuser.me/api/portraits/men/3.jpg"
            />
            
            <TeamMember 
              name="Sophie Moreau"
              role="Responsable des Professeurs"
              description="Sophie recrute et forme les meilleurs professeurs pour garantir un accompagnement de qualité à tous nos élèves."
              image="https://randomuser.me/api/portraits/women/4.jpg"
            />
            
            <TeamMember 
              name="Lucas Martin"
              role="Spécialiste IA"
              description="Docteur en intelligence artificielle, Lucas développe les algorithmes qui personnalisent l'apprentissage pour chaque élève."
              image="https://randomuser.me/api/portraits/men/5.jpg"
            />
            
            <TeamMember 
              name="Emma Bernard"
              role="Responsable Communication"
              description="Experte en marketing digital, Emma s'assure que Profpoto touche tous les élèves qui ont besoin d'aide en mathématiques."
              image="https://randomuser.me/api/portraits/women/6.jpg"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
