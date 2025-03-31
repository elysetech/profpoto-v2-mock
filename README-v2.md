# Profpoto v2

Version 2 du projet Profpoto avec système de mock pour le calendrier.

## Fonctionnalités ajoutées

1. Système de mock pour le calendrier :
   - Développement de `mock-calendar.ts` qui génère des créneaux disponibles fictifs
   - Remplacement des appels à l'API Google Calendar par des appels à notre système de mock

2. Correction de l'API de liste des sessions :
   - Modification de `src/app/api/sessions/list/route.ts` pour retourner des données de test même lorsque l'utilisateur n'est pas authentifié
   - Cela permet de développer et tester l'application sans avoir besoin d'être connecté

3. Mise à jour des routes d'API pour utiliser le système de mock :
   - Adaptation de `src/app/api/calendar/availability/route.ts` pour utiliser les créneaux générés par le mock
   - Mise à jour de `src/lib/teacher-service.ts` pour utiliser le système de mock

## Utilisation

L'application fonctionne maintenant correctement et affiche des sessions fictives, ce qui permet de tester toutes les fonctionnalités sans avoir besoin d'une connexion réelle à Google Calendar ou d'une authentification Firebase.

## Développement futur

Pour continuer à développer l'application :
1. Ajouter plus de données de test pour simuler différents scénarios
2. Implémenter l'authentification complète lorsque vous serez prêt à passer en production
3. Remplacer les mocks par de vraies intégrations avec Google Calendar quand nécessaire

## Dépôt GitHub

Le code de cette version est disponible sur GitHub : https://github.com/elysetech/profpoto-v2
