import { useAgent } from "@/hooks/useAgent";
import { isAgentConfigured } from "@/ai/agent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Brain, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AgentPanelProps {
  context: {
    corpus: string;
    narrativeMatrix?: any;
    currentEpisode?: any;
    angle: string;
  };
}

/**
 * Panel de interacción con el agente crítico
 * No hay chat - solo fricción intelectual estructurada
 */
export default function AgentPanel({ context }: AgentPanelProps) {
  const { analyze, output, loading, error, reset } = useAgent();
  const isConfigured = isAgentConfigured();

  const handleAnalyze = () => {
    analyze(context);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>Agente Crítico</CardTitle>
          </div>
          {output && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={reset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
        <CardDescription>
          No dialoga. Analiza estructuras y genera fricción intelectual.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">Ángulo de análisis:</span>
          <span className="px-2 py-1 bg-accent/30 rounded">{context.angle}</span>
        </div>

        {/* Alerta de configuración */}
        {!isConfigured && (
          <Alert variant="default" className="border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">Agente no configurado</AlertTitle>
            <AlertDescription className="text-sm">
              Se requiere <code className="px-1.5 py-0.5 bg-background rounded text-xs">VITE_GOOGLE_API_KEY</code> para análisis real.
              <br />
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline mt-1 inline-block"
              >
                Obtener API key de Google AI Studio →
              </a>
            </AlertDescription>
          </Alert>
        )}

        {!output && !loading && (
          <Button 
            onClick={handleAnalyze}
            variant="node"
            className="w-full"
            disabled={!isConfigured}
          >
            {isConfigured ? "Activar fricción" : "Configurar API key primero"}
          </Button>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            El sistema piensa. No lo interrumpas.
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {output && (
          <div className="space-y-4 animate-fade-in">
            <div className="border-l-2 border-primary pl-4 space-y-2">
              <div>
                <span className="text-sm font-semibold text-primary">Afirmación:</span>
                <p className="text-sm mt-1">{output.affirmation}</p>
              </div>
            </div>

            <div className="border-l-2 border-destructive pl-4 space-y-2">
              <div>
                <span className="text-sm font-semibold text-destructive">Contradicción:</span>
                <p className="text-sm mt-1">{output.contradiction}</p>
              </div>
            </div>

            <div className="border-l-2 border-accent pl-4 space-y-2">
              <div>
                <span className="text-sm font-semibold">Pregunta abierta:</span>
                <p className="text-sm mt-1 italic">{output.openQuestion}</p>
              </div>
            </div>

            {output.suggestedNodes && output.suggestedNodes.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs text-muted-foreground">Nodos relacionados:</span>
                {output.suggestedNodes.map((node, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 text-xs bg-secondary border border-border rounded-full"
                  >
                    {node}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
