import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface DocumentPreviewProps {
  fileUrl: string;
  fileName: string;
}

export const DocumentPreview = ({ fileUrl, fileName }: DocumentPreviewProps) => {
  const isPDF = fileName.toLowerCase().endsWith('.pdf');
  
  // Pour les PDFs sur Cloudinary, forcer l'affichage de la première page en JPG
  let displayUrl = fileUrl;
  if (isPDF && fileUrl.includes('cloudinary.com')) {
    // Ajouter .jpg à la fin pour convertir automatiquement
    displayUrl = `${fileUrl}.jpg`;
  }
  
  console.log("🔍 DocumentPreview:", { fileName, fileUrl, displayUrl, isPDF });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          Aperçu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogTitle className="sr-only">{fileName}</DialogTitle>
        <div className="w-full h-[80vh]">
          <div className="mb-2 p-2 bg-blue-100 rounded text-xs">
            <p><strong>Debug:</strong></p>
            <p>File: {fileName}</p>
            <p>URL: {displayUrl}</p>
          </div>

          {isPDF ? (
            // Afficher comme une image (première page du PDF)
            <img
              src={displayUrl}
              alt={fileName}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                console.error("❌ Erreur chargement:", displayUrl);
              }}
            />
          ) : (
            <img
              src={displayUrl}
              alt={fileName}
              className="w-full h-full object-contain rounded-lg"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};