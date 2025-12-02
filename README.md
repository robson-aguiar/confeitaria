# Vera Lúcia Confeitaria 🎂

Site institucional da Vera Lúcia Confeitaria com configuradores de bolos personalizados.

## 🚀 Funcionalidades

- **Configurador de Bolos Decorados**: 17 massas, 33 recheios, 4 coberturas, até 4 cores
- **Configurador de Bolos Caseirinhos**: 11 sabores, 6 coberturas
- **Calculadora de Bolo**: Estima peso ideal baseado no número de convidados
- **Sistema de Carrinho**: Adicione múltiplos produtos antes de enviar para WhatsApp
- **Galeria**: 55 fotos dos trabalhos realizados
- **Design Minimalista**: Inspirado no design da Apple

## 📋 Pré-requisitos

- Azure Subscription
- Terraform instalado
- Azure CLI instalado
- Git instalado

## 🏗️ Infraestrutura

A infraestrutura é gerenciada via Terraform e inclui:

- **Resource Group**: rg-confeitaria-prod
- **App Service Plan**: asp-confeitaria-prod (B1)
- **App Service**: app-veralucia-confeitaria

### Estrutura de Arquivos

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline CI/CD
├── terraform/
│   ├── main.tf                 # Recursos principais
│   ├── variables.tf            # Variáveis
│   ├── outputs.tf              # Outputs
│   └── terraform.tfvars        # Valores das variáveis
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/                     # 55 imagens
├── index.html
├── web.config                  # Configuração App Service
└── README.md
```

## 🔧 Setup Inicial

### 1. Criar Storage Account para Terraform State

```bash
# Criar Resource Group
az group create --name rg-terraform-state --location brazilsouth

# Criar Storage Account
az storage account create \
  --name stterraformstate001 \
  --resource-group rg-terraform-state \
  --location brazilsouth \
  --sku Standard_LRS

# Criar Container
az storage container create \
  --name tfstate \
  --account-name stterraformstate001
```

### 2. Criar Service Principal

```bash
az ad sp create-for-rbac \
  --name "sp-confeitaria-github" \
  --role contributor \
  --scopes /subscriptions/{SUBSCRIPTION_ID} \
  --sdk-auth
```

### 3. Configurar GitHub Secrets

No repositório GitHub, adicione os seguintes secrets:

- `AZURE_CREDENTIALS`: Output do comando acima
- `TF_STATE_RG`: rg-terraform-state
- `TF_STATE_SA`: stterraformstate001
- `TF_STATE_CONTAINER`: tfstate

## 🚀 Deploy

### Deploy Manual via Terraform

```bash
cd terraform

# Inicializar
terraform init \
  -backend-config="resource_group_name=rg-terraform-state" \
  -backend-config="storage_account_name=stterraformstate001" \
  -backend-config="container_name=tfstate" \
  -backend-config="key=confeitaria.tfstate"

# Planejar
terraform plan

# Aplicar
terraform apply
```

### Deploy Automático via GitHub Actions

1. Faça commit das alterações
2. Push para branch `main`
3. O pipeline será executado automaticamente

```bash
git add .
git commit -m "Deploy inicial"
git push origin main
```

## 📊 Monitoramento

Acesse o App Service no portal Azure:
- URL: https://app-veralucia-confeitaria.azurewebsites.net
- Logs: Application Insights (se configurado)
- Métricas: CPU, Memória, Requests

## 💰 Custos Estimados

- **App Service Plan B1**: ~R$ 50/mês
- **Storage Account**: ~R$ 1/mês
- **Total**: ~R$ 51/mês

## 🔄 Atualizações

Para atualizar o site:

1. Modifique os arquivos HTML/CSS/JS
2. Commit e push para `main`
3. GitHub Actions fará deploy automaticamente

## 📞 Contato

WhatsApp: (19) 97130-7912

## 📝 Licença

© 2025 Vera Lúcia Confeitaria. Todos os direitos reservados.
