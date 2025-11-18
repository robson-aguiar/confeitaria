# Instagram API Setup - Vera Lúcia Confeitaria

## 📋 Passo a Passo para Configurar

### 1. Criar App no Facebook Developers
1. Acesse: https://developers.facebook.com/
2. Clique em "Meus Apps" > "Criar App"
3. Escolha "Consumidor" 
4. Nome: "Vera Lúcia Confeitaria Website"

### 2. Configurar Instagram Basic Display
1. No painel do app, adicione produto "Instagram Basic Display"
2. Em "Configurações Básicas":
   - **Valid OAuth Redirect URIs**: `https://veralucia-confeitaria.azurewebsites.net/`
   - **Deauthorize Callback URL**: `https://veralucia-confeitaria.azurewebsites.net/`
   - **Data Deletion Request URL**: `https://veralucia-confeitaria.azurewebsites.net/`

### 3. Criar Instagram Tester
1. Vá em "Funções" > "Funções"
2. Adicione a conta do Instagram da confeitaria como "Instagram Tester"
3. A conta precisa aceitar o convite

### 4. Gerar Access Token
1. Use a ferramenta: https://developers.facebook.com/docs/instagram-basic-display-api/getting-started
2. Ou execute no console do navegador:

```javascript
// Configurar credenciais (substitua pelos valores reais)
const ACCESS_TOKEN = 'seu_access_token_aqui';
const USER_ID = 'seu_user_id_aqui';

// Configurar no site
instagramAPI.configure(ACCESS_TOKEN, USER_ID);
```

### 5. Testar Integração
```javascript
// Testar no console
instagramAPI.fetchPosts().then(posts => console.log(posts));
```

## 🔧 Configuração Atual

- **Status**: Usando posts mock para desenvolvimento
- **Fallback**: Se API falhar, mostra imagens locais
- **Cache**: Posts ficam salvos por 1 hora
- **Auto-update**: Busca novos posts a cada 30 minutos

## 📱 Funcionalidades

✅ Busca automática de posts do Instagram  
✅ Cache offline para performance  
✅ Fallback com imagens locais  
✅ Auto-atualização periódica  
✅ Link direto para posts originais  
✅ Design responsivo  

## 🚨 Importante

- Access tokens do Instagram expiram em 60 dias
- Precisa renovar periodicamente
- Para produção, implementar refresh token automático
