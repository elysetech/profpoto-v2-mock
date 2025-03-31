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
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Générer une correction fictive basée sur le texte fourni
    const correction = generateMockCorrection(text, mathExpressions);

    return NextResponse.json({ 
      success: true, 
      correction,
      documentId
    });
  } catch (error) {
    console.error('Error generating mock correction:', error);
    return NextResponse.json(
      { error: 'Failed to generate correction' },
      { status: 500 }
    );
  }
}

function generateMockCorrection(text: string, mathExpressions?: string[]) {
  // Détecter si le texte contient des mots-clés mathématiques
  const hasAlgebra = /équation|variable|x\s*[+\-*/=]\s*\d|résoudre/i.test(text);
  const hasGeometry = /triangle|cercle|carré|rectangle|angle|degré/i.test(text);
  const hasCalculus = /dérivée|intégrale|limite|fonction/i.test(text);
  const hasArithmetic = /addition|soustraction|multiplication|division/i.test(text);
  
  let correction = "# Correction détaillée\n\n";
  
  if (hasAlgebra) {
    correction += "## Résolution d'équation\n\n";
    correction += "Pour résoudre l'équation $ax^2 + bx + c = 0$, nous utilisons la formule du discriminant :\n\n";
    correction += "1. Calculer le discriminant : $\\Delta = b^2 - 4ac$\n";
    correction += "2. Analyser la valeur de $\\Delta$ :\n";
    correction += "   - Si $\\Delta > 0$ : deux solutions distinctes $x_1 = \\frac{-b - \\sqrt{\\Delta}}{2a}$ et $x_2 = \\frac{-b + \\sqrt{\\Delta}}{2a}$\n";
    correction += "   - Si $\\Delta = 0$ : une solution double $x = \\frac{-b}{2a}$\n";
    correction += "   - Si $\\Delta < 0$ : pas de solution réelle\n\n";
    correction += "### Application numérique\n\n";
    correction += "Prenons l'équation $2x^2 - 5x + 2 = 0$ :\n\n";
    correction += "1. Identifions les coefficients : $a = 2$, $b = -5$, $c = 2$\n";
    correction += "2. Calculons le discriminant : $\\Delta = (-5)^2 - 4 \\times 2 \\times 2 = 25 - 16 = 9$\n";
    correction += "3. Comme $\\Delta > 0$, l'équation admet deux solutions :\n";
    correction += "   - $x_1 = \\frac{5 - \\sqrt{9}}{2 \\times 2} = \\frac{5 - 3}{4} = \\frac{2}{4} = 0,5$\n";
    correction += "   - $x_2 = \\frac{5 + \\sqrt{9}}{2 \\times 2} = \\frac{5 + 3}{4} = \\frac{8}{4} = 2$\n\n";
    correction += "Les solutions de l'équation $2x^2 - 5x + 2 = 0$ sont donc $x_1 = 0,5$ et $x_2 = 2$.\n\n";
  } else if (hasGeometry) {
    correction += "## Problème de géométrie\n\n";
    correction += "### Calcul de l'aire d'un triangle\n\n";
    correction += "Pour calculer l'aire d'un triangle, nous pouvons utiliser plusieurs formules :\n\n";
    correction += "1. Formule de base : $A = \\frac{b \\times h}{2}$ où $b$ est la base et $h$ est la hauteur\n";
    correction += "2. Formule de Héron : $A = \\sqrt{p(p-a)(p-b)(p-c)}$ où $p = \\frac{a+b+c}{2}$ est le demi-périmètre\n\n";
    correction += "### Application numérique\n\n";
    correction += "Considérons un triangle de côtés $a = 5$ cm, $b = 7$ cm et $c = 8$ cm :\n\n";
    correction += "1. Calculons le demi-périmètre : $p = \\frac{5+7+8}{2} = \\frac{20}{2} = 10$ cm\n";
    correction += "2. Appliquons la formule de Héron :\n";
    correction += "   $A = \\sqrt{10 \\times (10-5) \\times (10-7) \\times (10-8)}$\n";
    correction += "   $A = \\sqrt{10 \\times 5 \\times 3 \\times 2}$\n";
    correction += "   $A = \\sqrt{300} \\approx 17,32$ cm²\n\n";
    correction += "L'aire du triangle est donc approximativement de 17,32 cm².\n\n";
  } else if (hasCalculus) {
    correction += "## Calcul de dérivée\n\n";
    correction += "Pour calculer la dérivée d'une fonction, nous appliquons les règles de dérivation :\n\n";
    correction += "1. Dérivée d'une constante : $(c)' = 0$\n";
    correction += "2. Dérivée de $x^n$ : $(x^n)' = n \\times x^{n-1}$\n";
    correction += "3. Règle de la somme : $(f + g)' = f' + g'$\n";
    correction += "4. Règle du produit : $(f \\times g)' = f' \\times g + f \\times g'$\n\n";
    correction += "### Application\n\n";
    correction += "Calculons la dérivée de $f(x) = 3x^4 - 2x^2 + 5x - 7$ :\n\n";
    correction += "1. Dérivée de $3x^4$ : $3 \\times 4 \\times x^{4-1} = 12x^3$\n";
    correction += "2. Dérivée de $-2x^2$ : $-2 \\times 2 \\times x^{2-1} = -4x$\n";
    correction += "3. Dérivée de $5x$ : $5 \\times 1 \\times x^{1-1} = 5$\n";
    correction += "4. Dérivée de $-7$ : $0$\n\n";
    correction += "En combinant ces résultats : $f'(x) = 12x^3 - 4x + 5$\n\n";
  } else if (hasArithmetic) {
    correction += "## Opérations arithmétiques\n\n";
    correction += "### Addition de nombres à deux chiffres\n\n";
    correction += "Pour additionner des nombres à deux chiffres, nous pouvons procéder de deux façons :\n\n";
    correction += "1. Méthode classique : additionner les unités, puis les dizaines, en tenant compte des retenues\n";
    correction += "2. Méthode de décomposition : décomposer les nombres, additionner séparément, puis recombiner\n\n";
    correction += "### Exemples\n\n";
    correction += "Calculons $37 + 45$ :\n\n";
    correction += "**Méthode classique :**\n";
    correction += "1. Addition des unités : $7 + 5 = 12$, on écrit $2$ et on retient $1$\n";
    correction += "2. Addition des dizaines : $3 + 4 + 1 = 8$\n";
    correction += "3. Résultat : $82$\n\n";
    correction += "**Méthode de décomposition :**\n";
    correction += "1. Décomposition : $37 = 30 + 7$ et $45 = 40 + 5$\n";
    correction += "2. Addition des dizaines : $30 + 40 = 70$\n";
    correction += "3. Addition des unités : $7 + 5 = 12$\n";
    correction += "4. Combinaison : $70 + 12 = 82$\n\n";
    correction += "Le résultat de $37 + 45$ est donc $82$.\n\n";
  } else {
    correction += "## Résolution du problème\n\n";
    correction += "Pour résoudre ce problème, nous allons procéder par étapes :\n\n";
    correction += "1. Identifier les données du problème\n";
    correction += "2. Déterminer la méthode de résolution appropriée\n";
    correction += "3. Appliquer la méthode et effectuer les calculs\n";
    correction += "4. Vérifier la cohérence du résultat\n\n";
    correction += "### Application\n\n";
    correction += "Considérons un problème où l'on cherche à déterminer la valeur de $x$ dans l'expression $2x + 3 = 11$ :\n\n";
    correction += "1. Nous avons l'équation $2x + 3 = 11$\n";
    correction += "2. Pour isoler $x$, soustrayons $3$ des deux côtés : $2x + 3 - 3 = 11 - 3$, ce qui donne $2x = 8$\n";
    correction += "3. Divisons les deux côtés par $2$ : $\\frac{2x}{2} = \\frac{8}{2}$, ce qui donne $x = 4$\n";
    correction += "4. Vérifions : $2 \\times 4 + 3 = 8 + 3 = 11$ ✓\n\n";
    correction += "La solution est donc $x = 4$.\n\n";
  }
  
  // Ajouter une section sur les expressions mathématiques si elles sont fournies
  if (mathExpressions && mathExpressions.length > 0) {
    correction += "## Expressions mathématiques spécifiques\n\n";
    
    mathExpressions.forEach((expr, index) => {
      correction += `### Expression ${index + 1}: $${expr}$\n\n`;
      correction += "Cette expression peut être interprétée comme suit :\n\n";
      
      if (expr.includes("=")) {
        correction += "Il s'agit d'une équation à résoudre. Pour la résoudre :\n";
        correction += "1. Isoler les termes avec la variable d'un côté\n";
        correction += "2. Isoler les termes constants de l'autre côté\n";
        correction += "3. Effectuer les opérations nécessaires pour isoler la variable\n\n";
      } else if (expr.includes("sin") || expr.includes("cos") || expr.includes("tan")) {
        correction += "Il s'agit d'une expression trigonométrique. Pour l'évaluer :\n";
        correction += "1. Identifier les fonctions trigonométriques impliquées\n";
        correction += "2. Déterminer les valeurs des angles\n";
        correction += "3. Appliquer les formules trigonométriques appropriées\n\n";
      } else if (expr.includes("^")) {
        correction += "Il s'agit d'une expression avec des puissances. Pour l'évaluer :\n";
        correction += "1. Identifier la base et l'exposant\n";
        correction += "2. Appliquer les règles des puissances\n";
        correction += "3. Effectuer les calculs numériques\n\n";
      } else {
        correction += "Pour évaluer cette expression :\n";
        correction += "1. Respecter l'ordre des opérations (PEMDAS)\n";
        correction += "2. Effectuer les calculs étape par étape\n";
        correction += "3. Vérifier le résultat final\n\n";
      }
    });
  }
  
  correction += "## Conclusion\n\n";
  correction += "En résumé, pour résoudre ce type de problème :\n\n";
  correction += "1. Identifier clairement ce qui est demandé\n";
  correction += "2. Appliquer les formules et méthodes appropriées\n";
  correction += "3. Effectuer les calculs avec précision\n";
  correction += "4. Vérifier la cohérence du résultat obtenu\n\n";
  correction += "Cette approche méthodique permet de résoudre efficacement la plupart des problèmes mathématiques.\n";
  
  return correction;
}
