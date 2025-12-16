// src/ai/episodeStructurePrompt.ts
/**
 * EPISODE_STRUCTURE_PROMPT
 * Prompt para generación y control de estructura de episodios.
 * 
 * - Usar para cualquier generación automática o validación de episodios.
 * - La estructura de episodes.json y los guiones markdown deben seguir estas reglas.
 * - No modificar sin consenso y versionado.
 */

export const EPISODE_STRUCTURE_PROMPT = `
Actúa como arquitecto narrativo del Podcast Sistema Lagrange.

Tu tarea es definir la ESTRUCTURA BASE DE EPISODIOS a partir del corpus socrático existente, con las siguientes reglas:

1. Cada episodio debe:
   - Derivar de UNA pregunta socrática del corpus
   - No resolverla
   - Explorarla desde un único ángulo de análisis

2. Define un archivo episodes.json con esta estructura mínima por episodio:

   {
     "id": "E01",
     "titulo": "Título breve y no explicativo",
     "pregunta_base": "Q01",
     "eje": "miedo | control | salud_mental | legitimidad | responsabilidad",
     "angulo": "psicologico | politico | institucional | simbolico | etico",
     "guion_md": "/episodes/E01.md",
     "audio": null,
     "estado": "borrador | publicado"
   }

3. Genera AL MENOS 5 episodios iniciales, cubriendo distintos ejes.

4. Para cada episodio, crea un guion en Markdown con esta estructura FIJA:

   # Título del episodio

   ## Apertura
   Hecho, dato o frase breve. Sin contexto largo.

   ## Afirmación aceptada
   Lo que el sistema presenta como sensato.

   ## Fractura
   Dónde la afirmación deja de sostenerse.

   ## Consecuencia silenciosa
   Qué ocurre sin ser votado ni declarado.

   ## Pregunta final
   Reformulación incómoda de la pregunta base.
   Sin respuesta.

5. El guion debe:
   - Poder ser leído en web
   - Poder convertirse en audio sin reescritura
   - Mantener coherencia con el corpus

6. No incluyas:
   - Conclusiones
   - Llamadas a la acción
   - Opiniones personales

Entrega:
- episodes.json
- Los archivos markdown de los episodios

No expliques el proceso.
No justifiques decisiones.
Entrega estructura y contenido.
`;
