# Script para iniciar backend y frontend en desarrollo

Write-Host "🚀 Iniciando Backend y Frontend..." -ForegroundColor Green

# Iniciar backend en segundo plano
Write-Host "📡 Iniciando Backend en puerto 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'Backend-gastos'; npm run dev" -WindowStyle Minimized

# Esperar un poco para que el backend se inicie
Start-Sleep -Seconds 3

# Iniciar frontend
Write-Host "🌐 Iniciando Frontend en puerto 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "✅ Ambos servicios iniciados:" -ForegroundColor Green
Write-Host "   Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
