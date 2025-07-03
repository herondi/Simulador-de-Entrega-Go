@echo off
REM Script para fazer push da imagem PostgreSQL para Docker Hub
REM Autor: Delivery Simulator

echo ======================================
echo    PUSH POSTGRESQL PARA DOCKER HUB
echo ======================================
echo.

REM Verificar se está logado no Docker Hub
echo Verificando login no Docker Hub...
docker info | findstr "Username" >nul
if %errorlevel% neq 0 (
    echo.
    echo [!] Voce precisa fazer login no Docker Hub primeiro!
    echo.
    echo Digite seu username do Docker Hub:
    set /p username=Username: 
    docker login -u %username%
    if %errorlevel% neq 0 (
        echo [ERRO] Falha no login!
        pause
        exit /b 1
    )
)

echo.
echo [OK] Login verificado!
echo.

REM Verificar se a imagem postgres existe
echo Verificando imagem PostgreSQL local...
docker images | findstr "postgres.*16" >nul
if %errorlevel% neq 0 (
    echo [ERRO] Imagem postgres:16 nao encontrada!
    echo.
    echo Execute primeiro: docker pull postgres:16
    pause
    exit /b 1
)

echo [OK] Imagem encontrada!
echo.

REM Criar tag para Docker Hub
echo Criando tag para Docker Hub...
docker tag postgres:16 waynerramos/delivery-postgres:latest
docker tag postgres:16 waynerramos/delivery-postgres:16

echo [OK] Tags criadas!
echo.

REM Fazer push das imagens
echo ======================================
echo    ENVIANDO PARA DOCKER HUB
echo ======================================
echo.
echo Isso pode demorar alguns minutos...
echo.

echo [1/2] Enviando waynerramos/delivery-postgres:latest...
docker push waynerramos/delivery-postgres:latest
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao enviar :latest
    pause
    exit /b 1
)

echo.
echo [2/2] Enviando waynerramos/delivery-postgres:16...
docker push waynerramos/delivery-postgres:16
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao enviar :16
    pause
    exit /b 1
)

echo.
echo ======================================
echo    PUSH CONCLUIDO COM SUCESSO!
echo ======================================
echo.
echo Imagens enviadas:
echo - waynerramos/delivery-postgres:latest
echo - waynerramos/delivery-postgres:16
echo.
echo Agora voce pode usar no docker-compose.yml:
echo   image: waynerramos/delivery-postgres:latest
echo.
echo URL no Docker Hub:
echo https://hub.docker.com/r/waynerramos/delivery-postgres
echo.
pause