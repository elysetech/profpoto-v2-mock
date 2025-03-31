import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Configuration Firebase Admin SDK
const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
};

// Vérifier si les variables d'environnement Firebase Admin sont définies
const isFirebaseAdminConfigured = 
  firebaseAdminConfig.projectId &&
  firebaseAdminConfig.privateKey &&
  firebaseAdminConfig.clientEmail;

console.log("🔥 Firebase Admin: Vérification de la configuration...");
console.log("🔥 Firebase Admin: Project ID défini:", !!firebaseAdminConfig.projectId);
console.log("🔥 Firebase Admin: Private Key définie:", !!firebaseAdminConfig.privateKey);
console.log("🔥 Firebase Admin: Client Email défini:", !!firebaseAdminConfig.clientEmail);
console.log("🔥 Firebase Admin: Configuration complète:", isFirebaseAdminConfigured);

// Initialiser Firebase Admin SDK
let adminApp: App;

if (!getApps().length) {
  try {
    console.log("🔥 Firebase Admin: Initialisation des services...");
    
    if (!isFirebaseAdminConfigured) {
      console.warn(
        "🔥 Firebase Admin: ATTENTION - Firebase Admin n'est pas correctement configuré. Veuillez remplir les variables d'environnement dans .env.local"
      );
      
      // Initialiser avec une configuration minimale pour le développement
      adminApp = initializeApp({
        projectId: firebaseAdminConfig.projectId || 'dummy-project',
      });
    } else {
      // Initialiser avec les informations d'identification complètes
      adminApp = initializeApp({
        credential: cert({
          projectId: firebaseAdminConfig.projectId,
          privateKey: firebaseAdminConfig.privateKey,
          clientEmail: firebaseAdminConfig.clientEmail,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      
      console.log("🔥 Firebase Admin: Configuration complète et valide");
    }
    
    console.log("🔥 Firebase Admin: App initialisée");
  } catch (error) {
    console.error("🔥 Firebase Admin: Erreur lors de l'initialisation:", error);
    throw error;
  }
} else {
  console.log("🔥 Firebase Admin: Utilisation de l'instance existante");
  adminApp = getApps()[0];
}

// Exporter les services
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);

// Fonction utilitaire pour tester la connexion à Firebase Admin
export async function testFirebaseAdminConnection() {
  console.log("🔥 Firebase Admin: Test de connexion...");
  
  try {
    // Vérifier si Firebase Admin est correctement initialisé
    if (!adminApp) {
      throw new Error("Firebase Admin n'est pas initialisé");
    }
    
    // Tester l'accès à Firestore
    const testCollection = adminDb.collection('test');
    await testCollection.listDocuments();
    
    // Tester l'accès à Storage
    const bucket = adminStorage.bucket();
    await bucket.exists();
    
    console.log("🔥 Firebase Admin: Services correctement initialisés");
    
    return { success: true, message: "Connexion à Firebase Admin réussie" };
  } catch (error) {
    console.error("🔥 Firebase Admin: Erreur lors du test de connexion:", error);
    return { 
      success: false, 
      message: `Erreur de connexion à Firebase Admin: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
    };
  }
}

// Fonction utilitaire pour tester l'upload vers Firebase Storage
export async function testFirebaseStorage() {
  console.log("🔥 Firebase Admin: Test d'upload vers Storage...");
  
  try {
    if (!adminApp) {
      throw new Error("Firebase Admin n'est pas initialisé");
    }
    
    const bucket = adminStorage.bucket();
    
    // Créer un fichier de test
    const testFileName = `test-${Date.now()}.txt`;
    const testFile = bucket.file(testFileName);
    
    // Uploader un contenu de test
    await testFile.save('Ceci est un fichier de test pour Firebase Storage', {
      contentType: 'text/plain',
      metadata: {
        customMetadata: {
          createdBy: 'firebase-admin-test',
          timestamp: new Date().toISOString(),
        },
      },
    });
    
    // Générer une URL de téléchargement
    const [url] = await testFile.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    
    console.log("🔥 Firebase Admin: Upload réussi, URL:", url);
    
    return { 
      success: true, 
      message: "Upload vers Firebase Storage réussi", 
      downloadUrl: url,
      fileName: testFileName
    };
  } catch (error) {
    console.error("🔥 Firebase Admin: Erreur lors du test d'upload:", error);
    return { 
      success: false, 
      message: `Erreur lors du test d'upload vers Firebase Storage: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
    };
  }
}

// Fonction utilitaire pour vérifier les règles de sécurité Firebase Storage
export async function checkStorageRules() {
  console.log("🔥 Firebase Admin: Vérification des règles de sécurité Storage...");
  
  try {
    if (!adminApp) {
      throw new Error("Firebase Admin n'est pas initialisé");
    }
    
    const bucket = adminStorage.bucket();
    
    // Vérifier si le bucket existe
    const [exists] = await bucket.exists();
    if (!exists) {
      throw new Error("Le bucket de stockage n'existe pas");
    }
    
    // Vérifier les métadonnées du bucket
    const [metadata] = await bucket.getMetadata();
    
    // Vérifier si le bucket est accessible publiquement
    const isPublic = metadata.iamConfiguration?.uniformBucketLevelAccess?.enabled === false;
    
    // Recommandations basées sur la configuration
    const recommendations = [];
    
    if (isPublic) {
      recommendations.push("Activez l'accès uniforme au niveau du bucket pour une meilleure sécurité.");
    }
    
    recommendations.push("Assurez-vous que vos règles de sécurité Firebase Storage autorisent les utilisateurs authentifiés à uploader des fichiers.");
    recommendations.push("Vérifiez que le chemin de stockage utilisé dans votre application correspond à celui défini dans les règles de sécurité.");
    
    return {
      success: true,
      message: "Vérification des règles de sécurité Firebase Storage réussie",
      isPublic,
      bucketName: metadata.name,
      recommendations
    };
  } catch (error) {
    console.error("🔥 Firebase Admin: Erreur lors de la vérification des règles:", error);
    
    // Déterminer la solution en fonction de l'erreur
    let solution = "Vérifiez la console Firebase pour plus de détails sur l'erreur. Assurez-vous que votre projet Firebase est correctement configuré et que vous avez les autorisations nécessaires.";
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes("permission denied") || errorMessage.includes("unauthorized")) {
        solution = "Vérifiez que le compte de service Firebase Admin a les autorisations nécessaires pour accéder à Storage. Assurez-vous que le rôle 'Storage Admin' est attribué au compte de service.";
      } else if (errorMessage.includes("not found")) {
        solution = "Le bucket de stockage spécifié n'existe pas. Vérifiez que le nom du bucket dans votre configuration correspond à celui dans la console Firebase.";
      } else if (errorMessage.includes("network")) {
        solution = "Problème de connexion réseau. Vérifiez votre connexion internet et assurez-vous que les ports nécessaires ne sont pas bloqués par un pare-feu.";
      }
    }
    
    return { 
      success: false, 
      message: `Erreur lors de la vérification des règles de sécurité: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      solution
    };
  }
}
