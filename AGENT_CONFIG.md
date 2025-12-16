# Configuración del Agente IA

## Variables de Entorno

### Desarrollo local

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
VITE_GOOGLE_API_KEY=tu_api_key_aqui
```

### Producción (GitHub Pages)

Para que el agente funcione en producción, configura la variable de entorno durante el build:

```bash
VITE_GOOGLE_API_KEY=tu_api_key npm run build
npm run deploy
```

O añádela a tu script de deploy en `package.json`:

```json
{
  "scripts": {
    "deploy": "VITE_GOOGLE_API_KEY=$GOOGLE_API_KEY npm run build && gh-pages -d dist"
  }
}
```

## Obtener API Key de Google

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea un nuevo proyecto o selecciona uno existente
3. Genera una API key
4. Copia la key y agrégala a tu `.env.local`

## Modelo utilizado

- **Modelo**: `gemini-1.5-flash`
- **Ventajas**: Rápido, gratuito hasta cierto límite, buen razonamiento
- **Límites**: Revisa la [documentación de cuotas](https://ai.google.dev/pricing)

## Funcionamiento

El agente NO es un chatbot. Es un analizador crítico que:
- Lee el corpus y contexto
- Detecta contradicciones estructurales
- Formula preguntas socráticas
- Genera fricción intelectual

Si no hay API key configurada, el botón estará deshabilitado y mostrará instrucciones.
