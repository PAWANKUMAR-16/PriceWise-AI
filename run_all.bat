@echo off
title PriceWise AI - Master Launcher
echo ========================================================
echo Launching PriceWise AI Application
echo 1. Backend:  http://localhost:8080/api/v1
echo 2. Frontend: http://localhost:5173
echo ========================================================

start "PriceWise Backend" "%~dp0run_backend.bat"
timeout /t 3 /nobreak >nul
start "PriceWise Frontend" "%~dp0run_frontend.bat"

echo.
echo Both servers have been launched in separate windows!
echo Open your browser and visit: http://localhost:5173
echo.
pause
