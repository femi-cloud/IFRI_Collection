from django.core.files.storage import Storage
from cloudinary_storage.storage import MediaCloudinaryStorage, RawMediaCloudinaryStorage


class SmartCloudinaryStorage(Storage):
    """
    Stockage intelligent qui choisit automatiquement :
    - RawMediaCloudinaryStorage pour les fichiers (PDF, DOC, etc.)
    - MediaCloudinaryStorage pour les images (PNG, JPG, etc.)
    """
    
    def __init__(self):
        self.raw_storage = RawMediaCloudinaryStorage()
        self.media_storage = MediaCloudinaryStorage()
    
    def _get_storage(self, name):
        """Retourne le bon storage selon l'extension du fichier"""
        extension = name.lower().split('.')[-1] if '.' in name else ''
        image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
        
        if extension in image_extensions:
            print(f"📸 Image détectée ({extension}) - MediaCloudinaryStorage")
            return self.media_storage
        else:
            print(f"📄 Document détecté ({extension}) - RawMediaCloudinaryStorage")
            return self.raw_storage
    
    def _save(self, name, content):
        storage = self._get_storage(name)
        return storage._save(name, content)
    
    def _open(self, name, mode='rb'):
        storage = self._get_storage(name)
        return storage._open(name, mode)
    
    def url(self, name):
        storage = self._get_storage(name)
        return storage.url(name)
    
    def exists(self, name):
        storage = self._get_storage(name)
        return storage.exists(name)
    
    def delete(self, name):
        storage = self._get_storage(name)
        return storage.delete(name)
    
    def size(self, name):
        storage = self._get_storage(name)
        return storage.size(name)
    
    def get_valid_name(self, name):
        storage = self._get_storage(name)
        return storage.get_valid_name(name)
    
    def get_available_name(self, name, max_length=None):
        storage = self._get_storage(name)
        return storage.get_available_name(name, max_length)