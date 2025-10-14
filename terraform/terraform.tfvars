resource_group_name    = "Confeitaria"
location               = "brazilsouth"
app_service_plan_name  = "asp-confeitaria"
app_service_name       = "veralucia-confeitaria"
sku_name               = "B1"
always_on              = true

tags = {
  Environment = "Production"
  Project     = "Confeitaria"
  ManagedBy   = "Terraform"
}
