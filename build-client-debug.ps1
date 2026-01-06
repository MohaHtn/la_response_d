# Script de diagnostic et build pour le client Docker
# Ce script aide à diagnostiquer les problèmes de build Docker

Write-Host "=== DIAGNOSTIC PRE-BUILD CLIENT ===" -ForegroundColor Yellow

# Vérification du répertoire de travail
Write-Host "Répertoire actuel: $(Get-Location)" -ForegroundColor Cyan

# Vérification de la présence de Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker installé: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas installé ou accessible" -ForegroundColor Red
    exit 1
}

# Vérification des fichiers critiques dans le contexte client
$clientPath = ".\client"
Write-Host "`nVérification des fichiers dans $clientPath:" -ForegroundColor Cyan

$criticalFiles = @("index.html", "vite.config.js", "eslint.config.js", "package.json")
$criticalDirs = @("src", "public")

foreach ($file in $criticalFiles) {
    $fullPath = Join-Path $clientPath $file
    if (Test-Path $fullPath) {
        Write-Host "✅ $file présent" -ForegroundColor Green
    } else {
        Write-Host "❌ $file MANQUANT" -ForegroundColor Red
    }
}

foreach ($dir in $criticalDirs) {
    $fullPath = Join-Path $clientPath $dir
    if (Test-Path $fullPath -PathType Container) {
        $fileCount = (Get-ChildItem $fullPath -Recurse -File).Count
        Write-Host "✅ $dir/ présent ($fileCount fichiers)" -ForegroundColor Green
    } else {
        Write-Host "❌ $dir/ MANQUANT" -ForegroundColor Red
    }
}

# Vérification du .dockerignore
$dockerignorePath = Join-Path $clientPath ".dockerignore"
if (Test-Path $dockerignorePath) {
    Write-Host "`n.dockerignore trouvé, contenu:" -ForegroundColor Cyan
    Get-Content $dockerignorePath | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "`n⚠️  Pas de .dockerignore dans client/" -ForegroundColor Yellow
}

# Tentative de build
Write-Host "`n=== LANCEMENT DU BUILD ===" -ForegroundColor Yellow
Write-Host "Commande: docker compose build --no-cache client" -ForegroundColor Cyan

try {
    docker compose build --no-cache client
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build réussi !" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur de build (code: $LASTEXITCODE)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur lors du lancement de la commande: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== FIN DU DIAGNOSTIC ===" -ForegroundColor Yellow
