from cloudinary_storage.storage import MediaCloudinaryStorage, RawMediaCloudinaryStorage

class SmartCloudinaryStorage:
    """
    Stockage intelligent qui choisit automatiquement :
    - RawMediaCloudinaryStorage pour les fichiers (PDF, DOC, etc.)
    - MediaCloudinaryStorage pour les images (PNG, JPG, etc.)
    """
    
    def __call__(self):
        # Cette méthode sera appelée pour chaque fichier uploadé
        return self
    
    def save(self, name, content, max_length=None):
        # Détecter le type de fichier par son extension
        extension = name.lower().split('.')[-1]
        
        # Liste des extensions d'images
        image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
        
        # Choisir le bon storage
        if extension in image_extensions:
            storage = MediaCloudinaryStorage()
            print(f"📸 Image détectée ({extension}) - Utilisation de MediaCloudinaryStorage")
        else:
            storage = RawMediaCloudinaryStorage()
            print(f"📄 Document détecté ({extension}) - Utilisation de RawMediaCloudinaryStorage")
        
        return storage.save(name, content, max_length)
    
    def url(self, name):
        # Pour récupérer l'URL, on doit deviner le type
        extension = name.lower().split('.')[-1]
        image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
        
        if extension in image_extensions:
            return MediaCloudinaryStorage().url(name)
        else:
            return RawMediaCloudinaryStorage().url(name)
    
    def exists(self, name):
        # Vérifier si le fichier existe
        try:
            return RawMediaCloudinaryStorage().exists(name)
        except:
            return MediaCloudinaryStorage().exists(name)
    
    def delete(self, name):
        # Supprimer le fichier
        extension = name.lower().split('.')[-1]
        image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
        
        if extension in image_extensions:
            return MediaCloudinaryStorage().delete(name)
        else:
            return RawMediaCloudinaryStorage().delete(name)