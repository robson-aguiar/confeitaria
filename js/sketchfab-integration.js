// Integração Sketchfab - 3D Profissional para Bolos
class SketchfabIntegration {
    constructor() {
        this.modelIds = {
            // IDs de modelos 3D de bolos no Sketchfab (exemplos)
            'redondo-1': 'abc123def456', // Bolo redondo 1 andar
            'redondo-2': 'def456ghi789', // Bolo redondo 2 andares
            'quadrado-1': 'ghi789jkl012', // Bolo quadrado 1 andar
            'quadrado-2': 'jkl012mno345'  // Bolo quadrado 2 andares
        };
        
        this.currentIframe = null;
    }

    create3DViewer(config) {
        const modelKey = `${config.formato}-${config.andares}`;
        const modelId = this.modelIds[modelKey] || this.modelIds['redondo-1'];
        
        return `
            <div class="sketchfab-container">
                <div class="sketchfab-controls">
                    <button class="btn-3d active" onclick="sketchfabIntegration.switchTo3D('${modelId}')">
                        🎂 Modelo 3D Real
                    </button>
                    <button class="btn-3d" onclick="sketchfabIntegration.switchToCSS()">
                        🎨 CSS 3D Rápido
                    </button>
                </div>
                
                <div class="sketchfab-viewer" id="sketchfab-viewer">
                    ${this.generateSketchfabEmbed(modelId)}
                </div>
                
                <div class="css-viewer" id="css-viewer" style="display: none;">
                    ${free3DFixed.create3DViewer(config)}
                </div>
                
                <div class="viewer-info">
                    <p><strong>🎂 Modelo 3D:</strong> ${config.formato} • ${config.andares} andar${config.andares > 1 ? 'es' : ''}</p>
                    <small>💡 Use o mouse para rotacionar e zoom</small>
                </div>
            </div>
        `;
    }

    generateSketchfabEmbed(modelId) {
        // URL do Sketchfab com parâmetros otimizados
        const embedUrl = `https://sketchfab.com/models/${modelId}/embed?` +
            'autostart=1&' +           // Iniciar automaticamente
            'ui_controls=1&' +         // Mostrar controles
            'ui_infos=0&' +           // Esconder informações
            'ui_inspector=0&' +        // Esconder inspetor
            'ui_stop=0&' +            // Não mostrar botão stop
            'ui_watermark=0&' +       // Esconder marca d'água (plano pago)
            'ui_hint=0&' +            // Esconder dicas
            'camera=0&' +             // Posição inicial da câmera
            'transparent=1';           // Fundo transparente
        
        return `
            <iframe 
                id="sketchfab-iframe"
                width="100%" 
                height="400" 
                src="${embedUrl}"
                frameborder="0" 
                allow="autoplay; fullscreen; vr" 
                mozallowfullscreen="true" 
                webkitallowfullscreen="true"
                style="border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
            </iframe>
            
            <div class="loading-overlay" id="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Carregando modelo 3D...</p>
            </div>
        `;
    }

    switchTo3D(modelId) {
        const sketchfabViewer = document.getElementById('sketchfab-viewer');
        const cssViewer = document.getElementById('css-viewer');
        
        sketchfabViewer.style.display = 'block';
        cssViewer.style.display = 'none';
        
        // Atualizar botões
        document.querySelectorAll('.btn-3d').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Recarregar iframe se necessário
        const iframe = document.getElementById('sketchfab-iframe');
        if (iframe && !iframe.src.includes(modelId)) {
            iframe.src = iframe.src.replace(/models\/[^\/]+\//, `models/${modelId}/`);
        }
    }

    switchToCSS() {
        const sketchfabViewer = document.getElementById('sketchfab-viewer');
        const cssViewer = document.getElementById('css-viewer');
        
        sketchfabViewer.style.display = 'none';
        cssViewer.style.display = 'block';
        
        // Atualizar botões
        document.querySelectorAll('.btn-3d').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }

    // Versão alternativa: usar API do Sketchfab para mais controle
    async initSketchfabAPI(modelId, containerId) {
        return new Promise((resolve, reject) => {
            const iframe = document.getElementById(containerId);
            const client = new Sketchfab(iframe);
            
            client.init(modelId, {
                success: (api) => {
                    api.start();
                    api.addEventListener('viewerready', () => {
                        console.log('✅ Sketchfab modelo carregado');
                        
                        // Configurar câmera inicial
                        api.setCameraLookAt(
                            [0, 0, 5],    // posição da câmera
                            [0, 0, 0],    // ponto de foco
                            [0, 1, 0]     // vetor up
                        );
                        
                        // Esconder loading
                        const loading = document.getElementById('loading-overlay');
                        if (loading) loading.style.display = 'none';
                        
                        resolve(api);
                    });
                },
                error: () => {
                    console.error('❌ Erro ao carregar modelo Sketchfab');
                    reject();
                }
            });
        });
    }
}

// CSS para Sketchfab
const sketchfabStyles = `
.sketchfab-container {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
}

.sketchfab-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 15px;
}

.sketchfab-viewer {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(248, 249, 250, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e0e0e0;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.viewer-info {
    text-align: center;
    margin-top: 15px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
}

.viewer-info small {
    color: #666;
    font-size: 12px;
}

@media (max-width: 480px) {
    .sketchfab-viewer iframe {
        height: 300px;
    }
}
`;

// Adicionar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = sketchfabStyles;
document.head.appendChild(styleSheet);

// Instância global
window.sketchfabIntegration = new SketchfabIntegration();
