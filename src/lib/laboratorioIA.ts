import { LABORATORIO_PROMPT } from "../ai/laboratorioPrompt";
import lagrangeMap from "../data/lagrange_map.json";

export interface LaboratorioInput {
  texto: string;
  preguntaId?: string;
  fragmentoCorpus?: string;
  episodioId?: string;
  ejes: string[];
  nivel: "individual" | "institucional" | "sistémico";
  tension: "ética" | "política" | "psicológica" | "simbólica";
}

export interface LaboratorioOutput {
  supuesto: string;
  contradiccion: string;
  eje: string;
  tension: string;
  preguntaEvita: string;
}

/**
 * Genera el prompt para el motor IA del Laboratorio, integrando input de usuario y contexto del sistema.
 */
export function buildLaboratorioPrompt(input: LaboratorioInput): string {
  let contexto = "";
  if (input.preguntaId) {
    const pregunta = lagrangeMap.preguntas.find(q => q.id === input.preguntaId);
    if (pregunta) contexto += `Pregunta socrática: ${pregunta.id} - ${pregunta.eje}\n`;
  }
  if (input.fragmentoCorpus) {
    contexto += `Fragmento corpus: ${input.fragmentoCorpus}\n`;
  }
  if (input.episodioId) {
    contexto += `Episodio: ${input.episodioId}\n`;
  }
  contexto += `Ejes: ${input.ejes.join(", ")}\nNivel: ${input.nivel}\nTensión: ${input.tension}\n`;
  contexto += `Texto usuario: ${input.texto}\n`;
  return `${LABORATORIO_PROMPT}\n---\nContexto de análisis:\n${contexto}`;
}
