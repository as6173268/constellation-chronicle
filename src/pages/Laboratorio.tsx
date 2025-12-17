import { Navigation } from "@/components/Navigation";
import { Brain, Database, Workflow, Sparkles, FileJson, Terminal } from "lucide-react";

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
                    title: "Generación de Ideas",
                    description: "NotebookLM procesa el corpus de las 52 espinas y genera nuevas perspectivas.",
                  },
                  {
                    step: 2,
                    title: "Estructuración",
                    description: "Script Python transforma las ideas en estructura JSON con título, tema y ángulo.",
                  },
                  {
                    step: 3,
                    title: "Etiquetado Lagrange",
                    description: "Asignación automática de conceptos, ángulos, tono y contradicciones.",
                  },
                  {
                    step: 4,
                    title: "Publicación",
                    description: "Cada episodio se publica con su metadata completa en el sistema.",
                  },
                  {
                    step: 5,
                    title: "Visualización",
                    description: "El Mapa Lagrange se actualiza mostrando nuevas conexiones.",
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
