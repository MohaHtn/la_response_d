# Script de Redémarrage du Serveur FastAPI
# Usage: powershell -File restart_server.ps1

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Redémarrage du Serveur FastAPI" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Arrêter les processus Python existants sur le port 8000
Write-Host "1. Arrêt des processus existants..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) {
    foreach ($pid in $processes) {
        Write-Host "   - Arrêt du processus PID: $pid" -ForegroundColor Gray
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "   ✓ Processus arrêtés" -ForegroundColor Green
} else {
    Write-Host "   ℹ Aucun processus en cours d'exécution sur le port 8000" -ForegroundColor Gray
}
Write-Host ""

# Démarrer le serveur
Write-Host "2. Démarrage du nouveau serveur..." -ForegroundColor Yellow
Set-Location "c:\Users\MohaHtn\PycharmProjects\la_response_d\server"

Write-Host "   - Répertoire: $(Get-Location)" -ForegroundColor Gray
Write-Host "   - Commande: python -m uvicorn src.app.main:app --reload --port 8000" -ForegroundColor Gray
Write-Host ""

# Démarrer le serveur en arrière-plan
$job = Start-Job -ScriptBlock {
    Set-Location "c:\Users\MohaHtn\PycharmProjects\la_response_d\server"
    python -m uvicorn src.app.main:app --reload --port 8000
}

# Attendre quelques secondes pour voir si le serveur démarre correctement
Start-Sleep -Seconds 3

# Vérifier si le serveur est en cours d'exécution
$listening = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if ($listening) {
    Write-Host "   ✓ Serveur démarré avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=======================================" -ForegroundColor Cyan
    Write-Host "Serveur accessible sur:" -ForegroundColor Green
    Write-Host "   http://localhost:8000" -ForegroundColor White
    Write-Host "   http://localhost:8000/docs (Swagger UI)" -ForegroundColor White
    Write-Host "   http://localhost:8000/health (Health Check)" -ForegroundColor White
    Write-Host "=======================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Job ID: $($job.Id)" -ForegroundColor Gray
    Write-Host "Pour voir les logs: Receive-Job -Id $($job.Id) -Keep" -ForegroundColor Gray
    Write-Host "Pour arrêter: Stop-Job -Id $($job.Id); Remove-Job -Id $($job.Id)" -ForegroundColor Gray
} else {
    Write-Host "   ✗ Échec du démarrage du serveur" -ForegroundColor Red
    Write-Host ""
    Write-Host "Logs du Job:" -ForegroundColor Yellow
    Receive-Job -Job $job
    Stop-Job -Job $job
    Remove-Job -Job $job
}

