# IFRI Collection - Backend

Backend API pour IFRI Collection, une plateforme de partage de documents académiques et d'emplois du temps.

---

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration de la base de données](#configuration-de-la-base-de-données)
- [Lancement](#lancement)
- [Comptes utilisateurs](#comptes-utilisateurs)
- [Dépannage](#dépannage)

---

## 🎯 Prérequis

- **Python 3.8+**
- **MySQL 8.0+**
- **pip** (gestionnaire de packages Python)

### Vérification

```bash
python --version    # Python 3.8+
mysql --version     # MySQL 8.0+
pip --version       # pip

### Installation
#1. Cloner le repository

git clone https://github.com/votre-repo/ifri-collection.git
cd ifri-collection/backend

#2. Créer un environnement virtuel 
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate

# Base de données
#1. Installer MySQL
Télécharger MySQL Installer depuis mysql.com -> windows
brew install mysql ou télécharger depuis mysql.com -> Mac
sudo apt install mysql-server -> Linux (Ubuntu/Debian)
sudo dnf install mysql-server -> Linux (Fedora/RHEL)

# 2. Configurer MySQL (premier démarrage)
## Windows (via MySQL Installer)
Lancez MySQL Installer
Choisissez "Developer Default" ou "Server only"
Définissez un mot de passe pour root (ex: votre_mot_de_passe)
Terminez l'installation'

# Mac/Linux (terminal)
# Démarrer MySQL
sudo systemctl start mysql      # Linux
# ou
brew services start mysql       # Mac

# Sécuriser l'installation (définir mot de passe root)
sudo mysql_secure_installation

# Suivez les instructions :
# - Définir le mot de passe root
# - Supprimer les utilisateurs anonymes
# - Désactiver l'accès root à distance
# - Supprimer la base de test

3. Vérifier l'installation'
# Vérifier que MySQL est démarré
mysql --version

# Se connecter à MySQL
mysql -u root -p
# Entrez votre mot de passe quand demandé

# Si la connexion réussit, vous verrez :
mysql>

#1. Créer la base de données MySQL

Ouvrez MySQL (via Workbench, terminal, ou ligne de commande) et exécutez :

CREATE DATABASE ifri_collection CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Configuration de la base de données
DB_NAME=ifri_collection
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=3306

# Clé secrète Django
SECRET_KEY=django-insecure-changez-moi-en-production-123456789abcdef
# Mode debug
DEBUG=True

# Origines autorisées
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080

# 🔑 IMPORTANT 
Remplacez votre_mot_de_passe_mysql_ici par VOTRE mot de passe MySQL root.

# 3. Appliquer les migrations
Les migrations vont créer toutes les tables dans votre base de données :

python manage.py migrate

# 4. Créer un superutilisateur (admin)
python manage.py createsuperuser

# Suivez les instructions :
Email : admin@ifri.edu
Username : admin
Password : (votre choix)

# 5. Créer un utilisateur de test (optionnel)

python manage.py shell

# Puis dans le shell Python :

from api.models import User
# Créer un utilisateur de test
user = User.objects.create_user(
    email='lala@gmail.com',
    username='Nara',
    password='newuser2',
    first_name='Nara',
    last_name='Host'
)
print(f"✅ Utilisateur créé : {user.username}")
exit()

### ▶️ Lancement
# Commandes minimales

# 1. Activer l'environnement virtuel
venv\Scripts\activate        # Windows
# ou
source venv/bin/activate      # Linux/Mac

# 2. Installer les dépendances (si pas encore fait)
pip install -r requirements.txt

# 3. Créer la base de données MySQL (via Workbench ou terminal)
CREATE DATABASE ifri_collection CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 4. Appliquer les migrations (CRÉE les tables)
python manage.py migrate

# 5. Créer un superutilisateur
python manage.py createsuperuser

# 6. Lancer le serveur
python manage.py runserver localhost:8000

### 📦 Dépendances

Fichier requirements.txt

Django==6.0.2
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
mysqlclient==2.2.0
python-dotenv==1.0.0
django-cors-headers==4.3.1
Pillow==10.1.0

# Installation
pip install -r requirements.txt

### Lancer le serveur
python manage.py runserver localhost:8000