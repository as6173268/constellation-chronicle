# Deploy del Sistema Lagrange

## Scripts disponibles

### Deploy local (recomendado)
```bash
./deploy.sh
```

Este script:
- Verifica que existe `.env.local` con la API key
- Carga la variable de entorno
- Construye el proyecto con la API key
- Despliega a GitHub Pages

### Deploy manual
```bash
npm run deploy:local
```

### Deploy con variable de entorno específica
```bash
VITE_GOOGLE_API_KEY=tu_api_key npm run deploy
```

## Configuración de producción

### Variables de entorno necesarias

**Desarrollo:**
```bash
# .env.local
VITE_GOOGLE_API_KEY=AIzaSyAm_qYKNgXqZa-nJiClbz66-CdGp5PR4V4
```

**Producción (GitHub Actions):**
Si usas CI/CD, añade la variable como secret:
1. Ve a Settings → Secrets and variables → Actions
2. Añade `VITE_GOOGLE_API_KEY` con tu API key
3. Actualiza el workflow para incluirla en el build

## Verificación

Para verificar que el agente funcionará en producción:

```bash
# Build de prueba
VITE_GOOGLE_API_KEY=$(cat .env.local | grep VITE_GOOGLE_API_KEY | cut -d '=' -f2) npm run build

# Verificar en dist/assets/*.js que la key está embebida
grep -r "generativelanguage.googleapis.com" dist/assets/
```

## Troubleshooting

### Error: API_KEY_MISSING
- Verifica que `.env.local` existe y tiene la variable correcta
- Asegúrate de usar `./deploy.sh` o `npm run deploy:local`

### Error 403 al hacer push
- Las credenciales del Codespace son de sistemaproyectomunidal
- Ejecuta desde tu máquina local donde tienes acceso a as6173268

### El agente no funciona en producción
- Verifica que el build incluyó la API key
- Revisa la consola del navegador para errores de CORS o API
- Confirma que la API key tiene permisos en Google AI Studio
