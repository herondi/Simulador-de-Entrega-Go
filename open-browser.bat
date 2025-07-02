@echo off
echo ======================================
echo    ABRINDO TODOS OS SERVICOS
echo ======================================
echo.

REM Aguarda 3 segundos para garantir que tudo está rodando
echo Aguardando servicos estarem prontos...
timeout /t 3 /nobreak >nul

REM Abre o Frontend
echo [1/3] Abrindo Frontend...
start "" "http://localhost:3000"
timeout /t 1 /nobreak >nul

REM Abre o RabbitMQ
echo [2/3] Abrindo RabbitMQ Management...
echo       Usuario: admin
echo       Senha: admin
start "" "http://localhost:15672"
timeout /t 1 /nobreak >nul

REM Abre a API
echo [3/3] Abrindo API...
start "" "http://localhost:8081"

echo.
echo ======================================
echo    TODOS OS SERVICOS FORAM ABERTOS!
echo ======================================
echo.
echo URLs abertas:
echo - Frontend: http://localhost:3000
echo - RabbitMQ: http://localhost:15672 (admin/admin)
echo - API: http://localhost:8081
echo.
pause