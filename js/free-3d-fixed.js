// 3D Gratuito - Versão Corrigida e Testada v2.0
console.log('🎂 3D Melhorado v2.0 carregado - Agora parece bolo de verdade!');

class Free3DFixed {
    constructor() {
        this.currentView = 'css';
        this.isRotating = false;
        this.rotationInterval = null;
        this.config = {
            formato: 'redondo',
            andares: 1,
            corPrimaria: '#ffffff',
            corSecundaria: '#ff69b4',
            decoracao: 'simples'
        };
        
        // Adicionar CSS automaticamente
        this.addCSS();
    }

    addCSS() {
        if (document.getElementById('free-3d-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'free-3d-styles';
        style.textContent = `
            .free-3d-container {
                width: 100%;
                max-width: 450px;
                margin: 0 auto;
                text-align: center;
            }

            .cake-3d-scene {
                width: 350px;
                height: 350px;
                margin: 0 auto 20px;
                perspective: 800px;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            }

            .cake-3d-wrapper {
                position: relative;
                transform-style: preserve-3d;
                transform: rotateX(-15deg) rotateY(20deg);
                transition: transform 0.5s ease;
            }

            .cake-tier {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                border: 1px solid rgba(255,255,255,0.5);
                transition: all 0.3s ease;
            }

            .cake-tier:hover {
                transform: translateX(-50%) scale(1.05);
            }

            .tier-decoration {
                position: absolute;
                pointer-events: none;
                animation: float 2s ease-in-out infinite;
            }

            @keyframes float {
                0%, 100% { transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-25px) translateZ(0); }
                50% { transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-30px) translateZ(5px); }
            }

            @keyframes sparkle {
                0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
                50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
            }

            @keyframes rotate3d {
                from { transform: rotateX(-15deg) rotateY(20deg); }
                to { transform: rotateX(-15deg) rotateY(380deg); }
            }

            .cake-3d-wrapper.rotating {
                animation: rotate3d 6s linear infinite;
            }

            .cake-top-decoration {
                position: absolute;
                z-index: 100;
                animation: bounce 1.5s ease-in-out infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateX(-50%) translateY(0) scale(1); }
                50% { transform: translateX(-50%) translateY(-8px) scale(1.1); }
            }

            .controls-3d {
                display: flex;
                gap: 8px;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 15px;
            }

            .btn-3d {
                padding: 8px 15px;
                border: 2px solid #007bff;
                background: white;
                color: #007bff;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 12px;
                font-weight: 600;
            }

            .btn-3d:hover, .btn-3d.active {
                background: #007bff;
                color: white;
                transform: translateY(-2px);
            }

            .canvas-3d {
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                margin: 0 auto 20px;
                display: none;
                background: #f8f9fa;
            }

            .canvas-3d.active {
                display: block;
            }

            .sync-controls {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin-top: 15px;
            }

            .config-display {
                display: flex;
                gap: 8px;
                justify-content: center;
                margin: 10px 0;
                flex-wrap: wrap;
            }

            .config-item {
                padding: 4px 8px;
                background: white;
                border-radius: 12px;
                font-size: 11px;
                border: 1px solid #dee2e6;
            }

            @media (max-width: 480px) {
                .cake-3d-scene {
                    width: 280px;
                    height: 280px;
                }
                
                .controls-3d {
                    gap: 5px;
                }
                
                .btn-3d {
                    padding: 6px 10px;
                    font-size: 11px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    create3DViewer(config = {}) {
        this.config = { ...this.config, ...config };
        
        return `
            <div class="free-3d-container">
                <div class="controls-3d">
                    <button class="btn-3d active" onclick="free3DFixed.switchView('css')" id="css-view-btn">
                        🎨 CSS 3D
                    </button>
                    <button class="btn-3d" onclick="free3DFixed.switchView('canvas')" id="canvas-view-btn">
                        🖼️ Canvas
                    </button>
                    <button class="btn-3d" onclick="free3DFixed.toggleRotation()" id="rotate-btn">
                        🔄 Girar
                    </button>
                    <button class="btn-3d" onclick="free3DFixed.takeScreenshot()">
                        📸 Foto
                    </button>
                </div>
                
                <div class="cake-3d-scene" id="cake-3d-scene">
                    ${this.generateCSS3D()}
                </div>
                
                <canvas class="canvas-3d" id="cake-canvas" width="350" height="350"></canvas>
                
                <div class="sync-controls">
                    <div class="config-display">
                        <span class="config-item">📐 ${this.config.formato}</span>
                        <span class="config-item">🏗️ ${this.config.andares} andar${this.config.andares > 1 ? 'es' : ''}</span>
                        <span class="config-item">🎨 ${this.config.decoracao}</span>
                    </div>
                    <button class="btn-3d" onclick="free3DFixed.updateFromConfigurator()" style="background: #28a745; color: white; border-color: #28a745;">
                        ↻ Sincronizar
                    </button>
                </div>
            </div>
        `;
    }

    generateCSS3D() {
        const { formato, andares, corPrimaria, corSecundaria, decoracao } = this.config;
        
        let html = '<div class="cake-3d-wrapper" id="cake-wrapper">';
        
        // Gerar andares com mais detalhes
        for (let i = 0; i < andares; i++) {
            const size = 120 - (i * 20);
            const height = 45;
            const bottom = i * 40;
            
            html += `
                <div class="cake-tier tier-${i}" style="
                    width: ${size}px;
                    height: ${height}px;
                    bottom: ${bottom}px;
                    background: linear-gradient(135deg, ${corPrimaria} 0%, ${corSecundaria} 50%, ${corPrimaria} 100%);
                    ${formato === 'redondo' ? 'border-radius: 50%;' : formato === 'quadrado' ? 'border-radius: 8px;' : 'border-radius: 15px;'}
                    box-shadow: 
                        0 4px 8px rgba(0,0,0,0.3),
                        inset 0 2px 4px rgba(255,255,255,0.3),
                        inset 0 -2px 4px rgba(0,0,0,0.1);
                    position: relative;
                    border: 2px solid rgba(255,255,255,0.4);
                ">
                    <!-- Cobertura do bolo -->
                    <div style="
                        position: absolute;
                        top: -3px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 95%;
                        height: 8px;
                        background: linear-gradient(45deg, ${corSecundaria}, ${corPrimaria});
                        ${formato === 'redondo' ? 'border-radius: 50%;' : 'border-radius: 4px;'}
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    "></div>
                    
                    <!-- Textura do bolo -->
                    <div style="
                        position: absolute;
                        top: 10%;
                        left: 10%;
                        right: 10%;
                        bottom: 10%;
                        background: repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 2px,
                            rgba(255,255,255,0.1) 2px,
                            rgba(255,255,255,0.1) 4px
                        );
                        ${formato === 'redondo' ? 'border-radius: 50%;' : 'border-radius: 4px;'}
                    "></div>
                    
                    ${this.generateDecorations(i, decoracao, size)}
                    ${this.generateCreamDetails(i, size, formato)}
                </div>
            `;
        }
        
        // Base/prato do bolo
        html += `
            <div class="cake-base-plate" style="
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: ${140}px;
                height: 12px;
                background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                border: 1px solid #ccc;
            "></div>
        `;
        
        // Decoração do topo mais elaborada
        html += this.generateTopDecoration(decoracao, andares);
        html += '</div>';
        
        return html;
    }

    generateCreamDetails(tier, size, formato) {
        // Adicionar detalhes de chantilly/creme
        let creamHtml = '';
        const creamCount = Math.floor(size / 20);
        
        for (let i = 0; i < creamCount; i++) {
            const angle = (360 / creamCount) * i;
            creamHtml += `
                <div style="
                    position: absolute;
                    top: -6px;
                    left: 50%;
                    transform: translateX(-50%) rotate(${angle}deg) translateY(-${size/2 - 10}px);
                    width: 8px;
                    height: 12px;
                    background: radial-gradient(circle, #fff, #f0f0f0);
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                "></div>
            `;
        }
        
        return creamHtml;
    }

    generateDecorations(tier, tipo, size) {
        if (tipo === 'simples') return '';
        
        const icons = {
            flores: { emoji: '🌸', color: '#ff69b4' },
            elegante: { emoji: '✨', color: '#ffd700' },
            personagem: { emoji: '🎭', color: '#87ceeb' }
        };
        
        const decoration = icons[tipo] || icons.elegante;
        let decorations = '';
        const count = Math.max(6, Math.floor(size / 12));
        
        for (let i = 0; i < count; i++) {
            const angle = (360 / count) * i;
            decorations += `
                <div class="tier-decoration" style="
                    --rotation: ${angle}deg;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(${angle}deg) translateY(-${size/2 + 5}px);
                    font-size: ${12 + tier * 2}px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                    animation: float 3s ease-in-out infinite;
                    animation-delay: ${i * 0.2}s;
                ">${decoration.emoji}</div>
            `;
        }
        
        return decorations;
    }

    generateTopDecoration(tipo, andares) {
        const topDecorations = {
            simples: { main: '🕯️', extras: ['✨'] },
            flores: { main: '🌺', extras: ['🌸', '🌿', '🌹'] },
            elegante: { main: '👑', extras: ['💎', '✨', '⭐'] },
            personagem: { main: '🎪', extras: ['🎭', '🎨', '🎈'] }
        };
        
        const decoration = topDecorations[tipo] || topDecorations.simples;
        const topY = -30 - (andares * 40);
        
        let topHtml = `
            <!-- Decoração principal do topo -->
            <div class="cake-top-decoration" style="
                position: absolute;
                top: ${topY}px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 24px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                animation: bounce 2s ease-in-out infinite;
                z-index: 100;
            ">${decoration.main}</div>
        `;
        
        // Decorações extras ao redor
        decoration.extras.forEach((extra, index) => {
            const angle = (index * 120) + 30;
            const radius = 25;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            topHtml += `
                <div style="
                    position: absolute;
                    top: ${topY + y}px;
                    left: calc(50% + ${x}px);
                    transform: translateX(-50%);
                    font-size: 14px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                    animation: sparkle 2s ease-in-out infinite;
                    animation-delay: ${index * 0.3}s;
                ">${extra}</div>
            `;
        });
        
        return topHtml;
    }

    switchView(viewType) {
        const cssScene = document.getElementById('cake-3d-scene');
        const canvas = document.getElementById('cake-canvas');
        const cssBtn = document.getElementById('css-view-btn');
        const canvasBtn = document.getElementById('canvas-view-btn');
        
        if (viewType === 'css') {
            cssScene.style.display = 'flex';
            canvas.classList.remove('active');
            cssBtn.classList.add('active');
            canvasBtn.classList.remove('active');
            this.currentView = 'css';
        } else {
            cssScene.style.display = 'none';
            canvas.classList.add('active');
            cssBtn.classList.remove('active');
            canvasBtn.classList.add('active');
            this.currentView = 'canvas';
            this.drawCanvas();
        }
    }

    drawCanvas() {
        const canvas = document.getElementById('cake-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const { formato, andares, corPrimaria, corSecundaria, decoracao } = this.config;
        
        // Limpar canvas
        ctx.clearRect(0, 0, 350, 350);
        
        // Fundo gradiente
        const bgGradient = ctx.createRadialGradient(175, 175, 0, 175, 175, 175);
        bgGradient.addColorStop(0, '#f8f9fa');
        bgGradient.addColorStop(1, '#e9ecef');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, 350, 350);
        
        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.ellipse(175, 320, 60, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Desenhar andares
        for (let i = andares - 1; i >= 0; i--) {
            this.drawTier(ctx, i, formato, corPrimaria, corSecundaria);
        }
        
        // Decorações
        this.drawCanvasDecorations(ctx, decoracao, andares);
    }

    drawTier(ctx, tierIndex, formato, cor1, cor2) {
        const size = 60 - (tierIndex * 10);
        const height = 35;
        const x = 175;
        const y = 280 - (tierIndex * 30);
        
        ctx.save();
        
        // Sombra do andar
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        if (formato === 'redondo') {
            ctx.ellipse(x + 3, y + height/2 + 3, size, size/3, 0, 0, Math.PI * 2);
        } else {
            ctx.fillRect(x - size + 3, y - height/2 + 3, size * 2, height);
        }
        ctx.fill();
        
        // Gradiente principal do bolo
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, cor1);
        gradient.addColorStop(0.7, cor2);
        gradient.addColorStop(1, this.darkenColor(cor2, 20));
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        
        if (formato === 'redondo') {
            // Desenhar cilindro mais realista
            // Base
            ctx.beginPath();
            ctx.ellipse(x, y + height/2, size, size/3, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Lateral com gradiente
            const sideGradient = ctx.createLinearGradient(x - size, y, x + size, y);
            sideGradient.addColorStop(0, this.darkenColor(cor2, 30));
            sideGradient.addColorStop(0.5, cor2);
            sideGradient.addColorStop(1, this.darkenColor(cor2, 30));
            
            ctx.fillStyle = sideGradient;
            ctx.fillRect(x - size, y - height/2, size * 2, height);
            
            // Topo com brilho
            const topGradient = ctx.createRadialGradient(x, y - height/2, 0, x, y - height/2, size);
            topGradient.addColorStop(0, this.lightenColor(cor1, 30));
            topGradient.addColorStop(0.8, cor1);
            topGradient.addColorStop(1, cor2);
            
            ctx.fillStyle = topGradient;
            ctx.beginPath();
            ctx.ellipse(x, y - height/2, size, size/3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Cobertura/chantilly no topo
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(x, y - height/2 - 2, size * 0.9, size/4, 0, 0, Math.PI * 2);
            ctx.fill();
            
        } else {
            // Formato quadrado/retangular mais detalhado
            const width = formato === 'retangular' ? size * 1.4 : size;
            
            // Base
            ctx.fillRect(x - width, y - height/2, width * 2, height);
            ctx.strokeRect(x - width, y - height/2, width * 2, height);
            
            // Cobertura no topo
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x - width * 0.9, y - height/2 - 3, width * 1.8, 6);
        }
        
        // Adicionar textura de bolo
        this.addCakeTexture(ctx, x, y, size, height, formato);
        
        ctx.restore();
    }

    addCakeTexture(ctx, x, y, size, height, formato) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        
        // Textura pontilhada para simular migalhas
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 20; i++) {
            const px = x + (Math.random() - 0.5) * size * 1.5;
            const py = y + (Math.random() - 0.5) * height * 0.8;
            ctx.beginPath();
            ctx.arc(px, py, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R > 255 ? 255 : R) * 0x10000 +
            (G > 255 ? 255 : G) * 0x100 + (B > 255 ? 255 : B)).toString(16).slice(1);
    }

    drawCanvasDecorations(ctx, tipo, andares) {
        if (tipo === 'simples') return;
        
        const icons = { flores: '🌸', elegante: '✨', personagem: '🎭' };
        const icon = icons[tipo] || '✨';
        
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        
        // Decorações ao redor
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 65;
            const x = 175 + Math.cos(angle) * radius;
            const y = 260 + Math.sin(angle) * radius * 0.4;
            
            ctx.fillText(icon, x, y);
        }
        
        // Decoração do topo
        const topIcons = { simples: '🕯️', flores: '🌺', elegante: '👑', personagem: '🎪' };
        ctx.font = '18px Arial';
        ctx.fillText(topIcons[tipo] || '🕯️', 175, 200 - (andares * 25));
    }

    toggleRotation() {
        const wrapper = document.getElementById('cake-wrapper');
        const btn = document.getElementById('rotate-btn');
        
        if (!wrapper) return;
        
        if (this.isRotating) {
            wrapper.classList.remove('rotating');
            btn.textContent = '🔄 Girar';
            this.isRotating = false;
        } else {
            wrapper.classList.add('rotating');
            btn.textContent = '⏸️ Parar';
            this.isRotating = true;
        }
    }

    takeScreenshot() {
        if (this.currentView === 'canvas') {
            const canvas = document.getElementById('cake-canvas');
            const link = document.createElement('a');
            link.download = 'meu-bolo-3d.png';
            link.href = canvas.toDataURL();
            link.click();
        } else {
            // Para CSS 3D, usar html2canvas se disponível
            const scene = document.getElementById('cake-3d-scene');
            
            if (window.html2canvas) {
                html2canvas(scene).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'meu-bolo-3d.png';
                    link.href = canvas.toDataURL();
                    link.click();
                });
            } else {
                alert('📸 Mude para visualização Canvas para capturar imagem');
            }
        }
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Atualizar visualização ativa
        if (this.currentView === 'css') {
            const scene = document.getElementById('cake-3d-scene');
            if (scene) {
                scene.innerHTML = this.generateCSS3D();
            }
        } else {
            this.drawCanvas();
        }
        
        // Atualizar display da configuração
        this.updateConfigDisplay();
    }

    updateConfigDisplay() {
        const display = document.querySelector('.config-display');
        if (display) {
            display.innerHTML = `
                <span class="config-item">📐 ${this.config.formato}</span>
                <span class="config-item">🏗️ ${this.config.andares} andar${this.config.andares > 1 ? 'es' : ''}</span>
                <span class="config-item">🎨 ${this.config.decoracao}</span>
            `;
        }
    }

    updateFromConfigurator() {
        if (window.visualConfigurator && window.visualConfigurator.config) {
            this.updateConfig(window.visualConfigurator.config);
        } else {
            alert('ℹ️ Configure seu bolo primeiro no configurador visual');
        }
    }
}

// Instância global
window.free3DFixed = new Free3DFixed();
