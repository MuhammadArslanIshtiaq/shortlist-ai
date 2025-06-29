Write-Host "Adding NEXT_PUBLIC_DISABLE_WEBSOCKET=true to .env.local..." -ForegroundColor Green
Add-Content -Path ".env.local" -Value "NEXT_PUBLIC_DISABLE_WEBSOCKET=true"
Write-Host ""
Write-Host "WebSocket has been disabled for development." -ForegroundColor Yellow
Write-Host "Restart your development server to apply changes." -ForegroundColor Yellow
Write-Host ""
Write-Host "To re-enable WebSocket, remove the line from .env.local" -ForegroundColor Cyan
Read-Host "Press Enter to continue" 