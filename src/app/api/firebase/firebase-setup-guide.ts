import { NextResponse } from 'next/server';

/**
 * Route API pour afficher un guide de configuration Firebase
 * GET /api/firebase/firebase-setup-guide
 */
export async function GET() {
  return NextResponse.json({
    title: "Guide de configuration Firebase Storage",
    steps: [
      {
        title: "Étape 1: Vérifier les variables d'environnement",
        description: "Assurez-vous que toutes les variables d'environnement Firebase sont correctement définies dans votre fichier .env.local",
        instructions: [
          "Ouvrez le fichier .env.local à la racine de votre projet",
          "Vérifiez que les variables suivantes sont définies et correctes:",
          "- NEXT_PUBLIC_FIREBASE_API_KEY",
          "- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
          "- NEXT_PUBLIC_FIREBASE_PROJECT_ID",
          "- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
          "- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
          "- NEXT_PUBLIC_FIREBASE_APP_ID"
        ]
      },
      {
        title: "Étape 2: Vérifier la console Firebase",
        description: "Accédez à la console Firebase pour vérifier la configuration de votre projet",
        instructions: [
          "1. Allez sur https://console.firebase.google.com/",
          "2. Sélectionnez votre projet (profpotocline)",
          "3. Dans le menu de gauche, cliquez sur 'Storage'",
          "4. Vérifiez que Firebase Storage est activé pour votre projet",
          "5. Si ce n'est pas le cas, cliquez sur 'Commencer' et suivez les instructions"
        ]
      },
      {
        title: "Étape 3: Vérifier les règles de sécurité Firebase Storage",
        description: "Les règles de sécurité Firebase Storage peuvent bloquer les uploads si elles sont trop restrictives",
        instructions: [
          "1. Dans la console Firebase, allez dans 'Storage' > 'Règles'",
          "2. Vérifiez les règles actuelles",
          "3. Pour le développement, vous pouvez utiliser des règles permissives (à ne pas utiliser en production):",
          `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
          `,
          "4. Cliquez sur 'Publier' pour appliquer les nouvelles règles"
        ]
      },
      {
        title: "Étape 4: Vérifier l'authentification Firebase",
        description: "Firebase Storage nécessite souvent une authentification pour les uploads",
        instructions: [
          "1. Dans la console Firebase, allez dans 'Authentication'",
          "2. Vérifiez que les méthodes d'authentification nécessaires sont activées (Email/Password, Google, etc.)",
          "3. Si ce n'est pas le cas, activez-les en cliquant sur 'Configurer' à côté de chaque méthode",
          "4. Vérifiez que vous êtes bien connecté dans l'application avant d'essayer d'uploader des fichiers"
        ]
      },
      {
        title: "Étape 5: Vérifier les quotas et limites",
        description: "Firebase Storage a des limites de stockage et de bande passante",
        instructions: [
          "1. Dans la console Firebase, allez dans 'Usage and billing' > 'Details & settings'",
          "2. Vérifiez que vous n'avez pas atteint les limites de votre plan",
          "3. Si nécessaire, passez à un plan supérieur"
        ]
      },
      {
        title: "Étape 6: Vérifier le CORS",
        description: "Les problèmes CORS peuvent empêcher les uploads vers Firebase Storage",
        instructions: [
          "1. Dans la console Firebase, allez dans 'Storage' > 'Rules'",
          "2. Vérifiez que vous n'avez pas de règles CORS restrictives",
          "3. Si nécessaire, configurez CORS pour autoriser les requêtes depuis votre domaine"
        ]
      },
      {
        title: "Étape 7: Tester avec un fichier plus petit",
        description: "Les fichiers volumineux peuvent causer des problèmes d'upload",
        instructions: [
          "1. Essayez d'uploader un fichier très petit (moins de 100KB)",
          "2. Si cela fonctionne, le problème peut être lié à la taille du fichier ou au timeout"
        ]
      },
      {
        title: "Étape 8: Vérifier le code d'initialisation Firebase",
        description: "Assurez-vous que Firebase est correctement initialisé dans votre application",
        instructions: [
          "1. Ouvrez le fichier src/lib/firebase.ts",
          "2. Vérifiez que l'initialisation de Firebase est correcte",
          "3. Assurez-vous que le service Storage est correctement exporté"
        ]
      }
    ],
    additionalResources: [
      {
        title: "Documentation Firebase Storage",
        url: "https://firebase.google.com/docs/storage"
      },
      {
        title: "Règles de sécurité Firebase Storage",
        url: "https://firebase.google.com/docs/storage/security"
      },
      {
        title: "Dépannage Firebase Storage",
        url: "https://firebase.google.com/docs/storage/web/handle-errors"
      }
    ]
  });
}
