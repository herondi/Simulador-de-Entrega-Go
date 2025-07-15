@echo off
echo 🔧 Corrigindo Frontend com Google Maps...

echo ⏹️ Parando servicos...
docker-compose down

echo 🏗️ Copiando arquivos corrigidos para container...
docker run --name temp-frontend waynerramos/delivery-frontend /bin/true
docker cp "./SIMULATOR/drivers/simulator/frontend/src/pages/DeliveryMap.js" temp-frontend:/usr/share/nginx/html/static/js/
docker commit temp-frontend delivery-frontend-fixed
docker rm temp-frontend

echo 🚀 Iniciando com imagem corrigida...
docker tag delivery-frontend-fixed waynerramos/delivery-frontend-fixed

echo ✅ Pronto! Use: docker-compose up -d
echo 🌐 Acesse: http://localhost:3000