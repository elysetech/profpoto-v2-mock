import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  UserCredential
} from 'firebase/auth';

// Email/Password Authentication
export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const createUserWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Google Authentication
export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    const provider = new GoogleAuthProvider();
    // Try with popup first
    try {
      return await signInWithPopup(auth, provider);
    } catch (popupError) {
      console.error("Popup error, falling back to redirect:", popupError);
      // If popup fails, fall back to redirect
      await signInWithRedirect(auth, provider);
      // This won't be reached immediately after redirect
      return null;
    }
  } catch (error) {
    console.error("Google auth error:", error);
    throw error;
  }
};

// Check for redirect result (call this on component mount)
export const getGoogleRedirectResult = async (): Promise<UserCredential | null> => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error("Error getting redirect result:", error);
    return null;
  }
};

// Sign Out
export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};
