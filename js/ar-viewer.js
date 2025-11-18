// AR Viewer - Visualização em Realidade Aumentada
class ARViewer {
    constructor() {
        this.isSupported = this.checkARSupport();
        this.currentModel = null;
    }

    checkARSupport() {
        return 'xr' in navigator && 'requestSession' in navigator.xr;
    }

    // Mostrar bolo em AR (fallback para visualização 3D)
    showCakeInAR(config) {
        if (!this.isSupported) {
            this.showFallback3D(config);
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'ar-modal';
        modal.innerHTML = `
            <div class="ar-content">
                <div class="ar-viewer">
                    <div class="ar-placeholder">
                        <div class="cake-3d-preview" style="
                            background: linear-gradient(45deg, ${config.corPrimaria}, ${config.corSecundaria});
                            width: 200px;
                            height: 150px;
                            border-radius: 50%;
                            margin: 0 auto;
                            position: relative;
                            transform: rotateX(60deg) rotateY(20deg);
                            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                        ">
                            <div style="
                                position: absolute;
                                top: -20px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: ${config.corSecundaria};
                                width: 180px;
                                height: 40px;
                                border-radius: 50%;
                                box-shadow: inset 0 5px 10px rgba(0,0,0,0.2);
                            "></div>
                        </div>
                        <p>🎂 Visualização 3D do seu bolo</p>
                        <p><small>Tema: ${config.tema}</small></p>
                    </div>
                </div>
                <div class="ar-controls">
                    <button onclick="arViewer.closeAR()" class="btn-secondary">Fechar</button>
                    <button onclick="arViewer.shareAR()" class="btn-primary">Compartilhar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showFallback3D(config) {
        this.showCakeInAR(config);
    }

    shareAR() {
        if (navigator.share) {
            navigator.share({
                title: 'Meu Bolo Personalizado',
                text: 'Veja como ficou meu bolo da Vera Lúcia Confeitaria!',
                url: window.location.href
            });
        } else {
            // Fallback para WhatsApp
            const message = `Olha como ficou meu bolo personalizado da Vera Lúcia Confeitaria! 🎂`;
            const url = `https://api.whatsapp.com/send/?phone=5519971307912&text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        }
    }

    closeAR() {
        const modal = document.querySelector('.ar-modal');
        if (modal) modal.remove();
    }
}

// Instância global
window.arViewer = new ARViewer();
