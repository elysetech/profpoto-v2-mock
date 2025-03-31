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

    // Générer un exercice similaire fictif basé sur le texte fourni
    const similarExercise = generateMockSimilarExercise(text, mathExpressions);

    return NextResponse.json({ 
      success: true, 
      similarExercise,
      documentId
    });
  } catch (error) {
    console.error('Error generating mock similar exercise:', error);
    return NextResponse.json(
      { error: 'Failed to generate similar exercise' },
      { status: 500 }
    );
  }
}

function generateMockSimilarExercise(text: string, mathExpressions?: string[]) {
  // Détecter si le texte contient des mots-clés mathématiques
  const hasAlgebra = /équation|variable|x\s*[+\-*/=]\s*\d|résoudre/i.test(text);
  const hasGeometry = /triangle|cercle|carré|rectangle|angle|degré/i.test(text);
  const hasCalculus = /dérivée|intégrale|limite|fonction/i.test(text);
  const hasArithmetic = /addition|soustraction|multiplication|division/i.test(text);
  
  let similarExercise = "# Exercice similaire\n\n";
  
  if (hasAlgebra) {
    similarExercise += "## Résolution d'équations du second degré\n\n";
    similarExercise += "Résoudre les équations suivantes :\n\n";
    similarExercise += "1. $3x^2 - 7x + 2 = 0$\n";
    similarExercise += "2. $x^2 - 6x + 9 = 0$\n";
    similarExercise += "3. $2x^2 + 5x - 3 = 0$\n";
    similarExercise += "4. $4x^2 - 1 = 0$\n";
    similarExercise += "5. $x^2 + 4x + 6 = 0$\n\n";
    similarExercise += "Pour chaque équation :\n";
    similarExercise += "- Calculez le discriminant\n";
    similarExercise += "- Déterminez le nombre de solutions réelles\n";
    similarExercise += "- Trouvez les solutions exactes\n";
    similarExercise += "- Vérifiez vos résultats\n\n";
  } else if (hasGeometry) {
    similarExercise += "## Problèmes de géométrie\n\n";
    similarExercise += "### Exercice 1 : Triangle rectangle\n\n";
    similarExercise += "Dans un triangle rectangle ABC, rectangle en A, on donne :\n";
    similarExercise += "- AB = 6 cm\n";
    similarExercise += "- AC = 8 cm\n\n";
    similarExercise += "1. Calculez la longueur BC (l'hypoténuse)\n";
    similarExercise += "2. Calculez l'aire du triangle ABC\n";
    similarExercise += "3. Calculez les valeurs des angles B et C (en degrés)\n";
    similarExercise += "4. On place un point D sur le segment [BC] tel que AD soit perpendiculaire à BC. Calculez la longueur AD.\n\n";
    similarExercise += "### Exercice 2 : Cercle inscrit\n\n";
    similarExercise += "Soit un triangle ABC tel que AB = 7 cm, BC = 8 cm et AC = 9 cm.\n\n";
    similarExercise += "1. Montrez que ce triangle est non rectangle\n";
    similarExercise += "2. Calculez l'aire de ce triangle\n";
    similarExercise += "3. Déterminez le rayon du cercle inscrit dans ce triangle\n";
    similarExercise += "4. Calculez la distance du centre du cercle inscrit à chacun des sommets du triangle\n\n";
  } else if (hasCalculus) {
    similarExercise += "## Calcul différentiel\n\n";
    similarExercise += "### Exercice 1 : Dérivation de fonctions\n\n";
    similarExercise += "Calculez les dérivées des fonctions suivantes :\n\n";
    similarExercise += "1. $f(x) = 2x^3 - 5x^2 + 3x - 7$\n";
    similarExercise += "2. $g(x) = \\frac{x^2 + 1}{x - 2}$\n";
    similarExercise += "3. $h(x) = x \\cdot e^{2x}$\n";
    similarExercise += "4. $j(x) = \\ln(x^2 + 3)$\n";
    similarExercise += "5. $k(x) = \\sin(2x) \\cdot \\cos(x)$\n\n";
    similarExercise += "### Exercice 2 : Applications de la dérivée\n\n";
    similarExercise += "Soit la fonction $f(x) = x^3 - 3x^2 - 9x + 5$ définie sur $\\mathbb{R}$.\n\n";
    similarExercise += "1. Calculez $f'(x)$\n";
    similarExercise += "2. Déterminez les intervalles où $f$ est croissante ou décroissante\n";
    similarExercise += "3. Calculez $f''(x)$ et déterminez les intervalles où la courbe représentative de $f$ est convexe ou concave\n";
    similarExercise += "4. Déterminez les coordonnées des points d'inflexion de la courbe\n";
    similarExercise += "5. Tracez l'allure de la courbe représentative de $f$\n\n";
  } else if (hasArithmetic) {
    similarExercise += "## Opérations arithmétiques\n\n";
    similarExercise += "### Exercice 1 : Calcul mental\n\n";
    similarExercise += "Effectuez les calculs suivants sans calculatrice :\n\n";
    similarExercise += "1. $47 + 86$\n";
    similarExercise += "2. $125 - 67$\n";
    similarExercise += "3. $32 \\times 15$\n";
    similarExercise += "4. $248 ÷ 8$\n";
    similarExercise += "5. $19 \\times 21$\n";
    similarExercise += "6. $72 ÷ 12 + 15 \\times 4$\n";
    similarExercise += "7. $(36 + 44) ÷ 8$\n";
    similarExercise += "8. $17 \\times 6 - 22$\n\n";
    similarExercise += "### Exercice 2 : Problème concret\n\n";
    similarExercise += "Un magasin propose des cahiers à 3,50 € l'unité et des stylos à 1,25 € l'unité.\n\n";
    similarExercise += "1. Calculez le prix de 5 cahiers et 8 stylos\n";
    similarExercise += "2. Pierre dispose de 50 €. Combien de cahiers peut-il acheter au maximum s'il a déjà acheté 6 stylos ?\n";
    similarExercise += "3. Marie souhaite acheter des cahiers et des stylos pour un montant exact de 30 €. Trouvez toutes les combinaisons possibles de cahiers et de stylos qu'elle peut acheter.\n";
    similarExercise += "4. Le magasin propose une réduction de 10% pour tout achat supérieur à 40 €. Quel est le prix à payer pour 10 cahiers et 12 stylos ?\n\n";
  } else {
    similarExercise += "## Exercices variés\n\n";
    similarExercise += "### Exercice 1 : Résolution de problème\n\n";
    similarExercise += "Un réservoir cylindrique a un rayon de 2 mètres et une hauteur de 5 mètres.\n\n";
    similarExercise += "1. Calculez le volume du réservoir en mètres cubes\n";
    similarExercise += "2. Si le réservoir se remplit à un débit constant de 0,5 mètre cube par minute, combien de temps faudra-t-il pour le remplir complètement ?\n";
    similarExercise += "3. Si le niveau d'eau dans le réservoir augmente de manière constante, quelle est la vitesse d'augmentation du niveau en centimètres par minute ?\n";
    similarExercise += "4. On perce un trou au fond du réservoir, ce qui provoque une fuite à un débit de 0,2 mètre cube par minute. Si le réservoir est initialement plein et qu'on arrête de le remplir, combien de temps faudra-t-il pour qu'il se vide complètement ?\n\n";
    similarExercise += "### Exercice 2 : Analyse de données\n\n";
    similarExercise += "Les notes d'un groupe de 10 étudiants à un examen sont les suivantes : 12, 15, 8, 17, 13, 9, 14, 11, 16, 10.\n\n";
    similarExercise += "1. Calculez la moyenne de ces notes\n";
    similarExercise += "2. Calculez la médiane de ces notes\n";
    similarExercise += "3. Calculez l'écart-type de ces notes\n";
    similarExercise += "4. Si l'enseignant décide d'ajouter 2 points à chaque note, comment cela affecte-t-il la moyenne, la médiane et l'écart-type ?\n";
    similarExercise += "5. Si l'enseignant décide de multiplier chaque note par 1,1, comment cela affecte-t-il la moyenne, la médiane et l'écart-type ?\n\n";
  }
  
  // Ajouter une section basée sur les expressions mathématiques si elles sont fournies
  if (mathExpressions && mathExpressions.length > 0) {
    similarExercise += "## Exercices basés sur les expressions du document original\n\n";
    
    mathExpressions.forEach((expr, index) => {
      similarExercise += `### Exercice inspiré de l'expression : $${expr}$\n\n`;
      
      if (expr.includes("=")) {
        similarExercise += "Résolvez les équations suivantes :\n\n";
        similarExercise += `1. $${expr.replace(/\d+/g, n => (parseInt(n) + 2).toString())}$\n`;
        similarExercise += `2. $${expr.replace(/\d+/g, n => (parseInt(n) - 1).toString())}$\n`;
        similarExercise += `3. $2 \\cdot (${expr})$\n\n`;
      } else if (expr.includes("sin") || expr.includes("cos") || expr.includes("tan")) {
        similarExercise += "Calculez les expressions trigonométriques suivantes :\n\n";
        similarExercise += `1. $2 \\cdot ${expr}$\n`;
        similarExercise += `2. $${expr.replace("sin", "cos").replace("cos", "sin")}$\n`;
        similarExercise += `3. $${expr} + ${expr.replace("sin", "cos").replace("cos", "sin")}$\n\n`;
      } else if (expr.includes("^")) {
        similarExercise += "Simplifiez les expressions suivantes :\n\n";
        similarExercise += `1. $${expr} \\cdot ${expr.replace(/\^(\d+)/g, (match, p1) => `^${parseInt(p1) - 1}`)}$\n`;
        similarExercise += `2. $\\frac{${expr}}{${expr.replace(/\^(\d+)/g, (match, p1) => `^${parseInt(p1) - 1}`)}$\n`;
        similarExercise += `3. $\\sqrt{${expr}}$\n\n`;
      } else {
        similarExercise += "Calculez les expressions suivantes :\n\n";
        similarExercise += `1. $2 \\cdot (${expr})$\n`;
        similarExercise += `2. $(${expr})^2$\n`;
        similarExercise += `3. $\\frac{1}{${expr}}$\n\n`;
      }
    });
  }
  
  similarExercise += "## Conseils pour la résolution\n\n";
  similarExercise += "1. Lisez attentivement l'énoncé et identifiez les données importantes\n";
  similarExercise += "2. Choisissez la méthode appropriée pour chaque type de problème\n";
  similarExercise += "3. Procédez étape par étape et notez clairement vos calculs\n";
  similarExercise += "4. Vérifiez vos résultats en les substituant dans les équations originales\n";
  similarExercise += "5. Exprimez vos réponses avec les unités appropriées lorsque nécessaire\n\n";
  
  return similarExercise;
}
