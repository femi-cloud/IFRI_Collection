from django.core.files.storage import Storage
from cloudinary_storage.storage import MediaCloudinaryStorage


class SmartCloudinaryStorage(Storage):
    """
    Utilise MediaCloudinaryStorage pour TOUS les fichiers.
    """
    
    def __init__(self):
        self.storage = MediaCloudinaryStorage()
    
    def _save(self, name, content):
        return self.storage._save(name, content)
    
    def _open(self, name, mode='rb'):
        return self.storage._open(name, mode)
    
    def url(self, name):
        # Retourner l'URL telle quelle de Cloudinary
        url = self.storage.url(name)
        print(f"🔗 URL générée par Cloudinary: {url}")
        return url
    
    def exists(self, name):
        return self.storage.exists(name)
    
    def delete(self, name):
        return self.storage.delete(name)
    
    def size(self, name):
        return self.storage.size(name)
    
    def get_valid_name(self, name):
        return self.storage.get_valid_name(name)
    
    def get_available_name(self, name, max_length=None):
        return self.storage.get_available_name(name, max_length)