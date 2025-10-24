terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

resource "azurerm_service_plan" "asp" {
  name                = var.app_service_plan_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = var.sku_name
  tags                = var.tags
}

resource "azurerm_linux_web_app" "app" {
  name                = var.app_service_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.asp.id
  https_only          = true
  tags                = var.tags

  site_config {
    always_on           = var.always_on
    http2_enabled       = true
    ftps_state          = "Disabled"
    minimum_tls_version = "1.2"
    
    application_stack {
      node_version = "18-lts"
    }
    
    app_command_line = "npm start"
  }

  app_settings = {
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
    "WEBSITE_NODE_DEFAULT_VERSION"   = "18-lts"
  }
}

# Azure CDN Profile
resource "azurerm_cdn_profile" "cdn" {
  name                = "cdn-veralucia-confeitaria"
  location            = "Global"
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Standard_Microsoft"
  tags                = var.tags
}

# CDN Endpoint
resource "azurerm_cdn_endpoint" "cdn_endpoint" {
  name                = "veralucia-confeitaria"
  profile_name        = azurerm_cdn_profile.cdn.name
  location            = azurerm_cdn_profile.cdn.location
  resource_group_name = azurerm_resource_group.rg.name
  
  origin {
    name      = "app-service-origin"
    host_name = azurerm_linux_web_app.app.default_hostname
  }

  delivery_rule {
    name  = "CacheImages"
    order = 1

    request_uri_condition {
      operator     = "Contains"
      match_values = ["/images/"]
    }

    cache_expiration_action {
      behavior = "Override"
      duration = "30.00:00:00"
    }
  }

  delivery_rule {
    name  = "CacheAssets"
    order = 2

    request_uri_condition {
      operator     = "Contains"
      match_values = ["/css/", "/js/", "/favicon"]
    }

    cache_expiration_action {
      behavior = "Override"
      duration = "7.00:00:00"
    }
  }

  global_delivery_rule {
    cache_expiration_action {
      behavior = "Override"
      duration = "04:00:00"
    }
  }

  tags = var.tags
}

# Certificado SSL gerenciado gratuito (quando adicionar domínio customizado)
resource "azurerm_app_service_managed_certificate" "cert" {
  count                      = var.custom_domain != "" ? 1 : 0
  custom_hostname_binding_id = azurerm_app_service_custom_hostname_binding.custom[0].id
}

resource "azurerm_app_service_custom_hostname_binding" "custom" {
  count               = var.custom_domain != "" ? 1 : 0
  hostname            = var.custom_domain
  app_service_name    = azurerm_linux_web_app.app.name
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_app_service_certificate_binding" "cert_binding" {
  count               = var.custom_domain != "" ? 1 : 0
  hostname_binding_id = azurerm_app_service_custom_hostname_binding.custom[0].id
  certificate_id      = azurerm_app_service_managed_certificate.cert[0].id
  ssl_state           = "SniEnabled"
}


