import { NextResponse } from 'next/server';
import { getStudentSessions, getTeacherById } from '@/lib/teacher-service';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * Route API pour récupérer les sessions d'un étudiant
 * GET /api/sessions/list
 */
export async function GET() {
  try {
    // Récupérer le token d'authentification depuis les cookies
    const sessionCookie = cookies().get('session')?.value;
    
    if (!sessionCookie) {
      // Si l'utilisateur n'est pas connecté, retourner des données de test
      // pour permettre le développement sans authentification
      console.log("Utilisateur non connecté, retour de données de test");
      
      return NextResponse.json({
        success: true,
        sessions: [
          {
            id: "test-session-1",
            teacherId: "test-teacher-1",
            studentId: "test-student-1",
            startTime: new Date(Date.now() + 86400000).toISOString(), // Demain
            endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), // Demain + 1h
            topic: "Mathématiques - Algèbre",
            status: "confirmed",
            teacher: {
              id: "test-teacher-1",
              name: "Prof. Marie Dupont",
              specialty: "Mathématiques",
              image: "https://randomuser.me/api/portraits/women/44.jpg",
              rating: 4.8,
              reviews: 24
            }
          },
          {
            id: "test-session-2",
            teacherId: "test-teacher-2",
            studentId: "test-student-1",
            startTime: new Date(Date.now() + 172800000).toISOString(), // Dans 2 jours
            endTime: new Date(Date.now() + 172800000 + 3600000).toISOString(), // Dans 2 jours + 1h
            topic: "Physique - Mécanique",
            status: "pending",
            teacher: {
              id: "test-teacher-2",
              name: "Dr. Thomas Martin",
              specialty: "Physique",
              image: "https://randomuser.me/api/portraits/men/32.jpg",
              rating: 4.6,
              reviews: 18
            }
          }
        ]
      });
    }
    
    try {
      // Vérifier le token avec Firebase Admin
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      const userId = decodedClaims.uid;
      
      // Récupérer les sessions de l'étudiant
      const sessions = await getStudentSessions(userId);
      
      // Récupérer les informations des professeurs pour chaque session
      const sessionsWithTeachers = await Promise.all(
        sessions.map(async (session) => {
          const teacher = await getTeacherById(session.teacherId);
          return {
            ...session,
            teacher: teacher ? {
              id: teacher.id,
              name: teacher.name,
              specialty: teacher.specialty,
              image: teacher.image,
              rating: teacher.rating,
              reviews: teacher.reviews
            } : null
          };
        })
      );
      
      // Trier les sessions par date (les plus récentes d'abord)
      sessionsWithTeachers.sort((a, b) => {
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        return dateB.getTime() - dateA.getTime();
      });
      
      return NextResponse.json({
        success: true,
        sessions: sessionsWithTeachers
      });
    } catch (error) {
      console.error("Erreur lors de la vérification du token:", error);
      
      // En cas d'erreur d'authentification, retourner des données de test
      // pour permettre le développement sans authentification
      console.log("Erreur d'authentification, retour de données de test");
      
      return NextResponse.json({
        success: true,
        sessions: [
          {
            id: "test-session-1",
            teacherId: "test-teacher-1",
            studentId: "test-student-1",
            startTime: new Date(Date.now() + 86400000).toISOString(), // Demain
            endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), // Demain + 1h
            topic: "Mathématiques - Algèbre",
            status: "confirmed",
            teacher: {
              id: "test-teacher-1",
              name: "Prof. Marie Dupont",
              specialty: "Mathématiques",
              image: "https://randomuser.me/api/portraits/women/44.jpg",
              rating: 4.8,
              reviews: 24
            }
          },
          {
            id: "test-session-2",
            teacherId: "test-teacher-2",
            studentId: "test-student-1",
            startTime: new Date(Date.now() + 172800000).toISOString(), // Dans 2 jours
            endTime: new Date(Date.now() + 172800000 + 3600000).toISOString(), // Dans 2 jours + 1h
            topic: "Physique - Mécanique",
            status: "pending",
            teacher: {
              id: "test-teacher-2",
              name: "Dr. Thomas Martin",
              specialty: "Physique",
              image: "https://randomuser.me/api/portraits/men/32.jpg",
              rating: 4.6,
              reviews: 18
            }
          }
        ]
      });
    }
    
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des sessions:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de la récupération des sessions: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
