# MDD API - Backend

## Configuration des variables d'environnement

Pour des raisons de sécurité, les informations sensibles (mots de passe, clés secrètes) sont stockées dans des variables d'environnement.

### Première installation

1. Copiez le fichier d'exemple :
```bash
cp .env.example .env
```

2. Éditez le fichier `.env` avec vos vraies valeurs :
```bash
# Configuration de la base de données
DATABASE_URL=jdbc:mysql://localhost:3306/dev_social_network?useSSL=false&serverTimezone=UTC
DATABASE_USERNAME=root
DATABASE_PASSWORD=votre_mot_de_passe_mysql

# Configuration JWT
JWT_SECRET=votre_clé_secrète_jwt_très_longue_et_sécurisée
```

### Démarrage de l'application

#### Option 1 : Avec le script (recommandé)
```bash
./start-dev.sh
```

#### Option 2 : Manuellement
```bash
# Exporter les variables d'environnement
export $(cat .env | grep -v '^#' | xargs)

# Démarrer l'application
./mvnw spring-boot:run
```

#### Option 3 : Avec votre IDE
Configurez votre IDE pour utiliser les variables d'environnement du fichier `.env`.

## Sécurité

- ✅ Le fichier `.env` est ignoré par Git
- ✅ Le fichier `.env.example` est committé pour documenter les variables nécessaires
- ✅ Les valeurs par défaut sont définies dans `application.properties` avec la syntaxe `${VARIABLE:valeur_par_defaut}`

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion à la base de données | `jdbc:mysql://localhost:3306/dev_social_network?useSSL=false&serverTimezone=UTC` |
| `DATABASE_USERNAME` | Nom d'utilisateur de la base de données | `root` |
| `DATABASE_PASSWORD` | Mot de passe de la base de données | `votre_mot_de_passe` |
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT | `une_cle_tres_longue_et_securisee` |
