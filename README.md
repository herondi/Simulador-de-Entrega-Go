# 🚚 Delivery Manager - Sistema de Gerenciamento de Entregas

Um sistema completo de gerenciamento de entregas para múltiplas empresas (iFood, Uber Eats, etc.) com arquitetura de microsserviços, interface moderna e rastreamento em tempo real.

## 🎯 Visão Geral

O **Delivery Manager** é uma plataforma robusta que permite gerenciar entregas de forma eficiente, oferecendo:

- **Gestão de Entregadores**: Cadastro, edição e monitoramento de entregadores
- **Rastreamento em Tempo Real**: Visualização de entregas no mapa com atualizações em tempo real
- **Dashboard Analítico**: Métricas e insights sobre performance das entregas
- **Arquitetura Escalável**: Microsserviços independentes e containerizados
- **Interface Moderna**: Frontend React com design responsivo e UX otimizada

## 🏗️ Arquitetura

### Microsserviços

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Drivers API    │    │   Simulator     │
│   (React)       │◄──►│   (Go)          │◄──►│   (Go)          │
│   Porta: 3000   │    │   Porta: 8081   │    │   Porta: 8082   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────────────────────────┐
                       │           RabbitMQ                  │
                       │        Message Broker               │
                       │         Porta: 5672                 │
                       └─────────────────────────────────────┘
```

### Tecnologias Utilizadas

| Componente | Tecnologia | Versão |
|------------|------------|--------|
| Frontend | React.js | 18.2.0 |
| Drivers API | Go | 1.21.3 |
| Simulator | Go | 1.21.3 |
| Message Broker | RabbitMQ | 3.x |
| Containerização | Docker | Latest |
| Orquestração | Docker Compose | 3.8 |
| Maps | Google Maps API | Latest |

## 🚀 Instalação e Configuração

### Pré-requisitos

- Docker e Docker Compose
- Node.js 16+ (para desenvolvimento local)
- Go 1.21+ (para desenvolvimento local)
- Google Maps API Key

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd Simulador-de-Entrega-Go
```

### 2. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Google Maps API
REACT_APP_GOOGLE_MAPS_API_KEY=sua_api_key_aqui

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
APP_PORT=8081
APP_ENV=development
```

### 3. Execução com Docker

```bash
# Na pasta do simulador
cd SIMULATOR/drivers/simulator

# Construir e executar todos os serviços
docker-compose up --build
```

### 4. Acessos

- **Frontend**: http://localhost:3000
- **Drivers API**: http://localhost:8081
- **RabbitMQ Management**: http://localhost:15672
  - Usuário: `admin`
  - Senha: `admin`

## 📱 Funcionalidades

### Dashboard
- Visão geral das métricas de entrega
- Cards com estatísticas em tempo real
- Lista de entregas recentes
- Ações rápidas para gerenciamento

### Gestão de Entregadores
- Lista completa de entregadores
- Busca e filtros
- Adicionar, editar e remover entregadores
- Visualização de status e informações

### Mapa de Entregas
- Integração com Google Maps
- Rastreamento em tempo real
- Visualização de rotas
- Overlay com informações de entrega

## 🔧 Desenvolvimento Local

### Frontend (React)

```bash
cd SIMULATOR/drivers/simulator/frontend
npm install
npm start
```

### Drivers API (Go)

```bash
cd SIMULATOR/drivers
go mod download
go run main.go
```

### Simulator (Go)

```bash
cd SIMULATOR/drivers/simulator
go mod download
go run main.go
```

## 📊 API Endpoints

### Drivers API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/drivers` | Lista todos os entregadores |
| GET | `/drivers/{uuid}` | Busca entregador por UUID |

### Exemplo de Resposta

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

## 🗺️ Integração com Google Maps

### Configuração

1. Obtenha uma API Key no [Google Cloud Console](https://console.cloud.google.com/)
2. Ative as APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
3. Configure a variável `REACT_APP_GOOGLE_MAPS_API_KEY`

### Funcionalidades do Mapa

- Visualização de entregadores em tempo real
- Rotas otimizadas
- Marcadores personalizados
- Geolocalização

## 🐳 Containerização

### Estrutura Docker

```
services:
  rabbitmq:        # Message Broker
  drivers-api:     # API de Entregadores
  simulator:       # Simulador de Entregas
  frontend:        # Interface React
```

### Comandos Úteis

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Reiniciar um serviço específico
docker-compose restart drivers-api

# Parar todos os serviços
docker-compose down

# Limpar volumes
docker-compose down -v
```

## 🧪 Testes

### Executar Testes Frontend

```bash
cd frontend
npm test
```

### Executar Testes Go

```bash
cd drivers
go test ./...

cd simulator
go test ./...
```

## 📈 Monitoramento

### RabbitMQ Management

Acesse http://localhost:15672 para monitorar:
- Filas e mensagens
- Conexões ativas
- Performance do broker

### Logs dos Serviços

```bash
# Logs do frontend
docker-compose logs frontend

# Logs da API
docker-compose logs drivers-api

# Logs do simulador
docker-compose logs simulator
```

## 🔒 Segurança

### Boas Práticas Implementadas

- Validação de inputs
- Sanitização de dados
- Rate limiting (configurável)
- CORS configurado
- Variáveis de ambiente para dados sensíveis

### Configurações de Segurança

```env
# Configurações de segurança
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT=100
JWT_SECRET=your_jwt_secret_here
```

## 🚀 Deploy em Produção

### GCP (Google Cloud Platform)

1. Configure o Google Cloud SDK
2. Ative as APIs necessárias
3. Configure o Kubernetes cluster
4. Deploy usando os manifests fornecidos

### AWS

1. Configure o ECS ou EKS
2. Configure o RDS para banco de dados
3. Configure o ElastiCache para Redis
4. Deploy usando Terraform ou CloudFormation

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: suporte@deliverymanager.com
- **Documentação**: [docs.deliverymanager.com](https://docs.deliverymanager.com)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/delivery-manager/issues)

## 🔄 Roadmap

### Versão 2.0
- [ ] Autenticação e autorização
- [ ] Notificações push
- [ ] Relatórios avançados
- [ ] Integração com mais plataformas
- [ ] Mobile app

### Versão 3.0
- [ ] IA para otimização de rotas
- [ ] Analytics preditivo
- [ ] Integração com IoT
- [ ] Blockchain para transparência

---

**Desenvolvido com ❤️ para revolucionar o mercado de entregas**
