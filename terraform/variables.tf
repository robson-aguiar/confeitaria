variable "resource_group_name" {
  description = "Nome do Resource Group"
  type        = string
}

variable "location" {
  description = "Localização dos recursos"
  type        = string
  default     = "brazilsouth"
}

variable "app_service_plan_name" {
  description = "Nome do App Service Plan"
  type        = string
}

variable "app_service_name" {
  description = "Nome do App Service"
  type        = string
}

variable "sku_name" {
  description = "SKU do App Service Plan"
  type        = string
  default     = "B1"
}

variable "always_on" {
  description = "Always On habilitado"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags para os recursos"
  type        = map(string)
  default = {
    Environment = "Production"
    Project     = "Confeitaria"
  }
}
