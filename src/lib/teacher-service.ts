import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { getMockAvailableTimeSlots } from './mock-calendar';

// Interface pour les données d'un professeur
export interface Teacher {
  id?: string;
  name: string;
  email: string;
  specialty: string;
  bio?: string;
  rating?: number;
  reviews?: number;
  image?: string;
  calendarId: string;
  workHours?: {
    start: string;
    end: string;
  };
  languages?: string[];
  hourlyRate?: number;
  available?: boolean;
}

// Interface pour les données d'une session
export interface Session {
  id?: string;
  teacherId: string;
  studentId: string;
  startTime: string;
  endTime: string;
  topic?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt?: Timestamp;
}

/**
 * Récupère tous les professeurs disponibles
 * @returns Liste des professeurs
 */
export async function getAvailableTeachers(): Promise<Teacher[]> {
  try {
    const teachersRef = collection(db, 'teachers');
    const q = query(teachersRef, where('available', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Teacher
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs:', error);
    throw error;
  }
}

/**
 * Récupère un professeur par son ID
 * @param teacherId ID du professeur
 * @returns Données du professeur
 */
export async function getTeacherById(teacherId: string): Promise<Teacher | null> {
  try {
    const teacherDoc = await getDoc(doc(db, 'teachers', teacherId));
    
    if (!teacherDoc.exists()) {
      return null;
    }
    
    return {
      id: teacherDoc.id,
      ...teacherDoc.data() as Teacher
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération du professeur ${teacherId}:`, error);
    throw error;
  }
}

/**
 * Récupère les créneaux disponibles pour un professeur sur une date donnée
 * @param teacherId ID du professeur
 * @param date Date au format YYYY-MM-DD
 * @returns Liste des créneaux disponibles
 */
export async function getTeacherAvailability(teacherId: string, date: string): Promise<{start: string, end: string}[]> {
  try {
    // Récupérer les informations du professeur
    const teacher = await getTeacherById(teacherId);
    
    if (!teacher || !teacher.calendarId) {
      throw new Error('Professeur non trouvé ou calendrier non configuré');
    }
    
    // Récupérer les créneaux disponibles (version mock pour éviter les problèmes avec Google Calendar)
    const workHourStart = teacher.workHours?.start || '09:00';
    const workHourEnd = teacher.workHours?.end || '18:00';
    
    return await getMockAvailableTimeSlots(
      date,
      workHourStart,
      workHourEnd,
      60 // Durée d'un créneau en minutes
    );
  } catch (error) {
    console.error(`Erreur lors de la récupération des disponibilités du professeur ${teacherId}:`, error);
    throw error;
  }
}

/**
 * Crée une nouvelle session avec un professeur
 * @param session Données de la session à créer
 * @returns ID de la session créée
 */
export async function createSession(session: Omit<Session, 'id' | 'createdAt'>): Promise<string> {
  try {
    // Vérifier que le professeur existe
    const teacher = await getTeacherById(session.teacherId);
    
    if (!teacher) {
      throw new Error('Professeur non trouvé');
    }
    
    // Ajouter la session à Firestore
    const sessionData = {
      ...session,
      createdAt: Timestamp.now(),
      status: session.status || 'pending'
    };
    
    const docRef = await addDoc(collection(db, 'sessions'), sessionData);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    throw error;
  }
}

/**
 * Récupère les sessions d'un étudiant
 * @param studentId ID de l'étudiant
 * @returns Liste des sessions
 */
export async function getStudentSessions(studentId: string): Promise<Session[]> {
  try {
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('studentId', '==', studentId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Session
    }));
  } catch (error) {
    console.error(`Erreur lors de la récupération des sessions de l'étudiant ${studentId}:`, error);
    throw error;
  }
}

/**
 * Met à jour le statut d'une session
 * @param sessionId ID de la session
 * @param status Nouveau statut
 */
export async function updateSessionStatus(sessionId: string, status: Session['status']): Promise<void> {
  try {
    const sessionRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessionRef, { status });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut de la session ${sessionId}:`, error);
    throw error;
  }
}

/**
 * Récupère les détails d'une session avec les informations du professeur
 * @param sessionId ID de la session
 * @returns Détails de la session avec les informations du professeur
 */
export async function getSessionDetails(sessionId: string): Promise<{session: Session, teacher: Teacher} | null> {
  try {
    const sessionDoc = await getDoc(doc(db, 'sessions', sessionId));
    
    if (!sessionDoc.exists()) {
      return null;
    }
    
    const sessionData = {
      id: sessionDoc.id,
      ...sessionDoc.data() as Session
    };
    
    const teacher = await getTeacherById(sessionData.teacherId);
    
    if (!teacher) {
      throw new Error('Professeur non trouvé');
    }
    
    return {
      session: sessionData,
      teacher
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails de la session ${sessionId}:`, error);
    throw error;
  }
}
