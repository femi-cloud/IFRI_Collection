import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface DocumentPreviewProps {
  fileUrl: string;
  fileName: string;
}

export const DocumentPreview = ({ fileUrl, fileName }: DocumentPreviewProps) => {
  const isPDF = fileName.toLowerCase().endsWith('.pdf');
  
  // Construire l'URL complète
  let fullUrl = fileUrl;
  
  // Si l'URL est relative (/media/...), construire l'URL complète
  if (fileUrl.startsWith('/media/') || fileUrl.startsWith('media/')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const baseUrl = apiUrl.replace('/api', ''); // Enlever /api pour avoir juste le domaine
    fullUrl = `${baseUrl}${fileUrl.startsWith('/') ? fileUrl : '/' + fileUrl}`;
  }
  
  // Forcer HTTPS pour les URLs Cloudinary
  if (fullUrl.includes('cloudinary.com')) {
    fullUrl = fullUrl.replace('http://', 'https://');
  }

  console.log('🔍 DocumentPreview:', { original: fileUrl, full: fullUrl });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          Aperçu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <div className="w-full h-[80vh]">
          {isPDF ? (
            <iframe
              src={fullUrl}
              className="w-full h-full rounded-lg"
              title={fileName}
              onError={(e) => {
                console.error('❌ Erreur chargement PDF:', fullUrl);
              }}
            />
          ) : (
            <img
              src={fullUrl}
              alt={fileName}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                console.error('❌ Erreur chargement image:', fullUrl);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};