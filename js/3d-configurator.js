// Configurador 3D Avançado - Three.js
// Visualização realística em tempo real

class Advanced3DConfigurator {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cakeModel = null;
        this.isLoaded = false;
    }

    async init3DViewer() {
        // Carregar Three.js dinamicamente
        if (!window.THREE) {
            await this.loadThreeJS();
        }

        this.setupScene();
        this.setupLighting();
        this.setupControls();
        this.loadCakeModel();
    }

    async loadThreeJS() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    setupScene() {
        // Configurar cena 3D
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        // Câmera
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.camera.position.set(0, 5, 10);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(400, 400);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    setupLighting() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Luz direcional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Luz pontual
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-10, 10, -10);
        this.scene.add(pointLight);
    }

    setupControls() {
        // Controles de órbita (carregar dinamicamente)
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/controls/OrbitControls.js';
        document.head.appendChild(script);
    }

    loadCakeModel() {
        // Criar bolo proceduralmente
        this.createProceduralCake();
    }

    createProceduralCake() {
        const group = new THREE.Group();

        // Base do bolo
        const baseGeometry = new THREE.CylinderGeometry(3, 3, 1, 32);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.castShadow = true;
        group.add(base);

        // Decorações
        this.addDecorations(group);

        this.cakeModel = group;
        this.scene.add(group);
        this.isLoaded = true;
    }

    addDecorations(group) {
        // Adicionar flores, velas, etc.
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * 2.5;
            const z = Math.sin(angle) * 2.5;

            const flowerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const flowerMaterial = new THREE.MeshLambertMaterial({ color: 0xff69b4 });
            const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
            flower.position.set(x, 0.6, z);
            group.add(flower);
        }
    }

    updateCakeConfig(config) {
        if (!this.isLoaded) return;

        // Atualizar cor
        const baseMesh = this.cakeModel.children[0];
        baseMesh.material.color.setHex(parseInt(config.corPrimaria.replace('#', '0x')));

        // Atualizar andares
        this.updateTiers(config.andares);

        // Atualizar decorações
        this.updateDecorations(config.decoracao);
    }

    updateTiers(tierCount) {
        // Remover andares extras
        while (this.cakeModel.children.length > tierCount + 8) { // +8 para decorações
            this.cakeModel.remove(this.cakeModel.children[this.cakeModel.children.length - 1]);
        }

        // Adicionar andares se necessário
        for (let i = 1; i < tierCount; i++) {
            const tierGeometry = new THREE.CylinderGeometry(3 - i * 0.5, 3 - i * 0.5, 1, 32);
            const tierMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
            const tier = new THREE.Mesh(tierGeometry, tierMaterial);
            tier.position.y = i;
            tier.castShadow = true;
            this.cakeModel.add(tier);
        }
    }

    updateDecorations(decorationType) {
        // Atualizar decorações baseado no tipo
        const decorations = this.cakeModel.children.slice(1, 9); // Primeiras 8 decorações
        
        decorations.forEach(decoration => {
            switch (decorationType) {
                case 'flores':
                    decoration.material.color.setHex(0xff69b4);
                    break;
                case 'elegante':
                    decoration.material.color.setHex(0xffd700);
                    break;
                case 'personagem':
                    decoration.material.color.setHex(0x87ceeb);
                    break;
                default:
                    decoration.material.color.setHex(0xffffff);
            }
        });
    }

    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (this.cakeModel) {
                this.cakeModel.rotation.y += 0.005; // Rotação suave
            }
            
            this.render();
        };
        animate();
    }

    open3DConfigurator() {
        const modal = document.getElementById('productModal');
        const content = document.getElementById('modalContent');
        
        content.innerHTML = `
            <h2 class="modal-title">🎮 Configurador 3D Avançado</h2>
            <p class="modal-description">Visualização realística em tempo real</p>
            
            <div class="3d-configurator-layout">
                <div class="3d-viewer" id="3d-viewer">
                    <div class="loading-3d">Carregando visualização 3D...</div>
                </div>
                
                <div class="3d-controls">
                    <div class="control-section">
                        <h4>🎨 Personalização</h4>
                        <button onclick="advanced3D.updatePreset('birthday')" class="preset-3d-btn">
                            🎂 Aniversário
                        </button>
                        <button onclick="advanced3D.updatePreset('wedding')" class="preset-3d-btn">
                            💒 Casamento
                        </button>
                        <button onclick="advanced3D.updatePreset('elegant')" class="preset-3d-btn">
                            ✨ Elegante
                        </button>
                    </div>
                    
                    <div class="control-section">
                        <h4>📱 Ações</h4>
                        <button onclick="advanced3D.takeScreenshot()" class="action-btn">
                            📸 Capturar Imagem
                        </button>
                        <button onclick="arViewer.openARViewer(visualConfigurator.config)" class="action-btn">
                            🥽 Ver em AR
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Inicializar 3D após modal abrir
        setTimeout(() => {
            this.init3DViewer().then(() => {
                const viewer = document.getElementById('3d-viewer');
                viewer.innerHTML = '';
                viewer.appendChild(this.renderer.domElement);
                this.startRenderLoop();
            });
        }, 100);
    }

    updatePreset(preset) {
        const presets = {
            birthday: { corPrimaria: '#ff69b4', andares: 2, decoracao: 'flores' },
            wedding: { corPrimaria: '#ffffff', andares: 3, decoracao: 'elegante' },
            elegant: { corPrimaria: '#ffd700', andares: 2, decoracao: 'elegante' }
        };
        
        if (presets[preset]) {
            this.updateCakeConfig(presets[preset]);
        }
    }

    takeScreenshot() {
        const canvas = this.renderer.domElement;
        const link = document.createElement('a');
        link.download = 'meu-bolo-3d.png';
        link.href = canvas.toDataURL();
        link.click();
    }
}

// Instância global
window.advanced3D = new Advanced3DConfigurator();
