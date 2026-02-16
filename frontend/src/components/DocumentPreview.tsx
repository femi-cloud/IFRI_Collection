import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

interface DocumentPreviewProps {
  fileUrl: string;
  fileName: string;
}

export const DocumentPreview = ({ fileUrl, fileName }: DocumentPreviewProps) => {
  const isPDF = fileName.toLowerCase().endsWith('.pdf');
  
  // Pour les PDFs, utiliser l'URL directe (sans .jpg)
  // Pour forcer le téléchargement inline au lieu de download
  let pdfUrl = fileUrl;
  if (isPDF && fileUrl.includes('cloudinary.com')) {
    // Cloudinary: ajouter fl_attachment:inline pour forcer l'affichage
    pdfUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');
  }
  
  console.log("🔍 Preview:", { fileName, originalUrl: fileUrl, pdfUrl, isPDF });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          Aperçu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] w-[95vw]">
        <DialogTitle>{fileName}</DialogTitle>
        
        <div className="flex justify-end gap-2 mb-2">
          <a 
            href={fileUrl} 
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          </a>
        </div>

        <div className="w-full h-[75vh] border rounded-lg overflow-hidden">
          {isPDF ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title={fileName}
              allow="fullscreen"
            />
          ) : (
            <img
              src={fileUrl}
              alt={fileName}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};