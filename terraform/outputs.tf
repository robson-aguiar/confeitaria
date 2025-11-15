output "app_service_url" {
  description = "URL do App Service"
  value       = "https://${azurerm_linux_web_app.app.default_hostname}"
}

output "app_service_name" {
  description = "Nome do App Service"
  value       = azurerm_linux_web_app.app.name
}

output "resource_group_name" {
  description = "Nome do Resource Group"
  value       = azurerm_resource_group.rg.name
}

output "frontdoor_endpoint_url" {
  description = "URL do Front Door Endpoint"
  value       = "https://${azurerm_cdn_frontdoor_endpoint.cdn_endpoint.host_name}"
}

output "frontdoor_profile_name" {
  description = "Nome do Front Door Profile"
  value       = azurerm_cdn_frontdoor_profile.cdn.name
}

