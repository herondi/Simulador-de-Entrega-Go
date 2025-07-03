# 🗄️ Como Acessar o Banco de Dados Visualmente

## 📊 Opção 1: pgAdmin (Você já tem instalado!)

### ✅ Vantagens:
- Interface desktop completa
- Mais recursos e ferramentas
- Já está instalado no seu PC

### 🔧 Como conectar:
1. **Abra o pgAdmin 16** (procure no menu Iniciar)
2. **Clique com botão direito** em "Servers" → "Register" → "Server"
3. **Configure:**
   ```
   Aba General:
   - Name: Delivery Docker
   
   Aba Connection:
   - Host: localhost
   - Port: 5433  ⚠️ (NÃO é 5432!)
   - Database: delivery_simulator
   - Username: postgres
   - Password: Bystronic30@
   ```
4. **Clique em "Save"**

### 🚀 Atalho:
```batch
database-manager.bat
# Escolha opção 1
```

---

## 🌐 Opção 2: Adminer (Interface Web)

### ✅ Vantagens:
- Abre no navegador
- Leve e rápido
- Não precisa instalar nada

### 🔧 Como usar:

#### Método Rápido:
```batch
database-manager.bat
# Escolha opção 2
```

#### Método Manual:
1. **Adicione ao `docker-compose.yml`:**
```yaml
  adminer:
    image: adminer:latest
    container_name: delivery-adminer
    ports:
      - "8080:8080"
    networks:
      - delivery-network
```

2. **Execute:**
```batch
docker-compose up -d adminer
```

3. **Acesse:** http://localhost:8080

4. **Preencha:**
   - Sistema: `PostgreSQL`
   - Servidor: `postgres`
   - Usuário: `postgres`
   - Senha: `Bystronic30@`
   - Base de dados: `delivery_simulator`

---

## 🖥️ Opção 3: Terminal (Linha de Comando)

### Para desenvolvedores que preferem CLI:
```batch
docker exec -it delivery-postgres psql -U postgres -d delivery_simulator
```

### Comandos úteis no psql:
```sql
\dt              -- Listar tabelas
\d+ drivers      -- Detalhes da tabela drivers
SELECT * FROM drivers;  -- Ver dados
\q               -- Sair
```

---

## 📝 Resumo das URLs

| Serviço | URL | Tipo | Login |
|---------|-----|------|-------|
| **Frontend** | http://localhost:3000 | Web | - |
| **RabbitMQ** | http://localhost:15672 | Web | admin/admin |
| **API** | http://localhost:8081 | Web | - |
| **Adminer** | http://localhost:8080 | Web | postgres/Bystronic30@ |
| **pgAdmin** | Aplicativo Desktop | Desktop | postgres/Bystronic30@ |

---

## 🎯 Qual Usar?

- **pgAdmin**: Para trabalho profissional completo
- **Adminer**: Para acesso rápido e visualização
- **Terminal**: Para scripts e automação

---

## 💡 Dica Pro

Execute este comando para ter TODAS as opções:
```batch
database-manager.bat
```

Este script oferece:
1. Abrir pgAdmin
2. Iniciar Adminer
3. Acessar via terminal
4. Fazer backup
5. Restaurar backup
6. Ver informações de conexão