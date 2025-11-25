// 3D Realista com Three.js - Vera Lúcia Confeitaria
console.log('🎂 3D Realista (Three.js) carregado!');

class Free3DFixed {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cakeGroup = null;
        this.controls = null;
        this.animationId = null;
        this.config = {
            formato: 'redondo',
            andares: 1,
            corPrimaria: '#ffffff',
            corSecundaria: '#ff69b4',
            decoracao: 'simples'
        };
    }

    create3DViewer(config = {}) {
        this.config = { ...this.config, ...config };

        // Retorna o HTML do container
        return `
            <div class="free-3d-container">
                <div class="controls-3d">
                    <button class="btn-3d" onclick="free3DFixed.resetCamera()">
                        🎥 Resetar Câmera
                    </button>
                    <button class="btn-3d" onclick="free3DFixed.toggleRotation()" id="rotate-btn">
                        ⏸️ Parar Giro
                    </button>
                    <button class="btn-3d" onclick="free3DFixed.takeScreenshot()">
                        📸 Foto
                    </button>
                </div>
                
                <div id="three-canvas-container" style="width: 100%; height: 400px; border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1);"></div>
                
                <div class="sync-controls">
                    <div class="config-display">
                        <span class="config-item">📐 ${this.config.formato}</span>
                        <span class="config-item">🏗️ ${this.config.andares} andares</span>
                        <span class="config-item">🎨 ${this.config.decoracao}</span>
                    </div>
                </div>
            </div>
        `;
    }

    initThreeJS() {
        const container = document.getElementById('three-canvas-container');
        if (!container) return;

        // Limpar container anterior se houver
        container.innerHTML = '';

        // Cena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f9fa);

        // Câmera
        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 20, 40);

        // Renderizador
        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);

        // Controles
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
        }

        // Luzes
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.scene.add(dirLight);

        const spotLight = new THREE.SpotLight(0xffffff, 0.5);
        spotLight.position.set(-10, 20, -5);
        this.scene.add(spotLight);

        // Chão (para sombra)
        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.1 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.1;
        plane.receiveShadow = true;
        this.scene.add(plane);

        // Grupo do bolo
        this.cakeGroup = new THREE.Group();
        this.scene.add(this.cakeGroup);

        // Iniciar loop
        this.isRotating = true;
        this.animate();

        // Construir bolo inicial
        this.buildCake();

        // Handle resize
        window.addEventListener('resize', () => {
            if (this.camera && this.renderer && container) {
                this.camera.aspect = container.clientWidth / container.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(container.clientWidth, container.clientHeight);
            }
        });
    }

    buildCake() {
        if (!this.cakeGroup) return;

        // Limpar bolo anterior
        while (this.cakeGroup.children.length > 0) {
            this.cakeGroup.remove(this.cakeGroup.children[0]);
        }

        const { formato, andares, corPrimaria, corSecundaria, decoracao } = this.config;

        const baseSize = 8;
        const tierHeight = 3;

        for (let i = 0; i < andares; i++) {
            const size = baseSize - (i * 1.5);
            const y = (i * tierHeight) + (tierHeight / 2);

            let geometry;
            if (formato === 'redondo') {
                geometry = new THREE.CylinderGeometry(size, size, tierHeight, 64);
            } else if (formato === 'quadrado') {
                geometry = new THREE.BoxGeometry(size * 1.8, tierHeight, size * 1.8);
            } else { // Retangular
                geometry = new THREE.BoxGeometry(size * 2.5, tierHeight, size * 1.5);
            }

            const material = new THREE.MeshStandardMaterial({
                color: i % 2 === 0 ? corPrimaria : corSecundaria,
                roughness: 0.3,
                metalness: 0.1
            });

            const tier = new THREE.Mesh(geometry, material);
            tier.position.y = y;
            tier.castShadow = true;
            tier.receiveShadow = true;
            this.cakeGroup.add(tier);

            // Adicionar detalhes (fitas/bordas)
            this.addTierDetails(tier, size, tierHeight, y, formato, i % 2 === 0 ? corSecundaria : corPrimaria);
        }

        // Base do bolo (prato)
        const plateGeo = new THREE.CylinderGeometry(baseSize + 2, baseSize + 2, 0.5, 64);
        const plateMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.1, metalness: 0.3 });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.y = 0;
        plate.receiveShadow = true;
        this.cakeGroup.add(plate);

        // Decoração do topo
        this.addTopDecoration(andares * tierHeight);
    }

    addTierDetails(tier, size, height, y, formato, color) {
        // Fita na base de cada andar
        let geometry;
        const thickness = 0.2;

        if (formato === 'redondo') {
            geometry = new THREE.TorusGeometry(size + 0.1, thickness, 16, 100);
            const material = new THREE.MeshStandardMaterial({ color: color });
            const ribbon = new THREE.Mesh(geometry, material);
            ribbon.rotation.x = Math.PI / 2;
            ribbon.position.y = y - (height / 2) + thickness;
            this.cakeGroup.add(ribbon);
        } else {
            // Para quadrado/retangular, criar bordas simples
            // Simplificação: apenas adiciona um box um pouco maior na base
            const w = tier.geometry.parameters.width;
            const d = tier.geometry.parameters.depth;
            geometry = new THREE.BoxGeometry(w + 0.2, thickness * 2, d + 0.2);
            const material = new THREE.MeshStandardMaterial({ color: color });
            const ribbon = new THREE.Mesh(geometry, material);
            ribbon.position.y = y - (height / 2) + thickness;
            this.cakeGroup.add(ribbon);
        }
    }

    addTopDecoration(topY) {
        const { decoracao } = this.config;

        if (decoracao === 'simples') return;

        const group = new THREE.Group();
        group.position.y = topY;

        if (decoracao === 'flores') {
            // Simular flores com esferas coloridas
            const colors = [0xff69b4, 0xffb6c1, 0xffffff];
            for (let i = 0; i < 5; i++) {
                const geo = new THREE.SphereGeometry(1, 16, 16);
                const mat = new THREE.MeshStandardMaterial({ color: colors[i % colors.length] });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(Math.random() * 3 - 1.5, 0.5, Math.random() * 3 - 1.5);
                group.add(mesh);
            }
        } else if (decoracao === 'elegante') {
            // Simular pérolas/topo dourado
            const geo = new THREE.IcosahedronGeometry(1.5, 0);
            const mat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 1;
            group.add(mesh);
        } else if (decoracao === 'personagem') {
            // Simular personagem (cubo simples por enquanto)
            const geo = new THREE.BoxGeometry(2, 3, 2);
            const mat = new THREE.MeshStandardMaterial({ color: 0x87ceeb });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 1.5;
            group.add(mesh);
        }

        this.cakeGroup.add(group);
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };

        // Se a cena ainda não foi iniciada, iniciar
        if (!this.scene) {
            this.initThreeJS();
        } else {
            this.buildCake();
        }

        this.updateConfigDisplay();
    }

    updateConfigDisplay() {
        const display = document.querySelector('.config-display');
        if (display) {
            display.innerHTML = `
                <span class="config-item">📐 ${this.config.formato}</span>
                <span class="config-item">🏗️ ${this.config.andares} andares</span>
                <span class="config-item">🎨 ${this.config.decoracao}</span>
            `;
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.controls) this.controls.update();

        if (this.isRotating && this.cakeGroup) {
            this.cakeGroup.rotation.y += 0.005;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    toggleRotation() {
        this.isRotating = !this.isRotating;
        const btn = document.getElementById('rotate-btn');
        if (btn) btn.textContent = this.isRotating ? '⏸️ Parar Giro' : '🔄 Girar';
    }

    resetCamera() {
        if (this.camera && this.controls) {
            this.camera.position.set(0, 20, 40);
            this.camera.lookAt(0, 0, 0);
            this.controls.reset();
        }
    }

    takeScreenshot() {
        if (this.renderer) {
            const link = document.createElement('a');
            link.download = 'meu-bolo-3d.png';
            link.href = this.renderer.domElement.toDataURL('image/png');
            link.click();
        }
    }
}

// Instância global
window.free3DFixed = new Free3DFixed();
