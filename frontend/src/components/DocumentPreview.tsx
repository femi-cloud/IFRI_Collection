import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface DocumentPreviewProps {
  fileUrl: string;
  fileName: string;
}

export const DocumentPreview = ({ fileUrl, fileName }: DocumentPreviewProps) => {
  const isPDF = fileName.toLowerCase().endsWith('.pdf');
  
  // Pour les PDFs Cloudinary : afficher la première page en image
  const displayUrl = isPDF && fileUrl.includes('cloudinary.com') 
    ? `${fileUrl}.jpg` 
    : fileUrl;

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
          {isPDF ? (
            <img
              src={displayUrl}
              alt={fileName}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <img
              src={fileUrl}
              alt={fileName}
              className="w-full h-full object-contain rounded-lg"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};