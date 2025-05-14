Application de Rencontre avec NestJS

📝 Description
Cette application est une plateforme de rencontre moderne développée avec NestJS, un framework Node.js progressif pour construire des applications côté serveur efficaces et évolutives. L'application permet aux utilisateurs de créer des profils, de découvrir d'autres personnes, de matcher et de communiquer.

✨ Fonctionnalités principales

✅ Authentification sécurisée (JWT)
🔍 Recherche et filtres avancés
💌 Messagerie en temps réel
❤️ Système de matching
📱 Interface responsive
🛡️ Modération des contenus
📊 Tableau de bord administrateur

🛠️ Technologies utilisées
Backend: NestJS
Authentification: JWT, OAuth2
Tests: Jest

🚀 Installation
Prérequis
Node.js (v16 ou supérieur)
npm ou yarn
Base de données installée (MySQL recommandé)


Étapes d'installation

1- Cloner le dépôt:  git clone https://github.com/TCHUINDJANG/LoveChat.git
2- Installer les dépendances:  npm install ou yarn install
3- Configurer les variables d'environnement: dans le fichier .env
4- Lancer l'application: 
# Développement
npm run start:dev
# Production
npm run build
npm run start:prod

🧪 Exécution des tests
# Tests unitaires
npm run test
# Tests e2e
npm run test:e2e
# Couverture de test
npm run test:cov


🏗️ Structure du projet:
src/
├── auth/               # Authentification
├── users/              # Gestion des utilisateurs
├── profiles/           # Profils utilisateurs
├── matches/            # Système de matching
├── messages/           # Messagerie
├── notifications/      # Notifications
├── admin/              # Administration
├── common/             # Utilitaires communs
├── config/             # Configuration
├── uploads/            # Gestion des uploads
├── main.ts             # Point d'entrée
└── app.module.ts       # Module racine


📡 API Endpoints
L'API est documentée avec Swagger. Après avoir lancé l'application, accédez à: http://localhost:3000/api

🐳 Docker
Pour lancer l'application avec Docker: docker-compose up --build

🌐 Déploiement : VPS


🤝 Contribution
1-Forkez le projet
2-Créez votre branche :(git checkout -b feature/AmazingFeature)
3-Committez vos changements : (git commit -m 'Add some AmazingFeature')
4-Pushez vers la branche (git push origin feature/AmazingFeature)
5-Ouvrez une Pull Request

📄 Licence
Distribué sous la licence MIT. Voir LICENSE pour plus d'informations.

📧 Contact
Developpeur :  TCHUINDJANG TANKEU DAVID
Lien du projet:  https://github.com/TCHUINDJANG/LoveChat
