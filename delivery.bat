@echo off
REM Script principal para gerenciar o projeto Delivery Simulator
REM Uso: delivery.bat [start|stop|restart|open|status|logs]

set ACTION=%1

if "%ACTION%"=="" goto menu

REM Executa acao diretamente se fornecida
goto %ACTION%

:menu
cls
echo ======================================
echo    DELIVERY SIMULATOR - GERENCIADOR
echo ======================================
echo.
echo 1) Iniciar projeto (start)
echo 2) Parar projeto (stop)  
echo 3) Reiniciar projeto (restart)
echo 4) Abrir no navegador (open)
echo 5) Ver status (status)
echo 6) Ver logs (logs)
echo 7) Inicio rapido - Start + Open
echo 0) Sair
echo.
set /p choice=Escolha uma opcao: 

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto open
if "%choice%"=="5" goto status
if "%choice%"=="6" goto logs
if "%choice%"=="7" goto quickstart
if "%choice%"=="0" exit
goto menu

:start
echo.
echo ======================================
echo    INICIANDO PROJETO
echo ======================================
echo.

REM Verifica se ja esta rodando
docker ps | findstr "delivery-frontend" >nul
if %errorlevel% equ 0 (
    echo [AVISO] O projeto ja esta rodando!
    echo.
    choice /M "Deseja reiniciar o projeto"
    if errorlevel 2 goto end
    if errorlevel 1 goto restart
)

echo Iniciando containers...
docker-compose up -d

echo.
echo Aguardando servicos iniciarem...
timeout /t 10 /nobreak >nul

echo.
echo [OK] Projeto iniciado com sucesso!
echo.
choice /M "Deseja abrir no navegador"
if errorlevel 1 goto open
goto end

:stop
echo.
echo ======================================
echo    PARANDO PROJETO
echo ======================================
echo.
docker-compose down
echo.
echo [OK] Projeto parado!
goto end

:restart
echo.
echo ======================================
echo    REINICIANDO PROJETO
echo ======================================
echo.
docker-compose restart
echo.
echo Aguardando servicos reiniciarem...
timeout /t 10 /nobreak >nul
echo.
echo [OK] Projeto reiniciado!
goto end

:open
echo.
echo ======================================
echo    ABRINDO NO NAVEGADOR
echo ======================================
echo.

REM Verifica se esta rodando
docker ps | findstr "delivery-frontend" >nul
if %errorlevel% neq 0 (
    echo [ERRO] O projeto nao esta rodando!
    echo.
    choice /M "Deseja iniciar o projeto"
    if errorlevel 1 goto start
    goto end
)

echo Abrindo servicos no navegador...
echo.
start "" "http://localhost:3000"
echo [OK] Frontend aberto
timeout /t 1 /nobreak >nul

start "" "http://localhost:15672"
echo [OK] RabbitMQ aberto (admin/admin)
timeout /t 1 /nobreak >nul

start "" "http://localhost:8081"
echo [OK] API aberta
echo.
echo Todos os servicos foram abertos!
goto end

:status
echo.
echo ======================================
echo    STATUS DO PROJETO
echo ======================================
echo.
docker-compose ps
echo.
pause
goto menu

:logs
echo.
echo ======================================
echo    LOGS DO PROJETO
echo ======================================
echo.
echo Escolha o servico:
echo 1) Todos os servicos
echo 2) Frontend
echo 3) API
echo 4) Simulator
echo 5) PostgreSQL
echo 6) RabbitMQ
echo 0) Voltar
echo.
set /p log_choice=Opcao: 

if "%log_choice%"=="1" docker-compose logs -f
if "%log_choice%"=="2" docker-compose logs -f delivery-frontend
if "%log_choice%"=="3" docker-compose logs -f delivery-drivers-api
if "%log_choice%"=="4" docker-compose logs -f delivery-simulator
if "%log_choice%"=="5" docker-compose logs -f delivery-postgres
if "%log_choice%"=="6" docker-compose logs -f delivery-rabbitmq
if "%log_choice%"=="0" goto menu
goto end

:quickstart
echo.
echo ======================================
echo    INICIO RAPIDO
echo ======================================
echo.
call :start
call :open
goto end

:end
echo.
pause
exit