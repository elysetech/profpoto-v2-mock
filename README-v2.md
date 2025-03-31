# ProfPoto v2

## Améliorations apportées dans cette version

### 1. Correction des erreurs de permissions Firebase

- Résolution de l'erreur "Missing or insufficient permissions" qui se produisait lorsque l'application tentait d'écrire dans Firestore sans authentification utilisateur
- Ajout de vérifications explicites de l'authentification utilisateur et de l'existence d'un ID de conversation avant toute opération d'écriture dans Firestore
- Les utilisateurs non connectés peuvent désormais utiliser le chat avec l'API OpenAI sans erreurs

### 2. Amélioration de la gestion des variables d'environnement

- Déplacement de l'ID de l'assistant OpenAI du code en dur vers une variable d'environnement
- Ajout de la variable `NEXT_PUBLIC_OPENAI_ASSISTANT_ID` dans le fichier `.env.local`
- Utilisation de cette variable dans le code avec une valeur par défaut en cas d'absence

### 3. Optimisation du code

- Remplacement des vérifications basées sur `testMode` par des vérifications explicites de `user && currentConversationId`
- Ajout de logs pour une meilleure traçabilité des opérations
- Amélioration de la gestion des erreurs

## Configuration requise

Pour que cette version fonctionne correctement, assurez-vous que les variables d'environnement suivantes sont définies dans votre fichier `.env.local` :

```
# OpenAI Configuration
OPENAI_API_KEY=votre_clé_api_openai
NEXT_PUBLIC_OPENAI_ASSISTANT_ID=votre_id_assistant_openai
```

## Utilisation

1. Clonez le dépôt
2. Installez les dépendances avec `npm install`
3. Configurez les variables d'environnement dans `.env.local`
4. Lancez l'application avec `npm run dev`
5. Accédez à l'application via `http://localhost:3000`
