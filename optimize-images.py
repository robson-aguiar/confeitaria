#!/usr/bin/env python3
"""
Script para otimizar imagens do site
- Converte para WebP
- Redimensiona para tamanhos adequados
- Comprime mantendo qualidade
"""

import os
from PIL import Image
import glob

# Configurações
INPUT_DIR = "images"
OUTPUT_DIR = "images/optimized"
MAX_WIDTH = 1200  # Largura máxima para imagens
QUALITY = 85  # Qualidade WebP (0-100)

def optimize_images():
    """Otimiza todas as imagens JPG/JPEG/PNG"""
    
    # Criar diretório de saída
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Buscar todas as imagens
    image_files = []
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']:
        image_files.extend(glob.glob(os.path.join(INPUT_DIR, ext)))
    
    total = len(image_files)
    print(f"Encontradas {total} imagens para otimizar\n")
    
    total_original = 0
    total_optimized = 0
    
    for i, img_path in enumerate(image_files, 1):
        try:
            # Abrir imagem
            img = Image.open(img_path)
            
            # Tamanho original
            original_size = os.path.getsize(img_path)
            total_original += original_size
            
            # Converter RGBA para RGB se necessário
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Redimensionar se necessário
            if img.width > MAX_WIDTH:
                ratio = MAX_WIDTH / img.width
                new_height = int(img.height * ratio)
                img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
            
            # Nome do arquivo de saída
            filename = os.path.basename(img_path)
            name_without_ext = os.path.splitext(filename)[0]
            output_path = os.path.join(OUTPUT_DIR, f"{name_without_ext}.webp")
            
            # Salvar como WebP
            img.save(output_path, 'WebP', quality=QUALITY, method=6)
            
            # Tamanho otimizado
            optimized_size = os.path.getsize(output_path)
            total_optimized += optimized_size
            
            # Calcular economia
            saved = original_size - optimized_size
            saved_percent = (saved / original_size) * 100
            
            print(f"[{i}/{total}] OK {filename}")
            print(f"    Original: {original_size/1024:.1f} KB → WebP: {optimized_size/1024:.1f} KB")
            print(f"    Economia: {saved/1024:.1f} KB ({saved_percent:.1f}%)\n")
            
        except Exception as e:
            print(f"[{i}/{total}] ERRO em {filename}: {e}\n")
    
    # Resumo final
    total_saved = total_original - total_optimized
    total_saved_percent = (total_saved / total_original) * 100 if total_original > 0 else 0
    
    print("=" * 60)
    print("RESUMO DA OTIMIZACAO")
    print("=" * 60)
    print(f"Total original:   {total_original/1024/1024:.2f} MB")
    print(f"Total otimizado:  {total_optimized/1024/1024:.2f} MB")
    print(f"Economia total:   {total_saved/1024/1024:.2f} MB ({total_saved_percent:.1f}%)")
    print("=" * 60)
    print(f"\nImagens otimizadas salvas em: {OUTPUT_DIR}")
    print("\nProximos passos:")
    print("1. Revise as imagens otimizadas")
    print("2. Substitua as originais pelas otimizadas")
    print("3. Atualize o HTML para usar .webp")

if __name__ == "__main__":
    print("Iniciando otimizacao de imagens...\n")
    optimize_images()
