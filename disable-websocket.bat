@echo off
echo Adding NEXT_PUBLIC_DISABLE_WEBSOCKET=true to .env.local...
echo NEXT_PUBLIC_DISABLE_WEBSOCKET=true >> .env.local
echo.
echo WebSocket has been disabled for development.
echo Restart your development server to apply changes.
echo.
echo To re-enable WebSocket, remove the line from .env.local
pause 