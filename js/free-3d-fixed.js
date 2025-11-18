// 3D Gratuito - Versão Corrigida e Testada
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

            @keyframes rotate3d {
                from { transform: rotateX(-15deg) rotateY(20deg); }
                to { transform: rotateX(-15deg) rotateY(380deg); }
            }

            .cake-3d-wrapper.rotating {
                animation: rotate3d 4s linear infinite;
            }

            .cake-top-decoration {
                position: absolute;
                z-index: 100;
                animation: bounce 1.5s ease-in-out infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50% { transform: translateX(-50%) translateY(-5px); }
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
        
        // Gerar andares
        for (let i = 0; i < andares; i++) {
            const size = 100 - (i * 15);
            const height = 35;
            const bottom = i * 30;
            
            html += `
                <div class="cake-tier" style="
                    width: ${size}px;
                    height: ${height}px;
                    bottom: ${bottom}px;
                    background: linear-gradient(135deg, ${corPrimaria} 0%, ${corSecundaria} 100%);
                    ${formato === 'redondo' ? 'border-radius: 50%;' : formato === 'quadrado' ? 'border-radius: 8px;' : 'border-radius: 15px;'}
                ">
                    ${this.generateDecorations(i, decoracao, size)}
                </div>
            `;
        }
        
        // Decoração do topo
        html += this.generateTopDecoration(decoracao);
        html += '</div>';
        
        return html;
    }

    generateDecorations(tier, tipo, size) {
        if (tipo === 'simples') return '';
        
        const icons = {
            flores: '🌸',
            elegante: '✨',
            personagem: '🎭'
        };
        
        const icon = icons[tipo] || '✨';
        let decorations = '';
        const count = Math.max(4, Math.floor(size / 15));
        
        for (let i = 0; i < count; i++) {
            const angle = (360 / count) * i;
            decorations += `
                <div class="tier-decoration" style="
                    --rotation: ${angle}deg;
                    top: 50%;
                    left: 50%;
                    font-size: ${10 + tier}px;
                ">${icon}</div>
            `;
        }
        
        return decorations;
    }

    generateTopDecoration(tipo) {
        const topIcons = {
            simples: '🕯️',
            flores: '🌺',
            elegante: '👑',
            personagem: '🎪'
        };
        
        return `
            <div class="cake-top-decoration" style="
                top: -25px;
                left: 50%;
                font-size: 18px;
            ">${topIcons[tipo] || '🕯️'}</div>
        `;
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
        const size = 50 - (tierIndex * 8);
        const height = 30;
        const x = 175;
        const y = 280 - (tierIndex * 25);
        
        // Gradiente
        const gradient = ctx.createLinearGradient(x - size, y - height, x + size, y + height);
        gradient.addColorStop(0, cor1);
        gradient.addColorStop(1, cor2);
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        
        ctx.save();
        
        if (formato === 'redondo') {
            // Cilindro isométrico
            // Topo
            ctx.beginPath();
            ctx.ellipse(x, y - height/2, size, size/2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Lateral
            ctx.fillRect(x - size, y - height/2, size * 2, height);
            ctx.strokeRect(x - size, y - height/2, size * 2, height);
            
            // Base
            ctx.beginPath();
            ctx.ellipse(x, y + height/2, size, size/2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else {
            // Formato quadrado/retangular
            const width = formato === 'retangular' ? size * 1.4 : size;
            
            // Topo
            ctx.fillRect(x - width, y - height/2, width * 2, height);
            ctx.strokeRect(x - width, y - height/2, width * 2, height);
        }
        
        ctx.restore();
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
