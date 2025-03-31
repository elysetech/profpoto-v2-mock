# ProfPoto

ProfPoto est une plateforme éducative complète qui aide les étudiants à améliorer leurs compétences académiques grâce à l'IA et à des sessions avec des professeurs qualifiés.

## Fonctionnalités Principales

### 🤖 Assistance IA
- **Correction de documents**: Soumettez vos devoirs pour une correction détaillée par IA
- **Explication d'exercices**: Obtenez des explications claires sur des problèmes complexes
- **Génération de quiz**: Testez vos connaissances avec des quiz générés par IA
- **Exercices similaires**: Pratiquez avec des exercices supplémentaires similaires
- **Résumés**: Obtenez des résumés concis de documents longs
- **Chat IA**: Posez des questions et recevez des réponses instantanées

### 👨‍🏫 Sessions avec des Professeurs
- **Réservation de sessions**: Planifiez des sessions individuelles avec des professeurs
- **Sessions pour collégiens et lycéens**: Adaptées à différents niveaux d'éducation
- **Tableau de bord des sessions**: Gérez vos sessions réservées

### 📄 Gestion de Documents
- **Téléchargement de documents**: Importez vos documents pour analyse
- **OCR (Reconnaissance Optique de Caractères)**: Extraction de texte à partir d'images
- **Visualisation de documents**: Interface conviviale pour consulter vos documents
- **Explications de documents**: Obtenez des explications détaillées sur vos documents

### 💰 Abonnements et Paiements
- **Plans d'abonnement**: Gratuit, Standard et Premium avec différentes fonctionnalités
- **Paiements sécurisés**: Intégration avec Stripe pour des paiements sécurisés
- **Achats de sessions individuelles**: Option d'achat de sessions individuelles

### 👤 Gestion des Utilisateurs
- **Authentification**: Inscription et connexion (email/mot de passe, Google)
- **Vérification KYC**: Processus de vérification d'identité pour les utilisateurs
- **Tableau de bord utilisateur**: Interface personnalisée pour gérer votre compte
- **Candidature pour devenir professeur**: Processus pour rejoindre l'équipe enseignante

## Architecture du Projet

```
profpoto/
├── public/                      # Fichiers statiques
├── src/
│   ├── app/                     # Routes et pages Next.js
│   │   ├── about/               # Page À propos
│   │   ├── api/                 # Routes API
│   │   │   ├── ai/              # Endpoints IA (correction, quiz, etc.)
│   │   │   └── checkout/        # Endpoints de paiement
│   │   ├── apply-teacher/       # Page de candidature pour devenir professeur
│   │   ├── chat/                # Interface de chat
│   │   ├── dashboard/           # Tableau de bord utilisateur
│   │   ├── document/            # Visualisation et gestion de documents
│   │   ├── kyc/                 # Vérification KYC
│   │   ├── login/               # Page de connexion
│   │   ├── pricing/             # Plans et tarifs
│   │   ├── register/            # Page d'inscription
│   │   ├── sessions/            # Gestion des sessions avec professeurs
│   │   └── upload/              # Téléchargement de documents
│   ├── components/              # Composants React réutilisables
│   │   ├── about/               # Composants de la page À propos
│   │   ├── chatbot/             # Composants du chatbot
│   │   ├── document/            # Composants de gestion de documents
│   │   ├── kyc/                 # Composants de vérification KYC
│   │   ├── layout/              # Composants de mise en page (header, footer, etc.)
│   │   ├── pricing/             # Composants de tarification
│   │   ├── theme/               # Gestion du thème (clair/sombre)
│   │   └── ui/                  # Composants UI génériques
│   └── lib/                     # Bibliothèques et utilitaires
│       ├── auth.ts              # Authentification
│       ├── firebase.ts          # Configuration Firebase
│       ├── ocr.ts               # Fonctionnalités OCR
│       ├── slack.ts             # Notifications Slack
│       ├── stripe.ts            # Intégration Stripe
│       └── utils.ts             # Fonctions utilitaires
├── .gitignore                   # Fichiers ignorés par Git
├── eslint.config.mjs            # Configuration ESLint
├── next.config.ts               # Configuration Next.js
├── package.json                 # Dépendances et scripts
├── postcss.config.mjs           # Configuration PostCSS
├── tailwind.config.js           # Configuration Tailwind CSS
└── tsconfig.json                # Configuration TypeScript
```

## Technologies Utilisées

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: Firebase Firestore
- **Authentification**: Firebase Auth, NextAuth.js
- **Stockage**: Firebase Storage
- **IA**: OpenAI API
- **Paiements**: Stripe
- **Déploiement**: Vercel

## Branches

Ce dépôt utilise plusieurs branches pour la gestion des versions:
- `main`: Branche principale contenant la version stable
- `dev`: Branche de développement pour le travail en cours
- `feature/*`: Branches pour des fonctionnalités spécifiques
- `release/*`: Branches pour des versions spécifiques

## Mise en Route

Pour exécuter le serveur de développement:

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur pour voir le résultat.

## Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes:

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID=
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=
NEXT_PUBLIC_STRIPE_COLLEGE_SESSION_PRICE_ID=
NEXT_PUBLIC_STRIPE_HIGHSCHOOL_SESSION_PRICE_ID=

# OpenAI
OPENAI_API_KEY=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Slack
SLACK_WEBHOOK_URL=
```

## Licence

Tous droits réservés © ProfPoto 2025
