import { Navigation } from "@/components/Navigation";
import { Brain, Database, Workflow, Sparkles, FileJson, Terminal, Send, Save, Eye, Trash2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { analyzeQuestion, defaultIAConfig } from "@/services/iaClient";

const tools = [
  {
    icon: Brain,
    name: "NotebookLM",
    description: "Generación de ideas a partir del corpus de las 52 espinas narrativas.",
    status: "active",
  },
  {
    icon: FileJson,
    name: "Dataset",
    description: "Estructura JSON con títulos, temas, ángulos y conexiones Lagrange.",
    status: "active",
  },
  {
    icon: Sparkles,
    name: "Prompts",
    description: "Biblioteca de prompts para explorar nuevos ángulos narrativos.",
    status: "building",
  },
  {
    icon: Database,
    name: "Red Neuronal",
    description: "Modelo entrenado en el corpus para generar diálogos socráticos.",
    status: "planned",
  },
  {
    icon: Workflow,
    name: "Pipeline",
    description: "Automatización de publicación con metadata Lagrange.",
    status: "planned",
  },
  {
    icon: Terminal,
    name: "Scripts",
    description: "Herramientas de sincronización y etiquetado automático.",
    status: "building",
  },
];

const statusColors = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  building: "bg-primary/20 text-primary border-primary/30",
  planned: "bg-muted text-muted-foreground border-border",
};

const statusLabels = {
  active: "Activo",
  building: "En desarrollo",
  planned: "Planificado",
};

export default function Laboratorio() {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [savedDrafts, setSavedDrafts] = useState<Array<{id: string, prompt: string, result: string, timestamp: Date}>>(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem('laboratory-drafts');
      return stored ? JSON.parse(stored).map((draft: any) => ({
        ...draft,
        timestamp: new Date(draft.timestamp)
      })) : [];
    } catch {
      return [];
    }
  });

  // Persist drafts to localStorage
  useEffect(() => {
    localStorage.setItem('laboratory-drafts', JSON.stringify(savedDrafts));
  }, [savedDrafts]);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;

    setIsAnalyzing(true);

    const result = await pipe(
      analyzeQuestion(defaultIAConfig, prompt, "Análisis crítico en el contexto del Sistema Lagrange"),
      TE.fold(
        (error) => {
          console.error("Analysis failed:", error);
          setResult("Error en el análisis. Por favor, intenta de nuevo.");
          return TE.right(undefined);
        },
        (response) => {
          setResult(response.response);
          return TE.right(undefined);
        }
      )
    )();

    setIsAnalyzing(false);
  };

  const handleSaveDraft = () => {
    if (!result) return;
    
    const draft = {
      id: Date.now().toString(),
      prompt,
      result,
      timestamp: new Date()
    };
    
    setSavedDrafts(prev => [draft, ...prev]);
    setPrompt("");
    setResult(null);
  };

  const handleLoadDraft = (draft: {id: string, prompt: string, result: string, timestamp: Date}) => {
    setPrompt(draft.prompt);
    setResult(draft.result);
  };

  const handleDeleteDraft = (id: string) => {
    setSavedDrafts(prev => prev.filter(draft => draft.id !== id));
  };

  const structuredPrompts = [
    "¿Cómo se manifiesta el miedo en los sistemas de control contemporáneos?",
    "¿Qué contradicciones existen entre la libertad individual y la seguridad colectiva?",
    "¿Cómo transforma la tecnología la experiencia de la consciencia?",
    "¿Qué significa ser humano en un mundo de algoritmos?",
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Laboratorio
            </h1>
            <p className="text-lg text-muted-foreground">
              El taller donde se construye el Sistema Lagrange. Herramientas de IA, 
              datasets estructurados y pipelines de automatización para dar vida al universo narrativo.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs border ${statusColors[tool.status as keyof typeof statusColors]}`}
                  >
                    {statusLabels[tool.status as keyof typeof statusLabels]}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>

          {/* IA Analysis Section */}
          <section className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-semibold mb-4">
                Análisis Crítico con IA
              </h2>
              <p className="text-muted-foreground">
                Explora preguntas filosóficas a través del lente del Sistema Lagrange.
                Los resultados requieren revisión humana antes de cualquier publicación.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Input Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Prompt Estructurado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Ingresa tu pregunta filosófica o selecciona una sugerida..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Sugerencias:</p>
                    <div className="flex flex-wrap gap-2">
                      {structuredPrompts.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleAnalyze}
                    disabled={!prompt.trim() || isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>Analizando...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Analizar con IA
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Result Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileJson className="h-5 w-5" />
                    Resultado del Análisis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{result}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSaveDraft}
                          className="flex-1"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Borrador
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setResult(null)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Revisar
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground text-center">
                        ⚠️ Este resultado no se publica automáticamente. Requiere revisión humana.
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Ingresa un prompt y haz clic en "Analizar con IA" para ver el resultado.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Saved Drafts */}
            {savedDrafts.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Borradores Guardados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {savedDrafts.map((draft) => (
                      <div key={draft.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">
                            {draft.timestamp.toLocaleDateString()}
                          </Badge>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleLoadDraft(draft)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteDraft(draft.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm font-medium mb-1">{draft.prompt}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {draft.result}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Workflow Section */}
          <section className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-semibold mb-8">
              Flujo de Producción
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
              
            <div className="space-y-8">
                {[
                  {
                    step: 1,
                    title: "Prompt Estructurado",
                    description: "Usuario ingresa o selecciona una pregunta filosófica estructurada.",
                  },
                  {
                    step: 2,
                    title: "Análisis con LLM",
                    description: "IA procesa el prompt y genera análisis crítico basado en el corpus Lagrange.",
                  },
                  {
                    step: 3,
                    title: "Resultado en Texto",
                    description: "Se presenta el análisis generado como texto estructurado.",
                  },
                  {
                    step: 4,
                    title: "No Publicación Automática",
                    description: "Los resultados no se publican automáticamente para mantener calidad.",
                  },
                  {
                    step: 5,
                    title: "Revisión Humana",
                    description: "Editor humano revisa, edita y aprueba antes de cualquier publicación.",
                  },
                ].map((item) => (
                  <div key={item.step} className="relative pl-16">
                    <div className="absolute left-0 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
                      <span className="font-display text-lg font-bold text-primary">
                        {item.step}
                      </span>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-5">
                      <h3 className="font-display font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
