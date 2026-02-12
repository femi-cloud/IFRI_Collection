#!/bin/bash
# Script de build pour Render

set -e  # Arrêter si une commande échoue

echo "🔧 Installation des dépendances..."
pip install -r requirements.txt

echo "✅ Build terminé avec succès!"