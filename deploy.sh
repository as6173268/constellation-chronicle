#!/bin/bash
# Script de deploy con configuración de API key

set -e

echo "🚀 Iniciando deploy del Sistema Lagrange..."

# Verificar que existe .env.local
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local no encontrado"
    echo "Crea el archivo con: VITE_GOOGLE_API_KEY=tu_api_key"
    exit 1
fi

# Cargar API key desde .env.local
export $(cat .env.local | grep VITE_GOOGLE_API_KEY | xargs)

if [ -z "$VITE_GOOGLE_API_KEY" ]; then
    echo "❌ Error: VITE_GOOGLE_API_KEY no configurada en .env.local"
    exit 1
fi

echo "✅ API key cargada"

# Instalar gh-pages globalmente si no existe
if ! command -v gh-pages &> /dev/null; then
    echo "📦 Instalando gh-pages..."
    npm install --global gh-pages
fi

# Build con API key
echo "🔨 Construyendo proyecto..."
npm run build

# Deploy
echo "🚢 Desplegando a GitHub Pages..."
gh-pages -d dist

echo "✨ Deploy completado exitosamente!"
echo "🌐 Sitio: https://as6173268.github.io/constellation-chronicle/"
