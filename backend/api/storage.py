from django.core.files.storage import Storage
from django.conf import settings
from supabase import create_client
from io import BytesIO

class SupabaseStorage(Storage):
    def __init__(self):
        self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        self.bucket = settings.SUPABASE_BUCKET
    
    def _save(self, name, content):
        """Upload file to Supabase"""
        file_bytes = content.read()
        
        # Upload to Supabase
        self.client.storage.from_(self.bucket).upload(
            path=name,
            file=file_bytes,
            file_options={"content-type": content.content_type if hasattr(content, 'content_type') else 'application/octet-stream'}
        )
        
        return name
    
    def exists(self, name):
        """Check if file exists"""
        try:
            self.client.storage.from_(self.bucket).get_public_url(name)
            return True
        except:
            return False
    
    def url(self, name):
        """Get public URL"""
        return f"{settings.SUPABASE_URL}/storage/v1/object/public/{self.bucket}/{name}"
    
    def delete(self, name):
        """Delete file"""
        self.client.storage.from_(self.bucket).remove([name])
    
    def size(self, name):
        """Get file size"""
        return 0  # Supabase doesn't provide this easily