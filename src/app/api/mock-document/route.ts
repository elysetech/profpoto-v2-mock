import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'ID du document depuis l'URL
    const url = new URL(request.url);
    const documentId = url.searchParams.get('id');

    if (!documentId) {
      return NextResponse.json(
        { error: 'ID de document manquant' },
        { status: 400 }
      );
    }

    // Simuler un délai pour rendre l'expérience plus réaliste
    await new Promise(resolve => setTimeout(resolve, 500));

    // Générer un document fictif
    const mockDocument = generateMockDocument(documentId);

    return NextResponse.json({ success: true, document: mockDocument });
  } catch (error) {
    console.error('Error generating mock document:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
}

function generateMockDocument(documentId: string) {
  // Générer un document fictif avec des données aléatoires
  const documentTypes = ['lesson', 'exercise'];
  const fileTypes = ['image', 'pdf'];
  const subjects = ['algèbre', 'géométrie', 'trigonométrie', 'arithmétique', 'analyse'];
  
  const randomDocumentType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
  const randomFileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
  
  let text = '';
  let mathExpressions = [];
  
  if (randomSubject === 'algèbre') {
    text = "Résolution d'équations du second degré. Pour résoudre une équation du type ax² + bx + c = 0, on utilise le discriminant Δ = b² - 4ac. Si Δ > 0, l'équation admet deux solutions réelles. Si Δ = 0, l'équation admet une solution réelle double. Si Δ < 0, l'équation n'admet pas de solution réelle.";
    mathExpressions = [
      "ax² + bx + c = 0",
      "Δ = b² - 4ac",
      "x = (-b ± √Δ) / 2a"
    ];
  } else if (randomSubject === 'géométrie') {
    text = "Théorème de Pythagore. Dans un triangle rectangle, le carré de la longueur de l'hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés. Si ABC est un triangle rectangle en A, alors BC² = AB² + AC².";
    mathExpressions = [
      "BC² = AB² + AC²",
      "a² + b² = c²"
    ];
  } else if (randomSubject === 'trigonométrie') {
    text = "Relations trigonométriques fondamentales. Dans un triangle rectangle, on définit le sinus, le cosinus et la tangente d'un angle comme les rapports entre les longueurs des côtés. Ces relations permettent de résoudre de nombreux problèmes de géométrie.";
    mathExpressions = [
      "sin(α) = côté opposé / hypoténuse",
      "cos(α) = côté adjacent / hypoténuse",
      "tan(α) = côté opposé / côté adjacent"
    ];
  } else if (randomSubject === 'arithmétique') {
    text = "Divisibilité et nombres premiers. Un nombre premier est un entier naturel qui admet exactement deux diviseurs distincts entiers et positifs. Les nombres premiers jouent un rôle fondamental en arithmétique et en cryptographie.";
    mathExpressions = [
      "a | b ⟺ ∃k ∈ ℤ, b = ka",
      "PGCD(a, b) = PGCD(b, a mod b)"
    ];
  } else {
    text = "Dérivation et applications. La dérivée d'une fonction en un point représente le taux de variation instantané de cette fonction en ce point. Géométriquement, elle correspond à la pente de la tangente à la courbe représentative de la fonction en ce point.";
    mathExpressions = [
      "f'(x) = lim_{h→0} [f(x+h) - f(x)] / h",
      "(f + g)' = f' + g'",
      "(f × g)' = f' × g + f × g'"
    ];
  }
  
  return {
    id: documentId,
    userId: "user123",
    fileName: `Document_${randomSubject}_${documentId.substring(0, 5)}`,
    fileType: randomFileType,
    documentType: randomDocumentType,
    fileUrl: `https://firebasestorage.googleapis.com/v0/b/profpotomvp-d1669.firebasestorage.app/o/documents%2Fuser123%2F${documentId}_math.png?alt=media&token=sample-token`,
    text: text,
    mathExpressions: mathExpressions,
    createdAt: new Date().toISOString(),
  };
}
