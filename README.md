# MDD - Monde de Dév

Application full-stack de réseau social pour développeurs permettant de s'abonner à des thèmes techniques, publier des articles et échanger via des commentaires.

## Vue d'ensemble

**MDD (Monde de Dév)** est une plateforme collaborative destinée aux développeurs pour :
- S'abonner à des thèmes techniques variés (Front, Back, Data, etc.)
- Publier des articles
- Commenter
- Suivre un fil d'actualité personnalisé basé sur leurs abonnements

## Architecture

### Stack technique
- **Frontend** : Angular 14 + TypeScript + Angular Material
- **Backend** : Spring Boot 2.7.3 + Spring Security + JWT
- **Base de données** : MySQL
- **Build tools** : Maven (backend), Angular CLI (frontend)

### Architecture applicative
```
┌───────────────────┐   HTTP/REST   ┌─────────────────── ┐   JPA/Hibernate   ┌───────────────────┐
│    Angular SPA    │◄─────────────►│   Spring Boot      │◄─────────────────►│       MySQL       │
│                   │      JWT      │       API          │                   │                   │
│ - Angular 14      │               │ - Spring 2.7.3     │                   │ - Relationnel     │
│ - TypeScript      │               │ - Spring Security  │                   │ - ACID            │
│ - Angular Material│               │ - Spring Data JPA  │                   │ - Transactions    │
│ - RxJS            │               │ - JWT Auth         │                   │                   │
└───────────────────┘               └─────────────────── ┘                   └───────────────────┘
```

## Installation et lancement

### Prérequis
- **Java 11+** (pour le backend)
- **Node.js 16+** et **npm** (pour le frontend)
- **MySQL 8.0+** (base de données)
- **Maven 3.6+** (pour le build backend)

### Configuration de la base de données

1. Créer une base de données MySQL :
```sql
CREATE DATABASE mdd_db;
CREATE USER 'mdd_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON mdd_db.* TO 'mdd_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Les informations de connexion seront configurées via les variables d'environnement (voir section Backend ci-dessous).

### Backend (Spring Boot)

#### Configuration des variables d'environnement

Pour des raisons de sécurité, les informations sensibles sont stockées dans des variables d'environnement.

1. **Première installation** - Copier le fichier d'exemple :
```bash
cd back
cp .env.example .env
```

2. **Configurer les variables** - Éditer le fichier `.env` avec vos valeurs :
```bash
# Configuration de la base de données
DATABASE_URL=jdbc:mysql://localhost:3306/mdd_db?useSSL=false&serverTimezone=UTC
DATABASE_USERNAME=mdd_user
DATABASE_PASSWORD=password

# Configuration JWT
JWT_SECRET=votre_clé_secrète_jwt_très_longue_et_sécurisée
```

#### Démarrage de l'application

**Option 1 : Avec le script (recommandé)**
```bash
./start-dev.sh
```

**Option 2 : Manuellement**
```bash
# Exporter les variables d'environnement
export $(cat .env | grep -v '^#' | xargs)

# Démarrer l'application
./mvnw spring-boot:run
```

**Option 3 : Avec votre IDE**
Configurez votre IDE pour utiliser les variables d'environnement du fichier `.env`.

L'API sera disponible sur **http://localhost:8080**

#### Endpoints principaux
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/themes` - Liste des thèmes
- `GET /api/posts` - Articles du fil d'actualité
- `POST /api/posts` - Créer un article

### Frontend (Angular)

```bash
# Aller dans le dossier frontend
cd front

# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve
# ou
npm start
```

L'application sera disponible sur **http://localhost:4200**

## Structure du projet

```
├── back/                          # Backend Spring Boot
│   ├── src/main/java/com/openclassrooms/mddapi/
│   │   ├── controllers/           # Contrôleurs REST
│   │   ├── models/               # Entités JPA
│   │   ├── repositories/         # Repositories Spring Data
│   │   ├── services/             # Services métier
│   │   ├── security/             # Configuration sécurité
│   │   └── dto/                  # Data Transfer Objects
│   └── pom.xml                   # Configuration Maven
│
├── front/                         # Frontend Angular
│   ├── src/app/
│   │   ├── features/             # Modules fonctionnels
│   │   │   ├── auth/            # Authentification
│   │   │   ├── posts/           # Gestion des articles
│   │   │   ├── themes/          # Gestion des thèmes
│   │   │   └── profile/         # Profil utilisateur
│   │   ├── services/            # Services Angular
│   │   ├── guards/              # Guards de navigation
│   │   ├── interceptors/        # Intercepteurs HTTP
│   │   └── models/              # Modèles TypeScript
│   └── package.json             # Configuration npm
│
└── spécifications/               # Documentation projet
    ├── Contraintes+techniques.pdf
    ├── Spécifications+fonctionnelles.pdf
    └── Template-–-Justification-des-choix-techniques.pdf
```

## Sécurité

- **Authentification JWT** : Tokens sécurisés pour l'authentification stateless
- **Spring Security** : Protection des endpoints et gestion des autorisations
- **BCrypt** : Hachage sécurisé des mots de passe
- **Route Guards** : Protection des routes frontend
- **HTTP Interceptors** : Injection automatique des tokens d'authentification

## Fonctionnalités principales

### Authentification
- Inscription avec email/mot de passe
- Connexion sécurisée
- Persistance de session avec JWT
- Déconnexion

### Gestion des thèmes
- Consultation de la liste des thèmes disponibles
- Abonnement/désabonnement aux thèmes
- Gestion des abonnements depuis le profil

### Articles et commentaires
- Création d'articles sur un thème choisi
- Consultation du détail d'un article
- Ajout de commentaires
- Fil d'actualité personnalisé (articles des thèmes suivis)
- Tri chronologique des articles

### Profil utilisateur
- Consultation et modification des informations personnelles
- Gestion de la liste des abonnements
- Déconnexion

## Scripts disponibles

### Backend
```bash
cd back
./start-dev.sh           # Lancement avec script (recommandé)
./mvnw clean install     # Build du projet
./mvnw test             # Exécution des tests (pas de tests actuellement)
```

### Frontend
```bash
npm start              # Serveur de développement
npm run build          # Build de production
npm test              # Tests unitaires
npm run watch          # Build en mode watch
```

## URLs de l'application

- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:8080

## Technologies et librairies

### Backend
- **Spring Boot 2.7.3** - Framework principal
- **Spring Security** - Sécurisation
- **Spring Data JPA** - Couche de persistance
- **JWT (jjwt 0.9.1)** - Authentification
- **MySQL Connector** - Driver base de données
- **Maven** - Gestionnaire de dépendances

### Frontend
- **Angular 14.1.0** - Framework frontend
- **Angular Material 14.2.5** - Composants UI
- **RxJS 7.5.0** - Programmation réactive
- **TypeScript 4.7.2** - Langage de développement
- **Angular CLI 14.1.3** - Outils de développement

### Patterns et bonnes pratiques implémentés
- **Architecture en couches** (backend)
- **Component-Service Pattern** (frontend)
- **Repository Pattern** (accès aux données)
- **DTO Pattern** (transfert de données)
- **Dependency Injection** (IoC)
- **Route Guards & HTTP Interceptors** (sécurité frontend)
