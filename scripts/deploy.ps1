param(
  [switch]$Build
)

Write-Host "==> Déploiement docker-compose (client, serveur, redis)" -ForegroundColor Cyan

$composeFile = Join-Path $PSScriptRoot "..\docker-compose.yml"
if (-not (Test-Path $composeFile)) {
  Write-Error "docker-compose.yml introuvable à $composeFile"
  exit 1
}

Push-Location (Join-Path $PSScriptRoot "..")
try {
  if ($Build) {
    docker compose build --no-cache
  }
  docker compose up -d
  docker compose ps
  Write-Host "==> Services démarrés:" -ForegroundColor Green
  Write-Host " - Client: http://localhost:5173"
  Write-Host " - API:    http://localhost:8000"
  Write-Host " - Redis:  localhost:6379"
}
finally {
  Pop-Location
}
