import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";

interface DocumentPreviewProps {
  fileUrl: string;
  fileName: string;
}

export const DocumentPreview = ({ fileUrl, fileName }: DocumentPreviewProps) => {
  const [error, setError] = useState<string | null>(null);
  const isPDF = fileName.toLowerCase().endsWith('.pdf');
  
  console.log("🔍 DocumentPreview DEBUG:");
  console.log("📁 fileName:", fileName);
  console.log("🔗 fileUrl (original):", fileUrl);
  console.log("📄 isPDF:", isPDF);

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
          {error && (
            <div className="text-red-500 p-4">
              <h3 className="font-bold">Erreur de chargement:</h3>
              <p>{error}</p>
              <p className="mt-2 text-sm">URL: {fileUrl}</p>
            </div>
          )}
          
          <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>File: {fileName}</p>
            <p>URL: {fileUrl}</p>
            <p>Type: {isPDF ? 'PDF' : 'Image'}</p>
          </div>

          {isPDF ? (
            <iframe
              src={fileUrl}
              className="w-full h-full rounded-lg border-2 border-blue-500"
              title={fileName}
              onLoad={() => {
                console.log("✅ PDF chargé avec succès");
                setError(null);
              }}
              onError={(e) => {
                console.error("❌ Erreur chargement PDF:", fileUrl);
                setError(`Impossible de charger le PDF: ${fileUrl}`);
              }}
            />
          ) : (
            <img
              src={fileUrl}
              alt={fileName}
              className="w-full h-full object-contain rounded-lg"
              onLoad={() => {
                console.log("✅ Image chargée avec succès");
                setError(null);
              }}
              onError={(e) => {
                console.error("❌ Erreur chargement image:", fileUrl);
                setError(`Impossible de charger l'image: ${fileUrl}`);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};