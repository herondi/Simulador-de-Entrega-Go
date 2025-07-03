@echo off
REM Script rápido para iniciar o Adminer (interface web para PostgreSQL)

echo ======================================
echo    INICIANDO ADMINER
echo ======================================
echo.

REM Verificar se já está rodando
docker ps | findstr "adminer" >nul
if %errorlevel% equ 0 (
    echo Adminer ja esta rodando!
    goto open_browser
)

REM Verificar se a rede existe
docker network ls | findstr "delivery-network" >nul
if %errorlevel% neq 0 (
    echo [ERRO] A rede Docker nao existe!
    echo Execute primeiro: docker-compose up -d
    pause
    exit /b 1
)

echo Iniciando Adminer...
docker run -d --name delivery-adminer --network simulador-de-entrega-go_delivery-network -p 8080:8080 -e ADMINER_DEFAULT_SERVER=postgres -e ADMINER_DESIGN=pepa-linha-dark adminer

echo.
echo Aguardando iniciar...
timeout /t 5 /nobreak >nul

:open_browser
echo.
echo Abrindo Adminer no navegador...
start http://localhost:8080

echo.
echo ======================================
echo    DADOS DE ACESSO
echo ======================================
echo Sistema: PostgreSQL
echo Servidor: postgres
echo Usuario: postgres
echo Senha: Bystronic30@
echo Base de dados: delivery_simulator
echo ======================================
echo.
echo Para parar o Adminer:
echo   docker stop delivery-adminer
echo   docker rm delivery-adminer
echo.
pause