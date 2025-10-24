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
        const modal = document.getElementById('productModal');
        const content = document.getElementById('modalContent');
        
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
                            <button class="tab-btn active" onclick="showTab('estrutura')">Estrutura</button>
                            <button class="tab-btn" onclick="showTab('sabores')">Sabores</button>
                            <button class="tab-btn" onclick="showTab('cores')">Cores</button>
                            <button class="tab-btn" onclick="showTab('decoracao')">Decoração</button>
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
                        </div>
                    </div>
                </div>
                
                <div class="configurator-actions">
                    <div class="config-summary">
                        <h4>Resumo da Configuração</h4>
                        <div id="config-summary">${this.renderSummary()}</div>
                    </div>
                    <div class="action-buttons">
                        <button onclick="visualConfigurator.saveConfig()" class="save-btn">
                            💾 Salvar Configuração
                        </button>
                        <button onclick="visualConfigurator.requestQuote()" class="quote-btn">
                            📱 Solicitar Orçamento
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    renderCakePreview() {
        const { formato, andares, corPrimaria, corSecundaria, decoracao } = this.config;
        
        return `
            <div class="cake-container">
                <div class="cake-base ${formato}" style="--cor-primaria: ${corPrimaria}; --cor-secundaria: ${corSecundaria};">
                    ${this.renderAndares()}
                    ${this.renderDecoracao()}
                </div>
                <div class="cake-shadow"></div>
            </div>
        `;
    }

    renderAndares() {
        let andaresHtml = '';
        for (let i = 0; i < this.config.andares; i++) {
            const size = 100 - (i * 20);
            andaresHtml += `
                <div class="andar andar-${i + 1}" style="width: ${size}%; height: 60px; z-index: ${10 - i};">
                    <div class="andar-base"></div>
                    <div class="andar-topo"></div>
                </div>
            `;
        }
        return andaresHtml;
    }

    renderDecoracao() {
        const { decoracao, corSecundaria } = this.config;
        
        const decoracoes = {
            simples: '',
            flores: `<div class="flores">🌸🌺🌸</div>`,
            elegante: `<div class="elegante">✨💎✨</div>`,
            personagem: `<div class="personagem">🎭🎪🎨</div>`
        };
        
        return decoracoes[decoracao] || '';
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
        return `
            <div class="summary-grid">
                <div class="summary-item">
                    <strong>Formato:</strong> ${this.config.formato}
                </div>
                <div class="summary-item">
                    <strong>Andares:</strong> ${this.config.andares}
                </div>
                <div class="summary-item">
                    <strong>Tamanho:</strong> ${this.config.tamanho}
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
            </div>
        `;
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

    requestQuote() {
        let message = `🎨 *ORÇAMENTO - CONFIGURADOR VISUAL*\n\n`;
        message += `📋 *Configuração do Bolo:*\n`;
        message += `• Formato: ${this.config.formato}\n`;
        message += `• Andares: ${this.config.andares}\n`;
        message += `• Tamanho: ${this.config.tamanho}\n`;
        message += `• Massa: ${this.config.massa}\n`;
        message += `• Recheio: ${this.config.recheio}\n`;
        message += `• Cobertura: ${this.config.cobertura}\n`;
        message += `• Decoração: ${this.config.decoracao}\n`;
        message += `• Cores: ${this.config.corPrimaria} / ${this.config.corSecundaria}\n\n`;
        message += `Gostaria de um orçamento para esta configuração! 😊`;
        
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

// Instância global
window.visualConfigurator = new VisualConfigurator();
