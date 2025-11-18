// Gerador 3D Gratuito - CSS 3D + Canvas
// Sem dependências externas, 100% gratuito

class Free3DGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.cakeConfig = {
            formato: 'redondo',
            andares: 1,
            corPrimaria: '#ffffff',
            corSecundaria: '#ff69b4',
            decoracao: 'simples'
        };
        this.rotationY = 0;
        this.animationId = null;
    }

    create3DViewer(config) {
        this.cakeConfig = { ...this.cakeConfig, ...config };
        
        return `
            <div class="free-3d-container">
                <div class="cake-3d-scene" id="cake-3d-scene">
                    ${this.generateCSS3DCake()}
                </div>
                <canvas id="cake-canvas" width="400" height="400" style="display: none;"></canvas>
                
                <div class="3d-controls">
                    <button onclick="free3D.switchView('css')" class="view-btn active" id="css-btn">
                        🎨 CSS 3D
                    </button>
                    <button onclick="free3D.switchView('canvas')" class="view-btn" id="canvas-btn">
                        🖼️ Canvas 2D
                    </button>
                    <button onclick="free3D.toggleRotation()" class="control-btn" id="rotate-btn">
                        🔄 Rotacionar
                    </button>
                    <button onclick="free3D.takeScreenshot()" class="control-btn">
                        📸 Capturar
                    </button>
                </div>
            </div>
        `;
    }

    generateCSS3DCake() {
        const { formato, andares, corPrimaria, corSecundaria, decoracao } = this.cakeConfig;
        
        let cakeHTML = '<div class="cake-3d-wrapper">';
        
        // Gerar andares
        for (let i = 0; i < andares; i++) {
            const size = 120 - (i * 20);
            const height = 40;
            const bottom = i * 35;
            
            cakeHTML += `
                <div class="cake-tier tier-${i}" style="
                    width: ${size}px;
                    height: ${height}px;
                    bottom: ${bottom}px;
                    background: linear-gradient(45deg, ${corPrimaria}, ${corSecundaria});
                    ${formato === 'redondo' ? 'border-radius: 50%;' : 'border-radius: 8px;'}
                ">
                    ${this.generateTierDecorations(i, decoracao)}
                </div>
            `;
        }
        
        // Adicionar decorações no topo
        cakeHTML += this.generateTopDecorations(decoracao);
        cakeHTML += '</div>';
        
        return cakeHTML;
    }

    generateTierDecorations(tierIndex, decoracao) {
        if (decoracao === 'simples') return '';
        
        const decorations = {
            flores: '🌸',
            elegante: '✨',
            personagem: '🎭'
        };
        
        const icon = decorations[decoracao] || '✨';
        let decorHTML = '';
        
        // Adicionar decorações ao redor do andar
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * 360;
            decorHTML += `
                <div class="tier-decoration" style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(${angle}deg) translateY(-25px);
                    font-size: 12px;
                ">${icon}</div>
            `;
        }
        
        return decorHTML;
    }

    generateTopDecorations(decoracao) {
        const topDecorations = {
            simples: '🕯️',
            flores: '🌺🌸🌺',
            elegante: '👑',
            personagem: '🎪'
        };
        
        const decoration = topDecorations[decoracao] || '🕯️';
        
        return `
            <div class="cake-top-decoration" style="
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 16px;
                z-index: 10;
            ">${decoration}</div>
        `;
    }

    switchView(viewType) {
        const cssScene = document.getElementById('cake-3d-scene');
        const canvas = document.getElementById('cake-canvas');
        const cssBtn = document.getElementById('css-btn');
        const canvasBtn = document.getElementById('canvas-btn');
        
        if (viewType === 'css') {
            cssScene.style.display = 'block';
            canvas.style.display = 'none';
            cssBtn.classList.add('active');
            canvasBtn.classList.remove('active');
        } else {
            cssScene.style.display = 'none';
            canvas.style.display = 'block';
            cssBtn.classList.remove('active');
            canvasBtn.classList.add('active');
            this.drawCanvasCake();
        }
    }

    drawCanvasCake() {
        const canvas = document.getElementById('cake-canvas');
        if (!canvas) return;
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Limpar canvas
        this.ctx.clearRect(0, 0, 400, 400);
        
        // Desenhar sombra
        this.drawShadow();
        
        // Desenhar andares
        for (let i = this.cakeConfig.andares - 1; i >= 0; i--) {
            this.drawTier(i);
        }
        
        // Desenhar decorações
        this.drawDecorations();
    }

    drawShadow() {
        const ctx = this.ctx;
        ctx.save();
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(200, 350, 80, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawTier(tierIndex) {
        const ctx = this.ctx;
        const { formato, corPrimaria, corSecundaria } = this.cakeConfig;
        
        const size = 60 - (tierIndex * 10);
        const height = 40;
        const x = 200;
        const y = 300 - (tierIndex * 35);
        
        ctx.save();
        
        // Criar gradiente
        const gradient = ctx.createLinearGradient(x - size, y - height, x + size, y + height);
        gradient.addColorStop(0, corPrimaria);
        gradient.addColorStop(1, corSecundaria);
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        
        if (formato === 'redondo') {
            // Desenhar cilindro (vista isométrica)
            // Topo elíptico
            ctx.beginPath();
            ctx.ellipse(x, y - height/2, size, size/3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Lateral
            ctx.beginPath();
            ctx.rect(x - size, y - height/2, size * 2, height);
            ctx.fill();
            ctx.stroke();
            
            // Base elíptica
            ctx.beginPath();
            ctx.ellipse(x, y + height/2, size, size/3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else {
            // Desenhar cubo (vista isométrica)
            ctx.beginPath();
            ctx.rect(x - size, y - height/2, size * 2, height);
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.restore();
    }

    drawDecorations() {
        const ctx = this.ctx;
        const { decoracao } = this.cakeConfig;
        
        if (decoracao === 'simples') return;
        
        const decorations = {
            flores: { emoji: '🌸', count: 8 },
            elegante: { emoji: '✨', count: 6 },
            personagem: { emoji: '🎭', count: 4 }
        };
        
        const decor = decorations[decoracao];
        if (!decor) return;
        
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        
        for (let i = 0; i < decor.count; i++) {
            const angle = (i / decor.count) * Math.PI * 2;
            const radius = 70;
            const x = 200 + Math.cos(angle) * radius;
            const y = 280 + Math.sin(angle) * radius * 0.3;
            
            ctx.fillText(decor.emoji, x, y);
        }
        
        // Decoração no topo
        ctx.font = '20px Arial';
        ctx.fillText(decoracao === 'flores' ? '🌺' : decoracao === 'elegante' ? '👑' : '🎪', 200, 220);
    }

    toggleRotation() {
        const scene = document.querySelector('.cake-3d-wrapper');
        const btn = document.getElementById('rotate-btn');
        
        if (this.animationId) {
            // Parar rotação
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            btn.textContent = '🔄 Rotacionar';
            scene.style.animation = 'none';
        } else {
            // Iniciar rotação
            btn.textContent = '⏸️ Parar';
            scene.style.animation = 'rotate3d 4s linear infinite';
        }
    }

    takeScreenshot() {
        const container = document.querySelector('.free-3d-container');
        
        // Usar html2canvas se disponível, senão fallback simples
        if (window.html2canvas) {
            html2canvas(container).then(canvas => {
                const link = document.createElement('a');
                link.download = 'meu-bolo-3d.png';
                link.href = canvas.toDataURL();
                link.click();
            });
        } else {
            // Fallback: capturar canvas se estiver visível
            const canvas = document.getElementById('cake-canvas');
            if (canvas.style.display !== 'none') {
                const link = document.createElement('a');
                link.download = 'meu-bolo-canvas.png';
                link.href = canvas.toDataURL();
                link.click();
            } else {
                alert('📸 Para capturar, mude para a visualização Canvas 2D');
            }
        }
    }

    updateConfig(newConfig) {
        this.cakeConfig = { ...this.cakeConfig, ...newConfig };
        
        // Atualizar visualização ativa
        const cssScene = document.getElementById('cake-3d-scene');
        const canvas = document.getElementById('cake-canvas');
        
        if (cssScene.style.display !== 'none') {
            cssScene.innerHTML = this.generateCSS3DCake();
        } else {
            this.drawCanvasCake();
        }
    }
}

// CSS 3D Styles (adicionar ao style.css)
const css3DStyles = `
.free-3d-container {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
}

.cake-3d-scene {
    width: 400px;
    height: 400px;
    margin: 0 auto 20px;
    perspective: 1000px;
    background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.cake-3d-wrapper {
    position: relative;
    transform-style: preserve-3d;
    transform: rotateX(-10deg) rotateY(0deg);
}

.cake-tier {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border: 2px solid rgba(255,255,255,0.3);
}

.tier-decoration {
    pointer-events: none;
}

@keyframes rotate3d {
    from { transform: rotateX(-10deg) rotateY(0deg); }
    to { transform: rotateX(-10deg) rotateY(360deg); }
}

.3d-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}

.view-btn, .control-btn {
    padding: 8px 16px;
    border: 2px solid #e91e63;
    background: white;
    color: #e91e63;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 12px;
}

.view-btn.active, .view-btn:hover, .control-btn:hover {
    background: #e91e63;
    color: white;
}

#cake-canvas {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin: 0 auto 20px;
    display: block;
}
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = css3DStyles;
document.head.appendChild(styleSheet);

// Instância global
window.free3D = new Free3DGenerator();
