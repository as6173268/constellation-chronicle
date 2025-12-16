// Prompts para el agente crítico del Sistema Lagrange

// PROMPT_BASE ha sido reemplazado por SYSTEM_PROMPT (ver systemPrompt.ts)
// Usar SYSTEM_PROMPT para toda integración IA o automatización central.
export const PROMPT_BASE = "[DEPRECATED] Usar SYSTEM_PROMPT de systemPrompt.ts";

export const PROMPT_EPISODE_ANALYSIS = `
Analiza el siguiente episodio bajo el marco del Sistema Lagrange.
Identifica:
1. Qué afirmación central hace
2. Qué contradicción subyace
3. Qué pregunta queda sin responder

Responde solo con JSON válido.
`;

export const PROMPT_CORPUS_FRICTION = `
Lee el corpus proporcionado.
Genera fricción intelectual:
- No resumas
- No simplifiques
- Encuentra la tensión
- Formula la pregunta incómoda

Responde solo con JSON válido.
`;
