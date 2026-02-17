import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DocumentPreview } from "@/components/DocumentPreview";
import { getDocuments, Document, downloadDocument } from "@/lib/api";

const Library = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch ALL documents once
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoadingDocs(true);
      try {
        const response = await getDocuments();
        
        // ✅ Extraire les résultats paginés
      const documentsData = response.data.results;
      
      console.log('📚 Documents:', documentsData);
      setAllDocuments(documentsData);
      } catch (error) {
        console.error('Erreur lors du chargement des documents:', error);
        setAllDocuments([]);
      } finally {
        setLoadingDocs(false);
      }
    };

    if (user) {
      fetchDocuments();
    }
  }, [user]);

  // Filter documents for the selected semester and category
  const documents = allDocuments.filter(d => {
    const matchesSemester = d.semester === parseInt(selectedSemester);
    const matchesCategory = !selectedCategory || d.document_type === selectedCategory;
    return matchesSemester && matchesCategory;
  });

  // Count documents by semester and category
  const getDocumentsByCategory = (semester: number) => {
    const semesterDocs = allDocuments.filter(d => d.semester === semester);
    return {
      cours: semesterDocs.filter(d => d.document_type === 'cours').length,
      td: semesterDocs.filter(d => d.document_type === 'td').length,
      tp: semesterDocs.filter(d => d.document_type === 'tp').length,
      examen: semesterDocs.filter(d => d.document_type === 'examen').length,
      total: semesterDocs.length
    };
  };

  const semesters = [
    { id: "1", name: "Semestre 1", stats: getDocumentsByCategory(1) },
    { id: "2", name: "Semestre 2", stats: getDocumentsByCategory(2) },
    { id: "3", name: "Semestre 3", stats: getDocumentsByCategory(3) },
    { id: "4", name: "Semestre 4", stats: getDocumentsByCategory(4) },
    { id: "5", name: "Semestre 5", stats: getDocumentsByCategory(5) },
    { id: "6", name: "Semestre 6", stats: getDocumentsByCategory(6) },
  ];

  if (loading) {
    return null;
  }


  const handleDownload = async (doc: Document) => {
  try {
    const response = await downloadDocument(doc.id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('❌ Erreur téléchargement:', error);
  }
};

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Bibliothèque de Documents
          </h1>
          <p className="text-muted-foreground">
            Accédez à tous les examens et documents académiques organisés par semestre
          </p>
        </div>

        <Tabs value={selectedSemester} onValueChange={setSelectedSemester} className="w-full">
          <TabsList className="grid grid-cols-6 w-full mb-8">
            {semesters.map((sem) => (
              <HoverCard key={sem.id} openDelay={200}>
                <HoverCardTrigger asChild>
                  <TabsTrigger 
                    value={sem.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">S{sem.id}</span>
                      <Badge variant="secondary" className="text-xs">
                        {sem.stats.total}
                      </Badge>
                    </div>
                  </TabsTrigger>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 bg-background border-border z-50">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Catégories de documents</h4>
                    <div className="space-y-1 text-sm">
                      <button
                        onClick={() => setSelectedCategory(selectedCategory === 'cours' ? null : 'cours')}
                        className="w-full flex justify-between text-muted-foreground hover:text-foreground hover:bg-accent/50 p-2 rounded-md transition-colors cursor-pointer"
                      >
                        <span>Cours</span>
                        <Badge variant={selectedCategory === 'cours' ? "default" : "outline"} className="text-xs">{sem.stats.cours}</Badge>
                      </button>
                      <button
                        onClick={() => setSelectedCategory(selectedCategory === 'td' ? null : 'td')}
                        className="w-full flex justify-between text-muted-foreground hover:text-foreground hover:bg-accent/50 p-2 rounded-md transition-colors cursor-pointer"
                      >
                        <span>TD</span>
                        <Badge variant={selectedCategory === 'td' ? "default" : "outline"} className="text-xs">{sem.stats.td}</Badge>
                      </button>
                      <button
                        onClick={() => setSelectedCategory(selectedCategory === 'tp' ? null : 'tp')}
                        className="w-full flex justify-between text-muted-foreground hover:text-foreground hover:bg-accent/50 p-2 rounded-md transition-colors cursor-pointer"
                      >
                        <span>TP</span>
                        <Badge variant={selectedCategory === 'tp' ? "default" : "outline"} className="text-xs">{sem.stats.tp}</Badge>
                      </button>
                      <button
                        onClick={() => setSelectedCategory(selectedCategory === 'examen' ? null : 'examen')}
                        className="w-full flex justify-between text-muted-foreground hover:text-foreground hover:bg-accent/50 p-2 rounded-md transition-colors cursor-pointer"
                      >
                        <span>Examens</span>
                        <Badge variant={selectedCategory === 'examen' ? "default" : "outline"} className="text-xs">{sem.stats.examen}</Badge>
                      </button>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </TabsList>

          {semesters.map((sem) => (
            <TabsContent key={sem.id} value={sem.id} className="space-y-4">
              {loadingDocs ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chargement des documents...
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun document pour ce semestre
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {documents.map((doc) => (
                    <Card 
                      key={doc.id} 
                      className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <FileText className="h-8 w-8 text-primary mb-2" />
                          <Badge variant={doc.document_type === "examen" ? "default" : "secondary"}>
                            {doc.document_type.toUpperCase()}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <CardDescription>
                          {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                        </CardDescription>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground mt-2">{doc.description}</p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <DocumentPreview fileUrl={doc.file_url} fileName={doc.file_name} />
                        <a 
                          href={`${import.meta.env.VITE_API_URL}/documents/${doc.id}/download/`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          download={doc.file_name}
                        >
                          <Button 
                            onClick={() => handleDownload(doc)}
                            className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                          >
                            <Download className="h-4 w-4" />
                            Télécharger
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Library;