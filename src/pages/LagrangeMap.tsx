import { Navigation } from "@/components/Navigation";
import { LagrangeMap } from "@/components/LagrangeMap";
import { useLagrangeData } from "@/hooks/useLagrangeData";

export default function LagrangeMap() {
  const { axes, nodes, isLoading } = useLagrangeData();

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Mapa <span className="text-gradient">Lagrange</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Un mapa interactivo de las {nodes.length || 52} espinas narrativas. Cada nodo representa un punto
              de equilibrio en la constelación del pensamiento. Las líneas conectan ideas que
              resuenan a través de los ejes conceptuales.
            </p>
          </div>

          {/* Interactive Map */}
          <div className="mb-16">
            <LagrangeMap />
          </div>

          {/* Axes Explanation */}
          <section className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-semibold mb-8 text-center">
              Los Cinco Ejes
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-lg p-6 animate-pulse"
                  >
                    <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                ))
              ) : (
                axes.map((axis) => {
                  const axisNodes = nodes.filter((n) => n.eje === axis.id);
                  return (
                    <div
                      key={axis.id}
                      className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-4 h-4 rounded-full node-glow"
                          style={{ backgroundColor: axis.color }}
                        />
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          {axisNodes.length} nodos
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-2">
                        {axis.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Episodios: {axisNodes.map((n) => n.episodio).join(", ") || "—"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Fundamentos */}
          <section className="max-w-3xl mx-auto mt-20">
            <h2 className="font-display text-2xl font-semibold mb-6">
              Fundamentos
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                El Sistema Lagrange toma su nombre de los puntos de Lagrange: posiciones en el espacio
                donde las fuerzas gravitacionales de dos cuerpos masivos se equilibran. De manera análoga,
                cada espina narrativa representa un punto de equilibrio entre fuerzas opuestas del pensamiento humano.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Los cinco ejes conectan estas espinas en constelaciones de significado, revelando patrones
                que atraviesan toda la experiencia humana: desde el miedo primordial hasta la conciencia
                que busca liberarse de sus propias cadenas.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
