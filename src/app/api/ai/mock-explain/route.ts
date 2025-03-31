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
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Générer une explication fictive basée sur le texte fourni
    const explanation = generateMockExplanation(text, mathExpressions);

    return NextResponse.json({ 
      success: true, 
      explanation,
      documentId
    });
  } catch (error) {
    console.error('Error generating mock explanation:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}

function generateMockExplanation(text: string, mathExpressions?: string[]) {
  // Détecter si le texte contient des mots-clés mathématiques
  const hasAlgebra = /équation|variable|x\s*[+\-*/=]\s*\d|résoudre/i.test(text);
  const hasGeometry = /triangle|cercle|carré|rectangle|angle|degré/i.test(text);
  const hasCalculus = /dérivée|intégrale|limite|fonction/i.test(text);
  const hasArithmetic = /addition|soustraction|multiplication|division/i.test(text);
  
  let explanation = "## Explication du contenu mathématique\n\n";
  
  if (hasAlgebra) {
    explanation += "### Concepts algébriques\n\n";
    explanation += "Dans ce document, nous abordons des concepts d'algèbre importants. Les équations présentées montrent comment manipuler des variables pour trouver des solutions spécifiques. Rappelez-vous que lorsque vous résolvez une équation, l'objectif est d'isoler la variable (généralement x) d'un côté de l'égalité.\n\n";
    explanation += "Pour résoudre une équation linéaire de type ax + b = c:\n";
    explanation += "1. Regroupez les termes avec x d'un côté\n";
    explanation += "2. Regroupez les termes constants de l'autre côté\n";
    explanation += "3. Divisez les deux côtés par le coefficient de x\n\n";
  }
  
  if (hasGeometry) {
    explanation += "### Concepts géométriques\n\n";
    explanation += "Ce document traite de concepts géométriques fondamentaux. La géométrie étudie les propriétés des formes, des tailles, des positions relatives des figures et les propriétés de l'espace.\n\n";
    explanation += "Points clés à retenir:\n";
    explanation += "- La somme des angles dans un triangle est toujours 180°\n";
    explanation += "- L'aire d'un cercle est calculée par la formule A = πr²\n";
    explanation += "- Le théorème de Pythagore (a² + b² = c²) s'applique uniquement aux triangles rectangles\n\n";
  }
  
  if (hasCalculus) {
    explanation += "### Analyse mathématique\n\n";
    explanation += "Ce document aborde des concepts d'analyse mathématique. L'analyse étudie les fonctions, leurs limites, dérivées et intégrales.\n\n";
    explanation += "Concepts importants:\n";
    explanation += "- La dérivée d'une fonction représente son taux de variation instantané\n";
    explanation += "- L'intégrale peut être interprétée comme l'aire sous la courbe d'une fonction\n";
    explanation += "- Les limites nous permettent d'étudier le comportement d'une fonction lorsque la variable s'approche d'une valeur spécifique\n\n";
  }
  
  if (hasArithmetic) {
    explanation += "### Opérations arithmétiques\n\n";
    explanation += "Ce document couvre les opérations arithmétiques fondamentales. L'arithmétique est la branche des mathématiques qui étudie les nombres et les opérations élémentaires.\n\n";
    explanation += "Rappel des opérations de base:\n";
    explanation += "- Addition: combiner deux nombres pour obtenir leur somme\n";
    explanation += "- Soustraction: trouver la différence entre deux nombres\n";
    explanation += "- Multiplication: processus d'addition répétée\n";
    explanation += "- Division: processus de partage équitable d'une quantité\n\n";
  }
  
  // Si aucun mot-clé spécifique n'est détecté, fournir une explication générale
  if (!hasAlgebra && !hasGeometry && !hasCalculus && !hasArithmetic) {
    explanation += "### Aperçu général\n\n";
    explanation += "Ce document contient du contenu mathématique qui couvre plusieurs concepts fondamentaux. Pour bien comprendre ces notions, il est important de:\n\n";
    explanation += "1. Maîtriser les définitions et propriétés de base\n";
    explanation += "2. S'entraîner avec différents types d'exercices\n";
    explanation += "3. Établir des connexions entre les différents concepts\n";
    explanation += "4. Appliquer ces connaissances à des problèmes concrets\n\n";
    explanation += "N'hésitez pas à revoir les sections précédentes du cours pour consolider votre compréhension des notions présentées ici.\n\n";
  }
  
  // Ajouter une section sur les expressions mathématiques si elles sont fournies
  if (mathExpressions && mathExpressions.length > 0) {
    explanation += "### Expressions mathématiques importantes\n\n";
    explanation += "Voici les expressions mathématiques clés identifiées dans ce document:\n\n";
    
    mathExpressions.forEach((expr, index) => {
      explanation += `**Expression ${index + 1}**: ${expr}\n\n`;
    });
    
    explanation += "Ces expressions représentent les formules et équations essentielles à comprendre pour maîtriser le sujet.\n\n";
  }
  
  explanation += "### Conseils d'étude\n\n";
  explanation += "Pour approfondir votre compréhension de ce sujet:\n";
  explanation += "- Faites des exercices supplémentaires pour renforcer votre maîtrise\n";
  explanation += "- Créez des fiches de révision avec les formules et concepts clés\n";
  explanation += "- Essayez d'expliquer ces concepts à quelqu'un d'autre pour tester votre compréhension\n";
  explanation += "- Reliez ces notions à des applications concrètes du monde réel\n\n";
  
  return explanation;
}
