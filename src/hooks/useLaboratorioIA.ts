import { useState } from "react";
import { buildLaboratorioPrompt, LaboratorioInput, LaboratorioOutput } from "../lib/laboratorioIA";

/**
 * Hook para ejecutar el análisis crítico del Laboratorio Lagrange vía IA.
 * Puede conectarse a un endpoint real o simular respuesta para desarrollo.
 */
export function useLaboratorioIA() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<LaboratorioOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function analizar(input: LaboratorioInput) {
    setLoading(true);
    setError(null);
    setOutput(null);
    const prompt = buildLaboratorioPrompt(input);
    try {
      // --- INTEGRACIÓN REAL ---
      // const response = await fetch("/api/ia/laboratorio", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ prompt })
      // });
      // const data = await response.json();
      // setOutput(data);

      // --- MOCK PARA DESARROLLO ---
      await new Promise(r => setTimeout(r, 1200));
      setOutput({
        supuesto: "El usuario asume que el control es siempre externo.",
        contradiccion: "Busca protección pero rechaza vigilancia.",
        eje: input.ejes[0] || "miedo",
        tension: input.tension,
        preguntaEvita: "¿Qué parte del control es autoimpuesta?"
      });
    } catch (e) {
      setError("Error al analizar el input.");
    } finally {
      setLoading(false);
    }
  }

  return { analizar, output, loading, error };
}
