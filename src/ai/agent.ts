// Agente IA para análisis crítico del Sistema Lagrange

import { AgentInput, AgentOutput, AgentError, PilarAnalysisInput, PilarAnalysisOutput } from "./types";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { buildAgentPromptWithPilares, buildPilarAnalysisPrompt } from "./prompts";
import { pilares } from "@/data/pilares";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

/**
 * Verifica si el agente está configurado con API real
 */
export function isAgentConfigured(): boolean {
  return !!GOOGLE_API_KEY;
}

/**
 * Ejecuta el agente de análisis crítico usando Google Gemini
 * Ahora incluye contexto de pilares fundamentales
 */
export async function runAgent(input: AgentInput): Promise<AgentOutput> {
  try {
    // Si no hay API key, lanzar error
    if (!GOOGLE_API_KEY) {
      throw new Error("API_KEY_MISSING");
    }

    // Usar pilares del input o todos por defecto
    const pilaresContext = input.pilares || pilares;

    // Preparar el prompt para Gemini con contexto de pilares
    const prompt = buildAgentPromptWithPilares(
      input.corpus,
      input.angle,
      pilaresContext
    );

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || response.statusText;
      throw new Error(`API_ERROR: ${errorMsg}`);
    }

    const data = await response.json();
    
    // Verificar si hay candidatos
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("NO_CANDIDATES: La API no devolvió resultados");
    }
    
    const text = data.candidates[0]?.content?.parts?.[0]?.text || "";
    
    if (!text) {
      throw new Error("EMPTY_RESPONSE: La respuesta está vacía");
    }
    
    // Extraer JSON de la respuesta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`INVALID_RESPONSE_FORMAT: No se encontró JSON válido en la respuesta. Texto recibido: ${text.substring(0, 200)}...`);
    }

    const result = JSON.parse(jsonMatch[0]);
    return result as AgentOutput;

  } catch (error: any) {
    console.error("Error en runAgent:", error);
    throw {
      message: error.message || "Error desconocido",
      code: error.code || "UNKNOWN_ERROR"
    } as AgentError;
  }
}

/**
 * Análisis específico basado en pilares fundamentales
 */
export async function analyzePilares(input: PilarAnalysisInput): Promise<PilarAnalysisOutput> {
  try {
    if (!GOOGLE_API_KEY) {
      throw new Error("API_KEY_MISSING");
    }

    const pilaresContext = input.pilarId 
      ? pilares.filter(p => p.id === input.pilarId)
      : pilares;

    const prompt = buildPilarAnalysisPrompt(
      input.texto,
      pilaresContext,
      input.pilarId
    );

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || response.statusText;
      throw new Error(`API_ERROR: ${errorMsg}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("NO_CANDIDATES: La API no devolvió resultados");
    }
    
    const text = data.candidates[0]?.content?.parts?.[0]?.text || "";
    
    if (!text) {
      throw new Error("EMPTY_RESPONSE: La respuesta está vacía");
    }
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`INVALID_RESPONSE_FORMAT: No se encontró JSON válido`);
    }

    const result = JSON.parse(jsonMatch[0]);
    return result as PilarAnalysisOutput;

  } catch (error: any) {
    console.error("Error en analyzePilares:", error);
    throw {
      message: error.message || "Error desconocido",
      code: error.code || "UNKNOWN_ERROR"
    } as AgentError;
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
