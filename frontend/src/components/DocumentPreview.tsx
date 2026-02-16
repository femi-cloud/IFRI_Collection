import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface DocumentPreviewProps {
  fileUrl: string;
  fileName: string;
}

export const DocumentPreview = ({ fileUrl, fileName }: DocumentPreviewProps) => {
  const isPDF = fileName.toLowerCase().endsWith('.pdf');
  const cleanUrl = fileUrl.replace('http://', 'https://').trim();

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
              src={cleanUrl}
              className="w-full h-full rounded-lg"
              title={fileName}
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