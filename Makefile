# Makefile para facilitar comandos Docker Compose do projeto Delivery

# Sobe os containers normalmente (sem rebuild)
up:
	docker-compose up

# Sobe os containers e força rebuild das imagens (use após alterações no código ou dependências)
up-build:
	docker-compose up --build

# Para e remove todos os containers do projeto
down:
	docker-compose down

# Mostra os logs de todos os containers em tempo real
logs:
	docker-compose logs -f

# Lista o status dos containers do projeto
ps:
	docker-compose ps

# Reinicia todos os containers do projeto
restart:
	docker-compose restart

# Limpa imagens, containers e volumes não utilizados (cuidado: operação destrutiva)
prune:
	docker system prune -af 