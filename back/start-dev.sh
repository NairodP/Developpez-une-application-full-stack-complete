#!/bin/bash

# Script pour charger les variables d'environnement et démarrer l'application Spring Boot
# Usage: ./start-dev.sh

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo "❌ Fichier .env non trouvé !"
    echo "📝 Copiez .env.example vers .env et remplissez avec vos valeurs :"
    echo "   cp .env.example .env"
    exit 1
fi

echo "🔧 Chargement des variables d'environnement depuis .env..."

# Charger les variables d'environnement
export $(cat .env | grep -v '^#' | xargs)

echo "✅ Variables d'environnement chargées"
echo "🚀 Démarrage de l'application Spring Boot..."

# Démarrer l'application
./mvnw spring-boot:run
