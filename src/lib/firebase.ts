import { initializeApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Vérifier si les variables d'environnement Firebase sont définies
const isFirebaseConfigured = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

console.log("🔥 Firebase: Vérification de la configuration...");
console.log("🔥 Firebase: API Key définie:", !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("🔥 Firebase: Auth Domain défini:", !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log("🔥 Firebase: Project ID défini:", !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log("🔥 Firebase: Storage Bucket défini:", !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log("🔥 Firebase: Messaging Sender ID défini:", !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
console.log("🔥 Firebase: App ID défini:", !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
console.log("🔥 Firebase: Configuration complète:", isFirebaseConfigured);

// Firebase configuration
const firebaseConfig = isFirebaseConfigured 
  ? {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }
  : {
      // Configuration de secours pour le développement
      apiKey: "dummy-api-key",
      authDomain: "dummy-project.firebaseapp.com",
      projectId: "dummy-project",
      storageBucket: "dummy-project.appspot.com",
      messagingSenderId: "000000000000",
      appId: "1:000000000000:web:0000000000000000000000",
    };

console.log("🔥 Firebase: Configuration utilisée:", {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? "***" : "non définie",
});

import { FirebaseApp } from 'firebase/app';

// Initialiser Firebase et exporter les services
let firebaseApp: FirebaseApp | undefined;
let authService: Auth;
let dbService: Firestore;
let storageService: FirebaseStorage;

// Vérifier si Firebase est déjà initialisé
if (!getApps().length) {
  console.log("🔥 Firebase: Initialisation des services...");
  try {
    firebaseApp = initializeApp(firebaseConfig);
    console.log("🔥 Firebase: App initialisée");
    
    authService = getAuth(firebaseApp);
    console.log("🔥 Firebase: Service Auth initialisé");
    
    dbService = getFirestore(firebaseApp);
    console.log("🔥 Firebase: Service Firestore initialisé");
    
    storageService = getStorage(firebaseApp);
    console.log("🔥 Firebase: Service Storage initialisé");
    
    if (!isFirebaseConfigured) {
      console.warn(
        "🔥 Firebase: ATTENTION - Firebase n'est pas correctement configuré. Veuillez remplir les variables d'environnement dans .env.local"
      );
    } else {
      console.log("🔥 Firebase: Configuration complète et valide");
    }
  } catch (error) {
    console.error("🔥 Firebase: Erreur lors de l'initialisation:", error);
    
    // Créer des objets fictifs pour éviter les erreurs
    authService = {} as Auth;
    dbService = {} as Firestore;
    storageService = {} as FirebaseStorage;
  }
} else {
  console.log("🔥 Firebase: Utilisation de l'instance existante");
  firebaseApp = getApps()[0];
  authService = getAuth(firebaseApp);
  dbService = getFirestore(firebaseApp);
  storageService = getStorage(firebaseApp);
}

// Exporter les services
export const auth = authService;
export const db = dbService;
export const storage = storageService;

// Fonction utilitaire pour tester la connexion à Firebase
export async function testFirebaseConnection() {
  console.log("🔥 Firebase: Test de connexion...");
  
  try {
    // Vérifier si Firebase est correctement initialisé
    if (!firebaseApp) {
      throw new Error("Firebase n'est pas initialisé");
    }
    
    // Vérifier si les services sont des objets vides (cas d'erreur)
    if (Object.keys(db).length === 0) {
      throw new Error("Firestore n'est pas correctement initialisé");
    }
    
    if (Object.keys(storage).length === 0) {
      throw new Error("Storage n'est pas correctement initialisé");
    }
    
    console.log("🔥 Firebase: Services correctement initialisés");
    
    return { success: true, message: "Connexion à Firebase réussie" };
  } catch (error) {
    console.error("🔥 Firebase: Erreur lors du test de connexion:", error);
    return { 
      success: false, 
      message: `Erreur de connexion à Firebase: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
    };
  }
}
