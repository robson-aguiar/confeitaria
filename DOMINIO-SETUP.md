# Configuração Domínio Próprio - Vera Lúcia Confeitaria

## Passo 1: Comprar Domínio no Registro.br

### 1.1 Acessar Registro.br
- Acesse: https://registro.br
- Clique em "Registre seu domínio"

### 1.2 Buscar Disponibilidade
- Digite: `veraluciaconfeitaria.com.br`
- Clique em "Buscar"
- Verifique se está disponível

### 1.3 Sugestões Alternativas (caso não esteja disponível)
- `veralucia.com.br`
- `confeitariaveralu.com.br`
- `veraluciaconfeitaria.net.br`

### 1.4 Finalizar Compra
- Adicione ao carrinho
- Preencha seus dados (CPF/CNPJ)
- **Custo**: R$ 40,00/ano
- Forma de pagamento: PIX, Boleto ou Cartão
- Finalize a compra

### 1.5 Aguardar Confirmação
- Você receberá um email de confirmação
- O domínio estará ativo em até 24 horas

---

## Passo 2: Configurar Cloudflare

### 2.1 Adicionar Domínio no Cloudflare
1. Acesse: https://dash.cloudflare.com
2. Clique em "Add a Site"
3. Digite: `veraluciaconfeitaria.com.br` (seu domínio comprado)
4. Escolha plano: **Free**
5. Clique em "Continue"

### 2.2 Copiar Nameservers
Cloudflare fornecerá 2 nameservers, algo como:
```
ns1.cloudflare.com
ns2.cloudflare.com
```
**IMPORTANTE**: Anote esses nameservers!

### 2.3 Configurar DNS no Cloudflare
Adicione os seguintes registros DNS:

**Registro A (principal)**
- Type: `A`
- Name: `@`
- IPv4: `Obter do Azure` (veja Passo 3.2)
- Proxy status: ✅ Proxied (nuvem laranja)

**Registro CNAME (www)**
- Type: `CNAME`
- Name: `www`
- Target: `veraluciaconfeitaria.com.br`
- Proxy status: ✅ Proxied (nuvem laranja)

---

## Passo 3: Configurar Azure

### 3.1 Obter IP do App Service
Execute no terminal:
```bash
az webapp show --name veralucia-confeitaria --resource-group Confeitaria --query "outboundIpAddresses" --output tsv
```

Ou acesse o Portal Azure:
1. Vá em App Services > veralucia-confeitaria
2. Em "Settings" > "Properties"
3. Copie o "Outbound IP addresses" (primeiro IP da lista)

### 3.2 Adicionar Domínio Customizado no Terraform

Edite `terraform/terraform.tfvars`:
```hcl
resource_group_name   = "Confeitaria"
app_service_name      = "veralucia-confeitaria"
app_service_plan_name = "asp-confeitaria"
location              = "brazilsouth"
sku_name              = "B1"
always_on             = true
custom_domain         = "veraluciaconfeitaria.com.br"
```

### 3.3 Aplicar Terraform
```bash
cd terraform
terraform plan
terraform apply
```

---

## Passo 4: Atualizar Nameservers no Registro.br

### 4.1 Acessar Painel Registro.br
1. Acesse: https://registro.br
2. Faça login com sua conta
3. Clique em "Meus Domínios"
4. Selecione `veraluciaconfeitaria.com.br`

### 4.2 Alterar Nameservers
1. Clique em "Alterar Servidores DNS"
2. Escolha "Usar outros servidores DNS"
3. Adicione os nameservers do Cloudflare:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
4. Salve as alterações

### 4.3 Aguardar Propagação
- Propagação DNS: 2-48 horas (geralmente 2-4 horas)
- Você pode verificar em: https://dnschecker.org

---

## Passo 5: Configurar SSL no Cloudflare

### 5.1 SSL/TLS Settings
1. No Cloudflare, vá em "SSL/TLS"
2. Escolha: **Full (strict)**
3. Ative:
   - ✅ Always Use HTTPS
   - ✅ Automatic HTTPS Rewrites
   - ✅ Opportunistic Encryption

### 5.2 Edge Certificates
1. Vá em "SSL/TLS" > "Edge Certificates"
2. Ative:
   - ✅ Always Use HTTPS
   - ✅ TLS 1.3
   - ✅ Automatic HTTPS Rewrites

---

## Passo 6: Otimizações Cloudflare

### 6.1 Speed > Optimization
- ✅ Auto Minify: HTML, CSS, JavaScript
- ✅ Brotli
- ✅ Early Hints
- ✅ Rocket Loader

### 6.2 Caching > Configuration
- ✅ Caching Level: Standard
- ✅ Browser Cache TTL: 4 hours

### 6.3 Caching > Cache Rules
Criar regra para imagens:
```
If: URI Path matches "/images/*"
Then:
- Cache Level: Cache Everything
- Edge TTL: 1 month
- Browser TTL: 1 day
```

### 6.4 Speed > Polish (Otimização de Imagens)
- ✅ Polish: Lossless
- ✅ WebP

---

## Passo 7: Verificar Funcionamento

### 7.1 Testar Domínio
Após propagação DNS, acesse:
- https://veraluciaconfeitaria.com.br
- https://www.veraluciaconfeitaria.com.br

### 7.2 Verificar SSL
- Deve mostrar cadeado verde no navegador
- Certificado emitido por Cloudflare

### 7.3 Verificar CDN
1. Abra DevTools (F12) > Network
2. Recarregue a página
3. Clique em uma imagem
4. Verifique headers:
   - `cf-cache-status: HIT` ✅
   - `cf-ray: xxxxx` ✅

---

## Resumo de Custos

| Item | Custo |
|------|-------|
| Domínio .com.br (Registro.br) | R$ 40/ano |
| Cloudflare CDN | R$ 0 (Free) |
| Azure App Service B1 | ~R$ 50/mês |
| **TOTAL** | **R$ 40/ano + R$ 50/mês** |

---

## Suporte

### Registro.br
- Site: https://registro.br
- Suporte: https://registro.br/suporte

### Cloudflare
- Dashboard: https://dash.cloudflare.com
- Docs: https://developers.cloudflare.com
- Community: https://community.cloudflare.com

### Azure
- Portal: https://portal.azure.com
- Docs: https://docs.microsoft.com/azure

---

## Troubleshooting

### Domínio não resolve
- Verifique se os nameservers foram alterados no Registro.br
- Aguarde até 48h para propagação DNS
- Teste em: https://dnschecker.org

### SSL não funciona
- Verifique se SSL/TLS está em "Full (strict)" no Cloudflare
- Aguarde até 24h para emissão do certificado
- Limpe cache do navegador

### Site não carrega
- Verifique se o domínio foi adicionado no Azure
- Verifique se o Terraform foi aplicado
- Verifique logs no Azure Portal
