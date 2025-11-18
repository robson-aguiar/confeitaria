// Sistema de Fidelidade - Pontos e Recompensas
class LoyaltySystem {
    constructor() {
        this.customerData = this.loadCustomerData();
        this.pointsRules = {
            purchase: 10, // 10 pontos por R$ 1
            review: 50,   // 50 pontos por avaliação
            referral: 200, // 200 pontos por indicação
            birthday: 100, // 100 pontos no aniversário
            social: 25     // 25 pontos por compartilhamento
        };
        
        this.rewards = [
            { id: 1, name: 'Desconto 10%', points: 500, type: 'discount', value: 0.1 },
            { id: 2, name: 'Bolo Caseirinho Grátis', points: 800, type: 'product', value: 'caseirinho' },
            { id: 3, name: 'Desconto 20%', points: 1200, type: 'discount', value: 0.2 },
            { id: 4, name: 'Entrega Grátis', points: 300, type: 'shipping', value: 'free' },
            { id: 5, name: 'Bolo Decorado 50% OFF', points: 1500, type: 'discount_category', value: { category: 'bolos', discount: 0.5 } }
        ];
    }

    loadCustomerData() {
        const saved = localStorage.getItem('vera_lucia_loyalty');
        return saved ? JSON.parse(saved) : {
            points: 0,
            level: 'Bronze',
            totalSpent: 0,
            orders: 0,
            rewards: [],
            joinDate: new Date().toISOString()
        };
    }

    saveCustomerData() {
        localStorage.setItem('vera_lucia_loyalty', JSON.stringify(this.customerData));
    }

    addPoints(amount, reason = 'purchase') {
        this.customerData.points += amount;
        this.updateLevel();
        this.saveCustomerData();
        
        this.showPointsNotification(amount, reason);
        this.checkAvailableRewards();
    }

    updateLevel() {
        const levels = [
            { name: 'Bronze', min: 0, benefits: ['Pontos básicos'] },
            { name: 'Prata', min: 1000, benefits: ['Pontos básicos', 'Desconto aniversário'] },
            { name: 'Ouro', min: 2500, benefits: ['Pontos básicos', 'Desconto aniversário', 'Entrega grátis'] },
            { name: 'Diamante', min: 5000, benefits: ['Pontos básicos', 'Desconto aniversário', 'Entrega grátis', 'Atendimento VIP'] }
        ];
        
        const currentLevel = levels.reverse().find(level => this.customerData.points >= level.min);
        this.customerData.level = currentLevel.name;
    }

    showPointsNotification(points, reason) {
        const reasons = {
            purchase: '🛒 Compra realizada',
            review: '⭐ Avaliação enviada',
            referral: '👥 Amigo indicado',
            birthday: '🎂 Feliz aniversário',
            social: '📱 Compartilhamento'
        };
        
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <div class="points-content">
                <div class="points-icon">🏆</div>
                <div class="points-text">
                    <strong>+${points} pontos!</strong>
                    <span>${reasons[reason]}</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    checkAvailableRewards() {
        const availableRewards = this.rewards.filter(reward => 
            this.customerData.points >= reward.points &&
            !this.customerData.rewards.some(used => used.id === reward.id)
        );
        
        if (availableRewards.length > 0) {
            this.showRewardNotification(availableRewards.length);
        }
    }

    showRewardNotification(count) {
        const notification = document.createElement('div');
        notification.className = 'reward-notification';
        notification.innerHTML = `
            <div class="reward-content">
                <div class="reward-icon">🎁</div>
                <div class="reward-text">
                    <strong>Nova${count > 1 ? 's' : ''} recompensa${count > 1 ? 's' : ''} disponível${count > 1 ? 'eis' : ''}!</strong>
                    <span>${count} recompensa${count > 1 ? 's' : ''} para resgatar</span>
                </div>
                <button onclick="loyaltySystem.openRewardsModal()" class="reward-btn">
                    Ver Recompensas
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    openLoyaltyDashboard() {
        const modal = document.getElementById('productModal');
        const content = document.getElementById('modalContent');
        
        content.innerHTML = `
            <h2 class="modal-title">🏆 Programa de Fidelidade</h2>
            <p class="modal-description">Acumule pontos e ganhe recompensas incríveis!</p>
            
            <div class="loyalty-dashboard">
                <div class="loyalty-header">
                    <div class="customer-level">
                        <div class="level-badge ${this.customerData.level.toLowerCase()}">
                            ${this.getLevelIcon()} ${this.customerData.level}
                        </div>
                        <div class="points-display">
                            <span class="points-number">${this.customerData.points}</span>
                            <span class="points-label">pontos</span>
                        </div>
                    </div>
                    
                    <div class="progress-to-next">
                        ${this.renderLevelProgress()}
                    </div>
                </div>
                
                <div class="loyalty-tabs">
                    <button class="tab-btn active" onclick="showLoyaltyTab('rewards')">🎁 Recompensas</button>
                    <button class="tab-btn" onclick="showLoyaltyTab('history')">📊 Histórico</button>
                    <button class="tab-btn" onclick="showLoyaltyTab('earn')">💰 Ganhar Pontos</button>
                </div>
                
                <div class="loyalty-content">
                    <div id="rewards-tab" class="tab-panel active">
                        ${this.renderRewardsTab()}
                    </div>
                    <div id="history-tab" class="tab-panel">
                        ${this.renderHistoryTab()}
                    </div>
                    <div id="earn-tab" class="tab-panel">
                        ${this.renderEarnTab()}
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    getLevelIcon() {
        const icons = {
            'Bronze': '🥉',
            'Prata': '🥈', 
            'Ouro': '🥇',
            'Diamante': '💎'
        };
        return icons[this.customerData.level] || '🏆';
    }

    renderLevelProgress() {
        const levels = { Bronze: 0, Prata: 1000, Ouro: 2500, Diamante: 5000 };
        const currentPoints = this.customerData.points;
        const currentLevel = levels[this.customerData.level];
        
        const nextLevels = Object.entries(levels).filter(([name, points]) => points > currentPoints);
        
        if (nextLevels.length === 0) {
            return '<div class="max-level">🎉 Nível máximo alcançado!</div>';
        }
        
        const [nextLevelName, nextLevelPoints] = nextLevels[0];
        const progress = ((currentPoints - currentLevel) / (nextLevelPoints - currentLevel)) * 100;
        
        return `
            <div class="level-progress">
                <div class="progress-info">
                    <span>Próximo nível: ${nextLevelName}</span>
                    <span>${nextLevelPoints - currentPoints} pontos restantes</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }

    renderRewardsTab() {
        const availableRewards = this.rewards.filter(reward => 
            this.customerData.points >= reward.points
        );
        
        const unavailableRewards = this.rewards.filter(reward => 
            this.customerData.points < reward.points
        );
        
        return `
            <div class="rewards-section">
                <h4>🎁 Disponíveis para Resgate</h4>
                <div class="rewards-grid">
                    ${availableRewards.map(reward => this.renderRewardCard(reward, true)).join('')}
                </div>
                
                <h4>🔒 Bloqueadas</h4>
                <div class="rewards-grid">
                    ${unavailableRewards.map(reward => this.renderRewardCard(reward, false)).join('')}
                </div>
            </div>
        `;
    }

    renderRewardCard(reward, available) {
        return `
            <div class="reward-card ${available ? 'available' : 'locked'}">
                <div class="reward-icon">${this.getRewardIcon(reward.type)}</div>
                <div class="reward-info">
                    <h5>${reward.name}</h5>
                    <div class="reward-points">${reward.points} pontos</div>
                </div>
                ${available ? 
                    `<button onclick="loyaltySystem.redeemReward(${reward.id})" class="redeem-btn">Resgatar</button>` :
                    `<div class="locked-overlay">🔒</div>`
                }
            </div>
        `;
    }

    getRewardIcon(type) {
        const icons = {
            discount: '💰',
            product: '🎂',
            shipping: '🚚',
            discount_category: '🏷️'
        };
        return icons[type] || '🎁';
    }

    renderHistoryTab() {
        return `
            <div class="history-section">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${this.customerData.orders}</div>
                        <div class="stat-label">Pedidos</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">R$ ${this.customerData.totalSpent.toFixed(2)}</div>
                        <div class="stat-label">Total Gasto</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.customerData.points}</div>
                        <div class="stat-label">Pontos Totais</div>
                    </div>
                </div>
                
                <div class="history-timeline">
                    <h4>📈 Atividade Recente</h4>
                    <div class="timeline-item">
                        <div class="timeline-date">Hoje</div>
                        <div class="timeline-content">Você ganhou 150 pontos por uma compra!</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-date">Ontem</div>
                        <div class="timeline-content">Resgatou desconto de 10%</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderEarnTab() {
        return `
            <div class="earn-section">
                <h4>💰 Como Ganhar Pontos</h4>
                
                <div class="earn-methods">
                    <div class="earn-method">
                        <div class="earn-icon">🛒</div>
                        <div class="earn-info">
                            <h5>Fazendo Compras</h5>
                            <p>Ganhe ${this.pointsRules.purchase} pontos para cada R$ 1,00 gasto</p>
                        </div>
                        <div class="earn-points">+${this.pointsRules.purchase} pts</div>
                    </div>
                    
                    <div class="earn-method">
                        <div class="earn-icon">⭐</div>
                        <div class="earn-info">
                            <h5>Avaliando Produtos</h5>
                            <p>Deixe sua avaliação e ganhe pontos</p>
                        </div>
                        <div class="earn-points">+${this.pointsRules.review} pts</div>
                    </div>
                    
                    <div class="earn-method">
                        <div class="earn-icon">👥</div>
                        <div class="earn-info">
                            <h5>Indicando Amigos</h5>
                            <p>Indique um amigo e ambos ganham pontos</p>
                        </div>
                        <div class="earn-points">+${this.pointsRules.referral} pts</div>
                    </div>
                    
                    <div class="earn-method">
                        <div class="earn-icon">📱</div>
                        <div class="earn-info">
                            <h5>Compartilhando</h5>
                            <p>Compartilhe nas redes sociais</p>
                        </div>
                        <div class="earn-points">+${this.pointsRules.social} pts</div>
                    </div>
                </div>
                
                <div class="quick-actions">
                    <button onclick="loyaltySystem.shareOnSocial()" class="action-btn">
                        📱 Compartilhar Agora
                    </button>
                    <button onclick="loyaltySystem.referFriend()" class="action-btn">
                        👥 Indicar Amigo
                    </button>
                </div>
            </div>
        `;
    }

    redeemReward(rewardId) {
        const reward = this.rewards.find(r => r.id === rewardId);
        
        if (!reward || this.customerData.points < reward.points) {
            alert('Pontos insuficientes!');
            return;
        }
        
        this.customerData.points -= reward.points;
        this.customerData.rewards.push({
            ...reward,
            redeemedAt: new Date().toISOString(),
            used: false
        });
        
        this.saveCustomerData();
        
        alert(`🎉 Recompensa "${reward.name}" resgatada com sucesso!`);
        this.openLoyaltyDashboard(); // Refresh
    }

    shareOnSocial() {
        const text = 'Descobri a melhor confeitaria! 🎂 Vera Lúcia Confeitaria tem os bolos mais deliciosos!';
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({ title: 'Vera Lúcia Confeitaria', text, url });
        } else {
            const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            window.open(shareUrl, '_blank');
        }
        
        this.addPoints(this.pointsRules.social, 'social');
    }

    referFriend() {
        const referralCode = `VERA${this.customerData.joinDate.slice(0, 4)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        const message = `🎂 Oi! Descobri a Vera Lúcia Confeitaria e os bolos são incríveis! Use meu código ${referralCode} e ganhe desconto no seu primeiro pedido: ${window.location.href}`;
        
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(shareUrl, '_blank');
        
        alert(`Seu código de indicação: ${referralCode}\nQuando seu amigo fizer o primeiro pedido, vocês dois ganharão ${this.pointsRules.referral} pontos!`);
    }
}

// Funções globais
function showLoyaltyTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    document.querySelector(`[onclick="showLoyaltyTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Instância global
window.loyaltySystem = new LoyaltySystem();
