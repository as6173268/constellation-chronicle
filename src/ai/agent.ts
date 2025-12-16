// Agente IA para análisis crítico del Sistema Lagrange

import { AgentInput, AgentOutput, AgentError } from "./types";
import { PROMPT_BASE } from "./prompts";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Verifica si el agente está configurado con API real
 */
export function isAgentConfigured(): boolean {
  return !!GOOGLE_API_KEY;
}

/**
 * Ejecuta el agente de análisis crítico usando Google Gemini
 * No dialoga - solo analiza y genera fricción
 */
export async function runAgent(input: AgentInput): Promise<AgentOutput> {
  try {
    // Si no hay API key, lanzar error
    if (!GOOGLE_API_KEY) {
      throw new Error("API_KEY_MISSING");
    }

    // Preparar el prompt para Gemini
    const prompt = `${PROMPT_BASE}

Contexto de análisis:
- Corpus: ${input.corpus.substring(0, 500)}...
- Ángulo: ${input.angle}

Analiza este contexto y responde SOLO con un objeto JSON válido siguiendo este formato exacto:
{
  "affirmation": "Una afirmación del corpus o contexto",
  "contradiction": "Una contradicción estructural o conceptual",
  "openQuestion": "Una pregunta socrática sin respuesta fácil",
  "suggestedNodes": ["nodo1", "nodo2"]
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("No se recibió respuesta del agente");
    }

    // Extraer JSON del texto (Gemini a veces incluye markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("El agente no devolvió JSON válido");
    }

    const output: AgentOutput = JSON.parse(jsonMatch[0]);
    return output;

  } catch (error) {
    console.error("Error en runAgent:", error);
    
    // Error específico de API key faltante
    if (error instanceof Error && error.message === "API_KEY_MISSING") {
      const err: AgentError = {
        message: "Agente no configurado. Se requiere VITE_GOOGLE_API_KEY.",
        code: "API_KEY_MISSING"
      };
      throw err;
    }
    
    const err: AgentError = {
      message: error instanceof Error ? error.message : "Error desconocido",
      code: "AGENT_ERROR"
    };
    throw err;
  }
}

/**
 * Versión simplificada para análisis rápido
 */
export async function quickAnalysis(text: string, angle: string): Promise<AgentOutput> {
  return runAgent({
    corpus: text,
    angle
  });
}
