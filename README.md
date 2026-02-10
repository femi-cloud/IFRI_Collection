# IFRI Collection - Backend

Backend API pour IFRI Collection.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Dépendances](#dépendances)

---

## 🎯 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Python 3.8+**
- **MySQL 8.0+**
- **pip** (gestionnaire de packages Python)

### Vérification des installations

```bash
python --version    # Doit afficher Python 3.8 ou supérieur
mysql --version     # Doit afficher MySQL 8.0 ou supérieur
pip --version       # Doit afficher pip

### Installation

# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate

# Configuration de la base de données
DB_NAME=ifri_collection
DB_USER=root
DB_PASSWORD=beat
DB_HOST=localhost
DB_PORT=3306

# Clé secrète Django
SECRET_KEY=django-insecure-changez-moi-en-production-123456789abcdef
# Mode debug
DEBUG=True

# Origines autorisées
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080

# Dépendances

Pour installer toutes les dépendances
pip install Django==6.0.2 djangorestframework==3.14.0 djangorestframework-simplejwt==5.3.1 python-dotenv==1.0.0 django-cors-headers==4.3.1 

# Lancement
# Lancer le serveur
python manage.py runserver localhost:8000