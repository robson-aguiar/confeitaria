# Script de Setup Azure para Confeitaria

$TenantId = "fe83f7ad-03ae-46b6-ad8e-2570fff43564"
$SubscriptionId = "73cd6b32-c96a-40fb-9e13-9dc55db03a3a"

# Login no Azure
Write-Host "Fazendo login no Azure..." -ForegroundColor Green
az login --tenant $TenantId

# Definir subscription
Write-Host "Definindo subscription..." -ForegroundColor Green
az account set --subscription $SubscriptionId

# Verificar conta
Write-Host "Verificando conta atual..." -ForegroundColor Green
az account show

# Criar Resource Group Confeitaria
Write-Host "Criando Resource Group Confeitaria..." -ForegroundColor Green
az group create --name Confeitaria --location brazilsouth

# Criar Storage Account para Terraform State
Write-Host "Criando Storage Account para Terraform State..." -ForegroundColor Green
az storage account create `
  --name stconfeitariatfstate `
  --resource-group Confeitaria `
  --location brazilsouth `
  --sku Standard_LRS

# Criar Container
Write-Host "Criando Container..." -ForegroundColor Green
az storage container create `
  --name tfstate `
  --account-name stconfeitariatfstate

# Criar Service Principal
Write-Host "Criando Service Principal..." -ForegroundColor Green
Write-Host "IMPORTANTE: Copie o output abaixo para o GitHub Secret AZURE_CREDENTIALS" -ForegroundColor Yellow
az ad sp create-for-rbac `
  --name "sp-confeitaria-github" `
  --role contributor `
  --scopes /subscriptions/$SubscriptionId `
  --sdk-auth

Write-Host "`nSetup concluído!" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. Copie o JSON acima para GitHub Secret: AZURE_CREDENTIALS"
Write-Host "2. Adicione os secrets no GitHub:"
Write-Host "   - TF_STATE_RG: Confeitaria"
Write-Host "   - TF_STATE_SA: stconfeitariatfstate"
Write-Host "   - TF_STATE_CONTAINER: tfstate"
