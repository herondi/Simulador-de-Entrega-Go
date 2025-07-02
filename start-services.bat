@echo off
REM Script de inicialização para Windows
REM Projeto Delivery Simulator

echo ======================================
echo    INICIANDO DELIVERY SIMULATOR
echo ======================================

REM Verificar se o arquivo .env existe
if not exist .env (
    echo [ERRO] Arquivo .env nao encontrado!
    echo Por favor, certifique-se de que o arquivo .env esta na raiz do projeto.
    pause
    exit /b 1
)

REM Verificar se Docker está rodando
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker nao esta rodando!
    echo Por favor, inicie o Docker Desktop.
    pause
    exit /b 1
)

echo [OK] Docker esta rodando
echo [OK] Arquivo .env encontrado

REM Parar containers antigos
echo.
echo Parando containers antigos...
docker-compose down

REM Limpar a tela
cls

echo ======================================
echo    INICIANDO SERVICOS
echo ======================================

REM Iniciar os serviços
echo Iniciando containers...
docker-compose up -d

REM Aguardar serviços iniciarem
echo.
echo Aguardando servicos iniciarem...
timeout /t 10 /nobreak >nul

REM Verificar status
echo.
echo ======================================
echo    STATUS DOS SERVICOS
echo ======================================
echo.

REM Verificar PostgreSQL
docker exec delivery-postgres pg_isready -U postgres >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL esta rodando na porta 5433
    echo      - Conecte via pgAdmin em: localhost:5433
    echo      - Database: delivery_simulator
    echo      - Usuario: postgres
    echo      - Senha: Bystronic30@
) else (
    echo [ERRO] PostgreSQL nao esta respondendo
)

echo.

REM Verificar RabbitMQ
curl -s -o nul http://localhost:15672
if %errorlevel% equ 0 (
    echo [OK] RabbitMQ esta rodando
    echo      - Management UI: http://localhost:15672
    echo      - Usuario: admin
    echo      - Senha: admin
) else (
    echo [ERRO] RabbitMQ nao esta respondendo
)

echo.

REM Verificar API
curl -s -o nul http://localhost:8081
if %errorlevel% equ 0 (
    echo [OK] API de Drivers esta rodando
    echo      - URL: http://localhost:8081
) else (
    echo [AVISO] API de Drivers ainda esta iniciando...
)

echo.

REM Verificar Frontend
curl -s -o nul http://localhost:3000
if %errorlevel% equ 0 (
    echo [OK] Frontend esta rodando
    echo      - URL: http://localhost:3000
) else (
    echo [AVISO] Frontend ainda esta iniciando...
)

echo.
echo ======================================
echo    COMANDOS UTEIS
echo ======================================
echo Ver logs de todos os servicos:
echo   docker-compose logs -f
echo.
echo Ver logs de um servico especifico:
echo   docker-compose logs -f delivery-drivers-api
echo.
echo Parar todos os servicos:
echo   docker-compose down
echo.
echo Reiniciar um servico:
echo   docker-compose restart delivery-drivers-api
echo.
echo ======================================

REM Abrir URLs no navegador
echo.
echo Abrindo aplicacao no navegador...
timeout /t 5 /nobreak >nul
start http://localhost:3000
start http://localhost:15672

REM Perguntar sobre logs
echo.
set /p view_logs=Deseja ver os logs em tempo real? (s/N): 

if /i "%view_logs%"=="s" (
    docker-compose logs -f
)

pause