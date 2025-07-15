# 🗺️ Como Configurar Google Maps API

## 🔑 Passo a Passo para Obter API Key

### 1. Acesse o Google Cloud Console
- Vá para: https://console.cloud.google.com/
- Faça login com sua conta Google

### 2. Crie ou Selecione um Projeto
- Clique em "Selecionar projeto" no topo
- Clique em "NOVO PROJETO"
- Nome: "Delivery-Maps" (ou outro nome)
- Clique em "CRIAR"

### 3. Ative as APIs Necessárias
No menu lateral, vá em **APIs e serviços > Biblioteca**

Ative estas APIs:
- ✅ **Maps JavaScript API**
- ✅ **Places API** 
- ✅ **Directions API**
- ✅ **Geocoding API**

Para cada uma:
1. Pesquise o nome da API
2. Clique na API
3. Clique em "ATIVAR"

### 4. Crie a API Key
1. Vá em **APIs e serviços > Credenciais**
2. Clique em **+ CRIAR CREDENCIAIS**
3. Selecione **Chave de API**
4. Copie a chave gerada

### 5. Configure Restrições (Recomendado)
1. Clique na API Key criada
2. Em **Restrições de aplicativo**:
   - Selecione "Referenciadores HTTP (sites da Web)"
   - Adicione: `http://localhost:3000/*`
3. Em **Restrições de API**:
   - Selecione "Restringir chave"
   - Marque as APIs ativadas acima
4. Clique em **SALVAR**

### 6. Atualize o arquivo .env
```env
# Substitua YOUR_API_KEY_HERE pela chave copiada
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyC4BvZrJ7J8Q5h5Z5sCk8Q9ZbE4M9K5A1B
```

### 7. Reinicie o Container
```bash
docker-compose restart delivery-frontend
```

## 🎯 Teste a Configuração

Após configurar:
1. Acesse: http://localhost:3000
2. Vá em "Mapa de Entregas"
3. O mapa deve carregar mostrando São Paulo
4. Você deve ver pins e sobreposição de entregas

## ⚠️ Problemas Comuns

### Erro: "This API project is not authorized"
- Verifique se as APIs estão ativadas
- Confirme que a API key está correta

### Erro: "RefererNotAllowedMapError"
- Adicione `http://localhost:3000/*` nas restrições
- Ou remova as restrições temporariamente para teste

### Mapa não carrega
- Abra F12 > Console no navegador
- Verifique erros relacionados ao Google Maps
- Confirme que a variável de ambiente está sendo lida

## 💡 Dicas

1. **Para desenvolvimento**: Use uma API key sem restrições inicialmente
2. **Para produção**: Sempre configure restrições adequadas
3. **Monitoramento**: Configure cotas e alertas no Google Cloud
4. **Backup**: Mantenha uma segunda API key como backup

## 🔗 Links Úteis

- [Google Cloud Console](https://console.cloud.google.com/)
- [Documentação Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Preços Google Maps](https://cloud.google.com/maps-platform/pricing)