# 📚 Documentação Técnica - Delivery Manager

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Componentes](#componentes)
4. [APIs](#apis)
5. [Frontend](#frontend)
6. [Deploy e Infraestrutura](#deploy-e-infraestrutura)
7. [Monitoramento](#monitoramento)
8. [Segurança](#segurança)
9. [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O **Delivery Manager** é um sistema de gerenciamento de entregas multi-empresa que utiliza arquitetura de microsserviços para oferecer escalabilidade, confiabilidade e performance.

### Objetivos do Sistema

- **Gestão Centralizada**: Controle unificado de entregas para múltiplas empresas
- **Rastreamento em Tempo Real**: Monitoramento de entregadores e pedidos
- **Escalabilidade**: Arquitetura que suporta crescimento
- **Confiabilidade**: Sistema resiliente com fallbacks
- **Performance**: Resposta rápida e eficiente

## 🏗️ Arquitetura do Sistema

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (Port 3000)                                    │
│  - Dashboard                                                   │
│  - Drivers Management                                          │
│  - Delivery Map                                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  Drivers API (Port 8081)                                       │
│  - RESTful endpoints                                           │
│  - Data validation                                             │
│  - Rate limiting                                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MESSAGE BROKER LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  RabbitMQ (Port 5672)                                          │
│  - Order processing                                            │
│  - Delivery updates                                            │
│  - Event streaming                                             │
└─────────────────────────────────────────────────────────────────┤
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  Simulator Service (Port 8082)                                 │
│  - Delivery simulation                                         │
│  - Route calculation                                           │
│  - Status updates                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Cliente** → Frontend React
2. **Frontend** → Drivers API (REST)
3. **Drivers API** → RabbitMQ (Mensagens)
4. **Simulator** ← RabbitMQ (Consumo)
5. **Simulator** → RabbitMQ (Atualizações)
6. **Frontend** ← WebSocket (Tempo Real)

## 🔧 Componentes

### 1. Drivers API (Go)

**Localização**: `SIMULATOR/drivers/`

**Responsabilidades**:
- Gerenciamento de entregadores
- Endpoints REST
- Validação de dados
- Persistência local

**Estrutura**:
```
drivers/
├── main.go          # Entry point
├── go.mod           # Dependencies
├── go.sum           # Checksums
└── data.json        # Mock data
```

**Endpoints**:
- `GET /drivers` - Lista todos os entregadores
- `GET /drivers/{uuid}` - Busca entregador específico

### 2. Simulator Service (Go)

**Localização**: `SIMULATOR/drivers/simulator/`

**Responsabilidades**:
- Simulação de entregas
- Processamento de mensagens
- Atualizações de status
- Cálculo de rotas

**Estrutura**:
```
simulator/
├── main.go              # Entry point
├── go.mod               # Dependencies
├── entity/              # Data models
│   └── entity.go
├── queue/               # RabbitMQ integration
│   └── queue.go
├── destinations/        # Route files
│   ├── airport.txt
│   └── centro.txt
├── docker-compose.yml   # Container orchestration
└── config.env          # Environment variables
```

### 3. Frontend (React)

**Localização**: `SIMULATOR/drivers/simulator/frontend/`

**Responsabilidades**:
- Interface do usuário
- Visualização de dados
- Interação com APIs
- Integração com mapas

**Estrutura**:
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.js
│   │   └── Sidebar.js
│   ├── pages/          # Page components
│   │   ├── Dashboard.js
│   │   ├── DriversList.js
│   │   └── DeliveryMap.js
│   ├── styles/         # Global styles
│   │   └── GlobalStyles.js
│   ├── App.js          # Main component
│   └── index.js        # Entry point
├── package.json        # Dependencies
└── README.md          # Frontend docs
```

## 📡 APIs

### Drivers API

**Base URL**: `http://localhost:8081`

#### Endpoints

##### GET /drivers
Lista todos os entregadores cadastrados.

**Response**:
```json
{
  "drivers": [
    {
      "uuid": "2297e388-8866-45e5-8761-0924f7819f90",
      "name": "João Silva",
      "email": "joao@example.com"
    }
  ]
}
```

##### GET /drivers/{uuid}
Busca um entregador específico por UUID.

**Parameters**:
- `uuid` (string, required): UUID do entregador

**Response**:
```json
{
  "uuid": "2297e388-8866-45e5-8761-0924f7819f90",
  "name": "João Silva",
  "email": "joao@example.com"
}
```

**Error Response**:
```json
{
  "error": "Não encontrado"
}
```

### Simulator API

**Base URL**: `http://localhost:8082`

#### Message Queue

**Consumer Queue**: `orders`
**Publisher Exchange**: `amq.topic`
**Routing Key**: `delivery.updates`

#### Message Format

**Order Message**:
```json
{
  "order": "order-uuid-123",
  "destination": "airport"
}
```

**Delivery Update**:
```json
{
  "order": "order-uuid-123",
  "lat": "-23.5505",
  "lng": "-46.6333"
}
```

## 🎨 Frontend

### Tecnologias

- **React 18.2.0**: Framework principal
- **Styled Components**: Estilização
- **Framer Motion**: Animações
- **React Router**: Navegação
- **Axios**: HTTP client
- **Google Maps API**: Mapas

### Componentes Principais

#### Header
- Logo e branding
- Indicador de status do sistema
- Ações rápidas (notificações, configurações, perfil)

#### Sidebar
- Navegação principal
- Menu de funcionalidades
- Botão de logout

#### Dashboard
- Cards de estatísticas
- Lista de entregas recentes
- Ações rápidas

#### DriversList
- Lista de entregadores
- Busca e filtros
- Ações de CRUD

#### DeliveryMap
- Integração com Google Maps
- Visualização de entregas
- Overlay com informações

### Estilização

**Design System**:
- Cores: Gradiente roxo/azul (#667eea → #764ba2)
- Tipografia: Inter (Google Fonts)
- Espaçamento: Sistema de 8px
- Bordas: 12px (cards), 16px (containers)

**Responsividade**:
- Mobile-first approach
- Breakpoints: 768px, 1024px, 1440px
- Grid system flexível

## 🚀 Deploy e Infraestrutura

### Docker

**Dockerfile.drivers**:
```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY main.go data.json ./
RUN CGO_ENABLED=0 GOOS=linux go build -o drivers-api .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/drivers-api .
COPY --from=builder /app/data.json .
EXPOSE 8081
CMD ["./drivers-api"]
```

**Dockerfile.simulator**:
```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o simulator .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/simulator .
COPY --from=builder /app/destinations/ ./destinations/
COPY --from=builder /app/config.env .env
EXPOSE 8082
CMD ["./simulator"]
```

### Docker Compose

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  rabbitmq:
    image: rabbitmq:3-management
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
    ports:
      - "15672:15672"
      - "5672:5672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      timeout: 10s
      retries: 5

  drivers-api:
    build:
      context: ../
      dockerfile: Dockerfile.drivers
    ports:
      - "8081:8081"
    volumes:
      - ../data.json:/app/data.json
    depends_on:
      rabbitmq:
        condition: service_healthy

  simulator:
    build:
      context: ./
      dockerfile: Dockerfile.simulator
    environment:
      - RABBITMQ_DEFAULT_HOST=rabbitmq
    volumes:
      - ./destinations:/app/destinations
    depends_on:
      rabbitmq:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - drivers-api
      - simulator

volumes:
  rabbitmq_data:

networks:
  delivery-network:
    driver: bridge
```

### Variáveis de Ambiente

**config.env**:
```env
# RabbitMQ Configuration
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=admin
RABBITMQ_DEFAULT_HOST=localhost
RABBITMQ_DEFAULT_PORT=5672
RABBITMQ_DEFAULT_VHOST=/

# Queue Configuration
RABBITMQ_CONSUMER_QUEUE=orders
RABBITMQ_DESTINATION=amq.topic
RABBITMQ_DESTINATION_ROUTING_KEY=delivery.updates

# Application Configuration
APP_PORT=8082
APP_ENV=development
```

## 📊 Monitoramento

### Health Checks

**Drivers API**:
```bash
curl http://localhost:8081/health
```

**Simulator**:
```bash
curl http://localhost:8082/health
```

### Logs

**Docker Compose**:
```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f drivers-api
```

**RabbitMQ Management**:
- URL: http://localhost:15672
- Usuário: admin
- Senha: admin

### Métricas

**RabbitMQ**:
- Filas ativas
- Taxa de mensagens
- Conexões
- Performance

**Aplicação**:
- Requests por segundo
- Tempo de resposta
- Taxa de erro
- Uso de memória

## 🔒 Segurança

### Implementações

1. **Validação de Inputs**
   - Sanitização de dados
   - Validação de tipos
   - Prevenção de injection

2. **Rate Limiting**
   - Limite por IP
   - Limite por endpoint
   - Configurável

3. **CORS**
   - Configuração específica
   - Headers seguros
   - Métodos permitidos

4. **Variáveis de Ambiente**
   - Dados sensíveis
   - Configurações
   - Secrets

### Configurações de Segurança

```env
# CORS
CORS_ORIGIN=http://localhost:3000
CORS_METHODS=GET,POST,PUT,DELETE
CORS_HEADERS=Content-Type,Authorization

# Rate Limiting
RATE_LIMIT=100
RATE_LIMIT_WINDOW=1m

# Security Headers
SECURITY_HEADERS=true
XSS_PROTECTION=true
CONTENT_TYPE_NOSNIFF=true
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. RabbitMQ não conecta

**Sintomas**:
- Erro de conexão no simulador
- Mensagens não processadas

**Solução**:
```bash
# Verificar se o RabbitMQ está rodando
docker-compose ps rabbitmq

# Reiniciar o serviço
docker-compose restart rabbitmq

# Verificar logs
docker-compose logs rabbitmq
```

#### 2. Frontend não carrega

**Sintomas**:
- Página em branco
- Erros no console

**Solução**:
```bash
# Verificar se a API está respondendo
curl http://localhost:8081/drivers

# Verificar logs do frontend
docker-compose logs frontend

# Rebuild do container
docker-compose build frontend
```

#### 3. Google Maps não carrega

**Sintomas**:
- Mapa não aparece
- Erro de API key

**Solução**:
1. Verificar se a API key está configurada
2. Verificar se as APIs estão ativadas no Google Cloud
3. Verificar limites de quota

#### 4. Simulador não processa mensagens

**Sintomas**:
- Entregas não aparecem no mapa
- Logs vazios

**Solução**:
```bash
# Verificar conexão com RabbitMQ
docker-compose exec simulator ping rabbitmq

# Verificar filas
curl -u admin:admin http://localhost:15672/api/queues

# Reiniciar simulador
docker-compose restart simulator
```

### Logs Úteis

**Drivers API**:
```bash
docker-compose logs drivers-api | grep ERROR
```

**Simulator**:
```bash
docker-compose logs simulator | grep "Message Sent"
```

**RabbitMQ**:
```bash
docker-compose logs rabbitmq | grep "started"
```

### Performance

**Otimizações**:
1. **Caching**: Implementar Redis para cache
2. **Database**: Migrar para PostgreSQL
3. **Load Balancing**: Adicionar nginx
4. **Monitoring**: Implementar Prometheus + Grafana

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0.0
**Autor**: Equipe Delivery Manager

## 🛠️ Makefile comentado
Cada comando do Makefile está documentado em português, explicando para que serve e quando usar.

## 📦 Documentação: Como subir o projeto para o Docker Hub

Incluído no arquivo `DOCUMENTATION.md`:
- Passo a passo para buildar, taguear e publicar cada serviço no Docker Hub.
- Como ajustar o `docker-compose.yml` para usar as imagens do Hub.
- Como rodar o projeto em qualquer servidor apenas com `docker-compose up -d`.
- Dicas de segurança e automação.
- Diagrama visual do fluxo de uso dos comandos Docker Compose.

### Exemplo de uso do Makefile:
```sh
make up         # Sobe containers normalmente
make up-build   # Sobe e rebuilda imagens (após alterações)
make down       # Para tudo
make logs       # Ver logs em tempo real
make ps         # Status dos containers
make restart    # Reinicia containers
make prune      # Limpa tudo não usado (cuidado!)
```

---

Se quiser, posso gerar um exemplo de `docker-compose.yml` já pronto para uso com imagens do Docker Hub, ou um exemplo de pipeline CI/CD para automação do build/push.  
Se precisar de mais algum ajuste ou explicação, só pedir! 