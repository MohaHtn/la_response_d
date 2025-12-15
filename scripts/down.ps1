Write-Host "==> Arrêt et nettoyage des services" -ForegroundColor Yellow

$composeFile = Join-Path $PSScriptRoot "..\docker-compose.yml"
if (-not (Test-Path $composeFile)) {
  Write-Error "docker-compose.yml introuvable à $composeFile"
  exit 1
}

Push-Location (Join-Path $PSScriptRoot "..")
try {
  docker compose down -v
}
finally {
  Pop-Location
}
