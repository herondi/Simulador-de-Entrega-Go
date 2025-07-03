@echo off
REM Script para atualizar TODAS as imagens no Docker Hub
REM Útil após mudanças no projeto

echo ======================================
echo   ATUALIZADOR DE IMAGENS DOCKER HUB
echo ======================================
echo.

REM Verificar login
echo Verificando login no Docker Hub...
docker info | findstr "Username" >nul
if %errorlevel% neq 0 (
    echo [!] Fazendo login...
    docker login -u waynerramos
)

echo.
echo ======================================
echo   CONSTRUINDO IMAGENS LOCALMENTE
echo ======================================
echo.

REM Construir imagens se necessário
echo Deseja reconstruir as imagens localmente? (s/N)
set /p rebuild=Opcao: 

if /i "%rebuild%"=="s" (
    echo.
    echo Construindo imagens...
    docker-compose build --no-cache
    echo [OK] Imagens construídas!
)

echo.
echo ======================================
echo   CRIANDO TAGS E FAZENDO PUSH
echo ======================================
echo.

REM PostgreSQL
echo [1/4] PostgreSQL...
docker tag postgres:16 waynerramos/delivery-postgres:latest
docker push waynerramos/delivery-postgres:latest
echo [OK] PostgreSQL atualizado!
echo.

REM Frontend
echo [2/4] Frontend...
docker tag delivery-frontend waynerramos/delivery-frontend:latest
docker push waynerramos/delivery-frontend:latest
echo [OK] Frontend atualizado!
echo.

REM API
echo [3/4] Drivers API...
docker tag delivery-drivers-api waynerramos/delivery-drivers-api:latest
docker push waynerramos/delivery-drivers-api:latest
echo [OK] API atualizada!
echo.

REM Simulator
echo [4/4] Simulator...
docker tag delivery-simulator waynerramos/delivery-simulator:latest
docker push waynerramos/delivery-simulator:latest
echo [OK] Simulator atualizado!
echo.

echo ======================================
echo   TODAS AS IMAGENS ATUALIZADAS!
echo ======================================
echo.
echo Imagens no Docker Hub:
echo - waynerramos/delivery-postgres
echo - waynerramos/delivery-frontend
echo - waynerramos/delivery-drivers-api
echo - waynerramos/delivery-simulator
echo.
echo Para usar as novas imagens:
echo   docker-compose pull
echo   docker-compose up -d
echo.
pause