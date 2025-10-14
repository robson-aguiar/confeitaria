# Certificado SSL

## 🔒 Certificado Padrão (Incluído)

O App Service já vem com **certificado SSL gratuito** para:
- `https://app-veralucia-confeitaria.azurewebsites.net`

✅ **HTTPS habilitado automaticamente**
✅ **TLS 1.2 mínimo**
✅ **Renovação automática**

## 🌐 Domínio Customizado (Opcional)

Se você comprar um domínio (ex: `veraluciaconfeitaria.com.br`):

### 1. Configurar DNS
Adicione um registro CNAME no seu provedor de DNS:
```
CNAME: www
Valor: app-veralucia-confeitaria.azurewebsites.net
```

### 2. Atualizar Terraform
Edite `terraform/terraform.tfvars`:
```hcl
custom_domain = "www.veraluciaconfeitaria.com.br"
```

### 3. Deploy
```bash
git add terraform/terraform.tfvars
git commit -m "Add custom domain"
git push
```

O Terraform vai:
- ✅ Adicionar o domínio customizado
- ✅ Criar certificado SSL gerenciado gratuito
- ✅ Configurar binding SSL automático
- ✅ Renovar certificado automaticamente

## 💰 Custos

- **Certificado azurewebsites.net**: Grátis ✅
- **Certificado domínio customizado**: Grátis ✅
- **Domínio**: ~R$ 40/ano (Registro.br)

## 📝 Provedores de Domínio Recomendados

- **Registro.br**: .com.br (R$ 40/ano)
- **GoDaddy**: .com (R$ 50/ano)
- **Hostinger**: .com (R$ 45/ano)
