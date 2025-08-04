# Etapa 1: Build do React
FROM node:18 AS build
WORKDIR /app

# Argumentos de build para variáveis de ambiente
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_GOOGLE_MAPS_API_KEY=${REACT_APP_GOOGLE_MAPS_API_KEY}

# Copiar arquivos de dependências e instalar
COPY package.json ./
RUN npm install --no-package-lock

# Copiar código fonte e fazer build
COPY . .
RUN npm run build

# Etapa 2: Nginx para servir o build
FROM nginx:alpine

# Copiar arquivo de build do React
COPY --from=build /app/build /usr/share/nginx/html

# Configurar nginx para SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 