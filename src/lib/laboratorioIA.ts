// src/lib/laboratorioIA.ts

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
    contexto += `Pregunta socrática: ${input.preguntaId}\n`;
  }
  if (input.fragmentoCorpus) {
    contexto += `Fragmento corpus: ${input.fragmentoCorpus}\n`;
  }
  if (input.episodioId) {
    contexto += `Episodio: ${input.episodioId}\n`;
  }
  contexto += `Ejes: ${input.ejes.join(", ")}\nNivel: ${input.nivel}\nTensión: ${input.tension}\n`;
  contexto += `Texto usuario: ${input.texto}\n`;
  return `Analiza críticamente el siguiente contexto y responde según el método socrático.\n---\nContexto de análisis:\n${contexto}`;
}
