from django.core.files.storage import Storage
from cloudinary_storage.storage import MediaCloudinaryStorage


class SmartCloudinaryStorage(Storage):
    """
    Utilise MediaCloudinaryStorage pour TOUS les fichiers (images ET PDFs).
    Cloudinary peut gérer les PDFs via /image/ et les convertir automatiquement.
    """
    
    def __init__(self):
        self.storage = MediaCloudinaryStorage()
    
    def _save(self, name, content):
        return self.storage._save(name, content)
    
    def _open(self, name, mode='rb'):
        return self.storage._open(name, mode)
    
    def url(self, name):
        # Pour les PDFs, on ajoute .jpg à la fin de l'URL pour forcer la conversion
        url = self.storage.url(name)
        
        # Si c'est un PDF, on peut le convertir en image pour l'aperçu
        if name.lower().endswith('.pdf'):
            # Cloudinary peut convertir la première page du PDF en image
            # Remplacer .pdf par .jpg dans l'URL
            url = url.replace('.pdf', '.jpg')
            print(f"📄 PDF converti en image pour aperçu: {url}")
        
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