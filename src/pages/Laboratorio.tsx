import { Navigation } from "@/components/Navigation";
import AgentPanel from "@/components/AgentPanel";
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


// --- BLOQUE LABORATORIO DE ANÁLISIS CRÍTICO ---
import { useState } from "react";
import { useLaboratorioIA } from "../hooks/useLaboratorioIA";
import lagrangeMap from "../data/lagrange_map.json";
const niveles = ["individual", "institucional", "sistémico"];
const tensiones = ["ética", "política", "psicológica", "simbólica"];

export default function Laboratorio() {
  // --- Estado para el laboratorio ---
  const [texto, setTexto] = useState("");
  const [ejes, setEjes] = useState<string[]>([]);
  const [nivel, setNivel] = useState(niveles[0]);
  const [tension, setTension] = useState(tensiones[0]);
  const [preguntaId, setPreguntaId] = useState("");
  const { analizar, output, loading, error } = useLaboratorioIA();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analizar({ texto, ejes, nivel: nivel as any, tension: tension as any, preguntaId });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* --- Laboratorio de Análisis Crítico --- */}
          <section className="max-w-2xl mx-auto p-6 space-y-6 mb-16 border border-primary/20 rounded-lg bg-card">
            <h2 className="text-2xl font-bold mb-2">Laboratorio de Análisis Crítico</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selector de marco */}
              <div>
                <label className="font-semibold">Ejes conceptuales:</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {lagrangeMap.ejes.map((e: any) => (
                    <label key={e.id} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        value={e.id}
                        checked={ejes.includes(e.id)}
                        onChange={ev => setEjes(ev.target.checked ? [...ejes, e.id] : ejes.filter(x => x !== e.id))}
                      />
                      {e.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="font-semibold">Nivel:</label>
                  <select value={nivel} onChange={e => setNivel(e.target.value)} className="ml-2">
                    {niveles.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold">Tensión:</label>
                  <select value={tension} onChange={e => setTension(e.target.value)} className="ml-2">
                    {tensiones.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              {/* Área de entrada */}
              <div>
                <label className="font-semibold">Texto libre:</label>
                <textarea
                  className="w-full border rounded p-2 mt-1"
                  rows={3}
                  value={texto}
                  onChange={e => setTexto(e.target.value)}
                  placeholder="Introduce texto, pregunta o fragmento..."
                />
              </div>
              <div>
                <label className="font-semibold">Pregunta socrática:</label>
                <select value={preguntaId} onChange={e => setPreguntaId(e.target.value)} className="ml-2">
                  <option value="">(Ninguna)</option>
                  {lagrangeMap.preguntas.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.id} - {p.eje}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
                {loading ? "Analizando..." : "Analizar"}
              </button>
            </form>
            {/* Salida estructurada */}
            {error && <div className="text-red-600">{error}</div>}
            {output && (
              <div className="border rounded p-4 bg-gray-50 space-y-2">
                <div><span className="font-semibold">Supuesto implícito detectado:</span> {output.supuesto}</div>
                <div><span className="font-semibold">Contradicción principal:</span> {output.contradiccion}</div>
                <div><span className="font-semibold">Eje activado:</span> {output.eje}</div>
                <div><span className="font-semibold">Tensión dominante:</span> {output.tension}</div>
                <div><span className="font-semibold">Pregunta que el sistema evita:</span> {output.preguntaEvita}</div>
              </div>
            )}
          </section>
          {/* ...existing code... */}

          {/* Workflow Section */}
          <section className="max-w-4xl mx-auto mb-16">
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

          {/* Agent Panel Section */}
          <section className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-semibold mb-6">
              Agente de Fricción Intelectual
            </h2>
            <AgentPanel 
              context={{
                corpus: "El Sistema Lagrange es una red de 52 puntos narrativos interconectados que exploran la tensión entre miedo, control, conciencia y rebelión silenciosa.",
                angle: "legitimidad institucional"
              }}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
