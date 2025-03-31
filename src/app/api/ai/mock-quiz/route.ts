import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { documentId, text, mathExpressions } = await request.json();

    if (!documentId || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simuler un délai pour rendre l'expérience plus réaliste
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Générer un quiz fictif basé sur le texte fourni
    const quiz = generateMockQuiz(text, mathExpressions);

    return NextResponse.json({ 
      success: true, 
      quiz,
      documentId
    });
  } catch (error) {
    console.error('Error generating mock quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}

function generateMockQuiz(text: string, mathExpressions?: string[]) {
  // Détecter si le texte contient des mots-clés mathématiques
  const hasAlgebra = /équation|variable|x\s*[+\-*/=]\s*\d|résoudre/i.test(text);
  const hasGeometry = /triangle|cercle|carré|rectangle|angle|degré/i.test(text);
  const hasCalculus = /dérivée|intégrale|limite|fonction/i.test(text);
  const hasArithmetic = /addition|soustraction|multiplication|division/i.test(text);
  
  let quiz = "# Quiz de mathématiques\n\n";
  
  // Question 1 - Toujours inclure une question générale
  quiz += "## Question 1\n\n";
  quiz += "Quel est l'objectif principal de l'étude des mathématiques?\n\n";
  quiz += "A) Mémoriser des formules\n";
  quiz += "B) Développer la pensée logique et la résolution de problèmes\n";
  quiz += "C) Calculer rapidement\n";
  quiz += "D) Utiliser une calculatrice efficacement\n\n";
  quiz += "**Réponse correcte: B**\n\n";
  quiz += "**Explication:** Les mathématiques visent principalement à développer la pensée logique, le raisonnement et les compétences de résolution de problèmes, bien au-delà de la simple mémorisation de formules ou de calculs.\n\n";
  
  // Questions spécifiques basées sur le contenu détecté
  if (hasAlgebra) {
    quiz += "## Question 2\n\n";
    quiz += "Pour résoudre l'équation 3x + 12 = 24, quelle est la première étape?\n\n";
    quiz += "A) Diviser les deux côtés par 3\n";
    quiz += "B) Soustraire 12 des deux côtés\n";
    quiz += "C) Multiplier les deux côtés par 3\n";
    quiz += "D) Ajouter 12 aux deux côtés\n\n";
    quiz += "**Réponse correcte: B**\n\n";
    quiz += "**Explication:** Pour isoler le terme avec la variable x, la première étape consiste à soustraire 12 des deux côtés, ce qui donne 3x = 12. Ensuite, on divise les deux côtés par 3 pour obtenir x = 4.\n\n";
  } else if (hasGeometry) {
    quiz += "## Question 2\n\n";
    quiz += "Quelle est l'aire d'un cercle de rayon 5 cm?\n\n";
    quiz += "A) 25π cm²\n";
    quiz += "B) 10π cm²\n";
    quiz += "C) 5π cm²\n";
    quiz += "D) 15π cm²\n\n";
    quiz += "**Réponse correcte: A**\n\n";
    quiz += "**Explication:** L'aire d'un cercle est calculée avec la formule A = πr², où r est le rayon. Avec r = 5 cm, on obtient A = π × 5² = 25π cm².\n\n";
  } else if (hasCalculus) {
    quiz += "## Question 2\n\n";
    quiz += "Quelle est la dérivée de la fonction f(x) = x²?\n\n";
    quiz += "A) f'(x) = 2x\n";
    quiz += "B) f'(x) = x\n";
    quiz += "C) f'(x) = 2\n";
    quiz += "D) f'(x) = x²\n\n";
    quiz += "**Réponse correcte: A**\n\n";
    quiz += "**Explication:** Pour dériver une fonction de la forme x^n, on applique la règle d/dx(x^n) = n×x^(n-1). Donc pour f(x) = x², on a f'(x) = 2×x^(2-1) = 2x.\n\n";
  } else if (hasArithmetic) {
    quiz += "## Question 2\n\n";
    quiz += "Quel est le résultat de 125 ÷ 5 + 10 × 3?\n\n";
    quiz += "A) 55\n";
    quiz += "B) 75\n";
    quiz += "C) 85\n";
    quiz += "D) 275\n\n";
    quiz += "**Réponse correcte: C**\n\n";
    quiz += "**Explication:** En suivant l'ordre des opérations (PEMDAS), on effectue d'abord la division et la multiplication: 125 ÷ 5 = 25, et 10 × 3 = 30. Puis on fait l'addition: 25 + 30 = 55.\n\n";
  } else {
    quiz += "## Question 2\n\n";
    quiz += "Quelle propriété mathématique est illustrée par l'équation 3 × (4 + 2) = 3 × 4 + 3 × 2?\n\n";
    quiz += "A) Commutativité\n";
    quiz += "B) Associativité\n";
    quiz += "C) Distributivité\n";
    quiz += "D) Identité\n\n";
    quiz += "**Réponse correcte: C**\n\n";
    quiz += "**Explication:** Cette équation illustre la propriété de distributivité de la multiplication par rapport à l'addition: a × (b + c) = a × b + a × c.\n\n";
  }
  
  // Question 3 - Basée sur les expressions mathématiques si disponibles, sinon générique
  if (mathExpressions && mathExpressions.length > 0) {
    quiz += "## Question 3\n\n";
    quiz += `Considérez l'expression suivante: ${mathExpressions[0]}. Quelle affirmation est correcte?\n\n`;
    quiz += "A) Cette expression représente une équation du second degré\n";
    quiz += "B) Cette expression peut être simplifiée davantage\n";
    quiz += "C) Cette expression est sous sa forme la plus simple\n";
    quiz += "D) Cette expression contient une erreur mathématique\n\n";
    quiz += "**Réponse correcte: B**\n\n";
    quiz += "**Explication:** En appliquant les règles algébriques appropriées, cette expression peut être simplifiée davantage pour obtenir une forme plus concise et plus claire.\n\n";
  } else {
    quiz += "## Question 3\n\n";
    quiz += "Lequel des ensembles suivants est infini?\n\n";
    quiz += "A) L'ensemble des nombres entiers entre 1 et 100\n";
    quiz += "B) L'ensemble des nombres premiers inférieurs à 50\n";
    quiz += "C) L'ensemble des nombres rationnels\n";
    quiz += "D) L'ensemble des jours de la semaine\n\n";
    quiz += "**Réponse correcte: C**\n\n";
    quiz += "**Explication:** L'ensemble des nombres rationnels (fractions) est infini, contrairement aux autres ensembles mentionnés qui contiennent un nombre fini d'éléments.\n\n";
  }
  
  // Question 4 - Application pratique
  quiz += "## Question 4\n\n";
  quiz += "Un train parcourt 240 km en 3 heures. Quelle est sa vitesse moyenne?\n\n";
  quiz += "A) 60 km/h\n";
  quiz += "B) 80 km/h\n";
  quiz += "C) 70 km/h\n";
  quiz += "D) 90 km/h\n\n";
  quiz += "**Réponse correcte: B**\n\n";
  quiz += "**Explication:** La vitesse moyenne se calcule en divisant la distance par le temps: 240 km ÷ 3 h = 80 km/h.\n\n";
  
  // Question 5 - Raisonnement logique
  quiz += "## Question 5\n\n";
  quiz += "Si tous les A sont des B, et certains B sont des C, laquelle des affirmations suivantes est nécessairement vraie?\n\n";
  quiz += "A) Tous les A sont des C\n";
  quiz += "B) Certains A sont des C\n";
  quiz += "C) Aucun A n'est un C\n";
  quiz += "D) Aucune des affirmations précédentes n'est nécessairement vraie\n\n";
  quiz += "**Réponse correcte: D**\n\n";
  quiz += "**Explication:** Avec les informations données, il est possible que certains A soient des C, mais ce n'est pas nécessairement le cas. Il est également possible qu'aucun A ne soit un C. Par conséquent, aucune des affirmations A, B ou C n'est nécessairement vraie.\n\n";
  
  return quiz;
}
