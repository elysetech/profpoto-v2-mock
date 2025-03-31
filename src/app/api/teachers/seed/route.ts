import { NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Teacher } from '@/lib/teacher-service';

/**
 * Route API pour ajouter des professeurs de test à la base de données
 * POST /api/teachers/seed
 */
export async function POST() {
  try {
    // Données des professeurs de test
    const teachersData: Omit<Teacher, 'id'>[] = [
      {
        name: 'Marie Dupont',
        email: 'marie.dupont@example.com',
        specialty: 'Mathématiques - Collège',
        bio: 'Professeure certifiée avec 8 ans d\'expérience dans l\'enseignement des mathématiques au collège. Spécialisée dans les méthodes pédagogiques innovantes pour rendre les mathématiques accessibles à tous.',
        rating: 4.9,
        reviews: 124,
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        calendarId: 'c_18835b98a95d0faede6f64b2c5c67d9b2f5bd8d1d5d8c3d0dd8c9c8c5c8c8c8@group.calendar.google.com',
        workHours: {
          start: '09:00',
          end: '18:00'
        },
        languages: ['Français', 'Anglais'],
        hourlyRate: 35,
        available: true
      },
      {
        name: 'Thomas Martin',
        email: 'thomas.martin@example.com',
        specialty: 'Mathématiques - Lycée',
        bio: 'Agrégé de mathématiques avec 12 ans d\'expérience dans l\'enseignement au lycée. Spécialiste des mathématiques pour les filières scientifiques et la préparation aux concours.',
        rating: 4.8,
        reviews: 98,
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        calendarId: 'c_18835b98a95d0faede6f64b2c5c67d9b2f5bd8d1d5d8c3d0dd8c9c8c5c8c8c9@group.calendar.google.com',
        workHours: {
          start: '10:00',
          end: '19:00'
        },
        languages: ['Français'],
        hourlyRate: 45,
        available: true
      },
      {
        name: 'Sophie Bernard',
        email: 'sophie.bernard@example.com',
        specialty: 'Mathématiques - Prépa',
        bio: 'Docteure en mathématiques et enseignante en classes préparatoires depuis 10 ans. Spécialisée dans l\'algèbre et l\'analyse pour les concours des grandes écoles.',
        rating: 4.7,
        reviews: 87,
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        calendarId: 'c_18835b98a95d0faede6f64b2c5c67d9b2f5bd8d1d5d8c3d0dd8c9c8c5c8c8ca@group.calendar.google.com',
        workHours: {
          start: '08:00',
          end: '17:00'
        },
        languages: ['Français', 'Anglais', 'Allemand'],
        hourlyRate: 55,
        available: false
      },
      {
        name: 'Alexandre Petit',
        email: 'alexandre.petit@example.com',
        specialty: 'Mathématiques - Collège/Lycée',
        bio: 'Professeur certifié avec 5 ans d\'expérience. Approche pédagogique basée sur des exemples concrets et des applications pratiques des mathématiques.',
        rating: 4.6,
        reviews: 62,
        image: 'https://randomuser.me/api/portraits/men/67.jpg',
        calendarId: 'c_18835b98a95d0faede6f64b2c5c67d9b2f5bd8d1d5d8c3d0dd8c9c8c5c8c8cb@group.calendar.google.com',
        workHours: {
          start: '14:00',
          end: '20:00'
        },
        languages: ['Français', 'Espagnol'],
        hourlyRate: 40,
        available: true
      },
      {
        name: 'Nathalie Leroy',
        email: 'nathalie.leroy@example.com',
        specialty: 'Mathématiques - Primaire/Collège',
        bio: 'Professeure des écoles spécialisée dans l\'accompagnement des élèves en difficulté. Méthode basée sur la confiance et la progression par petites étapes.',
        rating: 4.9,
        reviews: 145,
        image: 'https://randomuser.me/api/portraits/women/22.jpg',
        calendarId: 'c_18835b98a95d0faede6f64b2c5c67d9b2f5bd8d1d5d8c3d0dd8c9c8c5c8c8cc@group.calendar.google.com',
        workHours: {
          start: '09:00',
          end: '17:00'
        },
        languages: ['Français'],
        hourlyRate: 30,
        available: true
      }
    ];
    
    // Ajouter les professeurs à Firestore
    const teachersRef = collection(db, 'teachers');
    const addedTeachers = [];
    
    for (const teacherData of teachersData) {
      const docRef = await addDoc(teachersRef, teacherData);
      addedTeachers.push({
        id: docRef.id,
        ...teacherData
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `${addedTeachers.length} professeurs ajoutés avec succès`,
      teachers: addedTeachers
    });
    
  } catch (error: unknown) {
    console.error("Erreur lors de l'ajout des professeurs:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de l'ajout des professeurs: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      },
      { status: 500 }
    );
  }
}
