Write-Host "Removing NEXT_PUBLIC_DISABLE_WEBSOCKET from .env.local..." -ForegroundColor Green

# Read the file content
$content = Get-Content ".env.local"

# Remove the disable line
$newContent = $content | Where-Object { $_ -notmatch "NEXT_PUBLIC_DISABLE_WEBSOCKET" }

# Write back to file
$newContent | Set-Content ".env.local"

Write-Host ""
Write-Host "WebSocket has been re-enabled!" -ForegroundColor Green
Write-Host "Restart your development server to apply changes." -ForegroundColor Yellow
Write-Host ""
Write-Host "If you still see connection errors, check the AWS_WEBSOCKET_SETUP_GUIDE.md" -ForegroundColor Cyan
Read-Host "Press Enter to continue" 