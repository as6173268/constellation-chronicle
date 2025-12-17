import * as R from 'ramda';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';

// Functional types
export interface IARequest {
  readonly prompt: string;
  readonly context?: string;
  readonly temperature?: number;
}

export interface IAResponse {
  readonly response: string;
  readonly confidence?: number;
  readonly metadata?: Readonly<Record<string, any>>;
}

export interface IAConfig {
  readonly apiUrl: string;
  readonly apiKey?: string;
}

// Pure functions for mock responses
const mockResponses = [
  "En el contexto del Sistema Lagrange, esta pregunta revela una tensión fundamental entre el miedo primordial y los mecanismos de control contemporáneos. El miedo, como fuerza originaria, se transforma en legitimidad cuando se institucionaliza a través de narrativas de seguridad y protección.",
  "Esta interrogante socrática conecta con el eje 'Miedo → Control → Legitimidad'. La consciencia del miedo no es un estado pasivo, sino un punto de equilibrio dinámico que requiere constante renegociación entre la vulnerabilidad individual y la estabilidad colectiva.",
  "Desde la perspectiva lagrangiana, esta pregunta ilumina cómo el control se presenta como solución al miedo, pero en realidad lo perpetúa. La legitimidad surge no de la resolución del conflicto, sino de su gestión estratégica.",
  "El análisis crítico revela que el miedo no es el problema a resolver, sino el terreno sobre el cual se construyen todos los sistemas de control. La consciencia emerge cuando reconocemos esta dinámica como constitutiva de nuestra realidad social."
] as const;

// Pure function to get random element
const getRandomElement = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Pure function to create mock response
const createMockResponse = (prompt: string): IAResponse => ({
  response: getRandomElement(mockResponses),
  confidence: 0.85,
  metadata: {
    model: "mock-llm",
    tokens: getRandomElement(mockResponses).length,
    processing_time: 2.0
  }
});

// Pure function to simulate API delay
const simulateApiDelay = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, 2000));

// Functional API call (mock)
const mockApiCall = (request: IARequest): TE.TaskEither<Error, IAResponse> =>
  TE.tryCatch(
    async () => {
      await simulateApiDelay();
      return createMockResponse(request.prompt);
    },
    (error) => new Error(`API call failed: ${error}`)
  );

// Pure function to build analysis prompt
const buildAnalysisPrompt = (question: string, context?: string): string =>
  `Analiza la siguiente pregunta socrática en el contexto del Sistema Lagrange:\n\nPregunta: ${question}\n${context ? `Contexto: ${context}\n` : ''}\nProporciona un análisis profundo y conexiones con los ejes conceptuales.`;

// Curried function for generating responses
export const generateResponse = R.curry(
  (config: IAConfig, request: IARequest): TE.TaskEither<Error, IAResponse> =>
    mockApiCall(request) // In real implementation, this would use config
);

// Curried function for analyzing questions
export const analyzeQuestion = R.curry(
  (config: IAConfig, question: string, context?: string): TE.TaskEither<Error, IAResponse> =>
    R.pipe(
      buildAnalysisPrompt,
      (prompt) => ({ prompt, context, temperature: 0.7 }),
      generateResponse(config)
    )(question)
);

// Default configuration
export const defaultIAConfig: IAConfig = {
  apiUrl: '/api/ia'
};

// Functional composition for common analysis patterns
export const analyzeWithContext = R.curry(
  (config: IAConfig, context: string, question: string): TE.TaskEither<Error, IAResponse> =>
    analyzeQuestion(config, question, context)
);

export const analyzeWithoutContext = R.curry(
  (config: IAConfig, question: string): TE.TaskEither<Error, IAResponse> =>
    analyzeQuestion(config, question, undefined)
);

export const iaClient = new IAClient();