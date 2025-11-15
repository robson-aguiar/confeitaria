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

# Azure Front Door Profile (substitui CDN clássico)
resource "azurerm_cdn_frontdoor_profile" "cdn" {
  name                = "fd-veralucia-confeitaria"
  resource_group_name = azurerm_resource_group.rg.name
  sku_name           = "Standard_AzureFrontDoor"
  tags               = var.tags
}

# Front Door Endpoint
resource "azurerm_cdn_frontdoor_endpoint" "cdn_endpoint" {
  name                     = "veralucia-confeitaria"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.cdn.id
  enabled                  = true
}

# Origin Group
resource "azurerm_cdn_frontdoor_origin_group" "origin_group" {
  name                     = "app-service-origin-group"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.cdn.id
  
  load_balancing {
    sample_size                 = 4
    successful_samples_required = 3
  }
  
  health_probe {
    path                = "/"
    request_type        = "HEAD"
    protocol            = "Https"
    interval_in_seconds = 100
  }
}

# Origin
resource "azurerm_cdn_frontdoor_origin" "origin" {
  name                          = "app-service-origin"
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.origin_group.id
  enabled                       = true
  
  certificate_name_check_enabled = true
  host_name                      = azurerm_linux_web_app.app.default_hostname
  http_port                      = 80
  https_port                     = 443
  origin_host_header            = azurerm_linux_web_app.app.default_hostname
  priority                      = 1
  weight                        = 1000
}

# Front Door Route
resource "azurerm_cdn_frontdoor_route" "route" {
  name                          = "default-route"
  cdn_frontdoor_endpoint_id     = azurerm_cdn_frontdoor_endpoint.cdn_endpoint.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.origin_group.id
  enabled                       = true
  
  forwarding_protocol    = "HttpsOnly"
  https_redirect_enabled = true
  patterns_to_match      = ["/*"]
  supported_protocols    = ["Http", "Https"]
  
  cdn_frontdoor_origin_ids = [azurerm_cdn_frontdoor_origin.origin.id]
  link_to_default_domain   = true
  
  cache {
    query_string_caching_behavior = "IgnoreQueryString"
    query_strings                 = []
    compression_enabled           = true
    content_types_to_compress     = [
      "text/html",
      "text/css",
      "text/javascript",
      "application/javascript",
      "application/json",
      "image/svg+xml"
    ]
  }
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


