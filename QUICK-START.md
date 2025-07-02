# 🚀 Início Rápido - Delivery Simulator

## ✅ Pré-requisitos
- Docker Desktop instalado e rodando
- Arquivo `.env` configurado (você já tem!)
- pgAdmin 16 (você já tem instalado!)

## 📦 Arquivos Necessários

Salve estes arquivos na raiz do seu projeto:
1. `docker-compose.yml` (use o arquivo "docker-compose.yml - Configurado para seu Projeto")
2. `init.sql` (script de inicialização do banco)
3. `start-services.sh` (Linux/Mac) ou `start-services.bat` (Windows)

## 🎯 Iniciar o Projeto

### Windows:
```batch
start-services.bat
```

### Linux/Mac:
```bash
chmod +x start-services.sh
./start-services.sh
```

### Ou manualmente:
```bash
docker-compose up -d
```

## 🌐 URLs de Acesso

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | - |
| **API** | http://localhost:8081 | - |
| **RabbitMQ** | http://localhost:15672 | admin / admin |
| **PostgreSQL** | localhost:5433 | postgres / Bystronic30@ |

## 🔧 Conectar pgAdmin ao PostgreSQL

1. Abra o pgAdmin 16
2. Clique com botão direito em "Servers" → "Register" → "Server"
3. Na aba "General":
   - Name: `Delivery Simulator Docker`
4. Na aba "Connection":
   - Host: `localhost`
   - Port: `5433` (importante: não é 5432!)
   - Database: `delivery_simulator`
   - Username: `postgres`
   - Password: `Bystronic30@`
5. Clique em "Save"

## 📊 Comandos Úteis

### Ver logs em tempo real:
```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f delivery-drivers-api
```

### Gerenciar containers:
```bash
# Ver status
docker ps

# Parar tudo
docker-compose down

# Parar e limpar volumes
docker-compose down -v

# Reiniciar um serviço
docker-compose restart delivery-drivers-api
```

### Problemas comuns:

**Porta 5432 já em uso?**
- Estamos usando a porta 5433 justamente para evitar conflito com seu PostgreSQL local

**Container não inicia?**
```bash
# Ver logs detalhados
docker logs delivery-drivers-api -f
```

**Erro de conexão com banco?**
```bash
# Testar conexão
docker exec delivery-postgres psql -U postgres -d delivery_simulator -c "SELECT 1"
```

## 🔄 Atualizar Imagens

Para pegar as últimas versões do Docker Hub:
```bash
docker-compose pull
docker-compose up -d
```

## 🛠️ Build Local (Opcional)

Se preferir construir as imagens localmente:
```bash
# Usar o docker-compose-local.yml
docker-compose -f docker-compose-local.yml up --build
```

## ❓ Precisa de Ajuda?

1. Verifique se o Docker está rodando
2. Confirme que o arquivo `.env` está presente
3. Veja os logs: `docker-compose logs -f`
4. As portas 3000, 8081, 8082, 5433, 5672, 15672 devem estar livres

---

💡 **Dica**: Após iniciar, aguarde cerca de 30 segundos para todos os serviços estarem completamente prontos!