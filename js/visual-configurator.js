// Configurador Visual - Vera Lúcia Confeitaria

class VisualConfigurator {
    constructor() {
        this.config = {
            formato: 'redondo',
            andares: 1,
            tamanho: 'medio',
            massa: 'chocolate',
            recheio: 'brigadeiro',
            cobertura: 'chantilly',
            corPrimaria: '#ffffff',
            corSecundaria: '#ff69b4',
            decoracao: 'simples',
            tema: 'classico'
        };

        this.precos = {
            base: {
                pequeno: 45,
                medio: 65,
                grande: 85,
                gigante: 120
            },
            andares: {
                1: 0,
                2: 25,
                3: 50,
                4: 80
            },
            massa: {
                chocolate: 0,
                baunilha: 0,
                'red-velvet': 15,
                limao: 5,
                morango: 10
            },
            recheio: {
                brigadeiro: 0,
                nutella: 20,
                'doce-leite': 10,
                morango: 8,
                maracuja: 12
            },
            cobertura: {
                chantilly: 0,
                buttercream: 15,
                ganache: 20,
                fondant: 35
            },
            decoracao: {
                simples: 0,
                flores: 25,
                elegante: 40,
                personagem: 60
            },
            formato: {
                redondo: 0,
                quadrado: 5,
                retangular: 10
            }
        };

        this.presets = {
            aniversario: {
                corPrimaria: '#ff69b4',
                corSecundaria: '#ffffff',
                decoracao: 'flores',
                tema: 'festa'
            },
            casamento: {
                corPrimaria: '#ffffff',
                corSecundaria: '#f0f0f0',
                decoracao: 'elegante',
                tema: 'romantico'
            },
            infantil: {
                corPrimaria: '#87ceeb',
                corSecundaria: '#ffb6c1',
                decoracao: 'personagem',
                tema: 'divertido'
            }
        };
    }

    openConfigurator() {
        console.log('🎯 openConfigurator chamado');

        const modal = document.getElementById('productModal');
        if (!modal) {
            console.error('❌ Modal productModal não encontrado');
            alert('Erro: Modal não encontrado. Recarregue a página.');
            return;
        }

        const content = document.getElementById('modalContent');
        if (!content) {
            console.error('❌ modalContent não encontrado');
            alert('Erro: Conteúdo do modal não encontrado. Recarregue a página.');
            return;
        }

        console.log('✅ Modal e conteúdo encontrados, carregando configurador...');

        content.innerHTML = `
            <h2 class="modal-title">🎨 Configurador Visual</h2>
            <p class="modal-description">Crie e visualize seu bolo dos sonhos em tempo real</p>
            
            <div class="visual-configurator">
                <div class="configurator-layout">
                    <div class="preview-section">
                        <div class="cake-preview" id="cake-preview">
                            ${this.renderCakePreview()}
                        </div>
                        <div class="preset-buttons">
                            <button onclick="visualConfigurator.applyPreset('aniversario')" class="preset-btn">
                                🎂 Aniversário
                            </button>
                            <button onclick="visualConfigurator.applyPreset('casamento')" class="preset-btn">
                                💒 Casamento
                            </button>
                            <button onclick="visualConfigurator.applyPreset('infantil')" class="preset-btn">
                                🧸 Infantil
                            </button>
                        </div>
                    </div>
                    
                    <div class="controls-section">
                        <div class="control-tabs">
                            <button class="tab-btn active" onclick="showTab('estrutura')" ontouchstart="">Estrutura</button>
                            <button class="tab-btn" onclick="showTab('sabores')" ontouchstart="">Sabores</button>
                            <button class="tab-btn" onclick="showTab('cores')" ontouchstart="">Cores</button>
                            <button class="tab-btn" onclick="showTab('decoracao')" ontouchstart="">Decoração</button>
                            <button class="tab-btn" onclick="showTab('tema')" ontouchstart="">Tema</button>
                        </div>
                        
                        <div class="tab-content">
                            <div id="estrutura-tab" class="tab-panel active">
                                ${this.renderEstrutura()}
                            </div>
                            <div id="sabores-tab" class="tab-panel">
                                ${this.renderSabores()}
                            </div>
                            <div id="cores-tab" class="tab-panel">
                                ${this.renderCores()}
                            </div>
                            <div id="decoracao-tab" class="tab-panel">
                                ${this.renderDecoracao()}
                            </div>
                            <div id="tema-tab" class="tab-panel">
                                ${this.renderTema()}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="configurator-actions">
                    <div class="config-summary">
                        <h4>Resumo da Configuração</h4>
                        <div id="config-summary">${this.renderSummary()}</div>
                    </div>
                    <div class="action-buttons">
                        <button onclick="visualConfigurator.saveConfig()" class="save-btn" ontouchstart="">
                            💾 Salvar
                        </button>
                        <button onclick="visualConfigurator.requestQuote()" class="quote-btn" ontouchstart="">
                            📱 Orçamento
                        </button>
                        <button onclick="visualConfigurator.open3DView()" class="view-3d-btn" ontouchstart="">
                            🎮 Ver em 3D
                        </button>
                        <button onclick="visualConfigurator.openARView()" class="ar-btn" ontouchstart="">
                            📱 Ver em AR
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Adicionar suporte a swipe em mobile
        this.addMobileGestures();
    }

    addMobileGestures() {
        if (window.innerWidth <= 768) {
            const tabs = document.querySelectorAll('.tab-btn');
            let currentTab = 0;

            // Swipe entre tabs
            const tabContent = document.querySelector('.tab-content');
            let startX = 0;

            tabContent.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            tabContent.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;

                if (Math.abs(diff) > 50) { // Mínimo 50px para swipe
                    if (diff > 0 && currentTab < tabs.length - 1) {
                        // Swipe left - próxima tab
                        currentTab++;
                        tabs[currentTab].click();
                    } else if (diff < 0 && currentTab > 0) {
                        // Swipe right - tab anterior
                        currentTab--;
                        tabs[currentTab].click();
                    }
                }
            });
        }
    }

    renderCakePreview() {
        const { formato, andares, corPrimaria, corSecundaria, decoracao, tamanho } = this.config;

        return `
            <div class="cake-container">
                <div class="cake-base ${formato} ${tamanho}" style="--cor-primaria: ${corPrimaria}; --cor-secundaria: ${corSecundaria};">
                    ${this.renderAndares()}
                    ${this.renderDecoracaoVisual()}
                </div>
                <div class="cake-shadow"></div>
                <div class="cake-info">
                    <span class="cake-label">${this.getCakeDescription()}</span>
                </div>
            </div>
        `;
    }

    renderAndares() {
        let andaresHtml = '';
        const baseSize = this.config.tamanho === 'pequeno' ? 80 :
            this.config.tamanho === 'medio' ? 100 :
                this.config.tamanho === 'grande' ? 120 : 140;

        for (let i = 0; i < this.config.andares; i++) {
            const size = baseSize - (i * 25);
            const height = 50 + (this.config.andares > 2 ? 10 : 0);
            andaresHtml += `
                <div class="andar andar-${i + 1}" style="
                    width: ${size}px; 
                    height: ${height}px; 
                    bottom: ${i * (height - 5)}px;
                    z-index: ${10 - i};
                    background: linear-gradient(135deg, ${this.config.corPrimaria}, ${this.config.corSecundaria});
                ">
                    <div class="andar-topo"></div>
                </div>
            `;
        }
        return andaresHtml;
    }

    renderDecoracaoVisual() {
        const { decoracao } = this.config;

        const decoracoes = {
            simples: '<div class="decoracao-simples" style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); font-size: 12px;">✨</div>',
            flores: '<div class="decoracao-flores" style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-size: 16px;">🌸🌺🌸</div>',
            elegante: '<div class="decoracao-elegante" style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font-size: 14px;">✨💎✨</div>',
            personagem: '<div class="decoracao-personagem" style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-size: 16px;">🎭🎪🎨</div>'
        };

        return decoracoes[decoracao] || '';
    }

    calculatePrice() {
        const { tamanho, andares, massa, recheio, cobertura, decoracao, formato } = this.config;

        let preco = this.precos.base[tamanho] || 65;
        preco += this.precos.andares[andares] || 0;
        preco += this.precos.massa[massa] || 0;
        preco += this.precos.recheio[recheio] || 0;
        preco += this.precos.cobertura[cobertura] || 0;
        preco += this.precos.decoracao[decoracao] || 0;
        preco += this.precos.formato[formato] || 0;

        return preco;
    }

    validateConfig() {
        const errors = [];

        // Validar combinações problemáticas
        if (this.config.andares > 3 && this.config.tamanho === 'pequeno') {
            errors.push('Bolos pequenos não suportam mais de 3 andares');
        }

        if (this.config.cobertura === 'fondant' && this.config.decoracao === 'flores') {
            errors.push('Fondant não combina bem com decoração de flores naturais');
        }

        if (this.config.andares > 2 && this.config.formato === 'retangular') {
            errors.push('Formato retangular recomendado para até 2 andares');
        }

        return errors;
    }

    getEstimatedWeight() {
        const baseWeights = {
            pequeno: 1.5,
            medio: 3,
            grande: 5,
            gigante: 8
        };

        const weight = baseWeights[this.config.tamanho] * this.config.andares;
        return Math.round(weight * 10) / 10; // Arredondar para 1 casa decimal
    }

    renderEstrutura() {
        return `
            <div class="control-group">
                <label>Formato:</label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="formato" value="redondo" ${this.config.formato === 'redondo' ? 'checked' : ''} 
                               onchange="visualConfigurator.updateConfig('formato', this.value)">
                        <span>🔵 Redondo</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="formato" value="quadrado" ${this.config.formato === 'quadrado' ? 'checked' : ''} 
                               onchange="visualConfigurator.updateConfig('formato', this.value)">
                        <span>⬜ Quadrado</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="formato" value="retangular" ${this.config.formato === 'retangular' ? 'checked' : ''} 
                               onchange="visualConfigurator.updateConfig('formato', this.value)">
                        <span>▭ Retangular</span>
                    </label>
                </div>
            </div>
            
            <div class="control-group">
                <label>Número de Andares:</label>
                <div class="slider-group">
                    <input type="range" min="1" max="4" value="${this.config.andares}" 
                           onchange="visualConfigurator.updateConfig('andares', parseInt(this.value))">
                    <span class="slider-value">${this.config.andares} andar${this.config.andares > 1 ? 'es' : ''}</span>
                </div>
            </div>
            
            <div class="control-group">
                <label>Tamanho:</label>
                <select onchange="visualConfigurator.updateConfig('tamanho', this.value)">
                    <option value="pequeno" ${this.config.tamanho === 'pequeno' ? 'selected' : ''}>Pequeno (1-2kg)</option>
                    <option value="medio" ${this.config.tamanho === 'medio' ? 'selected' : ''}>Médio (2-4kg)</option>
                    <option value="grande" ${this.config.tamanho === 'grande' ? 'selected' : ''}>Grande (4-6kg)</option>
                    <option value="gigante" ${this.config.tamanho === 'gigante' ? 'selected' : ''}>Gigante (6kg+)</option>
                </select>
            </div>
        `;
    }

    renderSabores() {
        return `
            <div class="control-group">
                <label>Massa:</label>
                <select onchange="visualConfigurator.updateConfig('massa', this.value)">
                    <option value="chocolate" ${this.config.massa === 'chocolate' ? 'selected' : ''}>Chocolate</option>
                    <option value="baunilha" ${this.config.massa === 'baunilha' ? 'selected' : ''}>Baunilha</option>
                    <option value="red-velvet" ${this.config.massa === 'red-velvet' ? 'selected' : ''}>Red Velvet</option>
                    <option value="limao" ${this.config.massa === 'limao' ? 'selected' : ''}>Limão</option>
                    <option value="morango" ${this.config.massa === 'morango' ? 'selected' : ''}>Morango</option>
                </select>
            </div>
            
            <div class="control-group">
                <label>Recheio:</label>
                <select onchange="visualConfigurator.updateConfig('recheio', this.value)">
                    <option value="brigadeiro" ${this.config.recheio === 'brigadeiro' ? 'selected' : ''}>Brigadeiro</option>
                    <option value="nutella" ${this.config.recheio === 'nutella' ? 'selected' : ''}>Nutella</option>
                    <option value="doce-leite" ${this.config.recheio === 'doce-leite' ? 'selected' : ''}>Doce de Leite</option>
                    <option value="morango" ${this.config.recheio === 'morango' ? 'selected' : ''}>Morango</option>
                    <option value="maracuja" ${this.config.recheio === 'maracuja' ? 'selected' : ''}>Maracujá</option>
                </select>
            </div>
            
            <div class="control-group">
                <label>Cobertura:</label>
                <select onchange="visualConfigurator.updateConfig('cobertura', this.value)">
                    <option value="chantilly" ${this.config.cobertura === 'chantilly' ? 'selected' : ''}>Chantilly</option>
                    <option value="buttercream" ${this.config.cobertura === 'buttercream' ? 'selected' : ''}>Buttercream</option>
                    <option value="ganache" ${this.config.cobertura === 'ganache' ? 'selected' : ''}>Ganache</option>
                    <option value="fondant" ${this.config.cobertura === 'fondant' ? 'selected' : ''}>Fondant</option>
                </select>
            </div>
        `;
    }

    renderCores() {
        return `
            <div class="control-group">
                <label>Cor Primária:</label>
                <div class="color-picker">
                    <input type="color" value="${this.config.corPrimaria}" 
                           onchange="visualConfigurator.updateConfig('corPrimaria', this.value)">
                    <div class="color-presets">
                        ${['#ffffff', '#ff69b4', '#87ceeb', '#98fb98', '#dda0dd', '#f0e68c'].map(color =>
            `<div class="color-preset" style="background: ${color}" 
                                  onclick="visualConfigurator.updateConfig('corPrimaria', '${color}')"></div>`
        ).join('')}
                    </div>
                </div>
            </div>
            
            <div class="control-group">
                <label>Cor Secundária:</label>
                <div class="color-picker">
                    <input type="color" value="${this.config.corSecundaria}" 
                           onchange="visualConfigurator.updateConfig('corSecundaria', this.value)">
                    <div class="color-presets">
                        ${['#f0f0f0', '#ffb6c1', '#add8e6', '#90ee90', '#dda0dd', '#fff8dc'].map(color =>
            `<div class="color-preset" style="background: ${color}" 
                                  onclick="visualConfigurator.updateConfig('corSecundaria', '${color}')"></div>`
        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderDecoracao() {
        return `
            <div class="control-group">
                <label>Estilo de Decoração:</label>
                <div class="decoration-grid">
                    <div class="decoration-option ${this.config.decoracao === 'simples' ? 'active' : ''}" 
                         onclick="visualConfigurator.updateConfig('decoracao', 'simples')">
                        <div class="decoration-preview">✨</div>
                        <span>Simples</span>
                    </div>
                    <div class="decoration-option ${this.config.decoracao === 'flores' ? 'active' : ''}" 
                         onclick="visualConfigurator.updateConfig('decoracao', 'flores')">
                        <div class="decoration-preview">🌸</div>
                        <span>Flores</span>
                    </div>
                    <div class="decoration-option ${this.config.decoracao === 'elegante' ? 'active' : ''}" 
                         onclick="visualConfigurator.updateConfig('decoracao', 'elegante')">
                        <div class="decoration-preview">💎</div>
                        <span>Elegante</span>
                    </div>
                    <div class="decoration-option ${this.config.decoracao === 'personagem' ? 'active' : ''}" 
                         onclick="visualConfigurator.updateConfig('decoracao', 'personagem')">
                        <div class="decoration-preview">🎭</div>
                        <span>Personagem</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderSummary() {
        const preco = this.calculatePrice();
        const peso = this.getEstimatedWeight();
        const errors = this.validateConfig();

        return `
            <div class="summary-grid">
                <div class="summary-item">
                    <strong>Formato:</strong> ${this.config.formato}
                </div>
                <div class="summary-item">
                    <strong>Andares:</strong> ${this.config.andares}
                </div>
                <div class="summary-item">
                    <strong>Peso:</strong> ~${peso}kg
                </div>
                <div class="summary-item">
                    <strong>Massa:</strong> ${this.config.massa}
                </div>
                <div class="summary-item">
                    <strong>Recheio:</strong> ${this.config.recheio}
                </div>
                <div class="summary-item">
                    <strong>Decoração:</strong> ${this.config.decoracao}
                </div>
                <div class="summary-item">
                    <strong>Tema:</strong> ${this.config.tema}
                </div>
            </div>
            <div class="price-section">
                <div class="estimated-price">
                    <strong>Preço Estimado: R$ ${preco.toFixed(2)}</strong>
                    <small>*Valor pode variar conforme complexidade</small>
                </div>
            </div>
            ${errors.length > 0 ? `
                <div class="validation-errors">
                    <h5>⚠️ Atenção:</h5>
                    ${errors.map(error => `<p class="error-item">• ${error}</p>`).join('')}
                </div>
            ` : ''}
        `;
    }

    getCakeDescription() {
        return `${this.config.formato} • ${this.config.andares} andar${this.config.andares > 1 ? 'es' : ''} • ${this.config.tamanho}`;
    }

    updateConfig(key, value) {
        this.config[key] = value;
        this.updatePreview();
        this.updateSummary();
    }

    updatePreview() {
        const preview = document.getElementById('cake-preview');
        if (preview) {
            preview.innerHTML = this.renderCakePreview();
        }
    }

    updateSummary() {
        const summary = document.getElementById('config-summary');
        if (summary) {
            summary.innerHTML = this.renderSummary();
        }
    }

    applyPreset(preset) {
        if (this.presets[preset]) {
            Object.assign(this.config, this.presets[preset]);
            this.updatePreview();
            this.updateSummary();

            // Atualizar controles
            document.querySelectorAll('input[type="color"]').forEach(input => {
                if (input.onchange.toString().includes('corPrimaria')) {
                    input.value = this.config.corPrimaria;
                } else if (input.onchange.toString().includes('corSecundaria')) {
                    input.value = this.config.corSecundaria;
                }
            });
        }
    }

    saveConfig() {
        const configName = prompt('Nome para salvar esta configuração:');
        if (configName) {
            const savedConfigs = JSON.parse(localStorage.getItem('savedCakeConfigs') || '{}');
            savedConfigs[configName] = { ...this.config, timestamp: Date.now() };
            localStorage.setItem('savedCakeConfigs', JSON.stringify(savedConfigs));
            alert(`✅ Configuração "${configName}" salva com sucesso!`);
        }
    }

    openARView() {
        if (window.arViewer) {
            arViewer.showCakeInAR(this.config);
        } else {
            alert('AR Viewer não disponível');
        }
    }

    open3DView() {
        const modal = document.getElementById('productModal');
        const content = document.getElementById('modalContent');

        content.innerHTML = `
            <h2 class="modal-title">🎮 Visualização 3D Gratuita</h2>
            <p class="modal-description">Veja seu bolo em 3D - 100% gratuito e funcional!</p>
            
            ${free3DFixed.create3DViewer(this.config)}
            
            <div style="text-align: center; margin-top: 15px;">
                <small style="color: #666;">
                    💡 Use o mouse ou toque para girar e dar zoom no seu bolo!
                </small>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Garantir que a configuração seja aplicada
        setTimeout(() => {
            free3DFixed.updateConfig(this.config);
        }, 200);
    }

    sync3DConfig() {
        if (window.free3DFixed) {
            free3DFixed.updateConfig(this.config);
        }
    }
    requestQuote() {
        const preco = this.calculatePrice();
        const peso = this.getEstimatedWeight();
        const errors = this.validateConfig();

        let message = `🎨 *ORÇAMENTO - CONFIGURADOR VISUAL*\\n\\n`;
        message += `📋 *Configuração do Bolo:*\\n`;
        message += `• Formato: ${this.config.formato}\\n`;
        message += `• Andares: ${this.config.andares}\\n`;
        message += `• Tamanho: ${this.config.tamanho}\\n`;
        message += `• Peso estimado: ~${peso}kg\\n`;
        message += `• Massa: ${this.config.massa}\\n`;
        message += `• Recheio: ${this.config.recheio}\\n`;
        message += `• Cobertura: ${this.config.cobertura}\\n`;
        message += `• Decoração: ${this.config.decoracao}\\n`;
        message += `• Tema: ${this.config.tema}\\n`;
        message += `• Cores: ${this.config.corPrimaria} / ${this.config.corSecundaria}\\n\\n`;
        message += `💰 *Preço Estimado: R$ ${preco.toFixed(2)}*\\n`;
        message += `*(Valor final pode variar conforme complexidade)*\\n\\n`;

        if (errors.length > 0) {
            message += `⚠️ *Observações:*\\n`;
            errors.forEach(error => message += `• ${error}\\n`);
            message += `\\n`;
        }

        message += `Gostaria de confirmar este orçamento! 😊`;

        const whatsappUrl = `https://api.whatsapp.com/send/?phone=5519971307912&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        closeProductModal();
    }
}

// Funções globais
function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Instância global - Inicialização imediata
if (!window.visualConfigurator) {
    window.visualConfigurator = new VisualConfigurator();
    console.log('✅ Visual Configurator instanciado');
}

// Garantir disponibilidade quando DOM carregar
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 DOM carregado, verificando configurador...');

    // Garantir que a instância existe
    if (!window.visualConfigurator) {
        console.log('⚠️ Criando instância do configurador...');
        window.visualConfigurator = new VisualConfigurator();
    }

    // Verificar se todas as dependências estão carregadas
    if (typeof closeProductModal === 'undefined') {
        console.warn('closeProductModal não encontrada, definindo fallback');
        window.closeProductModal = function () {
            const modal = document.getElementById('productModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        };
    }

    // Verificar se o modal existe
    const modal = document.getElementById('productModal');
    if (!modal) {
        console.error('❌ Modal productModal não encontrado no DOM');
    } else {
        console.log('✅ Modal encontrado');
    }

    // Testar se o configurador funciona
    if (window.visualConfigurator && typeof window.visualConfigurator.openConfigurator === 'function') {
        console.log('✅ Configurador pronto para uso');
    } else {
        console.error('❌ Configurador não está funcionando corretamente');
    }
});

// Função de teste para debug
window.testConfigurator = function () {
    console.log('🧪 Testando configurador...');
    if (window.visualConfigurator) {
        try {
            window.visualConfigurator.openConfigurator();
            console.log('✅ Teste do configurador passou');
        } catch (error) {
            console.error('❌ Erro no teste do configurador:', error);
        }
    } else {
        console.error('❌ visualConfigurator não existe');
    }
};
