
# PowerShell deploy script for Vite + React + GitHub Pages
# Uso: Ejecutar desde la raíz del proyecto

Write-Host "Iniciando deploy del Sistema Lagrange..."

# 1. Escribir la API key en .env.local si no existe
$envPath = ".env.local"
$apiKey = "VITE_GOOGLE_API_KEY=AIzaSyCE2y7nxv8KJkJqDNULlj4gKALpPxtBQR0"
if (!(Test-Path $envPath)) {
    Set-Content -Path $envPath -Value $apiKey
    Write-Host ".env.local creado con API key."
} elseif (-not (Select-String -Path $envPath -Pattern "VITE_GOOGLE_API_KEY")) {
    Add-Content -Path $envPath -Value $apiKey
    Write-Host "API key agregada a .env.local."
} else {
    Write-Host ".env.local ya contiene la API key."
}

# 2. Instalar dependencias si es necesario
if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..."
    npm install
}

# 3. Sincronizar episodios y audios
Write-Host "Sincronizando episodios y audios..."
npm run sync-episodes

# 4. Build de producción
Write-Host "Construyendo proyecto..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error en build. Abortando."
    exit 1
}

# 5. Desplegar a GitHub Pages (gh-pages)
Write-Host "Desplegando a GitHub Pages..."
npx gh-pages -d dist
if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploy completado exitosamente!"
    Write-Host "Sitio: https://as6173268.github.io/constellation-chronicle/"
} else {
    Write-Error "Error en deploy."
    exit 1
}
