# Guia de Otimização de Imagens

## 📋 Pré-requisitos

1. **Python 3.8+** instalado
2. **Pillow** (biblioteca de processamento de imagens)

## 🚀 Como Usar

### Passo 1: Instalar Dependências

```bash
pip install -r requirements.txt
```

### Passo 2: Executar Script

```bash
python optimize-images.py
```

## 📊 O que o Script Faz

1. ✅ **Converte para WebP** - Formato moderno, 30-50% menor
2. ✅ **Redimensiona** - Máximo 1200px de largura
3. ✅ **Comprime** - Qualidade 85% (ótimo balanço)
4. ✅ **Mantém qualidade visual** - Imperceptível ao olho humano

## 📁 Estrutura

```
images/
├── original.jpg          (imagens originais)
└── optimized/
    └── original.webp     (imagens otimizadas)
```

## 🔄 Após Otimização

### Opção 1: Substituir Todas (Recomendado)
```bash
# Backup das originais
mkdir images/backup
move images/*.jpg images/backup/
move images/*.jpeg images/backup/

# Mover otimizadas
move images/optimized/*.webp images/
```

### Opção 2: Usar WebP com Fallback
Atualizar HTML para suportar navegadores antigos:
```html
<picture>
  <source srcset="images/foto.webp" type="image/webp">
  <img src="images/foto.jpg" alt="Descrição">
</picture>
```

## 📈 Resultados Esperados

- **Redução**: 50-70% do tamanho total
- **Qualidade**: Mantida (imperceptível)
- **Performance**: Score 85-95 no PageSpeed
- **Economia**: ~6-8 MB de dados

## ⚠️ Importante

- Sempre faça backup das imagens originais
- Teste as imagens otimizadas antes de substituir
- WebP é suportado por 95%+ dos navegadores modernos

## 🎯 Configurações Personalizadas

Edite `optimize-images.py`:

```python
MAX_WIDTH = 1200   # Largura máxima (px)
QUALITY = 85       # Qualidade WebP (0-100)
```

## 🆘 Problemas Comuns

### "ModuleNotFoundError: No module named 'PIL'"
```bash
pip install Pillow
```

### "Permission denied"
Execute como administrador ou ajuste permissões da pasta

### Imagens muito pequenas
Aumente `MAX_WIDTH` no script
