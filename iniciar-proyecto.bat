@echo off
echo ========================================
echo   INICIAR PROYECTO NAILS STUDIO
echo ========================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado
    echo Descarga desde: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js instalado
echo.

echo [2/4] Iniciando Backend...
start "Backend - Nails Studio" cmd /k "cd backend && npm run dev"
timeout /t 3 >nul
echo [OK] Backend iniciado en puerto 4000
echo.

echo [3/4] Iniciando Frontend...
start "Frontend - Nails Studio" cmd /k "cd frontend && npm start"
timeout /t 3 >nul
echo [OK] Frontend iniciado en puerto 3000
echo.

echo [4/4] Abriendo navegador...
timeout /t 5 >nul
start http://localhost:3000
echo.

echo ========================================
echo   PROYECTO INICIADO
echo ========================================
echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:3000
echo.
echo Credenciales de prueba:
echo   Correo: admin@nails.com
echo   Password: admin123
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
