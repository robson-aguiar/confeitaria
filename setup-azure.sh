#!/bin/bash

# Script de Setup Azure para Confeitaria

TENANT_ID="fe83f7ad-03ae-46b6-ad8e-2570fff43564"
SUBSCRIPTION_ID="73cd6b32-c96a-40fb-9e13-9dc55db03a3a"

# Login no Azure
echo "Fazendo login no Azure..."
az login --tenant $TENANT_ID

# Definir subscription
echo "Definindo subscription..."
az account set --subscription $SUBSCRIPTION_ID

# Verificar conta
echo "Verificando conta atual..."
az account show

# Criar Resource Group para Terraform State
echo "Criando Resource Group para Terraform State..."
az group create --name rg-terraform-state --location brazilsouth

# Criar Storage Account
echo "Criando Storage Account..."
az storage account create \
  --name stterraformstate001 \
  --resource-group rg-terraform-state \
  --location brazilsouth \
  --sku Standard_LRS

# Criar Container
echo "Criando Container..."
az storage container create \
  --name tfstate \
  --account-name stterraformstate001

# Criar Service Principal
echo "Criando Service Principal..."
echo "IMPORTANTE: Copie o output abaixo para o GitHub Secret AZURE_CREDENTIALS"
az ad sp create-for-rbac \
  --name "sp-confeitaria-github" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID \
  --sdk-auth

echo ""
echo "Setup concluído!"
echo ""
echo "Próximos passos:"
echo "1. Copie o JSON acima para GitHub Secret: AZURE_CREDENTIALS"
echo "2. Adicione os secrets no GitHub:"
echo "   - TF_STATE_RG: rg-terraform-state"
echo "   - TF_STATE_SA: stterraformstate001"
echo "   - TF_STATE_CONTAINER: tfstate"
