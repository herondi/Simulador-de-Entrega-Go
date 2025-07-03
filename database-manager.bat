@echo off
REM Script para gerenciar acesso ao banco de dados
REM Oferece opções visuais e linha de comando

echo ======================================
echo    GERENCIADOR DE BANCO DE DADOS
echo ======================================
echo.
echo 1) Abrir pgAdmin (precisa estar instalado)
echo 2) Iniciar Adminer (interface web)
echo 3) Acessar via terminal (psql)
echo 4) Fazer backup do banco
echo 5) Restaurar backup
echo 6) Ver informações de conexão
echo 0) Sair
echo.
set /p choice=Escolha uma opcao: 

if "%choice%"=="1" goto pgadmin
if "%choice%"=="2" goto adminer
if "%choice%"=="3" goto terminal
if "%choice%"=="4" goto backup
if "%choice%"=="5" goto restore
if "%choice%"=="6" goto info
if "%choice%"=="0" exit

:pgadmin
echo.
echo ======================================
echo    ABRINDO pgAdmin
echo ======================================
echo.
echo Configuracoes de conexao:
echo - Host: localhost
echo - Port: 5433
echo - Database: delivery_simulator
echo - Username: postgres
echo - Password: Bystronic30@
echo.
echo Abrindo pgAdmin...
start pgAdmin4.exe
echo.
echo Se o pgAdmin nao abriu, procure por "pgAdmin 16" no menu Iniciar
echo.
pause
goto :eof

:adminer
echo.
echo ======================================
echo    INICIANDO ADMINER (Interface Web)
echo ======================================
echo.

REM Verificar se Adminer está rodando
docker ps | findstr "adminer" >nul
if %errorlevel% equ 0 (
    echo Adminer ja esta rodando!
    echo.
    echo Abrindo no navegador...
    start http://localhost:8080
    echo.
    echo Dados de acesso:
    echo - Sistema: PostgreSQL
    echo - Servidor: postgres
    echo - Usuario: postgres
    echo - Senha: Bystronic30@
    echo - Base de dados: delivery_simulator
) else (
    echo Iniciando Adminer...
    docker run -d --name delivery-adminer --network simulador-de-entrega-go_delivery-network -p 8080:8080 adminer
    echo.
    timeout /t 5 /nobreak >nul
    echo Abrindo no navegador...
    start http://localhost:8080
    echo.
    echo Dados de acesso:
    echo - Sistema: PostgreSQL
    echo - Servidor: postgres
    echo - Usuario: postgres
    echo - Senha: Bystronic30@
    echo - Base de dados: delivery_simulator
)
echo.
pause
goto :eof

:terminal
echo.
echo ======================================
echo    ACESSO VIA TERMINAL
echo ======================================
echo.
echo Conectando ao PostgreSQL...
echo.
docker exec -it delivery-postgres psql -U postgres -d delivery_simulator
goto :eof

:backup
echo.
echo ======================================
echo    BACKUP DO BANCO DE DADOS
echo ======================================
echo.
set filename=backup_%date:~0,2%-%date:~3,2%-%date:~6,4%_%time:~0,2%-%time:~3,2%.sql
set filename=%filename: =0%
echo Criando backup: %filename%
docker exec delivery-postgres pg_dump -U postgres delivery_simulator > %filename%
echo.
echo [OK] Backup salvo em: %filename%
echo.
pause
goto :eof

:restore
echo.
echo ======================================
echo    RESTAURAR BACKUP
echo ======================================
echo.
echo Arquivos de backup disponiveis:
dir /b *.sql
echo.
set /p backup_file=Digite o nome do arquivo: 
if exist %backup_file% (
    echo.
    echo Restaurando %backup_file%...
    docker exec -i delivery-postgres psql -U postgres delivery_simulator < %backup_file%
    echo [OK] Backup restaurado!
) else (
    echo [ERRO] Arquivo nao encontrado!
)
echo.
pause
goto :eof

:info
echo.
echo ======================================
echo    INFORMACOES DE CONEXAO
echo ======================================
echo.
echo POSTGRESQL (Docker):
echo --------------------
echo Host: localhost
echo Port: 5433
echo Database: delivery_simulator
echo Username: postgres
echo Password: Bystronic30@
echo.
echo STRING DE CONEXAO:
echo ------------------
echo postgresql://postgres:Bystronic30@@localhost:5433/delivery_simulator
echo.
echo URLS DE ACESSO:
echo ---------------
echo pgAdmin: Aplicativo desktop (ja instalado)
echo Adminer: http://localhost:8080 (se iniciado)
echo.
pause
goto :eof