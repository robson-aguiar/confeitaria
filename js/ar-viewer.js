// AR Viewer - Realidade Aumentada para Bolos
// Usando WebXR API + Model Viewer

class ARViewer {
    constructor() {
        this.isARSupported = false;
        this.currentModel = null;
        this.checkARSupport();
    }

    async checkARSupport() {
        if ('xr' in navigator) {
            this.isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
        }
    }

    openARViewer(cakeConfig) {
        const modal = document.getElementById('productModal');
        const content = document.getElementById('modalContent');
        
        content.innerHTML = `
            <h2 class="modal-title">📱 Visualizar em Realidade Aumentada</h2>
            <p class="modal-description">Veja como seu bolo ficará na sua mesa!</p>
            
            <div class="ar-container">
                ${this.isARSupported ? this.renderARViewer(cakeConfig) : this.renderFallback()}
            </div>
            
            <div class="ar-instructions">
                <h4>Como usar:</h4>
                <ol>
                    <li>📱 Aponte a câmera para uma superfície plana</li>
                    <li>👆 Toque para posicionar o bolo</li>
                    <li>🔄 Gire e redimensione como desejar</li>
                    <li>📸 Tire uma foto para compartilhar</li>
                </ol>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    renderARViewer(config) {
        return `
            <model-viewer
                id="cake-ar-model"
                src="${this.generateCakeModel(config)}"
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                poster="images/cake-poster.jpg"
                shadow-intensity="1"
                auto-rotate
                ar-scale="auto">
                
                <button slot="ar-button" class="ar-button">
                    📱 Ver em AR
                </button>
                
                <div class="progress-bar" slot="progress-bar">
                    <div class="update-bar"></div>
                </div>
            </model-viewer>
        `;
    }

    renderFallback() {
        return `
            <div class="ar-fallback">
                <div class="fallback-preview">
                    <img src="images/ar-preview-demo.jpg" alt="Preview AR">
                    <div class="fallback-overlay">
                        <h3>📱 AR não disponível</h3>
                        <p>Seu dispositivo não suporta Realidade Aumentada</p>
                        <button onclick="arViewer.show3DPreview()" class="preview-btn">
                            🎯 Ver Preview 3D
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateCakeModel(config) {
        // Gerar modelo 3D baseado na configuração
        // Por enquanto, usar modelos pré-definidos
        const modelMap = {
            'redondo-1': 'models/cake-round-1tier.glb',
            'redondo-2': 'models/cake-round-2tier.glb',
            'quadrado-1': 'models/cake-square-1tier.glb',
            'quadrado-2': 'models/cake-square-2tier.glb'
        };
        
        const key = `${config.formato}-${config.andares}`;
        return modelMap[key] || 'models/cake-default.glb';
    }

    show3DPreview() {
        // Fallback para dispositivos sem AR
        alert('🎯 Preview 3D será implementado na próxima versão!');
    }
}

// Instância global
window.arViewer = new ARViewer();
